---
title: "CR-013 - Secondary Domain Controller and AD Resilience"
subtitle: "Nova Corp Enterprise Infrastructure Lab - Engineering Journal"
author: "Technical owner: David Eti"
date: "6-8 November 2026"
geometry: margin=22mm
fontsize: 10pt
header-includes:
  - |
    \usepackage{float}
    \floatplacement{figure}{H}
  - |
    \usepackage{fvextra}
    \DefineVerbatimEnvironment{Highlighting}{Verbatim}{breaklines,commandchars=\\\{\}}
---

# CR-013 - Secondary Domain Controller and AD Resilience

**Nova Corp Enterprise Infrastructure Lab**  
**Change request:** CR-013  
**Domain:** `nova.corp`  
**Domain controllers:** `NOVA-DC01` (`10.10.20.10`) and `NOVA-DC02` (`10.10.20.11`)  
**File server:** `NOVA-FILES01`  
**Domain client:** lab workstation referred to during the CR as `NOVA-CLIENT01`; current hostname captured as `nova-client`  
**Test user:** `NOVA\moyo`  
**Journal status:** **DRAFT v0.9.0 - technical content complete, pending final review**

> **Purpose of this journal:** preserve the command-level and reasoning-level truth of CR-013: what was validated, why each test existed, what a healthy result should have looked like, what actually happened, what failures were observed, how those failures were interpreted, why certain repairs were deliberately *not* performed, and how Nova Corp proved that its two-domain-controller design provides real operational resilience rather than merely having two installed servers.

---

# 1. Executive Summary

CR-013 validated and hardened Nova Corp's existing two-domain-controller Active Directory design. `NOVA-DC02` already existed before this change request, so the objective was **not** to build another DC. The objective was to prove that the existing secondary controller could actually provide DNS, Kerberos, SYSVOL, NETLOGON, authentication and directory continuity when `NOVA-DC01` was unavailable, and that both controllers could safely recover and reconverge afterward.

The work was intentionally evidence-driven. The lab first established an authoritative baseline of the two controllers, their IP addresses, Global Catalog state, site placement and FSMO ownership. Replication was then validated at both summary and per-naming-context level. `dcdiag` was used to distinguish current controller health from historical DFS Replication warnings left behind by shutdowns and backup activity. SYSVOL and NETLOGON were checked directly through SMB, not merely assumed from service state. DNS SRV records were inspected for LDAP, Kerberos and Global Catalog discovery, and Windows DC Locator was used to prove that the domain could discover both controllers.

The DNS resolver design was then checked on the client, file server and both DCs to make sure no system depended on only one AD DNS server. The Windows time hierarchy was also validated because Kerberos depends on time synchronization. The final design was proven as:

```text
External NTP
    |
    v
NOVA-DC02  (PDC Emulator, Stratum 2)
    |
    v
NOVA-DC01  (Stratum 3)
    |
    +--> NOVA-FILES01 / client systems (Stratum 4 in captured tests)
```

Active Directory Recycle Bin was found disabled, deliberately enabled after checking the forest functional level, and then tested end to end. A disposable user was created, its GUID and SID were recorded, it was deleted, found in Deleted Objects, restored through Active Directory Administrative Center, and verified to retain the **same** GUID and SID. A disposable security group was later subjected to the same recovery logic because authorization is tied to a group's SID, not merely its name.

Two resilience incidents were then exercised.

**INC-AD-13A - Primary DC unavailable:** `NOVA-DC01` was deliberately taken offline. The client forced fresh domain-controller discovery, selected `NOVA-DC02`, reached LDAP and Kerberos, accessed DC02 SYSVOL/NETLOGON, retained access to the authorized IT file share, and successfully signed in as Moyo while DC01 remained offline. When DC01 returned, temporary replication errors `1722` and `1908` were observed. Instead of immediately forcing replication, the lab tested DC/KDC discovery, DNS, Kerberos, time, RPC and LDAP. AD then converged naturally, all five naming contexts returned to success, and final `repadmin /replsummary` showed `0 / 5` failures on both controllers.

**INC-AD-13B - Controlled replication divergence:** inbound AD replication was deliberately disabled on DC02 while the server remained online. A disposable group was created explicitly on DC01. DC01 contained the object while DC02 did not, proving that a DC can be online but stale. `repadmin` reported error `8457 - The destination server is currently rejecting replication requests.` After the replication block was removed, the object initially remained absent from DC02, which correctly demonstrated that **fault removal and service convergence are separate phases**. AD later replicated the exact same object to DC02 with the same GUID and SID, and the final replication summary returned to `0 / 5`, `0%` failures without `repadmin /syncall` being used.

The final CP-15 validation re-ran replication and DCDIAG checks on both DCs, revalidated DNS SRV records, SYSVOL/NETLOGON, the time hierarchy, all five FSMO roles, and a normal user's client-side experience. All disposable CR-013 objects were then inventoried and removed, temporary replication-control flags were confirmed absent, and the final replication state remained clean.

## 1.1 Final control summary

| Control / test | Result |
|---|---|
| Both DCs recognized in AD with correct IP/site/GC state | PASS |
| Bidirectional replication summary | PASS |
| Per-naming-context inbound replication | PASS |
| Current DCDIAG health on both DCs | PASS |
| Historical DFSR warning/error interpretation | PASS - documented, no active fault |
| SYSVOL and NETLOGON publication/reachability | PASS |
| LDAP SRV registration | PASS |
| Kerberos SRV registration | PASS |
| Global Catalog SRV registration | PASS |
| Windows DC Locator | PASS |
| Redundant AD DNS resolver configuration | PASS |
| Domain time hierarchy | PASS |
| AD Recycle Bin enablement | PASS |
| Deleted user recovery with original GUID/SID | PASS |
| Deleted security-group recovery with original GUID/SID | PASS |
| FSMO role inventory | PASS |
| FSMO transfer-versus-seizure decision runbook | COMPLETE |
| Controlled DC01 outage | PASS |
| Client logon and domain service continuity through DC02 | PASS |
| DC01 natural recovery after outage | PASS |
| Controlled replication divergence | PASS |
| Error 8457 detection and diagnosis | PASS |
| Natural convergence after removing divergence fault | PASS |
| Final client-side validation as Moyo | PASS |
| Disposable-object cleanup | PASS |
| Temporary replication fault flags removed | PASS |
| Final aggregate replication health | PASS - `0 / 5`, `0%` on both DCs |

---

# 2. Business and Technical Objective

Nova Corp depends on Active Directory for more than usernames and passwords. The domain controllers provide or support:

- user and computer authentication;
- Kerberos ticketing;
- AD-integrated DNS;
- LDAP directory access;
- SYSVOL and Group Policy distribution;
- NETLOGON services;
- Global Catalog queries;
- replication of directory data and DNS application partitions;
- domain-wide time hierarchy;
- FSMO operations.

Having two domain controllers does not automatically provide resilience. A second controller is useful only if it is discoverable, synchronized, reachable by clients, publishing the expected services, and capable of continuing domain operations while its partner is unavailable.

The technical objective of CR-013 was therefore:

> Validate and harden the existing second domain controller so that Nova Corp can demonstrate real AD resilience during controller outage, controller recovery, accidental object deletion, and controlled replication divergence.

The CR deliberately included both **normal-state validation** and **failure-state testing**. The goal was to answer not only "does AD work?" but also:

- What happens when one DC disappears?
- What does a client do?
- What does DNS still show?
- Which services remain usable?
- What happens when the failed DC returns?
- How do we distinguish startup/transient replication errors from a genuine persistent fault?
- Can deleted AD security principals be restored rather than recreated?
- Can two online DCs temporarily disagree?
- How do we prove convergence afterward?

---

# 3. Starting Environment

## 3.1 Core systems

| System | Role | Relevant identity / state |
|---|---|---|
| `NOVA-DC01` | Domain controller, DNS, GC | `10.10.20.10` |
| `NOVA-DC02` | Domain controller, DNS, GC, FSMO role holder | `10.10.20.11` |
| `NOVA-FILES01` | Domain file server | Used to test normal user access during DC failure |
| `nova-client` / lab client | Domain workstation | Client address captured as `10.10.40.100`; used as Moyo |
| `NOVA\moyo` | Standard domain user | Used for user-perspective failover and share validation |

Both DCs were already members of `Default-First-Site-Name` and both were Global Catalogs. CR-013 therefore began from an already-built environment and focused on **validation, resilience and recovery**, not promotion of a new DC.

![Authoritative CR-013 baseline showing both domain controllers, their IP addresses, site, Global Catalog state and FSMO ownership.](assets/CP01-DC01-authoritative-baseline.png){ width=92% }

**Figure 1 - Authoritative DC baseline.** This captured the factual starting point before any CR-013 fault injection.

## 3.2 Recovery dependency from CR-012

CR-012 had already established backup and recovery controls, including DC01 System State protection. That mattered because CR-013 deliberately introduced outage and replication-fault conditions. The lab therefore entered resilience testing with an existing recovery layer rather than testing destructive conditions without protection.

## 3.3 Starting operational assumptions

The CR treated the following as assumptions to be **proved**, not trusted:

1. both DCs are reachable;
2. both controllers are actually replicating all AD naming contexts;
3. both publish SYSVOL and NETLOGON;
4. DNS advertises both controllers;
5. endpoints query both AD DNS servers;
6. time follows the Windows domain hierarchy;
7. clients can move to DC02 when DC01 is unavailable;
8. a recovered DC can naturally reconverge;
9. deleted AD objects can be restored with identity preserved;
10. a temporary replication fault can be diagnosed and rolled back safely.

---

# 4. Design Decisions

## 4.1 Validate the existing DC instead of rebuilding it

`NOVA-DC02` already existed from earlier work. Re-promoting or rebuilding it would have hidden whether the existing configuration was genuinely healthy. CR-013 therefore treated DC02 as an installed production asset that had to pass operational acceptance tests.

## 4.2 Observe before repairing

