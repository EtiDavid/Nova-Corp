---
title: "Engineering Journal Archive"
sourcePath: "docs/Documentation/Change-Requests/README.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/README.md"
section: "Documentation"
---

# Engineering Journal Archive

This is the technical record of how Nova Corp was built and tested.

**Looking for a system rather than a document?** [Enter the company explorer](/reference/EXPLORE_NOVACORP/). Every major system, service, group, policy, backup and incident links back to the relevant original record.

A **CR (Change Request)** is a controlled unit of work. Each journal preserves configuration decisions, commands, expected and actual results, failures, recovery and lessons.

| Record | Engineering work | Source |
| --- | --- | --- |
| **001** | Nested Proxmox/virtual platform | [Journal](/reference/Documentation/Change-Requests/Journal-CR-001/) |
| **002** | pfSense and network segmentation | [Journal](/reference/Documentation/Change-Requests/Journal-CR-002/) |
| **003** | AD DS/DNS and infrastructure migration | [Journal](/reference/Documentation/Change-Requests/Journal-CR-003/) |
| **004** | Second Domain Controller, replication and FSMO | [Journal](/reference/Documentation/Change-Requests/Journal-CR-004/) |
| **005** | OUs, users, groups and service accounts | [Journal](/reference/Documentation/Change-Requests/Journal-CR-005/) |
| **006** | Group Policy / workstation security | [Journal](/reference/Documentation/Change-Requests/Journal-CR-006/) · [PDF](/journals/CR-006_Group_Policy_Management_Beautified/) |
| **007** | WireGuard remote access and packet tracing | [Journal](/reference/Documentation/Change-Requests/Journal-CR-007/) · [PDF](/journals/CR-007_Remote_Access_VPN_WireGuard/) |
| **008** | File Server deployment | [PDF](/journals/NovaCorp_CR-008_File_Server_Deployment_Journal/) |
| **009** | Departmental shares and drive mapping | [PDF](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) |
| **010** | DFS and Shadow Copies | [PDF](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/) |
| **011** | PowerShell administration toolkit | [Journal](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/) · [PDF](/journals/CR-011_PowerShell_Administration_Toolkit/) |
| **012** | Windows Server Backup and recovery | [Journal](/reference/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal/) · [PDF](/journals/CR-012_Windows_Server_Backup_and_Recovery_Journal/) |
| **013** | Domain Controller resilience | [Journal](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) · [PDF](/journals/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |
| **014** | Incident exercises | [Summary](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) · [Full PDF](/journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence/) |
| **015** | Phase 2 validation and closure | [Summary](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |

## Start with an engineering question

- **Can the directory survive a DC outage?** [AD resilience](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/)
- **Can a backup restore a real deleted file?** [Backup failure and recovery](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/)
- **What happens if account automation fails halfway?** [PowerShell](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/)
- **How does VPN traffic reach the internal network?** [WireGuard](/reference/Documentation/Change-Requests/Journal-CR-007/)
- **How were group policies validated?** [GPO journal and images](/reference/Documentation/Change-Requests/Journal-CR-006/)
- **What did final acceptance uncover?** [Phase 2 closure](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/)

[← Explore the company](/reference/EXPLORE_NOVACORP/)