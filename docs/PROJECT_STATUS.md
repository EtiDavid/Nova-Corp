# Nova Corp — What has been built?

**Foundation milestone:** Completed and conditionally accepted on **21 November 2026**.

This is a view of the lab's progress, not a list of technologies claimed from tutorials.

## Now part of Nova Corp

| Area | Built and tested | Explore |
| --- | --- | --- |
| Virtualization | Nested VMware/Proxmox platform, virtual networking, backup storage and rollback | [Hypervisor](explore/systems/NOVA-PROX01.md) |
| Network | pfSense firewall, separated networks, routing/DHCP, WireGuard and tested filtering | [Network](explore/NETWORK.md) |
| Identity | `nova.corp` Active Directory, two writable DCs, DNS, replication, Kerberos/LDAP and identity recovery | [Identity Office](explore/services/ACTIVE_DIRECTORY.md) |
| People | Department OUs, staff/test/service accounts, global and resource access groups | [People & Departments](explore/PEOPLE_AND_DEPARTMENTS.md) |
| Windows policy | Group Policy for account/workstation controls, contractor USB and baseline security | [Policies](explore/POLICIES.md) |
| Shared files | FILES01, departmental folders, SMB/NTFS, DFS and Shadow Copies | [File services](explore/FILE_SERVICES.md) |
| Automation | Eight tested PowerShell administration tools | [Automation](explore/AUTOMATION.md) |
| Recovery | VM backup repository, Windows Server Backup, System State and verified file restore | [Recovery](explore/services/BACKUPS.md) |
| Operations | Runbooks, controlled incidents, failover, permissions and post-repair tests | [Incident Lab](explore/TESTS_AND_RECOVERY.md) |

**[Every component and its related records →](explore/ALL_COMPONENTS.md)**

## What the final review changed

The closing validation found that an ordinary workstation could reach firewall management more broadly than intended. That path was restricted and retested.

The same review found Proxmox snapshot-retention pressure. Removing 20 superseded snapshots reduced local-lvm usage from **86.73%** to **52.88%**, while retaining the active rollback point.

## What is coming next

The next security step is separation of ordinary user remote access from privileged administrative VPN/management access. It is not yet complete.

Centralized monitoring, broader automation and additional services belong to later growth stages. The lab is nested inside one outer physical host environment.

## Engineering journal archive

<details><summary><strong>Open the fifteen original change records and PDFs</strong></summary>

| Record | Topic | Read |
| --- | --- | --- |
| 001 | Virtual platform | [Journal](Documentation/Change-Requests/Journal-CR-001.md) |
| 002 | Firewall/network | [Journal](Documentation/Change-Requests/Journal-CR-002.md) |
| 003 | AD/DNS | [Journal](Documentation/Change-Requests/Journal-CR-003.md) |
| 004 | Second DC | [Journal](Documentation/Change-Requests/Journal-CR-004.md) |
| 005 | OUs/users/groups | [Journal](Documentation/Change-Requests/Journal-CR-005.md) |
| 006 | GPO/security | [Journal](Documentation/Change-Requests/Journal-CR-006.md) |
| 007 | VPN | [Journal](Documentation/Change-Requests/Journal-CR-007.md) |
| 008 | File server | [PDF](Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) |
| 009 | Shares | [PDF](Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) |
| 010 | DFS/VSS | [PDF](Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) |
| 011 | PowerShell | [Journal](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |
| 012 | Backup/recovery | [Journal](Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) |
| 013 | AD resilience | [Journal](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| 014 | Incidents | [Journal](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| 015 | Final validation | [Journal](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |

</details>

[← Company map](EXPLORE_NOVACORP.md)