---
title: "Inside Nova Corp's Active Directory — November 2026"
sourcePath: "docs/explore/DIRECTORY_SNAPSHOT_2026-11-22.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/DIRECTORY_SNAPSHOT_2026-11-22.md"
section: "explore"
---

# Inside Nova Corp's Active Directory — November 2026

Explore the **`nova.corp` company directory**. Open an organizational unit, person, group or computer to follow how the systems work together.

The directory contains **16 Organizational Units**, **20 user accounts** (including system, service and test accounts), **62 security groups**, and **4 computer objects**. Of the 20 user accounts, 16 were enabled and four disabled at capture time.

## Browse the company

<details open><summary><strong>Nova Users — Employees, contractors and test identities</strong></summary>

| Department OU | Accounts | Group |
| --- | --- | --- |
| **IT** | [David Eti](/reference/explore/people/DAVID/), [Moyo Agunbiade](/reference/explore/people/MOYO/), [Isaac Technology](/reference/explore/people/accounts/cr011-it/) | [IT_Users](/reference/explore/GROUPS/#it_users) |
| **Finance** | [Alice Finance](/reference/explore/people/accounts/cr011-fin/), [Finance Test](/reference/explore/people/accounts/fin-test/) | [Finance_Users](/reference/explore/GROUPS/#finance_users) |
| **HR** | [Henry HumanResources](/reference/explore/people/accounts/cr011-hr/), [HR Test](/reference/explore/people/accounts/hr-test/) | [HR_Users](/reference/explore/GROUPS/#hr_users) |
| **Management** | [Maria Manager](/reference/explore/people/accounts/cr011-mgmt/), [Management Test](/reference/explore/people/accounts/mgmt-test/) | [Management_Users](/reference/explore/GROUPS/#management_users) |
| **Sales** | [Sales Test](/reference/explore/people/accounts/sales-test/) | [Sales_Users](/reference/explore/GROUPS/#sales_users) |
| **Contractors** | [John Shaw](/reference/explore/people/JOHN_SHAW/) | OU-targeted contractor policy |

</details>

<details><summary><strong>Nova Service Accounts</strong></summary>

Three enabled service identities were created in the lab:
[svc_backup](/reference/explore/people/accounts/svc-backup/), [svc_fileserver](/reference/explore/people/accounts/svc-fileserver/), and [svc_monitoring](/reference/explore/people/accounts/svc-monitoring/).

A service account existing in AD does not by itself mean a service is currently configured to use it.

</details>

<details><summary><strong>Nova Disabled Objects</strong></summary>

- [CR011 GUI pilot](/reference/explore/people/accounts/cr011-gui/) — disabled.
- [Sarah Sales](/reference/explore/people/accounts/cr011-sales/) — disabled after the offboarding/access-control exercise.

</details>

<details><summary><strong>Built-in Users container</strong></summary>

- [Administrator](/reference/explore/people/accounts/administrator/) — enabled built-in administrative identity.
- [Guest](/reference/explore/people/accounts/guest/) — disabled built-in guest identity.
- [krbtgt](/reference/explore/people/accounts/krbtgt/) — disabled service identity used internally by Kerberos.
- [test.user](/reference/explore/people/accounts/test-user/) — enabled lab test account in the default Users container.

</details>

<details><summary><strong>Nova-Computers</strong></summary>

- Workstations: [NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/).
- Servers: [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/).

</details>

<details><summary><strong>Built-in Domain Controllers OU</strong></summary>

- [NOVA-DC01](/reference/explore/systems/NOVA-DC01/)
- [NOVA-DC02](/reference/explore/systems/NOVA-DC02/)

</details>

<details><summary><strong>Other company OUs</strong></summary>

- Nova Administrative Accounts
- Nova Resources
- Nova Security groups — [browse groups](/reference/explore/GROUPS/)

</details>

## Which Group Policies are connected to this directory?

These Group Policies are linked to the company directory:

| Directory location | Linked policy |
| --- | --- |
| Entire `nova.corp` domain | [Default Domain Policy: passwords and Kerberos](/reference/explore/policies/DOMAIN_PASSWORD/) |
| Built-in **Domain Controllers** OU | [Default Domain Controllers Policy](/reference/explore/policies/DEFAULT_DC/) |
| **Nova Users** parent OU | [Corporate wallpaper](/reference/explore/policies/WALLPAPER/) and [department drive mapping](/reference/explore/policies/DRIVE_MAPPING/) |
| **Contractors** OU | [Removable-storage restriction](/reference/explore/policies/CONTRACTOR_USB/) |
| **Nova-Computers → Workstations** | [Workstation security baseline](/reference/explore/policies/WORKSTATION_BASELINE/) |

The seventh GPO, [Nova Corp - Keyboard](/reference/explore/policies/KEYBOARD/), is not linked to the directory. A link describes intended scope; client-side processing is a separate validation result.

[Explore every Group Policy](/reference/explore/POLICIES/).

## Who belongs to which company group?

These are the **11 company-created security groups**, including department groups and resource-access groups. The directory has 51 additional built-in/default security groups used by Windows and Active Directory.

| Group | Direct members at capture | What it connects to |
| --- | --- | --- |
| `IT_Users` | David Eti, Moyo Agunbiade, Isaac Technology | `DL_FS_IT_Modify` |
| `Finance_Users` | Alice Finance, Finance Test | `DL_FS_Finance_Modify` |
| `HR_Users` | Henry HumanResources, HR Test | `DL_FS_HR_Modify` |
| `Management_Users` | Maria Manager, Management Test | `DL_FS_Management_Modify` and `DL_FS_Finance_FullControl` |
| `Sales_Users` | Sales Test | `DL_FS_Sales_Modify` |
| `DL_FS_IT_Modify` | `IT_Users` | IT shared folder |
| `DL_FS_Finance_Modify` | `Finance_Users` | Finance shared folder |
| `DL_FS_HR_Modify` | `HR_Users` | HR shared folder |
| `DL_FS_Management_Modify` | `Management_Users` | Management shared folder |
| `DL_FS_Sales_Modify` | `Sales_Users` | Sales shared folder |
| `DL_FS_Finance_FullControl` | `Management_Users` | Finance resource's full-control permission role |

[Learn how group nesting leads to file access](/reference/explore/GROUPS/) · [Open the shared files](/reference/explore/FILE_SERVICES/).

**Technical detail:** Membership counts here refer to direct group members. Windows also has **primary group** membership (such as Domain Users), which does not appear as an ordinary direct group-membership entry.

## Computers registered in Active Directory

| Computer | OU | Role |
| --- | --- | --- |
| [NOVA-DC01](/reference/explore/systems/NOVA-DC01/) | Built-in Domain Controllers | AD DS / DNS |
| [NOVA-DC02](/reference/explore/systems/NOVA-DC02/) | Built-in Domain Controllers | AD DS / DNS |
| [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/) | Nova-Computers / Servers | Department file server |
| [NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/) | Nova-Computers / Workstations | User and policy testing |

## Follow the connection

**[Moyo](/reference/explore/people/MOYO/) → [IT_Users](/reference/explore/GROUPS/#it_users) → `DL_FS_IT_Modify` → [SMB and NTFS](/reference/explore/services/SMB/) → [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/)**

[Read about Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [Group Policy](/reference/explore/POLICIES/) · [Original directory setup journal](/reference/Documentation/Change-Requests/Journal-CR-005/).

*Account and policy details reflect the last documented check, not a live directory connection.*