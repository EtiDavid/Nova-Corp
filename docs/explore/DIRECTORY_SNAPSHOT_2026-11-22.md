# Inside Nova Corp's Active Directory — November 2026

Explore the **`nova.corp` company directory**. Open an organizational unit, person, group or computer to follow how the systems work together.

The directory contains **16 Organizational Units**, **20 user accounts** (including system, service and test accounts), **62 security groups**, and **4 computer objects**. Of the 20 user accounts, 16 were enabled and four disabled at capture time.

## Browse the company

<details open><summary><strong>Nova Users — Employees, contractors and test identities</strong></summary>

| Department OU | Accounts | Group |
| --- | --- | --- |
| **IT** | [David Eti](people/DAVID.md), [Moyo Agunbiade](people/MOYO.md), [Isaac Technology](people/accounts/cr011-it.md) | [IT_Users](GROUPS.md#it_users) |
| **Finance** | [Alice Finance](people/accounts/cr011-fin.md), [Finance Test](people/accounts/fin-test.md) | [Finance_Users](GROUPS.md#finance_users) |
| **HR** | [Henry HumanResources](people/accounts/cr011-hr.md), [HR Test](people/accounts/hr-test.md) | [HR_Users](GROUPS.md#hr_users) |
| **Management** | [Maria Manager](people/accounts/cr011-mgmt.md), [Management Test](people/accounts/mgmt-test.md) | [Management_Users](GROUPS.md#management_users) |
| **Sales** | [Sales Test](people/accounts/sales-test.md) | [Sales_Users](GROUPS.md#sales_users) |
| **Contractors** | [John Shaw](people/JOHN_SHAW.md) | OU-targeted contractor policy |

</details>

<details><summary><strong>Nova Service Accounts</strong></summary>

Three enabled service identities were created in the lab:
[svc_backup](people/accounts/svc-backup.md), [svc_fileserver](people/accounts/svc-fileserver.md), and [svc_monitoring](people/accounts/svc-monitoring.md).

A service account existing in AD does not by itself mean a service is currently configured to use it.

</details>

<details><summary><strong>Nova Disabled Objects</strong></summary>

- [CR011 GUI pilot](people/accounts/cr011-gui.md) — disabled.
- [Sarah Sales](people/accounts/cr011-sales.md) — disabled after the offboarding/access-control exercise.

</details>

<details><summary><strong>Built-in Users container</strong></summary>

- [Administrator](people/accounts/administrator.md) — enabled built-in administrative identity.
- [Guest](people/accounts/guest.md) — disabled built-in guest identity.
- [krbtgt](people/accounts/krbtgt.md) — disabled service identity used internally by Kerberos.
- [test.user](people/accounts/test-user.md) — enabled lab test account in the default Users container.

</details>

<details><summary><strong>Nova-Computers</strong></summary>

- Workstations: [NOVA-CLIENT](systems/NOVA-CLIENT.md).
- Servers: [NOVA-FILES01](systems/NOVA-FILES01.md).

</details>

<details><summary><strong>Built-in Domain Controllers OU</strong></summary>

- [NOVA-DC01](systems/NOVA-DC01.md)
- [NOVA-DC02](systems/NOVA-DC02.md)

</details>

<details><summary><strong>Other company OUs</strong></summary>

- Nova Administrative Accounts
- Nova Resources
- Nova Security groups — [browse groups](GROUPS.md)

</details>

## Which Group Policies are connected to this directory?

These Group Policies are linked to the company directory:

| Directory location | Linked policy |
| --- | --- |
| Entire `nova.corp` domain | [Default Domain Policy: passwords and Kerberos](policies/DOMAIN_PASSWORD.md) |
| Built-in **Domain Controllers** OU | [Default Domain Controllers Policy](policies/DEFAULT_DC.md) |
| **Nova Users** parent OU | [Corporate wallpaper](policies/WALLPAPER.md) and [department drive mapping](policies/DRIVE_MAPPING.md) |
| **Contractors** OU | [Removable-storage restriction](policies/CONTRACTOR_USB.md) |
| **Nova-Computers → Workstations** | [Workstation security baseline](policies/WORKSTATION_BASELINE.md) |

The seventh GPO, [Nova Corp - Keyboard](policies/KEYBOARD.md), is not linked to the directory. A link describes intended scope; client-side processing is a separate validation result.

[Explore every Group Policy](POLICIES.md).

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

[Learn how group nesting leads to file access](GROUPS.md) · [Open the shared files](FILE_SERVICES.md).

**Technical detail:** Membership counts here refer to direct group members. Windows also has **primary group** membership (such as Domain Users), which is not shown as a normal direct-member record in this export.

## Computers registered in Active Directory

| Computer | OU | Role |
| --- | --- | --- |
| [NOVA-DC01](systems/NOVA-DC01.md) | Built-in Domain Controllers | AD DS / DNS |
| [NOVA-DC02](systems/NOVA-DC02.md) | Built-in Domain Controllers | AD DS / DNS |
| [NOVA-FILES01](systems/NOVA-FILES01.md) | Nova-Computers / Servers | Department file server |
| [NOVA-CLIENT](systems/NOVA-CLIENT.md) | Nova-Computers / Workstations | User and policy testing |

## Follow the connection

**[Moyo](people/MOYO.md) → [IT_Users](GROUPS.md#it_users) → `DL_FS_IT_Modify` → [SMB and NTFS](services/SMB.md) → [NOVA-FILES01](systems/NOVA-FILES01.md)**

[Read about Active Directory](services/ACTIVE_DIRECTORY.md) · [Group Policy](POLICIES.md) · [Original directory setup journal](../Documentation/Change-Requests/Journal-CR-005.md).

*Account and policy details reflect the last documented check, not a live directory connection.*