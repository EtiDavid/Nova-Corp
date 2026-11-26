---
title: "Skills → Evidence"
sourcePath: "docs/SKILLS_EVIDENCE.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/SKILLS_EVIDENCE.md"
section: "SKILLS_EVIDENCE.md"
---

# Skills → Evidence

The table connects each capability to an actual Nova Corp component and the journal that records how it was tested.

[Explore the company](/reference/EXPLORE_NOVACORP/) · [Complete component index](/reference/explore/ALL_COMPONENTS/)

## Identity and Windows Server

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| Active Directory Domain Services | Built and operated `nova.corp`; users, groups, OUs, two writable DCs | [CR-003](/reference/Documentation/Change-Requests/Journal-CR-003/), [CR-005](/reference/Documentation/Change-Requests/Journal-CR-005/), [CR-013](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |
| AD replication | Validated all naming contexts; investigated outage/divergence; observed natural convergence | [CR-013](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |
| DNS | AD-integrated DNS, SRV records, DC discovery; diagnosed client DNS failure | [CR-003](/reference/Documentation/Change-Requests/Journal-CR-003/), [CR-014](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) |
| Kerberos / time | Domain time hierarchy and authentication dependencies validated | [CR-013](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |
| Group Policy | Modular GPO design, targeting, workstation controls, troubleshooting | [CR-006](/reference/Documentation/Change-Requests/Journal-CR-006/), [CR-014](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) |
| AD Recycle Bin | Deleted/restored AD objects and verified identity continuity | [CR-013](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |

## Networking and security

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| pfSense | Routing, firewall rules, management access hardening, backup/rollback | [CR-002](/reference/Documentation/Change-Requests/Journal-CR-002/), [CR-015](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |
| VLAN / subnet design | Separated management, infrastructure, client, app, DMZ and VPN zones | [Architecture](/reference/ARCHITECTURE/), [CR-002](/reference/Documentation/Change-Requests/Journal-CR-002/) |
| Firewall troubleshooting | Rule ordering/scope, positive/negative tests, management exposure remediation | [CR-007](/reference/Documentation/Change-Requests/Journal-CR-007/), [CR-015](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |
| WireGuard | Built remote-access path and separated tunnel handshake from authorization | [CR-007](/reference/Documentation/Change-Requests/Journal-CR-007/) |

## File services and access control

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| SMB / NTFS | Department shares, share permissions, NTFS permissions | [CR-009 PDF](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) |
| Group-based authorization | Department access through AD groups / AGDLP-style model | [CR-005](/reference/Documentation/Change-Requests/Journal-CR-005/), [CR-009 PDF](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) |
| DFS Namespace | Domain-based namespace and server-path abstraction | [CR-010 PDF](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/) |
| Shadow Copies | Previous-version recovery layer | [CR-010 PDF](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/) |

## PowerShell and administration

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| PowerShell automation | Built 8 administration scripts | [CR-011](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/) |
| Safe mutation / rollback | Fixed partial-state behavior in bulk user creation | [CR-011](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/) |
| Integrity / release discipline | Parser checks, SHA-256 hashes, versioned release package | [CR-011](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/) |

## Backup, recovery and resilience

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| Windows Server Backup | Configured/revalidated backup and recovery path | [CR-012](/reference/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal/) |
| File recovery | Restored deleted file and verified matching SHA-256 | [CR-014](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) |
| DC resilience | Continued domain operation with DC01 offline; validated recovery | [CR-013](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |
| Proxmox rollback | Snapshots, backup inventory and retention cleanup | [CR-015](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |

## Troubleshooting / operations

| Skill | What I actually did | Best evidence |
| --- | --- | --- |
| Layered troubleshooting | Separated DNS, SMB, identity and authorization faults | [CR-014](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) |
| Incident exercises | Controlled permissions, DNS, GPO, backup, DC and cross-service failures | [CR-014](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) |
| Change validation | Current-state reconciliation, rollback baseline, risk register and closure | [CR-015](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |
| Runbooks | Phase 2 operating and recovery procedures | [Phase 2 Runbook](/reference/runbooks/PHASE-2-OPERATIONS-RUNBOOK/) |

## Current boundary

The next security milestone is privileged-admin VPN and management isolation. Centralized monitoring and later Linux/Microsoft workplace features are not part of the completed foundation.

[See current progress](/reference/PROJECT_STATUS/).
