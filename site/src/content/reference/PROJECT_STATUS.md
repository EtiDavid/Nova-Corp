---
title: "Nova Corp — What has been built?"
sourcePath: "docs/PROJECT_STATUS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/PROJECT_STATUS.md"
section: "PROJECT_STATUS.md"
---

# Nova Corp — What has been built?

**Foundation milestone:** Completed and conditionally accepted on **21 November 2026**.

This is a view of the lab's progress, not a list of technologies claimed from tutorials.

## Now part of Nova Corp

| Area | Built and tested | Explore |
| --- | --- | --- |
| Virtualization | Nested VMware/Proxmox platform, virtual networking, backup storage and rollback | [Hypervisor](/reference/explore/systems/NOVA-PROX01/) |
| Network | pfSense firewall, separated networks, routing/DHCP, WireGuard and tested filtering | [Network](/reference/explore/NETWORK/) |
| Identity | `nova.corp` Active Directory, two writable DCs, DNS, replication, Kerberos/LDAP and identity recovery | [Identity Office](/reference/explore/services/ACTIVE_DIRECTORY/) |
| People | Department OUs, staff/test/service accounts, global and resource access groups | [People & Departments](/reference/explore/PEOPLE_AND_DEPARTMENTS/) |
| Windows policy | Group Policy for account/workstation controls, contractor USB and baseline security | [Policies](/reference/explore/POLICIES/) |
| Shared files | FILES01, departmental folders, SMB/NTFS, DFS and Shadow Copies | [File services](/reference/explore/FILE_SERVICES/) |
| Automation | Eight tested PowerShell administration tools | [Automation](/reference/explore/AUTOMATION/) |
| Recovery | VM backup repository, Windows Server Backup, System State and verified file restore | [Recovery](/reference/explore/services/BACKUPS/) |
| Operations | Runbooks, controlled incidents, failover, permissions and post-repair tests | [Incident Lab](/reference/explore/TESTS_AND_RECOVERY/) |

**[Every component and its related records →](/reference/explore/ALL_COMPONENTS/)**

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
| 001 | Virtual platform | [Journal](/reference/Documentation/Change-Requests/Journal-CR-001/) |
| 002 | Firewall/network | [Journal](/reference/Documentation/Change-Requests/Journal-CR-002/) |
| 003 | AD/DNS | [Journal](/reference/Documentation/Change-Requests/Journal-CR-003/) |
| 004 | Second DC | [Journal](/reference/Documentation/Change-Requests/Journal-CR-004/) |
| 005 | OUs/users/groups | [Journal](/reference/Documentation/Change-Requests/Journal-CR-005/) |
| 006 | GPO/security | [Journal](/reference/Documentation/Change-Requests/Journal-CR-006/) |
| 007 | VPN | [Journal](/reference/Documentation/Change-Requests/Journal-CR-007/) |
| 008 | File server | [PDF](/journals/NovaCorp_CR-008_File_Server_Deployment_Journal/) |
| 009 | Shares | [PDF](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) |
| 010 | DFS/VSS | [PDF](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/) |
| 011 | PowerShell | [Journal](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/) |
| 012 | Backup/recovery | [Journal](/reference/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal/) |
| 013 | AD resilience | [Journal](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |
| 014 | Incidents | [Journal](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) |
| 015 | Final validation | [Journal](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |

</details>

[← Company map](/reference/EXPLORE_NOVACORP/)