Several parts of CR-013 deliberately avoided immediate remediation. This was especially important after DC01 returned from outage.

The operating pattern was:

```text
Observe
   |
   v
Identify the failing layer
   |
   v
Test dependencies
   |
   v
Allow normal retry / convergence
   |
   v
Repair only if recovery does not occur
```

This prevented unnecessary changes and allowed the lab to prove Active Directory's own recovery behavior.

## 4.3 Do not force replication unless natural convergence fails

`repadmin /syncall` was deliberately withheld during both DC01 recovery and the CP-14 divergence incident. A forced sync would prove that an administrator can make replication happen. The stronger resilience result was to prove that AD can resume normal replication on its own after the original fault disappears.

## 4.4 Use object identity, not names, to prove recovery

A restored user or group with the same name could still be a completely different security principal. The journal therefore uses:

- `ObjectGUID` to identify the directory object;
- `SID` to identify the security principal.

Matching GUID/SID before and after recovery proves restoration of the original object.

## 4.5 Treat DNS registration and host liveness as different concepts

During the DC01 outage, DNS still resolved DC01. This was not a DNS failure. DNS records describe registered service locations; they are not an immediate health probe. Client failover therefore had to be demonstrated with DC Locator, service ports and real resource access rather than assuming a stale-looking DNS record meant failover was broken.

## 4.6 Keep FSMO transfer and seizure separate

Normal **transfer** is a planned, graceful move while the current role holder is online. **Seizure** is an emergency action for an unrecoverable role holder. CR-013 explicitly did **not** seize roles during a temporary DC outage.

## 4.7 Fault injection must have a rollback before execution

The controlled replication-divergence incident used only a reversible inbound-replication flag on DC02. The rollback command was known and documented before the fault was applied:

```cmd
repadmin /options NOVA-DC02 -DISABLE_INBOUND_REPL
```

---

# 5. Prerequisites and Safety Checks

Before destructive or high-impact tests, the following rules were applied:

- Use disposable AD objects only.
- Capture object GUID/SID before deletion.
- Confirm the target domain/forest before enabling Recycle Bin.
- Keep DC02 online during the DC01 outage.
- Keep the client and file server online during failover testing.
- Do not change FSMO ownership merely because a DC is temporarily offline.
- Do not alter DNS settings during an outage unless evidence proves DNS configuration is the fault.
- Record rollback before applying replication-control flags.
- Do not use `repadmin /syncall` merely to make a warning disappear.
- Validate every recovery with a second tool or a different layer where practical.

The safety philosophy was simple:

```text
baseline -> controlled change/fault -> observe -> diagnose -> rollback -> validate -> clean up
```

---

# 6. Implementation and Checkpoint Journal

## 6.1 CP-01 - Authoritative baseline of DC01 and DC02

### What we were trying to achieve

Establish the factual state of the domain before touching anything. Later resilience results would be meaningless without knowing which DCs existed, their addresses, site membership, Global Catalog state and FSMO ownership.

### Why this test was necessary

A failover exercise needs a known-good starting point. If an engineer does not know where roles are held or whether the supposed secondary DC is actually recognized by AD, later behavior can be misinterpreted.

### Real-world scenario

Before planned maintenance on one domain controller, an administrator records the current DC inventory and role ownership so that any post-maintenance difference can be explained.

### Commands actually used

```powershell
hostname
whoami
$env:USERDNSDOMAIN

Get-ADDomainController -Filter * |
    Select-Object HostName,IPv4Address,Site,IsGlobalCatalog,OperationMasterRoles |
    Format-Table -AutoSize

Get-ADDomain |
    Select-Object DNSRoot,PDCEmulator,RIDMaster,InfrastructureMaster

Get-ADForest |
    Select-Object RootDomain,SchemaMaster,DomainNamingMaster
```

### Expected

- DC01 and DC02 appear as valid domain controllers in `nova.corp`.
- DC01 resolves to `10.10.20.10`.
- DC02 resolves to `10.10.20.11`.
- Both are Global Catalogs in the same site.
- FSMO role holders are clearly identified.

### Actual

- `NOVA-DC01` = `10.10.20.10`.
- `NOVA-DC02` = `10.10.20.11`.
- Both are in `Default-First-Site-Name`.
- Both are Global Catalogs.
- All five FSMO roles were on `NOVA-DC02`.

### What we wanted to find

We wanted a baseline strong enough to distinguish "the environment changed" from "we simply never knew the original state." The most important discovery was that DC02 was already the PDC Emulator and all other FSMO roles were already on it, which later influenced both time-hierarchy expectations and the decision not to move roles during the outage test.

### Conclusion

**PASS.** No configuration change was made during the baseline.

---

## 6.2 CP-02 - Active Directory replication health

### Test A - Aggregate replication summary

**What we tested:** bidirectional AD replication at summary level.

**Why:** two installed DCs provide no resilience if directory changes are not being exchanged.

**Command:**

```cmd
repadmin /replsummary
```

**Expected:** both DCs show `0 / 5` failures and `0%` error as sources and destinations.

**Actual:** both DCs showed `0 / 5` and `0%`; largest delta was roughly 55 minutes.

**What the largest delta meant:** it was the age of the oldest successful replication relationship represented by the summary, not the time taken to perform replication and not itself a failure.

![Baseline replication summary showing zero failures on both domain controllers.](assets/CP02-repadmin-replsummary.png){ width=92% }

**Figure 2 - Baseline replication summary.** The critical fields are `fails/total`, `%`, and `error`.

### Test B - Per-naming-context replication

**What we tested:** the actual inbound replication partner and each AD naming context.

**Why:** a clean summary can hide which partitions are involved. The domain, Configuration, Schema, DomainDnsZones and ForestDnsZones all matter.

```cmd
repadmin /showrepl NOVA-DC01
repadmin /showrepl NOVA-DC02
```

**Expected:** recent successful last attempts for all five naming contexts with no consecutive failures.

**Actual:** each controller showed successful inbound replication from the opposite controller for all five naming contexts over RPC.

![Detailed inbound replication for NOVA-DC01.](assets/CP02-showrepl-DC01.png){ width=92% }

![Detailed inbound replication for NOVA-DC02.](assets/CP02-showrepl-DC02.png){ width=92% }

### Conclusion

**PASS.** The baseline AD database was converged in both directions without forcing replication.

---

## 6.3 CP-03 - Directory-service health and DFSR history

This checkpoint intentionally became a troubleshooting exercise because the first DCDIAG pass showed recent warning/error history.

### Test A - Enterprise quiet DCDIAG

```cmd
dcdiag /e /q
```

### Why we ran it

`repadmin` focuses on replication. A domain controller can replicate while still having problems with advertising, SYSVOL, services, machine-account trust or event-log health. `dcdiag /e /q` is a fast first pass across the enterprise scope and only emits failures/warnings.

### Expected

Ideally, no output.

### Actual

The command reported DFS Replication warnings and, depending on the direction from which the enterprise query was executed, remote event-log queries failed with `0x6ba - The RPC server is unavailable`. The output also flagged `DFSREvent`, `KccEvent` and `SystemLog` tests because recent error/warning entries existed.

![Initial DCDIAG evidence showing DFSR and reciprocal RPC/event-log query warnings.](assets/CP03-dcdiag-DC02-local-and-enterprise.png){ width=92% }

### Thought process

The existence of recent error events did **not** prove that SYSVOL was currently broken. The next question was: are these old startup/shutdown events, or is the service failing now?

### Test B - Inspect DFS Replication event history locally

```powershell
Get-WinEvent -LogName "DFS Replication" -MaxEvents 50 |
    Where-Object {$_.LevelDisplayName -in "Warning","Error"} |
    Select-Object TimeCreated,Id,LevelDisplayName,Message |
    Format-List
```

This was run locally on both controllers.

### What we wanted to find

We wanted the exact event IDs, timestamps and messages responsible for DCDIAG's historical `DFSREvent` failure.

Important events included:

| Event / error | Meaning in this lab |
|---|---|
| 2212 | DFSR detected an unexpected shutdown and initiated automatic recovery |
| 1202 / error 160 | DFSR temporarily failed to contact a DC for configuration information |
| 5002 / 1753 | DFSR could not communicate with partner; no endpoint mapper endpoints available |
| 5008 / 1722 | RPC server unavailable |
| 5014 / 1723 | RPC server too busy |
| 5014 / 9036 | Replication paused for backup/restore - expected around backup activity |

### Learner question preserved

**Question:** "Do these DFSR errors mainly come from the systems shutting down unexpectedly?"

**Answer:** largely yes for the captured 2212/startup clusters. Event 2212 explicitly says DFSR detected an unexpected shutdown and began recovery. Several 1202/5002/5008/5014 entries occurred in the same startup/recovery windows. However, 5014 with error 9036 is a different case: it is an expected pause for backup or restore.

### Test C - Current-state DCDIAG

Rather than "fixing" historical logs, current-state tests were run:

```cmd
dcdiag /s:NOVA-DC01 /test:Advertising /test:Services /test:NetLogons /test:SysVolCheck /test:Replications /test:MachineAccount

dcdiag /s:NOVA-DC02 /test:Advertising /test:Services /test:NetLogons /test:SysVolCheck /test:Replications /test:MachineAccount
```

### Expected

Each selected test should return `passed test`.

### Actual

Both controllers passed Connectivity, Advertising, SysVolCheck, MachineAccount, NetLogons, Replications and Services.

![Current-state DCDIAG on DC01 with the targeted service tests passing.](assets/CP03-dcdiag-targeted-DC01-pass.png){ width=92% }

![Current-state DCDIAG on DC02 with the targeted service tests passing.](assets/CP03-dcdiag-targeted-DC02-pass.png){ width=92% }

### Conclusion

**PASS.** The DFSR events were retained as incident history. The current domain-controller service state was healthy, so destructive DFSR repair would have been unnecessary and potentially harmful.

---

## 6.4 CP-04 - SYSVOL and NETLOGON validation

### What we tested

