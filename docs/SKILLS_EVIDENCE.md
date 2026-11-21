# Skills → Evidence

The table connects each capability to an actual Nova Corp component and the journal that records how it was tested.

[Explore the company](EXPLORE_NOVACORP.md) · [Complete component index](explore/ALL_COMPONENTS.md)

## Identity and Windows Server

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| Active Directory Domain Services | Built and operated `nova.corp`; users, groups, OUs, two writable DCs | [CR-003](Documentation/Change-Requests/Journal-CR-003.md), [CR-005](Documentation/Change-Requests/Journal-CR-005.md), [CR-013](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| AD replication | Validated all naming contexts; investigated outage/divergence; observed natural convergence | [CR-013](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| DNS | AD-integrated DNS, SRV records, DC discovery; diagnosed client DNS failure | [CR-003](Documentation/Change-Requests/Journal-CR-003.md), [CR-014](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| Kerberos / time | Domain time hierarchy and authentication dependencies validated | [CR-013](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| Group Policy | Modular GPO design, targeting, workstation controls, troubleshooting | [CR-006](Documentation/Change-Requests/Journal-CR-006.md), [CR-014](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| AD Recycle Bin | Deleted/restored AD objects and verified identity continuity | [CR-013](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |

## Networking and security

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| pfSense | Routing, firewall rules, management access hardening, backup/rollback | [CR-002](Documentation/Change-Requests/Journal-CR-002.md), [CR-015](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| VLAN / subnet design | Separated management, infrastructure, client, app, DMZ and VPN zones | [Architecture](ARCHITECTURE.md), [CR-002](Documentation/Change-Requests/Journal-CR-002.md) |
| Firewall troubleshooting | Rule ordering/scope, positive/negative tests, management exposure remediation | [CR-007](Documentation/Change-Requests/Journal-CR-007.md), [CR-015](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| WireGuard | Built remote-access path and separated tunnel handshake from authorization | [CR-007](Documentation/Change-Requests/Journal-CR-007.md) |

## File services and access control

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| SMB / NTFS | Department shares, share permissions, NTFS permissions | [CR-009 PDF](Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) |
| Group-based authorization | Department access through AD groups / AGDLP-style model | [CR-005](Documentation/Change-Requests/Journal-CR-005.md), [CR-009 PDF](Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) |
| DFS Namespace | Domain-based namespace and server-path abstraction | [CR-010 PDF](Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) |
| Shadow Copies | Previous-version recovery layer | [CR-010 PDF](Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) |

## PowerShell and administration

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| PowerShell automation | Built 8 administration scripts | [CR-011](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |
| Safe mutation / rollback | Fixed partial-state behavior in bulk user creation | [CR-011](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |
| Integrity / release discipline | Parser checks, SHA-256 hashes, versioned release package | [CR-011](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |

## Backup, recovery and resilience

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| Windows Server Backup | Configured/revalidated backup and recovery path | [CR-012](Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) |
| File recovery | Restored deleted file and verified matching SHA-256 | [CR-014](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| DC resilience | Continued domain operation with DC01 offline; validated recovery | [CR-013](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| Proxmox rollback | Snapshots, backup inventory and retention cleanup | [CR-015](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |

## Troubleshooting / operations

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| Layered troubleshooting | Separated DNS, SMB, identity and authorization faults | [CR-014](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| Incident exercises | Controlled permissions, DNS, GPO, backup, DC and cross-service failures | [CR-014](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| Change validation | Current-state reconciliation, rollback baseline, risk register and closure | [CR-015](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| Runbooks | Phase 2 operating and recovery procedures | [Phase 2 Runbook](runbooks/PHASE-2-OPERATIONS-RUNBOOK.md) |

## Current boundary

The next security milestone is privileged-admin VPN and management isolation. Centralized monitoring and later Linux/Microsoft workplace features are not part of the completed foundation.

[See current progress](PROJECT_STATUS.md).
