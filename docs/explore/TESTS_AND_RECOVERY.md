# Incident Lab — What broke, what we tested, how it recovered

A running VM and a green configuration screenshot don't prove a system is usable. Nova Corp deliberately tested failure paths, investigated symptoms and re-tested the repaired services.

## Choose an investigation

| Incident / test | What was wrong | How the result was proven |
| --- | --- | --- |
| **Nested virtualization** | Hypervisor prerequisites / nested virtualization behavior | Proxmox installation and recovery validation |
| **Network migration** | Connectivity after moving domain infrastructure to another subnet | Routing and DNS validation after repair |
| **WireGuard handshake** | WAN packets arrived, but peer authentication did not complete | Corrected peer, bidirectional traffic and approved services |
| **Bulk user creation** | Password failure left incomplete accounts | Rollback fixed and failure re-tested |
| **Access-analysis script** | Domain-qualified ACL name didn't match the bare group name | Corrected comparison plus real-user allowed/denied tests |
| **Domain Controller outage** | DC01 deliberately unavailable | Client continued through DC02; replication recovered |
| **Replication divergence** | Intentionally inconsistent AD replicas | Detected and repaired; convergence verified |
| **File permissions** | A user couldn't open an expected folder | Share, NTFS, membership and user-token layers inspected |
| **DNS problem** | File share looked down by name, but server/IP worked | Client DNS fixed, DC discovery and share re-tested |
| **GPO processing** | Policy refresh and SYSVOL/GPT.INI errors | Processing/recovery checked after repair |
| **Backup target outage** | Backup disk unavailable; backup failed | Target restored, fresh backup completed, file restored with identical SHA-256 |
| **Cross-service fault** | DNS and authorization failures overlapped | Two root causes resolved separately |
| **pfSense management access** | Normal client reached management paths too broadly | Blocked access verified; DNS/AD/SMB/Internet still worked |
| **Proxmox snapshot pressure** | Thin pool reached 86.73% | Old snapshots removed; 52.88% after cleanup |

## Follow a complete recovery

```mermaid
flowchart LR
    S["User symptom"] --> T["Layered tests"]
    T --> C["Find root cause"]
    C --> F["Smallest safe repair"]
    F --> P["Positive retest"]
    P --> N["Negative/security retest"]
    N --> E["Evidence and notes"]
```

## Explore by system

[Identity and Domain Controllers](IDENTITY.md) · [Network and pfSense](NETWORK.md) · [File server](FILE_SERVICES.md) · [Backups](services/BACKUPS.md) · [PowerShell automation](AUTOMATION.md) · [Group Policy](POLICIES.md).

## Read the full investigations

[Failure-testing report](../Documentation/failure-testing-report.md) · [Remote VPN repair](../Documentation/Change-Requests/Journal-CR-007.md) · [Automation failures](../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) · [AD resilience](../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) · [Incident exercises](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) · [Final closure](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).

[← Company map](../EXPLORE_NOVACORP.md)