Whether both DCs actually publish SYSVOL and NETLOGON and whether the shares are reachable locally and across the partner DC.

### Why

SYSVOL contains Group Policy files and other domain-wide data. NETLOGON exposes logon-related resources. A surviving DC that can answer LDAP but cannot serve SYSVOL/NETLOGON is not fully resilient.

### Commands

```powershell
Get-SmbShare -Name SYSVOL,NETLOGON |
    Select-Object Name,Path,Description

Test-Path "\\NOVA-DC01\SYSVOL"
Test-Path "\\NOVA-DC01\NETLOGON"
Test-Path "\\NOVA-DC02\SYSVOL"
Test-Path "\\NOVA-DC02\NETLOGON"
```

The relevant share checks were performed from both controllers.

### Expected

- `SYSVOL` and `NETLOGON` exist on both DCs.
- Cross-DC path tests return `True`.

### Actual

All captured path tests returned `True`, and both controllers published the expected SMB shares.

![DC01 SYSVOL/NETLOGON publication and reachability checks.](assets/CP04-DC01-SYSVOL-NETLOGON-pass.png){ width=92% }

![DC02 SYSVOL/NETLOGON publication and reciprocal reachability checks.](assets/CP04-DC02-SYSVOL-NETLOGON-pass.png){ width=92% }

### Conclusion

**PASS.** Both controllers could provide the domain logon/GPO file layer.

---

## 6.5 CP-05 - DNS SRV records and Windows DC discovery

### What we tested

The service-location records that Active Directory clients use to discover LDAP, Kerberos and Global Catalog services, plus Windows DC Locator behavior.

### Why

Clients do not normally have a hard-coded "use DC01" rule. They discover domain services through DNS SRV records. A healthy DC that is not advertised correctly may be invisible to clients.

### Commands

```powershell
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"
Resolve-DnsName -Type SRV "_ldap._tcp.gc._msdcs.nova.corp"
```

```cmd
nltest /dsgetdc:nova.corp
nltest /dclist:nova.corp
```

### Expected

- LDAP locator: both DCs on port 389.
- Kerberos: both DCs on port 88.
- Global Catalog: both DCs on port 3268.
- `nltest` can locate a valid DC and list both controllers.

### Actual

Both controllers appeared in the correct SRV record sets. Their A records resolved to `10.10.20.10` and `10.10.20.11`. `nltest` successfully located a DC and listed both controllers.

![LDAP/DC Locator SRV records for both controllers.](assets/CP05-SRV-LDAP-both-DCs.png){ width=92% }

![Kerberos SRV records for both controllers.](assets/CP05-SRV-Kerberos-both-DCs.png){ width=92% }

![Global Catalog SRV records for both controllers.](assets/CP05-SRV-GlobalCatalog-both-DCs.png){ width=92% }

![Windows DC Locator / domain-controller enumeration.](assets/CP05-nltest-DC-discovery.png){ width=92% }

### What we wanted to find

We wanted to prove that redundancy existed in the **discovery layer**, not only on the server inventory page. The SRV records proved that a client had a legitimate path to discover DC02 if DC01 disappeared.

### Conclusion

**PASS.** AD DNS service registration and DC discovery were healthy.

---

## 6.6 CP-06 - Preferred and alternate DNS configuration

### What we tested

The actual DNS resolver addresses configured on the client, file server and both DCs.

### Why

Publishing two DNS servers is useless if endpoints query only one of them. A client that points only to DC01 may lose the ability to discover DC02 when DC01 fails.

### Commands

```powershell
hostname

Get-DnsClientServerAddress -AddressFamily IPv4 |
    Where-Object {$_.ServerAddresses.Count -gt 0} |
    Select-Object InterfaceAlias,ServerAddresses
```

On the client the active IP configuration was also recorded:

```powershell
Get-NetIPConfiguration |
    Select-Object InterfaceAlias,IPv4Address,IPv4DefaultGateway,DNSServer
```

### Expected

Domain members should have both AD DNS servers available:

- `10.10.20.10` - DC01
- `10.10.20.11` - DC02

For the DCs, the exact order can differ, but both domain DNS addresses should be present so that a single DNS/DC failure does not remove domain name resolution.

### Actual

- The domain client used both `10.10.20.10` and `10.10.20.11`.
- `NOVA-FILES01` used both.
- DC01 and DC02 both had redundant AD DNS resolver addresses configured.

![Client DNS resolver configuration.](assets/CP06-client01-DNS-servers.png){ width=92% }

![DC01 DNS resolver configuration.](assets/CP06-dc01-DNS-servers-1.png){ width=92% }

![DC02 DNS resolver configuration.](assets/CP06-dc02-DNS-servers.png){ width=92% }

![FILES01 DNS resolver configuration.](assets/CP06-files01-DNS-servers.png){ width=92% }

### Conclusion

**PASS.** The tested hosts were not dependent on a single AD DNS resolver.

---

## 6.7 CP-07 - Windows domain time hierarchy

### What we tested

Where the PDC Emulator, the other DC, the file server and the client obtain time.

### Why

Kerberos is time-sensitive. Correct credentials can still fail if clocks drift too far apart. In a Windows domain, the forest-root PDC Emulator should anchor the hierarchy to a trusted external source, while other domain systems follow AD's time hierarchy.

### Commands

On DC02:

```cmd
hostname
w32tm /query /source
w32tm /query /status
w32tm /query /configuration
```

On DC01, FILES01 and the client:

```cmd
hostname
w32tm /query /source
w32tm /query /status
```

### Expected

- DC02, as PDC Emulator, uses a clear external NTP source.
- DC01 follows the domain hierarchy/DC02.
- Domain members follow a domain controller.
- Status shows no leap warning and recent successful synchronization.

### Actual

- DC02 used external NTP (`1.pool.ntp.org` in the captured final configuration) and reported Stratum 2.
- DC01 used `nova-dc02.nova.corp` and reported Stratum 3.
- FILES01 used DC01 and reported Stratum 4.
- The client also followed DC01 and reported Stratum 4 in the captured status.

![DC02 PDC Emulator using external NTP and reporting a healthy time status.](assets/CP07-DC02-time-source-status.png){ width=92% }

![DC01 synchronizing from DC02.](assets/CP07-DC01-time-source-status.png){ width=92% }

![FILES01 following the domain time hierarchy.](assets/CP07-FILES01-time-source-status.png){ width=92% }

![Client time status showing domain synchronization.](assets/CP07-CLIENT01-time-source-status.png){ width=92% }

### Troubleshooting lesson - non-elevated client query

On the client, `w32tm /query /source` returned **Access is denied** in a non-elevated user shell. The `/status` query still showed the active source and synchronization state. This was an authorization limitation on the diagnostic command, not evidence that time synchronization itself had failed.

### Conclusion

**PASS.** The time hierarchy was coherent and suitable for Kerberos.

---

## 6.8 CP-08 - AD Recycle Bin and disposable object recovery

This checkpoint had several distinct tests because enabling Recycle Bin is forest-wide and irreversible, and recovery must prove identity preservation rather than same-name recreation.

### 6.8.1 Baseline - is Recycle Bin already enabled?

```powershell
Get-ADOptionalFeature -Filter 'Name -like "Recycle Bin Feature"' |
    Select-Object Name,EnabledScopes,RequiredForestMode

Get-ADForest |
    Select-Object ForestMode,RootDomain
```

### Why

The feature cannot simply be disabled again after enablement. We therefore needed to prove the starting state and confirm that the forest functional level met the requirement.

### Expected

- Empty `EnabledScopes` means disabled.
- Forest functional mode must meet or exceed `Windows2008R2Forest`.

### Actual

- Recycle Bin was disabled.
- The forest mode was `Windows2025Forest`, comfortably above the requirement.

![Recycle Bin baseline showing the feature disabled and the forest mode sufficient.](assets/CP08-AD-Recycle-Bin-baseline.png){ width=92% }

### 6.8.2 Enable the forest-wide feature

```powershell
Enable-ADOptionalFeature `
    -Identity "Recycle Bin Feature" `
    -Scope ForestOrConfigurationSet `
    -Target "nova.corp"
```

The irreversible warning was reviewed and confirmed only for `nova.corp`.

### Expected

`EnabledScopes` becomes populated for the forest configuration scope.

### Actual and important observation

The first immediate validation still showed an empty `EnabledScopes`, while a subsequent read showed the expected populated scope.

### Why that mattered

This was a useful replication lesson: a forest-wide AD configuration change can be committed correctly while an immediate read briefly observes stale state. The correct response was to verify both DCs and replication rather than instantly retrying or changing unrelated settings.

![Recycle Bin enablement and validation sequence.](assets/CP08-AD-Recycle-Bin-enable-and-validation.png){ width=92% }

### 6.8.3 Verify both DCs see the feature

```powershell
Get-ADOptionalFeature -Identity "Recycle Bin Feature" -Server "nova-dc01.nova.corp" |
    Select-Object Name,EnabledScopes,RequiredForestMode

Get-ADOptionalFeature -Identity "Recycle Bin Feature" -Server "nova-dc02.nova.corp" |
    Select-Object Name,EnabledScopes,RequiredForestMode

repadmin /replsummary
```

**Expected:** both DC-specific queries show the feature enabled; replication remains `0 / 5` failures.

**Actual:** both DCs showed populated enabled scopes and replication remained clean.

![Recycle Bin enabled on both DCs with healthy replication.](assets/CP08-Recycle-Bin-both-DCs-and-replication-pass.png){ width=92% }

### 6.8.4 Create and fingerprint a disposable user

```powershell
$TestUserName = "CR013-RecycleTest"
$TestSam      = "cr013.recycletest"

