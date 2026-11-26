---
title: "Nova Corp — Phase 2 Operations Runbook"
sourcePath: "docs/runbooks/PHASE-2-OPERATIONS-RUNBOOK.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/runbooks/PHASE-2-OPERATIONS-RUNBOOK.md"
section: "runbooks"
---

# Nova Corp — Phase 2 Operations Runbook

**Validated baseline:** 21 November 2026  
**Purpose:** Operating and troubleshooting guide for the current Windows/network foundation.

## Safe startup order

1. Start the Windows host and VMware Workstation.
2. Start `nova-prox01`.
3. Start pfSense / `nova-fw01`.
4. Confirm pfSense interfaces and IPv4 WAN gateway.
5. Start `NOVA-DC02`.
6. Start `NOVA-DC01`.
7. Allow AD/DNS/Kerberos/DFSR to initialize.
8. Start `NOVA-FILES01`.
9. Start `NOVA-CLIENT`.
10. Run the health checks below before a risky change.

## Active Directory health

```cmd
repadmin /replsummary
repadmin /showrepl NOVA-DC01
repadmin /showrepl NOVA-DC02
dcdiag /test:Replications /test:Advertising /test:SysVolCheck /test:NetLogons
```

Expected current state:
- zero current replication failures;
- both DCs advertising;
- SYSVOL and NETLOGON healthy.

## DNS / DC discovery

```powershell
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"
Resolve-DnsName -Type SRV "_gc._tcp.nova.corp"
```

```cmd
nltest /dsgetdc:nova.corp /force
```

## SYSVOL / NETLOGON

```powershell
Test-Path "\\NOVA-DC01\SYSVOL"
Test-Path "\\NOVA-DC01\NETLOGON"
Test-Path "\\NOVA-DC02\SYSVOL"
Test-Path "\\NOVA-DC02\NETLOGON"
```

## Group Policy

```cmd
gpupdate /force
gpresult /r /scope:user
gpresult /r /scope:computer
```

A GPO appearing in `gpresult` is not enough on its own; validate the actual business effect.

## File services

```powershell
Resolve-DnsName nova-files01.nova.corp
Test-NetConnection nova-files01.nova.corp -Port 445
Test-Path "\\nova.corp\shares"
```

When troubleshooting access, separate the layers:

```text
DNS
 -> network/TCP 445
 -> SMB
 -> DFS
 -> authentication
 -> group membership
 -> share ACL
 -> NTFS ACL
```

## Backup health

On `NOVA-FILES01`:

```cmd
wbadmin get status
wbadmin get versions -backupTarget:B:
```

The strongest Phase 2 recovery proof is not a successful backup status. CR-014 restored a deleted file to an alternate path and verified that the recovered SHA-256 matched the original.

## Proxmox storage

```bash
pvesm status
lvs -o lv_name,lv_size,data_percent,metadata_percent,lv_attr
```

Post-CR-015 reference:
- local-lvm Data% approximately 52.88%;
- 20 superseded snapshots were removed;
- current pre-CR-016 pfSense rollback snapshot was retained.

Use `qm delsnapshot` for normal Proxmox snapshot removal. Do not manually remove Proxmox-managed snapshot LVs with `lvremove`.

## pfSense change safety

Before a firewall/management change:

1. confirm console access;
2. preserve a known-good recovery point;
3. define the exact source/destination/port;
4. define positive and negative tests;
5. make one change;
6. retest the original path and required business traffic.

## Key incident lesson

Diagnose by layer.

A failed UNC path does not prove the file server is down.

A successful WireGuard handshake does not prove the user is authorized to reach an internal service.

A successful backup job does not prove restore.

A running service does not prove the client can actually use it.

## Current limitations

- external privileged-management VPN validation is CR-016 work;
- centralized monitoring is a later phase;
- the lab is nested on one wider physical host environment.

[Explore the systems](/reference/explore/SYSTEMS/) · [Open the Incident Lab](/reference/explore/TESTS_AND_RECOVERY/) · [Browse the engineering journals](/reference/Documentation/Change-Requests/README/).
