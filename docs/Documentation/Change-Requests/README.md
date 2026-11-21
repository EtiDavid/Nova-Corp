# Engineering Journal Archive

This is the technical record of how Nova Corp was built and tested.

**Looking for a system rather than a document?** [Enter the company explorer](../../EXPLORE_NOVACORP.md). Every major system, service, group, policy, backup and incident links back to the relevant original record.

A **CR (Change Request)** is a controlled unit of work. Each journal preserves configuration decisions, commands, expected and actual results, failures, recovery and lessons.

| Record | Engineering work | Source |
| --- | --- | --- |
| **001** | Nested Proxmox/virtual platform | [Journal](Journal-CR-001.md) |
| **002** | pfSense and network segmentation | [Journal](Journal-CR-002.md) |
| **003** | AD DS/DNS and infrastructure migration | [Journal](Journal-CR-003.md) |
| **004** | Second Domain Controller, replication and FSMO | [Journal](Journal-CR-004.md) |
| **005** | OUs, users, groups and service accounts | [Journal](Journal-CR-005.md) |
| **006** | Group Policy / workstation security | [Journal](Journal-CR-006.md) · [PDF](CR-006_Group_Policy_Management_Beautified.pdf) |
| **007** | WireGuard remote access and packet tracing | [Journal](Journal-CR-007.md) · [PDF](CR-007_Remote_Access_VPN_WireGuard.pdf) |
| **008** | File Server deployment | [PDF](NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) |
| **009** | Departmental shares and drive mapping | [PDF](NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) |
| **010** | DFS and Shadow Copies | [PDF](NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) |
| **011** | PowerShell administration toolkit | [Journal](CR-011_PowerShell_Administration_Toolkit.md) · [PDF](CR-011_PowerShell_Administration_Toolkit.pdf) |
| **012** | Windows Server Backup and recovery | [Journal](CR-012_Windows_Server_Backup_and_Recovery_Journal.md) · [PDF](CR-012_Windows_Server_Backup_and_Recovery_Journal.pdf) |
| **013** | Domain Controller resilience | [Journal](CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) · [PDF](CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.pdf) |
| **014** | Incident exercises | [Summary](CR-014_Phase_2_Incident_Exercises.md) · [Full PDF](Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf) |
| **015** | Phase 2 validation and closure | [Summary](CR-015_Phase_2_Validation_and_Closure.md) |

## Start with an engineering question

- **Can the directory survive a DC outage?** [AD resilience](CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)
- **Can a backup restore a real deleted file?** [Backup failure and recovery](CR-014_Phase_2_Incident_Exercises.md)
- **What happens if account automation fails halfway?** [PowerShell](CR-011_PowerShell_Administration_Toolkit.md)
- **How does VPN traffic reach the internal network?** [WireGuard](Journal-CR-007.md)
- **How were group policies validated?** [GPO journal and images](Journal-CR-006.md)
- **What did final acceptance uncover?** [Phase 2 closure](CR-015_Phase_2_Validation_and_Closure.md)

[← Explore the company](../../EXPLORE_NOVACORP.md)