New-ADUser `
    -Name $TestUserName `
    -SamAccountName $TestSam `
    -UserPrincipalName "$TestSam@nova.corp" `
    -GivenName "CR013" `
    -Surname "RecycleTest" `
    -DisplayName "CR013 Recycle Bin Test User" `
    -Description "Disposable CR-013 AD Recycle Bin recovery test object" `
    -Path "CN=Users,DC=nova,DC=corp" `
    -Enabled $false

$Before = Get-ADUser $TestSam -Properties ObjectGUID,SID,DistinguishedName,MemberOf,Description

$Before |
    Select-Object Name,SamAccountName,UserPrincipalName,ObjectGUID,SID,DistinguishedName,Description
```

### Why capture GUID and SID first?

If a deleted account is simply recreated with the same name, it receives a different object identity and security identity. We needed a fingerprint to prove that restoration returned the original object.

### Actual fingerprint

- ObjectGUID: `cb2c56d5-8723-4201-ab55-adb3138ff573`
- SID: `S-1-5-21-2109268265-1139938310-975847112-1143`
- DN: `CN=CR013-RecycleTest,CN=Users,DC=nova,DC=corp`

`MemberOf` was empty because the fresh account had no direct group memberships; the primary group relationship is not represented by the `memberOf` attribute.

![Disposable user identity captured before deletion.](assets/CP08-test-user-predelete-identity.png){ width=92% }

### 6.8.5 Delete the user and discover the deleted object

```powershell
Remove-ADUser "cr013.recycletest" -Confirm
```

Then prove the live object is gone and query Deleted Objects:

```powershell
Get-ADUser "cr013.recycletest"

$Deleted = Get-ADObject `
    -Filter 'SamAccountName -eq "cr013.recycletest"' `
    -IncludeDeletedObjects `
    -Properties ObjectGUID,ObjectSID,LastKnownParent,msDS-LastKnownRDN,SamAccountName,WhenChanged

$Deleted |
    Select-Object Name,SamAccountName,ObjectGUID,ObjectSID,LastKnownParent,'msDS-LastKnownRDN',WhenChanged,DistinguishedName
```

### Expected

- Normal live lookup fails.
- Deleted object retains the original GUID and SID.
- `LastKnownParent` points to the original `CN=Users` container.
- Deleted DN is under `CN=Deleted Objects` and contains a `DEL:<GUID>` marker.

### Actual

The deleted object retained the exact original GUID and SID and recorded its original location.

![Deleted user discovered with identity and last-known-parent metadata preserved.](assets/CP08-deleted-object-discovery.png){ width=92% }

### 6.8.6 Restore through ADAC GUI

The user was restored in **Active Directory Administrative Center** using **Deleted Objects -> Restore** rather than `Restore To`, because the test required return to the original parent.

Post-restore validation:

```powershell
$After = Get-ADUser "cr013.recycletest" -Properties ObjectGUID,SID,DistinguishedName,Description,Enabled

$After |
    Select-Object Name,SamAccountName,UserPrincipalName,ObjectGUID,SID,DistinguishedName,Description,Enabled
```

### Expected

Same GUID, same SID, original DN, description preserved, account remains disabled.

### Actual

All matched the original fingerprint.

![Restored user retaining the original object and security identity.](assets/CP08-restored-user-identity-pass.png){ width=92% }

### Conclusion

**PASS.** Nova Corp can recover a deleted AD user as the original object rather than recreating a replacement account.

---

## 6.9 Roadmap recovery extension - disposable security-group recovery

The roadmap required the same recovery principle to be proven for a security group.

### Why a group recovery test matters

Permissions reference the **group SID**, not merely the display name. Recreating a group called `Finance-Modify` would not automatically restore ACL references to the original SID.

A disposable group `CR013-RecycleGroup` was created with:

- Global scope;
- Security category;
- description identifying it as disposable.

Its identity was captured before deletion:

- ObjectGUID: `53628784-f00f-40ed-b739-814f6446e977a`
- SID: `S-1-5-21-2109268265-1139938310-975847112-1144`

After deletion, normal `Get-ADGroup` lookup returned `ADIdentityNotFoundException`, while `Get-ADObject -IncludeDeletedObjects` showed the original GUID/SID, `LastKnownParent` and `msDS-LastKnownRDN`.

![Deleted security group preserved in AD Deleted Objects.](assets/CR013-recyclegroup-deleted-object-discovery.png){ width=92% }

The group was restored through ADAC and validated:

```powershell
$GroupAfter = Get-ADGroup "CR013-RecycleGroup" `
    -Properties ObjectGUID,SID,DistinguishedName,GroupScope,GroupCategory,Description

$GroupAfter |
    Select-Object Name,SamAccountName,ObjectGUID,SID,DistinguishedName,GroupScope,GroupCategory,Description
```

### Expected

Same GUID/SID, original `CN=Users` location, Global scope, Security category and description preserved.

### Actual

All identity and core group attributes matched.

![Restored security group retaining its original identity and attributes.](assets/CR013-recyclegroup-restored-pass.png){ width=92% }

### Conclusion

**PASS.** The literal roadmap requirement for disposable-group Recycle Bin recovery was satisfied.

---

## 6.10 CP-09 - FSMO role inventory

### What we tested

Where all five Flexible Single Master Operations roles were held.

### Why

FSMO ownership affects time architecture, RID allocation and forest/domain operations. It is also essential context before any outage test so that an engineer does not confuse temporary role-holder unavailability with a reason to seize roles.

### Commands

```powershell
Get-ADDomain |
    Select-Object PDCEmulator,RIDMaster,InfrastructureMaster

Get-ADForest |
    Select-Object SchemaMaster,DomainNamingMaster
```

### Expected

The role holders should match the authoritative baseline and be known before failure testing.

### Actual

All five roles were held by `nova-dc02.nova.corp`.

### What this meant for the planned DC01 outage

DC01 could be taken offline without making DC02's current FSMO role ownership unavailable. More importantly, no transfer or seizure was needed simply to prove DC failover.

### Conclusion

**PASS.** FSMO ownership was known and intentional.

---

## 6.11 CP-10 - FSMO transfer versus seizure decision runbook

This checkpoint was documentation/decision-control rather than a destructive lab action.

### Why

A common Active Directory mistake is to seize FSMO roles too quickly when a DC is merely offline. CR-013 therefore defined the decision boundary before outage testing.

### Normal transfer

Use when the current role holder is online and healthy.

- graceful and preferred;
- source DC cooperates;
- no emergency metadata cleanup is implied;
- appropriate for maintenance, redesign or planned role placement.

### Seizure

Use only when the current role holder is considered permanently unrecoverable.

- emergency action;
- old role holder must not simply be returned to production afterward without appropriate recovery/rebuild decisions;
- metadata/DNS cleanup and replacement planning may be required.

### Temporary DC outage rule

A brief outage is **not** a reason to seize FSMO roles. First validate that clients use the surviving DC and allow the failed controller to recover.

### Stale snapshot/restore rule

Do not blindly restore an old DC snapshot. Use an AD-aware recovery method or rebuild/re-promote the controller according to the failure scenario.

### DNS failure rule

Separate host failure from DNS registration/discovery failure. Check A/SRV records, resolver addresses, DC Locator and DNS service health before making unrelated AD changes.

### Conclusion

**COMPLETE.** This runbook governed the later outage and recovery decisions.

---

## 6.12 CP-11 - Controlled DC01 outage

### Goal

Take DC01 offline on purpose while keeping DC02, the client and FILES01 online.

### Why

So far, redundancy had only been proven while both DCs were healthy. The real test was whether the surviving DC could continue domain-dependent services.

### Pre-outage client baseline

```powershell
hostname
nltest /dsgetdc:nova.corp
Resolve-DnsName nova-dc01.nova.corp
Resolve-DnsName nova-dc02.nova.corp
whoami
Test-Path "\\nova-files01\IT"
```

The authorized IT share was used because Moyo was not expected to have Finance access. This distinction mattered: a `False` result on `\\nova-files01\Finance` would be an authorization outcome, not a failover failure.

### Expected

Before shutdown:

- a valid DC is selected;
- both DC names resolve;
- Moyo has normal access to the IT share.

After shutdown:

- DC01 should become unreachable;
- no FSMO or DNS reconfiguration should be performed merely because of the planned outage.

### Actual

Before the outage, DC Locator selected DC01 and both DC names resolved. Moyo could reach the IT share. After the controlled shutdown, DC01 stopped responding.

![Pre-outage DC01 baseline.](assets/CP09-preoutage-DC01-baseline.png){ width=92% }

