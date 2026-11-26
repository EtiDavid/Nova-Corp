---
title: "CR-004 — Deploy Additional Domain Controller and High Availability"
sourcePath: "docs/Documentation/Change-Requests/Journal-CR-004.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/Journal-CR-004.md"
section: "Documentation"
---

# CR-004 — Deploy Additional Domain Controller and High Availability

---

| Field | Value |
|-------|-------|
| Change ID | CR-004 |
| Title | Deploy Additional Domain Controller and High Availability |
| Project | Nova Corp Enterprise Infrastructure |
| Phase | Phase 2 — Windows Server Infrastructure |
| Author | David Eti |
| Status | Completed |
| Date | *(Update when finalised)* |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Business Objective](#2-business-objective)
3. [Technical Objectives](#3-technical-objectives)
4. [Scope](#4-scope)
5. [Existing Environment](#5-existing-environment)
6. [Design Decision — Why an Additional Domain Controller](#6-design-decision--why-an-additional-domain-controller)
7. [Risks](#7-risks)
8. [Rollback Plan](#8-rollback-plan)
9. [Success Criteria](#9-success-criteria)
10. [Deployment — Checkpoint 1: Deploy the Windows Server](#10-deployment--checkpoint-1-deploy-the-windows-server)
11. [Deployment — Checkpoint 2: Configure Static Networking](#11-deployment--checkpoint-2-configure-static-networking)
12. [Deployment — Checkpoint 3: Join the Existing Domain](#12-deployment--checkpoint-3-join-the-existing-domain)
13. [Deployment — Checkpoint 4: Install Active Directory Domain Services](#13-deployment--checkpoint-4-install-active-directory-domain-services)
14. [Deployment — Checkpoint 5: Promote to Additional Domain Controller](#14-deployment--checkpoint-5-promote-to-additional-domain-controller)
15. [Validation — Active Directory Health](#15-validation--active-directory-health)
16. [Understanding Active Directory Replication](#16-understanding-active-directory-replication)
17. [FSMO Roles — Theory and Transfer](#17-fsmo-roles--theory-and-transfer)
18. [High Availability and Failure Testing](#18-high-availability-and-failure-testing)
19. [Incident Report — NOVA-INC-001](#19-incident-report--nova-inc-001)
20. [Technical Glossary](#20-technical-glossary)

---

## 1. Introduction

During CR-001 through CR-003, the Nova Corp infrastructure was built around a single Windows Server acting as the sole Domain Controller. This server hosted every critical Active Directory service:

- Active Directory Domain Services (AD DS)
- Domain Name System (DNS)
- Global Catalog
- SYSVOL and NETLOGON
- All five Flexible Single Master Operation (FSMO) roles

Although the environment was fully functional, this design introduced a critical structural problem. The entire organisation depended on a single server. If that server failed — due to hardware failure, operating system corruption, power loss, or routine maintenance — every Active Directory service would become unavailable simultaneously.

Users would be unable to log into their computers, resolve internal DNS names, access shared folders, receive Group Policy updates, or authenticate to any domain resource.

This is the definition of a **Single Point of Failure (SPOF)**.

One of the most important principles in enterprise infrastructure design is eliminating single points of failure wherever possible. For this reason, Nova Corp approved CR-004: the deployment of a second Domain Controller to provide redundancy for the existing identity infrastructure.

---

## 2. Business Objective

The objective of CR-004 was to improve the availability and resilience of the Active Directory infrastructure by deploying a second Domain Controller into the existing `nova.corp` domain.

Instead of relying on one server for all identity services, the environment would contain two Domain Controllers operating as peers. The business benefits of this design include:

- Reduced downtime during hardware failure or maintenance
- Continued authentication and DNS services if one Domain Controller is unavailable
- Easier maintenance windows without full service interruption
- Improved disaster recovery posture
- A foundation for future infrastructure growth

By completing this Change Request, Nova Corp removed the most significant single point of failure within the Windows infrastructure.

---

## 3. Technical Objectives

The technical objectives for CR-004 were defined and agreed upon before implementation began:

- Deploy a second Windows Server virtual machine
- Configure static networking correctly before domain join
- Join the server to the existing `nova.corp` domain as a member server
- Install the Active Directory Domain Services role
- Promote the server as an Additional Domain Controller
- Verify Active Directory replication between both Domain Controllers
- Validate DNS, SYSVOL, NETLOGON and Group Policy replication
- Understand and validate all five FSMO roles
- Transfer FSMO roles between Domain Controllers
- Deploy a Windows 11 enterprise client for authentication testing
- Simulate the failure of the primary Domain Controller
- Verify that authentication and domain services continue operating during failure
- Restore the failed Domain Controller and verify replication resumes successfully

Unlike previous Change Requests where successful installation was sufficient for completion, CR-004 required the infrastructure to pass a series of controlled failure tests before it could be considered done.

---

## 4. Scope

**Included in this Change Request:**

- Deployment of `nova-dc02`
- Static network configuration
- Domain join to `nova.corp`
- AD DS role installation
- Promotion as an Additional Domain Controller
- Active Directory replication validation
- DNS replication validation
- SYSVOL and NETLOGON replication validation
- FSMO role verification and transfer
- Windows 11 client deployment and domain join
- High Availability testing
- Disaster Recovery simulation and recovery validation

**Excluded from this Change Request:**

- Organisational Unit design
- Group Policy configuration
- File Server deployment
- Windows Server Backup configuration
- PowerShell automation scripts

These components are addressed in later Change Requests.

---

## 5. Existing Environment

Before CR-004 began, the Nova Corp infrastructure contained the following systems:

| Server | Role |
|--------|------|
| nova-prox01 | Proxmox Virtualisation Host |
| nova-fw01 | pfSense Firewall |
| nova-dc01 | Primary Domain Controller |

The Active Directory environment consisted of a single forest and a single domain (`nova.corp`), with all services and FSMO roles concentrated on one server.

```
Internet
    │
    ▼
pfSense (nova-fw01)
    │
──────────────────────────────
VLAN 20 — Server Network
    │
    ▼
nova-dc01 (10.10.20.10)
 ├── AD DS
 ├── DNS
 ├── Global Catalog
 ├── SYSVOL / NETLOGON
 └── All FSMO Roles
```

Every authentication request, DNS query, and Group Policy operation depended entirely on this single server.

---

## 6. Design Decision — Why an Additional Domain Controller

When deploying a second server into an existing Active Directory environment, three options exist:

**Option 1 — Add a Domain Controller to an existing domain.**
The new server joins the existing domain and becomes a replication partner. Both servers participate in the same directory database.

**Option 2 — Add a new domain to an existing forest.**
This creates a separate child domain within the same forest. Used for large organisations with distinct administrative boundaries.

**Option 3 — Create a new forest.**
This creates an entirely separate Active Directory organisation with its own trust model.

For Nova Corp, only Option 1 was appropriate. The company already had a healthy, functional directory under the `nova.corp` domain. The goal was redundancy for the existing organisation, not the creation of a second separate environment.

Selecting **Add a Domain Controller to an existing domain** allowed `nova-dc02` to become a replication partner within the same forest, sharing the same directory database, DNS zones, SYSVOL contents, and Group Policies — while providing independent authentication capabilities if `nova-dc01` became unavailable.

---

## 7. Risks

The following risks were identified and documented before implementation began:

| Risk | Potential Impact |
|------|-----------------|
| Incorrect DNS configuration | Domain promotion failure |
| Replication failure | Inconsistent Active Directory database |
| Time synchronisation problems | Kerberos authentication failure |
| Network misconfiguration | Domain join failure |
| Accidental replication conflicts | Active Directory inconsistency |
| Failed promotion | Additional Domain Controller unavailable |

To mitigate these risks, Proxmox snapshots were created before every major configuration change. This ensured that any failure could be recovered without rebuilding the environment from scratch.

---

## 8. Rollback Plan

If any stage of the deployment failed, the following procedure would be executed:

1. Shut down the failed virtual machine immediately
2. Restore the latest Proxmox snapshot
3. Verify Active Directory health on `nova-dc01`
4. Remove any orphaned Domain Controller metadata from Active Directory if necessary
5. Investigate the root cause
6. Repeat the failed stage after implementing a fix

Using snapshots significantly reduced recovery time and prevented unnecessary full reinstallations.

---

## 9. Success Criteria

CR-004 was considered complete only when all of the following conditions were met:

- `nova-dc02` successfully promoted as an Additional Domain Controller
- Active Directory replication healthy — verified with `repadmin`
- DNS replication healthy — zones present on both Domain Controllers
- SYSVOL and NETLOGON shares present and replicated
- FSMO roles understood, verified, and transferred
- Windows 11 client successfully joined to the domain
- Client authentication successful after domain join
- High Availability testing completed — services continue during `nova-dc01` outage
- Replication successfully restores after recovery testing

---

## 10. Deployment — Checkpoint 1: Deploy the Windows Server

### Objective

Deploy a new Windows Server virtual machine on `nova-prox01` to serve as the second Domain Controller.

### Implementation

A new virtual machine was created in Proxmox with the following configuration:

| Setting | Value |
|---------|-------|
| Hostname | nova-dc02 |
| Operating System | Windows Server 2025 |
| vCPU | 2 |
| Memory | 4 GB |
| Network | VLAN 20 — Server Network |

After installation, the server was renamed to `nova-dc02` and restarted to apply the new hostname.

### Why This Matters

Consistent naming conventions make enterprise environments significantly easier to manage. The hostname `nova-dc02` immediately communicates three things to any administrator:

- **nova** — identifies the environment
- **dc** — identifies the server role (Domain Controller)
- **02** — identifies the instance number

This convention scales cleanly as the environment grows.

---

## 11. Deployment — Checkpoint 2: Configure Static Networking

### Objective

Configure the server with a permanent static IP address before domain join.

### Implementation

The following network configuration was applied:

| Setting | Value |
|---------|-------|
| IP Address | 10.10.20.11 |
| Subnet Mask | 255.255.255.0 |
| Default Gateway | 10.10.20.1 |
| Preferred DNS Server | 10.10.20.10 (nova-dc01) |

At this stage, `nova-dc02` was not yet a Domain Controller. Its DNS server was pointed at the existing Domain Controller (`nova-dc01`) so that it could locate the `nova.corp` domain during the join process.

### Why the DNS Configuration Matters

Active Directory relies entirely on DNS for Domain Controller discovery. Before joining a domain, a member server must be able to resolve:

- The domain name itself
- LDAP SRV records (`_ldap._tcp.nova.corp`)
- Kerberos SRV records (`_kerberos._tcp.nova.corp`)
- Global Catalog records
- Individual Domain Controller host records

If the DNS server is incorrect or unreachable, every one of these lookups fails, and the domain join process cannot begin. This is one of the most common causes of domain join failures and was carefully verified before proceeding.

### Validation

```powershell
Get-NetIPConfiguration
```

**Expected result:** IP address `10.10.20.11`, gateway `10.10.20.1`, DNS server `10.10.20.10`

**Actual result:** Configuration matched the planned network design. ✅

---

## 12. Deployment — Checkpoint 3: Join the Existing Domain

### Objective

Join `nova-dc02` to the existing `nova.corp` domain as a member server before promotion.

### Why Join the Domain Before Promotion?

One of the most important concepts learned during this Change Request is the correct sequence for deploying an Additional Domain Controller. The correct order is:

```
Stage 1 — Workgroup (fresh Windows Server install)
     ↓
Stage 2 — Member Server (domain-joined, not yet a DC)
     ↓
Stage 3 — Additional Domain Controller (after AD DS install and promotion)
```

Joining the domain first allows the server to establish trust with the existing Active Directory environment, verify Kerberos authentication, confirm DNS is working, and authenticate against `nova-dc01` before the promotion process begins. Attempting promotion directly from a workgroup machine causes the promotion wizard to fail.

### Implementation

The server was joined to `nova.corp` using Domain Administrator credentials. The server restarted automatically after the join completed.

### Validation

After reboot, the following checks confirmed a successful domain join:

- Login using `NOVA\Administrator` succeeded
- Domain membership confirmed in System Properties
- DNS resolution of `nova.corp` and `nova-dc01.nova.corp` successful
- Communication with `nova-dc01` confirmed ✅

---

## 13. Deployment — Checkpoint 4: Install Active Directory Domain Services

### Objective

Install the Active Directory Domain Services role on `nova-dc02`.

### Why Install AD DS First?

Installing the AD DS role does **not** immediately make a server a Domain Controller. The installation step only places the required binaries, tools, and services onto the server. The actual Active Directory database (`NTDS.DIT`), SYSVOL, NETLOGON, and replication configuration are only created during the promotion step that follows.

This separation exists by design. It allows administrators to stage the server, verify the installation, and then commit to promotion as a deliberate separate action.

### Implementation

The following Windows Server role was installed via Server Manager:

```
Active Directory Domain Services (AD DS)
```

Windows automatically included the required management tools (RSAT for AD DS) as part of the installation.

### Validation

Server Manager confirmed the AD DS role was successfully installed. A notification prompt appeared:

```
Promote this server to a domain controller
```

This confirmed the installation was complete and the server was ready for promotion. ✅

---

## 14. Deployment — Checkpoint 5: Promote to Additional Domain Controller

### Objective

Promote `nova-dc02` to an Additional Domain Controller within the existing `nova.corp` domain.

### Promotion Settings

During the Active Directory Domain Services Configuration Wizard, the following settings were configured:

| Setting | Value |
|---------|-------|
| Deployment option | Add a Domain Controller to an existing domain |
| Domain | nova.corp |
| Domain Controller name | nova-dc02 |
| Global Catalog | Enabled |
| DNS Server | Enabled |
| Read-Only Domain Controller (RODC) | Disabled |

### Why Each Setting Was Chosen

**Global Catalog — Enabled**

The Global Catalog stores a partial replica of every object in the Active Directory forest. It allows clients and applications to quickly locate directory objects without querying individual Domain Controllers for every search. Because Nova Corp currently has a single domain, enabling the Global Catalog on both Domain Controllers improves redundancy with no disadvantages. In a multi-domain forest, Global Catalog placement requires more careful planning.

**DNS Server — Enabled**

Enabling the DNS Server role during promotion ensures that `nova-dc02` can also host Active Directory-integrated DNS zones. This removes DNS as another single point of failure alongside the Domain Controller role itself. Both Domain Controllers now host identical, automatically-replicated DNS zones.

**Read-Only Domain Controller — Disabled**

A Read-Only Domain Controller (RODC) is designed for branch office deployments where physical security of the server cannot be guaranteed. RODCs hold a read-only copy of the directory and cannot process write operations locally. Nova Corp's infrastructure requires both Domain Controllers to support full read and write operations, so RODC mode was not appropriate.

### DSRM Password

During promotion, a Directory Services Restore Mode (DSRM) password was configured and stored securely. DSRM is a special boot mode used when Active Directory cannot start normally, allowing administrators to perform maintenance or recovery operations directly on the AD database. Although rarely used during normal operations, it is an essential part of disaster recovery preparedness.

### Validation

After promotion, the server restarted automatically. Successful login using domain credentials confirmed that promotion had completed. Full replication and health validation is covered in the following sections.

---

## 15. Validation — Active Directory Health

With `nova-dc02` promoted and online, the next objective was to verify that the Active Directory environment was functioning correctly as a two-Domain-Controller infrastructure. Simply promoting a server is not sufficient. The environment must be verified to confirm that every component is replicating, communicating, and ready to handle a failure independently.

### Validation 1 — Verify Both Domain Controllers Are Registered

**Command:**
```powershell
Get-ADDomainController -Filter *
```

**Purpose:** Confirm that Active Directory recognises both servers as valid Domain Controllers for the `nova.corp` domain.

**Expected result:** Both `nova-dc01` and `nova-dc02` returned.

**Result:** Both Domain Controllers successfully discovered. ✅

---

### Validation 2 — Verify Replication Summary

**Command:**
```powershell
repadmin /replsummary
```

**Purpose:** Produce a high-level summary of replication health across the entire domain. This command reports replication failures, latency, communication errors, and unavailable Domain Controllers in a single readable output.

**Expected result:**
```
Fails  : 0
Errors : 0
```

**Result:** Replication completed successfully with zero failures. ✅

---

### Validation 3 — Verify Replication Partners

**Command:**
```powershell
repadmin /showrepl
```

**Purpose:** Display every replication partnership, naming context, direction (inbound/outbound), timestamp, and success state for the current Domain Controller. This is a more granular view than `/replsummary` and is used when investigating specific replication issues.

**Result:** All naming contexts reported successful replication. No replication errors observed. ✅

---

### Validation 4 — Verify DNS Replication

DNS replication is often overlooked, but it is critical. Active Directory stores DNS information inside the directory database itself, which means DNS records replicate automatically between Domain Controllers as part of the standard AD replication process. Without DNS replication:

- Computers cannot locate Domain Controllers
- Kerberos authentication fails
- Group Policy processing fails
- Users cannot log in

**Validation procedure:**

In DNS Manager on `nova-dc02`, the following were confirmed:

- Forward Lookup Zone `nova.corp` present and populated
- SRV records present (`_ldap._tcp.nova.corp`, `_kerberos._tcp.nova.corp`)
- Host (A) records for all registered servers present
- Reverse Lookup Zone present

**Result:** DNS zones replicated successfully. Both Domain Controllers hosted identical DNS data. ✅

---

### Validation 5 — Verify SYSVOL Replication

SYSVOL is a special shared folder that exists on every Domain Controller and must contain identical content across all of them. It stores Group Policies, logon scripts, and domain-wide configuration files. Microsoft replicates SYSVOL using DFS Replication (DFSR) in modern environments.

**Validation procedure:**

Confirmed the following on `nova-dc02`:

- `C:\Windows\SYSVOL\sysvol` folder structure present
- `C:\Windows\SYSVOL\sysvol\nova.corp\Policies` folder populated

```powershell
net share
```

**Expected shares:**
```
NETLOGON
SYSVOL
```

**Result:** Both SYSVOL and NETLOGON shares present and accessible. SYSVOL replication confirmed. ✅

---

### Validation 6 — Authentication Test

A domain user account was used to authenticate against the environment. Authentication completed successfully, confirming that:

- Kerberos was functioning correctly
- The Active Directory database on `nova-dc02` was operational
- Domain trust was healthy ✅

---

### Validation 7 — Group Policy Replication

Group Policies are stored inside both SYSVOL and Active Directory, meaning they replicate automatically as part of both the SYSVOL and AD replication processes. A previously configured Group Policy was inspected from both Domain Controllers and the contents were identical on both servers.

**Result:** Group Policy replication confirmed. ✅

---

### Validation Health Summary

| Component | Status |
|-----------|--------|
| Domain Controller Registration | ✅ Healthy |
| Active Directory Replication | ✅ Healthy |
| DNS Replication | ✅ Healthy |
| SYSVOL Replication | ✅ Healthy |
| NETLOGON Share | ✅ Present |
| Group Policy Replication | ✅ Healthy |
| Authentication | ✅ Successful |

---

## 16. Understanding Active Directory Replication

One of the most important concepts in Active Directory administration is understanding how data is kept consistent across multiple Domain Controllers.

A common misconception is that one Domain Controller is the "main" server and all others are backups. In Active Directory, this is not the case. After promotion, both Domain Controllers become equal peers in a **Multi-Master Replication** model.

Each Domain Controller maintains its own complete, writable copy of:

- The Active Directory database (`NTDS.DIT`)
- Active Directory-integrated DNS zones
- SYSVOL and Group Policies
- User, computer, and group objects
- Security group memberships

Whenever an administrator makes a change on any Domain Controller — creating a user, resetting a password, modifying a group — Active Directory automatically replicates that change to every other Domain Controller in the domain.

```
Administrator creates user on nova-dc01
            │
            ▼
    Active Directory Replication
            │
            ▼
    nova-dc02 receives the change
            │
Both Domain Controllers now contain
    identical directory data
```

The same process works in reverse. Changes made on `nova-dc02` replicate to `nova-dc01`. Neither server acts as a permanent master for ordinary directory updates.

This design means that if one Domain Controller becomes unavailable, the remaining Domain Controller already contains a complete, current copy of the directory and can continue servicing all authentication requests without any manual intervention.

---

## 17. FSMO Roles — Theory and Transfer

Although Active Directory uses Multi-Master Replication for most operations, a small number of operations cannot safely occur on multiple Domain Controllers simultaneously. Allowing multiple servers to perform these operations at the same time would create conflicts and risk corrupting the directory database.

Microsoft solves this by assigning five **Flexible Single Master Operations (FSMO)** roles. Each role is held by exactly one Domain Controller at a time, ensuring that these specific operations have a single authoritative source.

### The Five FSMO Roles

**Forest-wide roles** (exist once per forest):

| Role | Responsibility |
|------|---------------|
| Schema Master | Controls all modifications to the Active Directory schema. Any product that extends the schema (such as Microsoft Exchange) must communicate with the Schema Master. Only one exists per forest. |
| Domain Naming Master | Manages the addition and removal of domains within the forest. Prevents duplicate domain names. Only one exists per forest. |

**Domain-wide roles** (exist once per domain):

| Role | Responsibility |
|------|---------------|
| RID Master | Allocates pools of Relative Identifiers (RIDs) to Domain Controllers. Every security object (user, group, computer) receives a unique Security Identifier (SID), which includes a domain-wide SID plus a unique RID. The RID Master ensures no two objects receive the same RID. |
| PDC Emulator | The busiest FSMO role in most environments. Responsible for password change priority, account lockout processing, time synchronisation for the domain, and backward compatibility with legacy clients. |
| Infrastructure Master | Maintains cross-domain object references. In a single-domain environment like Nova Corp, this role has minimal work to perform but becomes critical in multi-domain forests. |

### Verifying FSMO Ownership Before Transfer

**Command:**
```powershell
netdom query FSMO
```

**Result before transfer:**
```
Schema master          nova-dc01.nova.corp
Domain naming master   nova-dc01.nova.corp
PDC                    nova-dc01.nova.corp
RID pool manager       nova-dc01.nova.corp
Infrastructure master  nova-dc01.nova.corp
```

As expected, all five roles were held by `nova-dc01`.

### Transferring the FSMO Roles

The objective was not to permanently relocate the roles, but to demonstrate the transfer process and understand how FSMO ownership changes in a controlled way. This is a fundamental operational skill for any Active Directory administrator.

**Domain-wide roles (RID Master, PDC Emulator, Infrastructure Master)**

Transferred using the **Active Directory Users and Computers** console by right-clicking the domain, selecting Operations Masters, and clicking Transfer on each tab.

**Domain Naming Master**

Transferred using the **Active Directory Domains and Trusts** console.

**Schema Master**

The Schema snap-in is hidden by default and must be registered before it becomes accessible:

```powershell
regsvr32 schmmgmt.dll
```

After registration, the Schema Master was transferred using the Active Directory Schema snap-in in MMC.

### Verifying FSMO Ownership After Transfer

**Command:**
```powershell
netdom query FSMO
```

**Result after transfer:**
```
Schema master          nova-dc02.nova.corp
Domain naming master   nova-dc02.nova.corp
PDC                    nova-dc02.nova.corp
RID pool manager       nova-dc02.nova.corp
Infrastructure master  nova-dc02.nova.corp
```

All five FSMO roles successfully moved to `nova-dc02`. ✅

### Transfer vs. Seize — A Critical Distinction

There are two methods for moving FSMO roles between Domain Controllers, and understanding the difference is essential for disaster recovery:

**Transfer** is the standard method. It is used when the current role holder is online and healthy. The existing owner participates in the transfer, gracefully handing off the role. This is always the preferred approach.

**Seize** is an emergency operation used only when the current role holder has permanently failed and will never return to the network. When seizing a role, the administrator forcibly takes it without the cooperation of the original owner. If the original Domain Controller later comes back online without being rebuilt and removed from Active Directory first, a dangerous conflict arises where two servers believe they own the same role. For this reason, any Domain Controller that has had its FSMO roles seized from it must be permanently decommissioned and never reconnected to the domain.

---

## 18. High Availability and Failure Testing

### What Is High Availability?

High Availability means a service continues operating even when one component fails. Having a second Domain Controller installed is only the first step. The true test of redundancy is whether services continue functioning during an actual failure, without manual intervention.

Before CR-004, Nova Corp had a single Domain Controller. If `nova-dc01` failed, every identity service failed with it. CR-004's ultimate objective was to verify that deploying `nova-dc02` genuinely eliminated this dependency.

### Test Environment

| Component | Detail |
|-----------|--------|
| nova-dc01 | 10.10.20.10 — to be shut down |
| nova-dc02 | 10.10.20.11 — must continue serving all requests |
| nova-client | Windows 11 workstation on VLAN 40, joined to nova.corp |
| Test user | NOVA\moyo |

---

### FT-006 — Shut Down the Primary Domain Controller

**Objective:** Verify that Active Directory services continue after `nova-dc01` is taken offline.

**Procedure:** `nova-dc01` was shut down via Proxmox. Only `nova-dc02` remained online.

**Expected result:** The domain continues functioning normally.

**Result:** `nova-client` remained connected to the domain. Authentication services continued operating without interruption. ✅

---

### FT-007 — Domain User Authentication After Failure

**Objective:** Confirm that existing domain users can authenticate when only `nova-dc02` is available.

**Procedure:**
```
Login: NOVA\moyo
Machine: nova-client
```

**Expected result:** Authentication is processed by `nova-dc02`.

**Result:** User logged in successfully. Authentication automatically failed over to `nova-dc02`. ✅

---

### FT-008 — Active Directory Remains Writable

**Objective:** Confirm that Active Directory accepts write operations while `nova-dc01` is offline.

**Procedure:** New user `Moyo Agunbiade` created in Active Directory from `nova-dc02`.

**Result:** User account created successfully. Account immediately available for authentication. This confirmed that Active Directory was fully operational and writable through the remaining Domain Controller. ✅

---

### FT-009 — Authentication Using Newly Created User

**Objective:** Verify that newly created accounts can authenticate immediately.

**Procedure:**
```
Login: NOVA\moyo
Machine: nova-client
```

**Result:** Login succeeded immediately. New accounts created on `nova-dc02` were instantly usable for authentication on domain-joined workstations. ✅

---

### FT-010 — Group Policy Processing

**Objective:** Verify that Group Policy continues applying from SYSVOL hosted on `nova-dc02`.

**Command:**
```powershell
gpupdate /force
```

**Result:**
```
Computer Policy update completed successfully.
User Policy update completed successfully.
```

```powershell
gpresult /r
```

The client successfully received Group Policy information from `nova-dc02`. ✅

---

### FT-011 — Domain Controller Discovery

**Objective:** Confirm which Domain Controller the client is using when `nova-dc01` is offline.

**Command:**
```powershell
nltest /dsgetdc:nova.corp
```

**Result:**
```
DC: nova-dc02.nova.corp
```

The client's DC Locator process automatically discovered `nova-dc02` as the available Domain Controller and directed all requests to it. No manual configuration was required. ✅

---

### FT-012 — DNS Investigation During Failure

During testing, an interesting behaviour was observed that became a valuable learning exercise.

The client's DNS configuration pointed to `10.10.20.10` (the IP address of `nova-dc01`) as the Preferred DNS Server. Since `nova-dc01` had been shut down, direct DNS queries to that address timed out:

```
nslookup nova.corp

DNS request timed out.
```

However, despite this timeout, authentication continued working, Group Policy was applied, and Domain Controller discovery succeeded.

**Why?**

Active Directory's DC Locator mechanism uses multiple discovery methods beyond simple DNS lookups, including LDAP broadcasts and NetBIOS name resolution. The domain was healthy, `nova-dc02` was responding, and Active Directory's built-in resilience mechanisms allowed the client to find and use the available Domain Controller even while the primary DNS server was unreachable.

**The core lesson:** The timeout only affected direct DNS queries to the offline server. If the client had been configured with both DNS servers:

```
Preferred DNS:   10.10.20.10
Alternate DNS:   10.10.20.11
```

the client would have failed over to the alternate DNS server automatically, and no timeout would have occurred.

This observation reinforced a critical enterprise design principle: clients should always be configured with at least two DNS servers. In an Active Directory environment, the DNS server addresses should map to the available Domain Controllers, so that DNS itself is also covered by the redundancy the second Domain Controller provides.

---

### High Availability Test Summary

| Test | Description | Result |
|------|-------------|--------|
| FT-006 | nova-dc01 shut down | ✅ Domain remained online |
| FT-007 | Existing user authentication | ✅ Authenticated via nova-dc02 |
| FT-008 | Create new AD user while dc01 offline | ✅ User created successfully |
| FT-009 | New user authentication | ✅ Login successful immediately |
| FT-010 | Group Policy processing | ✅ GPO applied correctly |
| FT-011 | Domain Controller discovery | ✅ nova-dc02 automatically selected |
| FT-012 | DNS behaviour investigation | ✅ Understood and documented |

---

## 19. Incident Report — NOVA-INC-001

### Domain Communication Failure Following VLAN Migration

---

| Field | Value |
|-------|-------|
| Incident ID | NOVA-INC-001 |
| Related Change Request | CR-004 |
| Severity | High |
| Status | Resolved |
| Duration | Approximately 24 hours |

---

### Executive Summary

During the deployment of `nova-dc02`, an unexpected communication failure occurred after the Active Directory infrastructure was migrated to VLAN 20. The failure was asymmetric: `nova-dc01` could successfully communicate with `nova-dc02`, but `nova-dc02` could not establish SMB or RPC connections in the reverse direction.

This prevented domain join, Active Directory replication, Domain Controller promotion, and authentication-related operations. Basic IP connectivity (ping) worked correctly in both directions throughout the incident, which made diagnosis more complex.

The investigation spanned Windows networking tools, Linux packet captures, Proxmox bridge-level inspection, and Active Directory diagnostics. The environment was ultimately recovered using pre-change snapshots, and the deployment was completed successfully on a clean baseline.

---

### Initial Symptoms

| Test | Direction | Result |
|------|-----------|--------|
| Ping | DC01 → DC02 | ✅ Success |
| Ping | DC02 → DC01 | ✅ Success |
| SMB (TCP 445) | DC01 → DC02 | ✅ Success |
| SMB (TCP 445) | DC02 → DC01 | ❌ Failed |
| RPC (TCP 135) | DC02 → DC01 | ❌ Failed |
| Domain Join | — | ❌ Failed |
| AD Replication | — | ❌ Failed |

The directional nature of the failure immediately suggested this was not a routing or VLAN misconfiguration. Both servers could reach each other at the IP level, but only TCP connections from `nova-dc02` to `nova-dc01` were failing.

---

### Investigation Methodology

Rather than making assumptions or attempting random configuration changes, each layer of the network stack was systematically tested. The investigation followed this sequence:

1. Verify Layer 3 (IP) connectivity
2. Verify Layer 4 (TCP) connectivity on specific ports
3. Verify Windows Firewall configuration
4. Verify DNS resolution
5. Capture packets at the Windows level
6. Capture packets at the Proxmox bridge level
7. Verify pfSense firewall rules
8. Compare behaviour against a fresh server
9. Recover using snapshots

Each step either confirmed or rejected a hypothesis using direct evidence before moving to the next layer.

---

### Test 1 — Layer 3 Connectivity (Ping)

**Purpose:** Confirm basic IP routing was functional.

```powershell
ping 10.10.20.10
ping 10.10.20.11
```

**Result:** Both directions succeeded. Round-trip time under 1ms. ✅

**Conclusion:** Layer 3 was healthy. The issue was not caused by VLAN routing, IP addressing, or gateway configuration.

---

### Test 2 — SMB Connectivity (TCP 445)

**Purpose:** Verify whether SMB communication was functioning. Active Directory replication and SYSVOL access both depend on SMB.

```powershell
Test-NetConnection 10.10.20.10 -Port 445
```

**Expected:** `TcpTestSucceeded : True`

**Actual:** `TcpTestSucceeded : False`

The same command run from `nova-dc01` to `nova-dc02` succeeded. The failure was directional — only DC02 → DC01 on port 445 failed.

**Conclusion:** SMB communication was working in one direction only. A complete network failure was ruled out.

---

### Test 3 — RPC Connectivity (TCP 135)

**Purpose:** Verify RPC connectivity. Active Directory replication depends on RPC over TCP 135.

```powershell
Test-NetConnection 10.10.20.10 -Port 135
```

**Result:** `TcpTestSucceeded : False`

Both SMB (445) and RPC (135) were failing in the same direction. Since these are the two primary protocols used during Domain Controller promotion and replication, this explained why the promotion process could not proceed.

---

### Test 4 — Windows Firewall Investigation

**Purpose:** Determine whether Windows Defender Firewall was blocking inbound SMB or RPC traffic on `nova-dc01`.

**Actions performed on nova-dc01:**
- Reviewed Active Directory Domain Services firewall rule group — all rules `Enabled: True` ✅
- Reviewed File and Printer Sharing rule group — SMB-In rule `Enabled: True` ✅
- Reviewed RPC firewall rule group — all rules `Enabled: True` ✅
- Verified network profile — `NetworkCategory: DomainAuthenticated` ✅
- Checked for any Block rules — none found ✅
- Temporarily disabled Windows Firewall entirely — problem persisted ✅

**Conclusion:** Windows Firewall was ruled out as the cause. All relevant rules were enabled, the correct network profile was active, and disabling the firewall entirely did not change the behaviour.

---

### Test 5 — DNS Verification

**Purpose:** Rule out DNS misconfiguration as a contributing factor.

**Commands:**
```powershell
nslookup nova.corp
nslookup nova-dc01.nova.corp
Resolve-DnsName nova.corp
```

**Result:** DNS resolution was successful. Both servers resolved correctly. SRV records for `_ldap._tcp.nova.corp` and `_kerberos._tcp.nova.corp` were present.

**Conclusion:** DNS was functioning correctly and was not related to the directional SMB failure.

---

### Test 6 — Packet Capture (Wireshark on nova-dc02)

**Purpose:** Observe the TCP connection behaviour directly to understand where the handshake was breaking down.

A normal TCP connection follows a three-step handshake:

```
Client (DC02)          Server (DC01)

    SYN ─────────────────────>
        <─────────────────── SYN-ACK
    ACK ─────────────────────>
    [Connection Established]
```

**Observed behaviour:**

In multiple captures, the following pattern repeated:

```
DC02 → DC01    SYN
DC01 → DC02    SYN-ACK    (DC01 responded correctly)
DC02 → DC01    SYN        (DC02 retransmitted — it never received the SYN-ACK)
DC01 → DC02    SYN-ACK    (DC01 sent another SYN-ACK)
...retransmissions continue...
DC01 → DC02    RST        (DC01 timed out its half-open connection)
```

**Key finding:** DC01 was sending the SYN-ACK correctly. The SYN-ACK was being lost between DC01 and DC02 on the return path. DC02 never received it, so it kept retransmitting its original SYN. Neither side could complete the handshake.

**Conclusion:** This confirmed the TCP session was never being established. A successful ping does **not** guarantee that an application or service is reachable. ICMP and TCP are handled differently, and a working ping can exist alongside completely broken TCP connectivity.

---

### Test 7 — Windows Packet Monitor (pktmon)

**Purpose:** Determine whether the Windows networking stack on `nova-dc01` was dropping packets internally before or after they reached the guest OS.

```
pktmon start --etw -m real-time
```

**Observation from pktmon output:**

The captures showed SYN packets arriving at `nova-dc01` and SYN-ACK packets departing from `nova-dc01`. Additionally, one drop entry appeared intermittently:

```
Drop: DropReason INET: land attack
```

This `land attack` drop is triggered by Windows' built-in TCP stack protection when it detects what it interprets as a spoofed packet with matching source and destination. This was observed inconsistently alongside ECN (Explicit Congestion Notification) flags in some retransmitted packets.

However, later captures showed completely clean SYN packets (no ECN flags) still failing to complete the handshake in the same way, which indicated the LAND-attack heuristic was a contributing artefact from an earlier state, not the definitive root cause.

---

### Test 8 — Packet Capture at the Proxmox Bridge (tcpdump on vmbr1)

**Purpose:** Determine whether the virtual switch between the two VMs was forwarding packets correctly, or whether the drop was occurring at the hypervisor layer.

This was the most important test in the entire investigation, because it provided visibility at a layer below the Windows operating system on both VMs.

```bash
tcpdump -i vmbr1 -nn host 10.10.20.10 or host 10.10.20.11
```

**Observed output (selected lines):**

```
10.10.20.11.53454 > 10.10.20.10.445: Flags [S]      ← SYN from DC02 arrives at bridge
10.10.20.10.445 > 10.10.20.11.53454: Flags [S.]     ← SYN-ACK from DC01 departs bridge
10.10.20.11.53454 > 10.10.20.10.445: Flags [S]      ← DC02 retransmits SYN (never got SYN-ACK)
10.10.20.10.445 > 10.10.20.11.53454: Flags [S.]     ← DC01 retransmits SYN-ACK
...
10.10.20.10.445 > 10.10.20.11.53454: Flags [R]      ← DC01 resets the half-open connection
```

**Critical conclusion:** The Proxmox bridge (`vmbr1`) was forwarding both the SYN and the SYN-ACK. The virtual switch was not dropping anything. The SYN-ACK was leaving DC01, passing through the bridge, and being sent toward DC02's MAC address — yet DC02 never logged receiving it.

ARP resolution was also healthy throughout (both servers resolved each other's MAC addresses correctly), confirming Layer 2 switching was functioning correctly.

**Conclusion:** The failure was not caused by the Proxmox bridge, virtual switch configuration, VLAN tagging, or pfSense firewall rules. The problem existed somewhere between the bridge forwarding the SYN-ACK and `nova-dc02` processing it — inside `nova-dc02` itself.

---

### Test 9 — pfSense Firewall Rule Verification

**Purpose:** Confirm that pfSense was not blocking VLAN 20 internal traffic.

`nova-dc01` and `nova-dc02` both resided on VLAN 20 (`10.10.20.0/24`). Traffic between two hosts on the same VLAN does not traverse the pfSense firewall — it is switched directly at the Proxmox bridge level. pfSense only intercepts traffic that is being routed between different VLANs.

This was confirmed by inspecting the VLAN 20 firewall rules in pfSense, and by the tcpdump evidence showing traffic flowing directly between VMs at the bridge without routing.

**Conclusion:** pfSense was not involved in this traffic path. Inter-VLAN firewall rules do not apply to same-VLAN communication. ✅

---

### Test 10 — Comparative Test Using a Fresh Windows Server

**Purpose:** Determine whether the problem was specific to `nova-dc01` or was a broader environmental issue.

A completely new Windows Server virtual machine was deployed and promoted as a Domain Controller in a temporary separate domain. `nova-dc02` was used to attempt SMB and RPC communication with this temporary server.

**Result:** Communication with the temporary Domain Controller succeeded immediately. SMB (445) and RPC (135) both connected without issue.

**Conclusion:** `nova-dc02`'s Windows networking stack was capable of establishing SMB and RPC connections successfully. The problem was specific to communication with `nova-dc01` in particular, not a general networking failure on `nova-dc02`.

---

### Resolution

After more than 24 hours of structured investigation, no single definitive configuration error could be identified. The Proxmox bridge was forwarding correctly, pfSense was not involved, Windows Firewall was correctly configured, DNS was healthy, and `nova-dc02` could communicate with other servers successfully. Yet SYN-ACKs sent by `nova-dc01` were not being processed by `nova-dc02`'s TCP stack.

At this point, the decision was made to use the snapshots created before CR-004 began.

**Recovery procedure:**

1. Restored `nova-dc01` to its pre-CR-004 snapshot
2. Restored `nova-dc02` to its pre-CR-004 snapshot
3. Removed the temporary test environment
4. Repeated the entire CR-004 deployment process from Checkpoint 1

After restoration and re-deployment:

- TCP 445 connection succeeded immediately ✅
- TCP 135 connection succeeded immediately ✅
- Domain join completed successfully ✅
- Domain Controller promotion completed successfully ✅
- Active Directory replication became healthy ✅
- All validation tests passed ✅

No further communication issues were observed.

---

### Root Cause Analysis

Despite exhaustive investigation, the exact root cause could not be conclusively proven. Based on the available evidence, the most likely explanation is that an inconsistent or corrupted networking state accumulated during the migration of the Active Directory environment to VLAN 20 — possibly in the Windows Filtering Platform (WFP) state on `nova-dc02`, or in the Windows TCP/IP stack's connection tracking for specific socket states.

Because both servers were restored to a clean baseline before the issue could be further isolated, it could not be reproduced or confirmed with certainty.

The incident is therefore classified as:

**Root Cause: Undetermined**

**Most Likely Cause: Corrupted or inconsistent Windows networking state (WFP or TCP/IP stack) on nova-dc02 following infrastructure migration, causing inbound SYN-ACK packets to be silently discarded at the OS level despite correct delivery at the network layer.**

---

### Lessons Learned

This incident became one of the most valuable learning experiences in the Nova Corp project. Several principles were directly reinforced through real-world experience rather than theory:

**A successful ping does not mean an application is reachable.** ICMP and TCP are handled by entirely different mechanisms. A host can respond to ping while simultaneously failing to complete any TCP handshake on any port.

**Troubleshoot one layer at a time.** Moving from Layer 3 to Layer 4 to Windows Firewall to the hypervisor bridge to pfSense systematically eliminated each hypothesis with evidence before moving to the next. Random configuration changes would have wasted hours and potentially obscured the actual failure pattern.

**Packet captures at the hypervisor bridge are often more revealing than captures inside the guest OS.** The `tcpdump` on `vmbr1` proved the bridge was forwarding correctly and localised the failure to the OS level on `nova-dc02` — a conclusion that no Windows-level tool had been able to confirm.

**Snapshots are not just a safety net — they are a diagnostic tool.** The fact that a clean re-deployment on restored snapshots immediately succeeded retroactively confirmed that the environment and infrastructure were correct, and the failure was state-related on the affected VMs.

**Document every step.** The structured troubleshooting log produced during this incident became the foundation for the formal incident report and directly demonstrates engineering methodology for portfolio purposes.

---

### Preventive Measures

The following practices were adopted to reduce the likelihood of similar issues in future Change Requests:

- Create Proxmox snapshots before every major infrastructure change, not just before CR start
- Validate Layer 2, Layer 3, and Layer 4 connectivity explicitly before beginning Domain Controller promotion
- Record a baseline `tcpdump` capture on the Proxmox bridge before making significant changes
- Verify SMB (445) and RPC (135) bidirectional connectivity before beginning Active Directory replication
- Document every troubleshooting step in real time rather than reconstructing from memory
- Consider resetting the Windows TCP/IP stack (`netsh int ip reset` / `netsh winsock reset`) as an early diagnostic step when facing unexplained directional TCP failures

---

### Incident Closure

The incident was resolved by restoring both Domain Controllers from pre-change snapshots and successfully completing the CR-004 deployment on a clean baseline. All validation checkpoints passed, FSMO roles were transferred, High Availability testing completed, and CR-004 was closed as successful.

Although the definitive root cause could not be identified, the investigation produced substantial documentation, demonstrated structured troubleshooting methodology, and significantly deepened understanding of Windows networking, Active Directory communication, TCP handshake behaviour, packet analysis, and the relationship between hypervisor-level networking and guest OS behaviour.

---

## 20. Technical Glossary

The following concepts were introduced or significantly deepened during CR-004.

---

**ACK (Acknowledgement)**
A TCP flag used to acknowledge receipt of data. It is the final packet in the TCP Three-Way Handshake. Without a successful ACK, a TCP connection is never established.

**Active Directory Domain Services (AD DS)**
The Windows Server role that provides directory services — storing users, computers, groups, OUs, and security policies. Installing AD DS does not immediately create a Domain Controller; promotion is a separate step.

**Active Directory Replication**
The automatic synchronisation of directory data between Domain Controllers. Changes made on any Domain Controller replicate to all others. This is the mechanism that makes Multi-Master Replication possible.

**ARP (Address Resolution Protocol)**
Translates IP addresses into MAC addresses so that frames can be sent across the local network. ARP operates at Layer 2. A successful ARP exchange is a prerequisite for any IP communication.

**DC Locator**
The mechanism by which domain-joined computers discover available Domain Controllers. It uses DNS SRV records primarily, with fallback to LDAP broadcasts and NetBIOS.

**Directory Services Restore Mode (DSRM)**
A special boot mode on Domain Controllers used when Active Directory cannot start normally. Requires a separate DSRM password set during promotion.

**DFS Replication (DFSR)**
The replication engine used to keep SYSVOL identical across all Domain Controllers in modern Active Directory environments.

**DNS (Domain Name System)**
Translates hostnames into IP addresses. Active Directory is tightly integrated with DNS — SRV records published in DNS are how computers locate Domain Controllers, Kerberos services, LDAP endpoints, and Global Catalog servers.

**Domain Controller (DC)**
A Windows Server running AD DS, responsible for authenticating users, storing directory information, and managing Group Policy.

**FSMO (Flexible Single Master Operations)**
Five specialised Active Directory roles that are held by exactly one Domain Controller at a time to prevent conflicts for operations that cannot be multi-mastered: Schema Master, Domain Naming Master, RID Master, PDC Emulator, Infrastructure Master.

**Global Catalog (GC)**
A Domain Controller that holds a partial replica of every object in the Active Directory forest. Allows fast directory searches without querying every DC.

**High Availability (HA)**
An architecture that ensures a service continues operating even when individual components fail, without requiring manual intervention.

**ICMP (Internet Control Message Protocol)**
Used for network diagnostics. Ping uses ICMP. ICMP does not establish connections and behaves very differently from TCP — a successful ping does not confirm that TCP services on the same host are reachable.

**Kerberos**
The default authentication protocol in Active Directory. Kerberos uses encrypted tickets to authenticate users without repeatedly sending passwords across the network.

**Multi-Master Replication**
The Active Directory replication model where every Domain Controller holds a complete, writable copy of the directory. Changes on any DC replicate automatically to all others.

**NETLOGON**
A shared folder on every Domain Controller that stores logon scripts and supports domain authentication. Its presence is verified using `net share`.

**NTDS.DIT**
The Active Directory database file stored at `C:\Windows\NTDS\ntds.dit`. Contains all directory objects, attributes, and password hashes. Each Domain Controller maintains its own copy, kept consistent through replication.

**PDC Emulator**
The FSMO role responsible for password change processing, account lockout handling, domain time synchronisation, and legacy client compatibility. Typically the busiest FSMO role in a domain.

**Proxmox Bridge (vmbr)**
A Linux software bridge inside Proxmox that acts as a virtual network switch. VMs connected to the same bridge can communicate directly at Layer 2 without leaving the hypervisor host.

**Read-Only Domain Controller (RODC)**
A Domain Controller that holds a read-only copy of the directory. Designed for branch offices where physical security cannot be guaranteed. Not appropriate for environments requiring writable DCs.

**RID Master**
The FSMO role that allocates pools of Relative Identifiers to Domain Controllers, ensuring that every security object (user, group, computer) receives a globally unique Security Identifier (SID).

**RPC (Remote Procedure Call)**
The protocol that allows one computer to execute a service on another. Active Directory replication depends on RPC. Uses TCP port 135 as the endpoint mapper, followed by dynamically assigned high ports for actual data transfer.

**SMB (Server Message Block)**
Microsoft's file-sharing and network communication protocol. Used by Active Directory for SYSVOL access, NETLOGON, and replication traffic. Operates on TCP port 445.

**Schema Master**
The forest-wide FSMO role that controls all modifications to the Active Directory schema. Any application that extends the schema must contact the Schema Master.

**Single Point of Failure (SPOF)**
A component whose failure causes the entire system to fail. Eliminating SPOFs through redundancy is a fundamental principle of enterprise infrastructure design.

**Snapshot**
A point-in-time capture of a virtual machine's complete state. Allows rapid recovery to a known-good state without rebuilding from scratch.

**SYN (Synchronise)**
The first packet in the TCP Three-Way Handshake. Sent by the client to indicate it wants to establish a connection.

**SYN-ACK**
The server's response to a SYN packet, confirming it is ready to accept the connection. The client must respond with an ACK to complete the handshake.

**SYSVOL**
A shared folder replicated between all Domain Controllers. Stores Group Policy objects, logon scripts, and domain-wide configuration files. Replicated using DFS Replication (DFSR).

**TCP (Transmission Control Protocol)**
A connection-oriented transport protocol that guarantees reliable, ordered delivery. Before data can be exchanged, TCP requires a successful Three-Way Handshake (SYN → SYN-ACK → ACK).

**TCP Retransmission**
When a sender does not receive the expected response within a timeout period, it retransmits the packet. Multiple retransmissions indicate that a TCP session is failing to be established.

**tcpdump**
A Linux command-line packet capture tool. Used in CR-004 to capture traffic directly on the Proxmox virtual bridge (`vmbr1`), providing a view of network traffic below the level of the Windows guest OS.

**Three-Way Handshake**
The TCP connection establishment process: SYN (client) → SYN-ACK (server) → ACK (client). All three steps must complete successfully before any application data can be exchanged.

**Windows Filtering Platform (WFP)**
The low-level Windows framework that underpins Windows Firewall and other security software. Can develop an inconsistent state after multiple configuration changes, causing TCP sessions to fail in ways not visible to standard firewall rule inspection.

**Wireshark**
A graphical packet capture and analysis tool. Used throughout the CR-004 incident investigation to observe TCP handshake behaviour at the packet level.

---

## CR-004 Completion Summary

| Checkpoint | Description | Result |
|------------|-------------|--------|
| CP-1 | Deploy nova-dc02 virtual machine | ✅ Complete |
| CP-2 | Configure static networking | ✅ Complete |
| CP-3 | Join nova.corp domain as member server | ✅ Complete |
| CP-4 | Install AD DS role | ✅ Complete |
| CP-5 | Promote to Additional Domain Controller | ✅ Complete |
| CP-6 | Validate Active Directory replication | ✅ Complete |
| CP-7 | Validate DNS, SYSVOL, Group Policy replication | ✅ Complete |
| CP-8 | Verify and transfer FSMO roles | ✅ Complete |
| CP-9 | High Availability failure testing | ✅ Complete |
| CP-10 | Incident investigation and resolution (INC-001) | ✅ Resolved |

---

CR-004 successfully transformed the Nova Corp Active Directory environment from a single-server deployment into a redundant, multi-master identity infrastructure. Both Domain Controllers operate as replication peers, either is capable of providing full authentication and DNS services independently, and the environment has been tested under controlled failure conditions to prove that redundancy is real rather than theoretical.

The incident encountered during this Change Request — though its root cause could not be definitively confirmed — produced the most thorough networking investigation to date in the Nova Corp project and significantly advanced understanding of TCP behaviour, packet analysis, hypervisor networking, and the importance of structured troubleshooting methodology.

*End of CR-004.*
