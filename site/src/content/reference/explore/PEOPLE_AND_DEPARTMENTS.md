---
title: "People & Departments"
sourcePath: "docs/explore/PEOPLE_AND_DEPARTMENTS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/PEOPLE_AND_DEPARTMENTS.md"
section: "explore"
---

# People & Departments

Nova Corp's fictional organization uses Active Directory to group employees and manage access by department.

The directory includes **Finance, Human Resources, IT, Management and Sales**, plus contractor and service-account areas.

## Open a department

[Finance](/reference/explore/people/DEPARTMENTS/#finance) · [Human Resources](/reference/explore/people/DEPARTMENTS/#human-resources) · [IT](/reference/explore/people/IT_DEPARTMENT/) · [Management](/reference/explore/people/DEPARTMENTS/#management) · [Sales](/reference/explore/people/DEPARTMENTS/#sales) · [Contractors](/reference/explore/people/DEPARTMENTS/#contractors)

**[Explore all 20 directory accounts, 16 OUs, groups and computers](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/)**

## Meet lab identities

| Person or account | Department / scenario | Explore |
| --- | --- | --- |
| **David Eti** | IT account in directory-organizing exercise | [David's profile](/reference/explore/people/DAVID/) |
| **Moyo Agunbiade** | IT account used for real file-access validation | [Moyo's profile](/reference/explore/people/MOYO/) |
| **Isaac Technology** | IT account created in the administration exercises | [Isaac's profile](/reference/explore/people/accounts/cr011-it/) |
| **John Shaw** | Contractor test account for removable-storage policy | [Contractor profile](/reference/explore/people/JOHN_SHAW/) |
| **Zoë** | Remote laptop used for WireGuard connectivity testing | [Remote-access test device](/reference/explore/people/ZOE/) |
| **svc_backup** | Service identity created during directory setup | [Service accounts](/reference/explore/DIRECTORY/) |
| **svc_monitoring** | Service identity created during directory setup | [Service accounts](/reference/explore/DIRECTORY/) |
| **svc_fileserver** | Service identity created during directory setup | [Service accounts](/reference/explore/DIRECTORY/) |

Accounts created for scripting and incident exercises are part of the lab history. [Explore the test accounts used for onboarding, access, offboarding and lockout](/reference/explore/people/TEST_ACCOUNTS/).

## Inside the directory

<details open><summary><strong>Organizational Units</strong></summary>

- **Nova Users** — Finance, HR, IT, Management, Sales and Contractors
- **Nova-Computers** — Workstations and Servers
- **Nova Security groups** — global and resource permission groups
- **Nova Service Accounts**
- **Nova Administrative Accounts**
- **Nova Disabled Objects**
- **Nova Resources**
- **Built-in Domain Controllers OU**

[Open the expandable OU tree](/reference/explore/DIRECTORY/)

</details>

## How access follows an employee

[Moyo](/reference/explore/people/MOYO/) belongs to [IT_Users](/reference/explore/GROUPS/#it_users), and the documented authorization path includes `DL_FS_IT_Modify`. That allowed the IT folder but did not grant access to Finance.

[Follow the full access chain](/reference/explore/files/PERMISSIONS/) · [Explore Group Policy](/reference/explore/POLICIES/).

*Accounts and group memberships reflect the last documented directory check.*

[← Company map](/reference/EXPLORE_NOVACORP/)