![Pre-outage client baseline with Moyo's normal context.](assets/CP09-preoutage-client01-baseline.png){ width=92% }

![DC01 transitioning from available to unavailable while authorized file access remained available.](assets/CP09-DC01-outage-transition.png){ width=92% }

### Conclusion

**PASS - outage condition successfully created.** The next checkpoint tested the surviving environment while DC01 remained offline.

---

## 6.13 CP-12 - Prove client logon, DNS and resource access through DC02

### What we tested

Whether the domain still worked from a user's perspective with DC01 offline.

### Why

A server-side "DC02 is running" result is not enough. A client must actually discover DC02, reach authentication services, read SYSVOL/NETLOGON and continue authorized business access.

### Test A - Force fresh DC discovery

```cmd
nltest /dsgetdc:nova.corp /force
```

### Expected

DC02 / `10.10.20.11` should be selected.

### Actual

The client selected `nova-dc02.nova.corp`.

![Client forcing fresh DC discovery and selecting DC02 while DC01 was offline.](assets/CP12-client-force-DC02-and-SRV.png){ width=92% }

### Test B - DNS and service ports

```powershell
Resolve-DnsName nova-dc02.nova.corp
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"

Test-NetConnection nova-dc02.nova.corp -Port 389
Test-NetConnection nova-dc02.nova.corp -Port 88
Test-NetConnection nova-dc02.nova.corp -Port 445
```

### Why these ports

- `389` - LDAP directory access;
- `88` - Kerberos authentication;
- `445` - SMB, including SYSVOL/NETLOGON file access.

### Expected

All service tests succeed.

### Actual

LDAP and Kerberos tests passed from the client, and SMB continuity was proved through working UNC paths.

### Test C - SYSVOL / NETLOGON on surviving DC

```powershell
Test-Path "\\nova-dc02\SYSVOL"
Test-Path "\\nova-dc02\NETLOGON"
```

**Actual:** both returned `True` while DC01's share paths were unavailable.

![DC02 SYSVOL/NETLOGON available while DC01 remained unavailable.](assets/CP12-DC02-SYSVOL-NETLOGON-DC01-unreachable.png){ width=92% }

### Test D - Authorized file-server access

```powershell
Test-Path "\\nova-files01\IT"
```

**Actual:** `True`.

### Test E - Fresh user authentication

A pre-existing `whoami` token cannot prove a new login occurred after the outage. Moyo therefore signed out and signed back in while DC01 was still offline, then ran:

```powershell
whoami
nltest /dsgetdc:nova.corp /force
Test-Path "\\nova-files01\IT"
```

### Expected

- sign-in succeeds;
- user is `nova\moyo`;
- DC02 is selected;
- authorized file access remains available.

### Actual

All passed.

![Post-login proof: Moyo authenticated while DC01 was offline, DC02 was selected and IT share access remained available.](assets/CP12-client-postlogin-DC02-and-IT-access.png){ width=92% }

### Two important interpretation lessons

**DNS records can remain present for an offline DC.** DC01's A/SRV records still existed. That is expected because DNS registration is not a live health monitor.

**Loopback port tests are supplementary only.** A DC02-local `Test-NetConnection` used `::1`, proving the local service was listening. The stronger continuity evidence was the client's successful access to `\\nova-dc02\SYSVOL` and `\\nova-dc02\NETLOGON`.

### Conclusion

**PASS.** DC02 provided functional domain resilience during the controlled DC01 outage.

---

## 6.14 CP-13 - Recover DC01 and prove natural replication convergence

This was the most important diagnostic checkpoint in the first incident because the recovered controller initially showed partial replication failures.

### Goal

Prove that DC01 can return after outage, rejoin the AD environment, synchronize missed changes and return to a healthy state without unnecessary administrator repair.

### Stage 1 - Are the critical services running?

```powershell
Get-Service NTDS,DNS,DFSR,Netlogon,W32Time |
    Select-Object Name,Status,StartType
```

### Why this came first

Replication depends on these layers. Investigating replication before confirming that AD DS, DNS, DFSR, Netlogon and Windows Time are running would skip a simpler possible root cause.

### Expected

All services Running / Automatic.

### Actual

All were Running / Automatic.

### Stage 2 - Aggregate replication after boot

```cmd
repadmin /replsummary
```

### Expected

Eventually `0 / 5`, `0%` on both controllers.

### Initial actual result

Both controllers showed `2 / 5` failures (`40%`) with errors including:

- `1722 - The RPC server is unavailable`
- `1908 - Could not find the domain controller for this domain`

![DC01 core services running while the first post-boot replication summary still showed partial failure.](assets/CP13-DC01-services-and-replsummary-partial-failure.png){ width=92% }

### Thought process - why 2/5 mattered

There are five relevant naming contexts:

1. Domain
2. Configuration
3. Schema
4. DomainDnsZones
5. ForestDnsZones

Only two were failing. Three were already working. That strongly suggested **partial convergence**, not a total network, DNS or RPC collapse.

### Stage 3 - Which naming contexts are failing?

```cmd
repadmin /showrepl NOVA-DC01
```

### Actual

Already successful:

- Domain
- DomainDnsZones
- ForestDnsZones

Temporarily failing:

- Configuration
- Schema

Each affected context showed only one consecutive failure.

![Per-naming-context view showing partial convergence.](assets/CP13-DC01-showrepl-partial-convergence-1.png){ width=92% }

![Additional partial-convergence evidence showing successful DNS application partitions.](assets/CP13-DC01-showrepl-partial-convergence-2.png){ width=92% }

### What we wanted to find

We wanted to know whether the errors represented an ongoing infrastructure fault or simply services and replication partners settling after boot. Because several partitions had already replicated successfully, the lab chose diagnosis and observation instead of immediate repair.

### Stage 4 - Test DC/KDC discovery implicated by error 1908

```cmd
nltest /dsgetdc:nova.corp /force
nltest /dsgetdc:nova.corp /kdc /force
```

**Expected:** both discovery operations succeed.

**Actual:** both succeeded.

### Stage 5 - Validate DNS service discovery

```powershell
Resolve-DnsName nova-dc02.nova.corp
Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
```

**Expected:** DC02 resolves correctly and both controllers appear in Kerberos/LDAP SRV records.

**Actual:** DC02 resolved to `10.10.20.11`, and both DCs were advertised.

![DC/KDC discovery and DC02 name resolution during diagnosis.](assets/CP13-DC-KDC-discovery-and-DC02-DNS.png){ width=92% }

![Kerberos SRV records during recovery diagnosis.](assets/CP13-Kerberos-SRV-records.png){ width=92% }

![LDAP SRV records during recovery diagnosis.](assets/CP13-LDAP-SRV-records.png){ width=92% }

### Stage 6 - Check authentication/time dependencies

```powershell
Get-Service Kdc,Netlogon,W32Time |
    Select-Object Name,Status,StartType

w32tm /query /source
w32tm /query /status
```

### Why

Error 1908 can involve domain/KDC discovery, and Kerberos is time-sensitive. A returned DC with bad time could have network connectivity while still failing authentication-dependent replication operations.

### Actual

KDC, Netlogon and W32Time were healthy. DC01's source was `nova-dc02.nova.corp` with a recent successful sync.

### Stage 7 - Test the actual protocol paths

```powershell
Test-NetConnection nova-dc02.nova.corp -Port 88
Test-NetConnection nova-dc02.nova.corp -Port 135
Test-NetConnection nova-dc02.nova.corp -Port 389
```

### Why these tests

- TCP/88 checks Kerberos reachability.
- TCP/135 checks the RPC Endpoint Mapper, directly relevant to error 1722.
- TCP/389 checks LDAP.

### Actual

All returned `TcpTestSucceeded : True`.

![KDC/time health and Kerberos port reachability.](assets/CP13-KDC-time-and-Kerberos-port.png){ width=92% }

![RPC endpoint mapper and LDAP reachability from DC01 to DC02.](assets/CP13-RPC-LDAP-port-connectivity.png){ width=92% }

### Why we did not run `repadmin /syncall`

At this point every dependency that could sustain the initial errors was healthy. Forcing replication would have destroyed an opportunity to prove natural recovery. The correct question was not "can we make the warning disappear?" but "will AD's own retry mechanisms converge now that the environment is healthy?"

### Stage 8 - Observe natural convergence

A later:

```cmd
repadmin /showrepl NOVA-DC01
repadmin /showrepl NOVA-DC02
```

showed current successful inbound replication for all five naming contexts.

![DC01 showing current successful inbound replication after natural recovery.](assets/CP13-DC01-showrepl-natural-success.png){ width=92% }

On DC02, current attempts were successful even though an old `1722` consecutive-failure line remained visible lower in the output. This was a reminder that historical counters/status lines can remain visible after the current condition has recovered.

![DC02 showing current successful replication with an older historical failure line still visible.](assets/CP13-DC02-showrepl-success-with-lingering-counter.png){ width=92% }

### Stage 9 - Final aggregate validation

```cmd
repadmin /replsummary
```

### Expected

`0 / 5` and `0%` for both controllers as sources and destinations.

### Actual

Exactly that; no active error remained.

![Final aggregate replication summary after DC01 recovery.](assets/CP13-final-replsummary-zero-failures.png){ width=92% }

### Stage 10 - Validate the recovered DC as an actual domain controller

```cmd
dcdiag /test:Replications /test:Advertising /test:SysVolCheck
```

### Why run DCDIAG after REPADMIN?

REPADMIN proves replication. It does not independently prove that the DC is advertising itself and exposing a healthy SYSVOL state.

### Actual

Advertising, SysVolCheck and Replications all passed.

![Targeted DCDIAG confirming the recovered DC is healthy above the replication layer.](assets/CP13-final-dcdiag-targeted-pass.png){ width=92% }

### Conclusion

**PASS.** DC01 recovered naturally. The transient 1722/1908 errors were startup/convergence symptoms, not a configuration defect requiring forced replication or firewall/DNS changes.

### Core engineering lesson

> A replication error immediately after a DC outage does not automatically mean configuration is broken. Diagnose by layers, determine whether the environment is naturally converging, and intervene only when normal recovery fails.

---

## 6.15 CP-14 - Controlled replication-divergence incident

### Goal

Create a safe condition where both DCs remain online but DC02 temporarily stops accepting inbound directory replication. Then prove that one controller can be alive yet hold stale AD data.

### Why this incident matters

Real networks can experience partial failures: WAN interruption, firewall/RPC disruption, or replication-specific problems while DNS/Kerberos services remain online. "The server responds" therefore does not mean "the directory is current."

### Safety baseline

Before injecting the fault:

```cmd
repadmin /replsummary
```

showed both controllers at `0 / 5`, `0%` failures.

The disposable object `CR013-DivergenceTest` was confirmed absent on both DCs.

![Clean replication baseline before the divergence incident.](assets/CP14-clean-replsummary-baseline.png){ width=92% }

![Disposable divergence object absent from both DCs before fault injection.](assets/CP14-baseline-no-test-group-both-DCs.png){ width=92% }

### Fault mechanism

Inbound replication on DC02 was disabled:

```cmd
repadmin /options NOVA-DC02 +DISABLE_INBOUND_REPL
repadmin /options NOVA-DC02
```

The flag was first toggled on/off as a reversible safety test, then applied for the actual incident.

### Expected

DC02 remains online as a DC but refuses inbound AD replication.

### Actual

`repadmin /options NOVA-DC02` showed:

```text
IS_GC
DISABLE_INBOUND_REPL
```

![Controlled inbound-replication flag applied and verified on DC02.](assets/CP14-final-disable-inbound-repl-verified.png){ width=92% }

### Create a change explicitly on DC01

```powershell
New-ADGroup `
    -Name "CR013-DivergenceTest" `
    -SamAccountName "CR013-DivergenceTest" `
    -GroupScope Global `
    -GroupCategory Security `
    -Path "CN=Users,DC=nova,DC=corp" `
    -Description "Disposable CR-013 replication divergence test" `
    -Server nova-dc01.nova.corp
```

The explicit `-Server` parameter guaranteed that the write originated on DC01.

### Prove the directory states differ

```powershell
Get-ADGroup "CR013-DivergenceTest" `
    -Server nova-dc01.nova.corp `
    -Properties ObjectGUID,SID,WhenCreated,Description |
    Select-Object Name,ObjectGUID,SID,WhenCreated,Description

Get-ADGroup "CR013-DivergenceTest" `
    -Server nova-dc02.nova.corp
```

### Expected

- DC01 returns the object.
- DC02 returns `ADIdentityNotFoundException`.

### Actual

Exactly that. Both DCs were online, but their directory state differed.

![Object exists on DC01 but is absent from DC02 while inbound replication is blocked.](assets/CP14-divergence-object-on-DC01-not-DC02.png){ width=92% }

### Diagnose replication while the fault exists

```cmd
repadmin /showrepl NOVA-DC02
repadmin /replsummary
```

### Actual

`showrepl` reported:

```text
8457 (0x2109): The destination server is currently rejecting replication requests.
```

The aggregate summary showed `2 / 5` failures (`40%`) on the affected source/destination path.

![DC02 reporting replication error 8457 while the controlled block is active.](assets/CP14-showrepl-DC02-error-8457.png){ width=92% }

### Why only 2/5 failed instead of 5/5

`replsummary` reports the most recent status known for each naming context. Some partitions still had a previous successful result because a newer failed attempt had not yet occurred for each one during the observation window. The decisive evidence was:

- DC02 was configured to reject inbound replication;
- error 8457 was emitted;
- the newly created domain object did not arrive on DC02.

### Rollback

```cmd
repadmin /options NOVA-DC02 -DISABLE_INBOUND_REPL
repadmin /options NOVA-DC02
```

The new DSA options returned to `IS_GC` only.

![Replication summary during the fault and the rollback command that removed the block.](assets/CP14-replsummary-8457-and-rollback.png){ width=92% }

### Important post-rollback observation

Immediately after removing the flag, DC02 still did **not** contain the group.

![The object was still absent immediately after rollback.](assets/CP14-postrollback-object-still-missing-on-DC02.png){ width=92% }

This was not proof of rollback failure. It demonstrated a key operational concept:

```text
fault removed
    !=
service already converged
```

The system still needed a normal replication opportunity.

### Natural convergence proof

Without `repadmin /syncall`, the object later appeared on DC02.

DC02 returned:

- ObjectGUID: `3145b154-d01a-4ec7-b903-86a6ef0ed989`
- SID: `S-1-5-21-2109268265-1139938310-975847112-1145`

These matched DC01 exactly.

![DC02 receives the same original divergence-test object after normal replication resumes.](assets/CP14-DC02-object-arrived-same-identity.png){ width=92% }

### Why matching GUID/SID is stronger than matching the name

A same-named group could have been recreated manually. Matching the GUID and SID proves that DC02 received the original directory object from DC01 through replication.

`repadmin /showrepl NOVA-DC02` then showed current successful inbound replication again.

![Post-rollback DC02 replication returns to successful current attempts.](assets/CP14-DC02-showrepl-postrollback-success.png){ width=92% }

Final validation:

```cmd
repadmin /replsummary
```

returned `0 / 5`, `0%` for both DCs as sources and destinations.

![Final zero-failure replication summary closing the divergence incident.](assets/CP14-final-replsummary-zero-failures.png){ width=92% }

### Conclusion

**PASS.** The lab proved that an online DC can be stale, that replication direction matters, that error 8457 can be tied directly to a controlled inbound-replication block, and that AD can naturally converge after rollback.

---

## 6.16 CP-15 - Final resilience validation and cleanup

The final checkpoint was intentionally repetitive. The purpose was to prove that after all resilience exercises the environment had been returned to a clean, supportable production state.

### 6.16.1 Final replication and DCDIAG health

```cmd
repadmin /replsummary

dcdiag /test:Replications /test:Advertising /test:SysVolCheck /test:NetLogons

dcdiag /s:NOVA-DC02 /test:Replications /test:Advertising /test:SysVolCheck /test:NetLogons
```

### Expected

- `0 / 5`, `0%` replication failures on both DCs.
- Connectivity, Advertising, SysVolCheck, NetLogons and Replications pass on both.

### Actual

All passed.

![Fresh final replication summary and DC01 health validation.](assets/CP15-replsummary-clean-and-dcdiag-DC01-start.png){ width=92% }

![DC01 targeted DCDIAG passing.](assets/CP15-dcdiag-DC01-pass.png){ width=92% }

![DC02 targeted DCDIAG passing.](assets/CP15-dcdiag-DC02-pass.png){ width=92% }

### 6.16.2 Final DNS/service discovery

```powershell
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"
Resolve-DnsName -Type SRV "_ldap._tcp.gc._msdcs.nova.corp"
```

### Actual

- both DCs on LDAP port 389;
- both DCs on Kerberos port 88;
- both DCs on Global Catalog port 3268.

![Final LDAP SRV validation.](assets/CP15-dns-ldap-srv-both-DCs.png){ width=92% }

![Final Kerberos SRV validation.](assets/CP15-dns-kerberos-srv-both-DCs.png){ width=92% }

### 6.16.3 Final SYSVOL / NETLOGON reachability

```powershell
Test-Path "\\NOVA-DC01\SYSVOL"
Test-Path "\\NOVA-DC01\NETLOGON"
Test-Path "\\NOVA-DC02\SYSVOL"
Test-Path "\\NOVA-DC02\NETLOGON"
```

**Actual:** all four returned `True`.

![Global Catalog SRV records plus final SYSVOL/NETLOGON reachability.](assets/CP15-dns-gc-srv-and-sysvol-netlogon-all-true.png){ width=92% }

### 6.16.4 Final time and FSMO checks

On DC01 and DC02:

```cmd
w32tm /query /source
w32tm /query /status
```

FSMO:

```powershell
Get-ADDomain |
    Select-Object PDCEmulator,RIDMaster,InfrastructureMaster

Get-ADForest |
    Select-Object SchemaMaster,DomainNamingMaster
```

### Expected

- DC01 follows the domain hierarchy toward DC02.
- DC02/PDC follows external NTP.
- all FSMO roles remain where the design says they are.

### Actual

- DC01 source = `nova-dc02.nova.corp`.
- DC02 source = `1.pool.ntp.org,0x8`.
- all five FSMO roles = `nova-dc02.nova.corp`.

![DC01 following DC02 for time and domain FSMO role output.](assets/CP15-DC01-time-source-DC02-and-FSMO.png){ width=92% }

![DC02 PDC using external NTP with FSMO roles still on DC02.](assets/CP15-DC02-external-NTP-and-FSMO.png){ width=92% }

### 6.16.5 Final client test as Moyo

Run on the domain client:

```powershell
hostname
whoami
nltest /dsgetdc:nova.corp /force
Resolve-DnsName nova-dc01.nova.corp
Resolve-DnsName nova-dc02.nova.corp
Test-Path "\\nova-files01\IT"
Test-Path "\\NOVA-DC01\SYSVOL"
Test-Path "\\NOVA-DC02\SYSVOL"
```

### Expected

A normal domain user should be able to discover a valid DC, resolve both controllers, access the permitted IT share and reach SYSVOL on both DCs.

### Actual

- hostname = `nova-client`;
- user = `nova\moyo`;
- DC Locator selected `nova-dc02.nova.corp` / `10.10.20.11`;
- DC01 resolved to `10.10.20.10`;
- DC02 resolved to `10.10.20.11`;
- IT share = `True`;
- both SYSVOL paths = `True`.

![Final client-side discovery, DNS, file-share and SYSVOL proof from Moyo's session.](assets/CP15-moyo-client-dc-discovery-dns-share-sysvol.png){ width=92% }

![Moyo confirms SYSVOL reachability on both DCs.](assets/CP15-moyo-client-both-sysvol-true.png){ width=92% }

### 6.16.6 Inventory and remove disposable objects

Before deletion, the exact test objects were listed:

```powershell
Get-ADUser -Filter 'SamAccountName -eq "cr013.recycletest"' `
    -Properties ObjectGUID,SID,Description |
    Select-Object Name,SamAccountName,ObjectGUID,SID,Description

Get-ADGroup -Filter 'SamAccountName -eq "CR013-RecycleGroup" -or SamAccountName -eq "CR013-DivergenceTest"' `
    -Properties ObjectGUID,SID,Description |
    Select-Object Name,SamAccountName,ObjectGUID,SID,Description
```

This confirmed the user and two groups were the disposable CR-013 objects.

![Final disposable-object inventory before cleanup.](assets/CP15-final-inventory-disposable-objects.png){ width=92% }

They were then removed:

```powershell
Remove-ADUser "cr013.recycletest" -Confirm:$false
Remove-ADGroup "CR013-RecycleGroup" -Confirm:$false
Remove-ADGroup "CR013-DivergenceTest" -Confirm:$false
```

### 6.16.7 Prove no fault-injection settings remain

```cmd
repadmin /options NOVA-DC01
repadmin /options NOVA-DC02
```

### Expected

Normal DSA options such as `IS_GC`, but no:

- `DISABLE_INBOUND_REPL`
- `DISABLE_OUTBOUND_REPL`

### Actual

Both controllers showed only `IS_GC` in the captured output.

### 6.16.8 Final replication closure

```cmd
repadmin /replsummary
```

### Actual

Both DCs reported `0 / 5`, `0%` as sources and destinations, with no active error.

![Cleanup complete, no replication-disable flags, and final zero-failure replication state.](assets/CP15-cleanup-flags-and-final-replsummary.png){ width=92% }

### About the 57-minute largest delta in the final screen

This was not a failure. `largest delta` describes how long it has been since the oldest successful replication relationship represented by the summary. The health fields remained:

```text
fails/total = 0 / 5
%           = 0
error       = blank
```

### Conclusion

**PASS. CP-15 complete. CR-013 formally closed.**

---

# 7. Command and Configuration Breakdown

## 7.1 `repadmin /replsummary`

### Purpose

Fast aggregate view of replication health.

### Important fields

- **Source DSA** - the controller sending changes.
- **Destination DSA** - the controller receiving changes.
- **largest delta** - age of the oldest represented successful replication result.
- **fails/total** - failed relationships out of tested relationships.
- **%** - failure percentage.
- **error** - current error class if a failure exists.

### How it was used in CR-013

- baseline health;
- post-outage recovery trend;
- controlled divergence detection;
- final closure validation.

## 7.2 `repadmin /showrepl <DC>`

### Purpose

Inspect inbound neighbors and replication results for each naming context.

### Why it was necessary

A summary can say `2 / 5` failures. `showrepl` tells us **which two**, from which partner, and whether the current last attempt succeeded or failed.

## 7.3 `dcdiag`

### Purpose

Validate domain-controller functions above raw replication.

### Tests used

- `Advertising` - can the DC advertise itself as usable?
- `Services` - are required services running?
- `NetLogons` - is Netlogon functioning?
- `SysVolCheck` - is SYSVOL in a usable state?
- `Replications` - DCDIAG's replication-health view.
- `MachineAccount` - is the DC's machine account/trust healthy?
- `Connectivity` - can the diagnostic framework communicate with the target?

## 7.4 `nltest /dsgetdc`

### Purpose

Ask Windows DC Locator to discover a suitable domain controller.

### Important variants used

```cmd
nltest /dsgetdc:nova.corp /force
nltest /dsgetdc:nova.corp /kdc /force
nltest /dclist:nova.corp
```

`/force` prevented reliance on a cached DC selection during failover/recovery tests.

## 7.5 `Resolve-DnsName -Type SRV`

### Purpose

Inspect the DNS service records that advertise AD services.

### Key records

- `_ldap._tcp.dc._msdcs.nova.corp` -> domain-controller LDAP, port 389;
- `_kerberos._tcp.nova.corp` -> Kerberos, port 88;
- `_ldap._tcp.gc._msdcs.nova.corp` -> Global Catalog, port 3268.

## 7.6 `w32tm`

### Purpose

Inspect the Windows Time source, status and PDC configuration.

```cmd
w32tm /query /source
w32tm /query /status
w32tm /query /configuration
```

The hierarchy and stratum values were used to validate the trust chain for Kerberos time.

## 7.7 AD Recycle Bin commands

Baseline and validation:

```powershell
Get-ADOptionalFeature -Filter 'Name -like "Recycle Bin Feature"'
```

Enablement:

```powershell
Enable-ADOptionalFeature -Identity "Recycle Bin Feature" -Scope ForestOrConfigurationSet -Target "nova.corp"
```

Deleted-object discovery:

```powershell
Get-ADObject -IncludeDeletedObjects ...
```

The lab deliberately used ADAC for the restore step to learn both CLI inspection and GUI operational recovery.

## 7.8 `repadmin /options` replication-control flags

Fault injection:

```cmd
repadmin /options NOVA-DC02 +DISABLE_INBOUND_REPL
```

Rollback:

```cmd
repadmin /options NOVA-DC02 -DISABLE_INBOUND_REPL
```

### Why inbound only?

This isolated the test variable. DC02 remained online and could still act as a domain controller, but it could not accept new directory changes from its partner. That was the exact state needed to demonstrate an online-but-stale DC.

---

# 8. Validation Tests

| Validation | Expected | Actual | Result |
|---|---|---|---|
| DC inventory | Both DCs recognized with correct IP/site/GC | Correct | PASS |
| Baseline replication summary | 0 failures | 0/5, 0% both DCs | PASS |
| Detailed replication | 5 naming contexts successful both ways | Successful | PASS |
| Current DCDIAG | selected tests pass both DCs | Passed | PASS |
| SYSVOL/NETLOGON | published and reachable on both DCs | True | PASS |
| LDAP SRV | both DCs, port 389 | correct | PASS |
| Kerberos SRV | both DCs, port 88 | correct | PASS |
| GC SRV | both DCs, port 3268 | correct | PASS |
| Endpoint DNS config | both AD DNS servers present | correct | PASS |
| Time hierarchy | PDC external, domain members hierarchical | correct | PASS |
| Recycle Bin replication | enabled on both DCs, repl clean | correct | PASS |
| Deleted user recovery | same GUID/SID restored | matched | PASS |
| Deleted group recovery | same GUID/SID restored | matched | PASS |
| DC01 outage | DC01 unavailable, other systems remain online | achieved | PASS |
| Fresh DC discovery during outage | DC02 selected | DC02 selected | PASS |
| LDAP/Kerberos during outage | ports reachable on DC02 | reachable | PASS |
| DC02 SYSVOL/NETLOGON during outage | reachable | True | PASS |
| Fresh Moyo sign-in during outage | succeeds through surviving domain | succeeded | PASS |
| DC01 post-outage services | core DC services running | running | PASS |
| DC01 natural convergence | transient errors clear without syncall | cleared | PASS |
| Controlled divergence | object on DC01 absent on DC02 | observed | PASS |
| Fault diagnosis | 8457 expected | observed | PASS |
| Post-rollback convergence | same GUID/SID arrives on DC02 | matched | PASS |
| Final DCDIAG both DCs | all selected tests pass | passed | PASS |
| Final client test | DNS/DC/share/SYSVOL usable | passed | PASS |
| Fault flags removed | no replication-disable flags | only IS_GC | PASS |
| Final replication summary | 0/5, 0% | 0/5, 0% | PASS |

---

# 9. Failure Tests and Troubleshooting

CR-013 intentionally preserves the non-happy-path evidence because that is where most of the engineering learning occurred.

## 9.1 `dcdiag /e /q` reported RPC/event-log and DFSR warnings

### Symptom

Enterprise DCDIAG showed `0x6ba - The RPC server is unavailable` while querying remote event logs and reported DFSREvent/KccEvent/SystemLog failures.

### Initial risk

It would have been easy to conclude "replication is broken" and start changing firewall or DFSR configuration.

### Diagnostic reasoning

Replication had already passed baseline checks. The team therefore inspected the DFS Replication event log locally and then ran current-state DCDIAG tests.

### Resolution

Current-state tests passed. The errors were retained as historical incident evidence rather than "repaired."

## 9.2 DFSR Event 2212 after unexpected shutdown

### Meaning

DFSR detected an unexpected shutdown on the volume and initiated automatic recovery.

### Why this mattered

The event explains why a server that was powered off or interrupted can have red historical logs even after it is healthy.

### Result

No manual DFSR database rebuild was needed because current service and replication checks passed.

## 9.3 DFSR Event 5014 / error 9036

### Meaning

Replication paused for backup or restore.

### Why this mattered

Not every warning in an AD-related log indicates a domain incident. In this case the pause correlated with the backup/recovery activity already established under CR-012.

## 9.4 Client `w32tm /query /source` returned Access Denied

### Symptom

A non-elevated user shell on the client could not run the source query.

### Interpretation

The denial was about access to the diagnostic interface, not the actual ability of Windows Time to synchronize.

### Validation

`w32tm /query /status` still showed the active domain time source and a recent successful synchronization.

## 9.5 Recycle Bin immediate validation briefly appeared empty

### Symptom

The first `EnabledScopes` read immediately after enablement was empty.

### Risk

Repeating the irreversible enable command or treating the change as failed without further evidence.

### Correct response

Query both DCs explicitly and check `repadmin /replsummary`.

### Result

Both controllers later showed the feature enabled and replication stayed healthy.

## 9.6 Expected not-found errors during Recycle Bin testing

After deleting the disposable user/group, `Get-ADUser` or `Get-ADGroup` returned `ADIdentityNotFoundException`.

This was an **expected success condition** for the deletion stage. The deleted-object query then proved the original object was preserved in Deleted Objects.

## 9.7 Post-outage replication errors 1722 and 1908

### Symptom

Immediately after DC01 returned, `repadmin /replsummary` showed `2 / 5` failures and `40%` with errors 1722 and 1908.

### Why we did not panic

Three of five naming contexts were already succeeding. This was inconsistent with a total routing/DNS/RPC failure.

### Tests performed

- DC/KDC discovery;
- A and SRV DNS records;
- KDC/Netlogon/W32Time services;
- time source/status;
- Kerberos TCP/88;
- RPC endpoint mapper TCP/135;
- LDAP TCP/389;
- repeated `showrepl` observation.

### Result

All dependencies were healthy and AD naturally converged. No `syncall` was required.

## 9.8 Lingering historical 1722 line after current success

A DC02 `showrepl` screen still displayed an older consecutive-failure line even though current naming-context attempts were successful.

### Lesson

Read timestamps and current last-attempt state. Do not interpret every visible old error line as a current failure. A fresh aggregate summary was used to settle the question.

## 9.9 Controlled replication error 8457

### Symptom

`The destination server is currently rejecting replication requests.`

### Cause

Intentionally applied `DISABLE_INBOUND_REPL` on DC02.

### Why this was useful

It tied a known control to a known replication error and demonstrated how an administrator can reason from symptom back to a replication policy/state condition.

## 9.10 Object still missing immediately after rollback

### Symptom

The replication block had been removed, but `CR013-DivergenceTest` still did not appear on DC02 in the first immediate lookup.

### Interpretation

Rollback removed the cause; it did not guarantee instantaneous convergence.

### Result

After the next natural replication opportunity, the object appeared with the same GUID/SID and the replication summary returned to clean state.

---

# 10. Logs and Reports

The most important logs/reports generated or inspected during CR-013 were:

- `repadmin /replsummary` at baseline, during failure and after recovery;
- `repadmin /showrepl` for both DCs;
- DCDIAG output for enterprise and targeted tests;
- DFS Replication warning/error event history;
- DNS SRV query output;
- Windows DC Locator output;
- Windows Time source/status/configuration;
- AD Deleted Objects metadata;
- client-side `Test-Path` and `Test-NetConnection` results.

The source/evidence package accompanying this journal contains the raw DFSR text capture and the screenshot evidence used throughout the journal.

---

# 11. Security Considerations

## 11.1 Do not use production identities for destructive recovery tests

All deletion/recovery tests used objects clearly marked as disposable.

## 11.2 SID preservation matters

For users and groups, restoring the original SID is critical because authorization references security identifiers. A same-named replacement is not equivalent.

## 11.3 Recycle Bin enablement is irreversible

The forest target and functional level were checked before enabling the feature.

## 11.4 Normal-user validation is necessary

Moyo's tests proved that the environment worked without relying on administrator privileges. Server health from an admin console is not enough to prove user service availability.

## 11.5 FSMO seizure is an emergency operation

No role seizure was performed during temporary outage. This prevents unnecessary split-brain/old-role-holder risks.

## 11.6 Replication fault injection was scoped

Only **inbound replication on DC02** was disabled, and rollback was known in advance. No production user/group was modified to create divergence.

---

# 12. Rollback and Recovery

## 12.1 DC01 outage rollback

Rollback was simply to start DC01 normally and allow AD services to initialize. No role movement or DNS change was required.

## 12.2 Replication-divergence rollback

```cmd
repadmin /options NOVA-DC02 -DISABLE_INBOUND_REPL
```

Rollback success was not declared until:

1. the flag disappeared;
2. the pending object arrived on DC02;
3. the object GUID/SID matched DC01;
4. `showrepl` returned to current success;
5. `replsummary` returned to zero failures.

## 12.3 Deleted-object recovery

ADAC Restore returned the user/group to the original parent and preserved the original identity.

## 12.4 Recycle Bin enablement

There is no normal disable rollback. That is why baseline, forest mode and target verification were mandatory before enablement.

---

# 13. Commands Reference

| Purpose | Command |
|---|---|
| List DCs | `Get-ADDomainController -Filter *` |
| Domain FSMO roles | `Get-ADDomain` |
| Forest FSMO roles | `Get-ADForest` |
| Replication summary | `repadmin /replsummary` |
| Detailed inbound replication | `repadmin /showrepl <DC>` |
| DSA options | `repadmin /options <DC>` |
| Disable inbound replication | `repadmin /options NOVA-DC02 +DISABLE_INBOUND_REPL` |
| Re-enable inbound replication | `repadmin /options NOVA-DC02 -DISABLE_INBOUND_REPL` |
| DC diagnostics | `dcdiag ...` |
| Discover DC | `nltest /dsgetdc:nova.corp /force` |
| Discover KDC | `nltest /dsgetdc:nova.corp /kdc /force` |
| List DCs | `nltest /dclist:nova.corp` |
| LDAP SRV | `Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"` |
| Kerberos SRV | `Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"` |
| GC SRV | `Resolve-DnsName -Type SRV "_ldap._tcp.gc._msdcs.nova.corp"` |
| DNS server configuration | `Get-DnsClientServerAddress -AddressFamily IPv4` |
| Time source | `w32tm /query /source` |
| Time status | `w32tm /query /status` |
| Recycle Bin status | `Get-ADOptionalFeature ...` |
| Deleted objects | `Get-ADObject -IncludeDeletedObjects ...` |
| TCP service test | `Test-NetConnection <host> -Port <port>` |
| SMB path test | `Test-Path "\\server\share"` |

---

# 14. Evidence Screenshots

The implementation sections embed the important evidence directly rather than listing file names without context. The full evidence package also contains additional supporting captures. Key evidence categories include:

- authoritative DC/FSMO baseline;
- replication summary and detailed partner views;
- DCDIAG and DFSR event evidence;
- SYSVOL/NETLOGON publication;
- LDAP/Kerberos/GC SRV registration;
- endpoint DNS configuration;
- time hierarchy;
- Recycle Bin baseline, enablement, deletion and restoration;
- DC01 outage and DC02 failover;
- DC01 recovery and natural replication convergence;
- controlled replication divergence/error 8457;
- final client acceptance and cleanup.

The companion ZIP contains all 80 CR-013 evidence files preserved from the live handoff.

---

# 15. Lessons Learned

1. **Two DCs are not automatically resilient.** Redundancy must be proved through discovery, replication, SYSVOL/NETLOGON, DNS and real client behavior.
2. **Historical red event logs do not automatically mean the service is broken now.** Current-state tests and timestamps matter.
3. **`repadmin /replsummary` and `/showrepl` answer different questions.** One gives breadth; the other gives partition-level detail.
4. **A partial failure is diagnostic information.** `2 / 5` failures immediately suggested a narrower problem than total network failure.
5. **Do not repair before locating the failing layer.** DNS, KDC discovery, time, RPC and LDAP were tested individually before any replication repair.
6. **Natural convergence is valuable evidence.** Withholding `repadmin /syncall` proved AD could recover on its own.
7. **DNS records are not live health checks.** An offline DC can remain registered in DNS.
8. **A live DC can still be stale.** CP-14 proved availability and replication freshness are separate dimensions.
9. **Fault removal is not the same as recovery completion.** The post-rollback object delay demonstrated this clearly.
10. **Names do not prove object identity.** GUID and SID comparisons are required for meaningful AD recovery evidence.
11. **Time is part of authentication architecture.** The PDC time hierarchy is not cosmetic; it protects Kerberos reliability.
12. **Normal-user testing matters.** Moyo's client tests proved the environment from the consumer side, not only from an administrator's console.
13. **FSMO seizure is not a normal failover mechanism.** Temporary outage should be tolerated and diagnosed before emergency role seizure is considered.
14. **Cleanup is part of incident closure.** CR-013 was not closed until disposable objects and temporary replication-control flags were gone.

---

# 16. Acceptance Criteria

CR-013 was accepted only after all of the following were true:

- both domain controllers recognized and healthy;
- both Global Catalogs available;
- bidirectional replication clean;
- all five naming contexts healthy;
- SYSVOL and NETLOGON available on both controllers;
- LDAP, Kerberos and Global Catalog SRV records correct;
- client and server DNS resolver configuration redundant;
- Windows time hierarchy correct;
- Recycle Bin enabled and replicated;
- disposable user restored with original GUID/SID;
- disposable group restored with original GUID/SID;
- FSMO ownership known and documented;
- transfer/seizure decision rules documented;
- client failover through DC02 proven during DC01 outage;
- fresh user logon proven during the outage;
- recovered DC01 converged naturally;
- controlled divergence detected and diagnosed;
- controlled divergence recovered naturally;
- final DCDIAG checks passed on both DCs;
- final client-side checks passed;
- disposable test objects removed;
- no replication-disable flags remained;
- final `repadmin /replsummary` returned `0 / 5`, `0%` for both DCs.

**Acceptance result: PASS.**

---

# 17. Final State

At CR-013 closure:

```text
nova.corp

                 +--------------------------+
External NTP --->| NOVA-DC02                |
                 | 10.10.20.11              |
                 | GC + DNS + AD DS         |
                 | all FSMO roles           |
                 +-------------+------------+
                               |
                       AD replication
                               |
                 +-------------v------------+
                 | NOVA-DC01                |
                 | 10.10.20.10              |
                 | GC + DNS + AD DS         |
                 +-------------+------------+
                               |
                 domain services / DNS / auth
                               |
                  +------------+------------+
                  |                         |
             NOVA-FILES01              nova-client
                                       NOVA\moyo
```

Final replication health:

```text
Source DSA
NOVA-DC01   0 / 5   0%
NOVA-DC02   0 / 5   0%

Destination DSA
NOVA-DC01   0 / 5   0%
NOVA-DC02   0 / 5   0%
```

Final DSA options on both controllers contained `IS_GC` and no replication-disable fault-injection flags.

---

# 18. Snapshot / Backup Evidence

CR-013 relied on the backup/recovery controls completed in CR-012, including DC01 System State protection. The CR-013 handoff does not record a separate new CR-013 hypervisor snapshot as a closure requirement, so this journal does not invent one.

The relevant recovery safety boundary was therefore:

- CR-012 backup/recovery controls already validated;
- CR-013 used disposable AD objects for destructive testing;
- replication fault injection had a recorded rollback command;
- DC outage was controlled and reversible.

---

# 19. Conclusion

CR-013 moved Nova Corp from "there are two domain controllers" to **evidence that the domain is resilient**.

The lab proved that DC02 can carry authentication, DNS discovery, Kerberos, SYSVOL/NETLOGON and normal user access while DC01 is unavailable. It also proved that DC01 can return and naturally converge after temporary 1722/1908 replication errors without unnecessary repair. Active Directory Recycle Bin was enabled and validated through real user and group recovery with GUID/SID preservation. FSMO ownership and the transfer-versus-seizure decision boundary were documented. A deliberately induced replication divergence produced a real 8457 condition and an online-but-stale DC, then recovered naturally after rollback.

Most importantly, the environment was not closed merely when the fault stopped. Nova Corp revalidated both DCs, DNS service discovery, time hierarchy, FSMO roles, SYSVOL/NETLOGON, a normal user's client experience, cleanup of all disposable objects, and the absence of temporary replication-control flags.

The final state was clean:

```text
Both DCs healthy
+ replication 0/5 failures
+ DNS/DC discovery healthy
+ SYSVOL/NETLOGON available
+ time hierarchy correct
+ client access proven
+ no temporary fault flags
+ disposable objects removed
```

**CR-013 - Secondary Domain Controller and AD Resilience: COMPLETE / PASS.**

**Next frozen roadmap item:** CR-014 - Phase 2 Incident Exercises.
