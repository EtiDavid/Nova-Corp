# People & Departments

Nova Corp's fictional organization uses Active Directory to group employees and manage access by department.

The directory includes **Finance, Human Resources, IT, Management and Sales**, plus contractor and service-account areas.

## Open a department

[Finance](people/DEPARTMENTS.md#finance) · [Human Resources](people/DEPARTMENTS.md#human-resources) · [IT](people/IT_DEPARTMENT.md) · [Management](people/DEPARTMENTS.md#management) · [Sales](people/DEPARTMENTS.md#sales) · [Contractors](people/DEPARTMENTS.md#contractors)

## Meet lab identities

| Person or account | Department / scenario | Explore |
| --- | --- | --- |
| **David Eti** | IT account in directory-organizing exercise | [David's profile](people/DAVID.md) |
| **Moyo Agunbiade** | IT account used for real file-access validation | [Moyo's profile](people/MOYO.md) |
| **John Shaw** | Contractor test account for removable-storage policy | [Contractor profile](people/JOHN_SHAW.md) |
| **Zoë** | Remote laptop used for WireGuard connectivity testing | [Remote-access test device](people/ZOE.md) |
| **svc_backup** | Service identity created during directory setup | [Service accounts](DIRECTORY.md) |
| **svc_monitoring** | Service identity created during directory setup | [Service accounts](DIRECTORY.md) |
| **svc_fileserver** | Service identity created during directory setup | [Service accounts](DIRECTORY.md) |

Accounts created for scripting and incident exercises are part of the lab history. [Explore the test accounts used for onboarding, access, offboarding and lockout](people/TEST_ACCOUNTS.md).

## Inside the directory

<details open><summary><strong>Organizational Units</strong></summary>

- **Nova Users** — Finance, HR, IT, Management, Sales and Contractors
- **Nova Computers** — Workstations and Servers
- **Nova Security Groups** — global and resource permission groups
- **Nova Service Accounts**
- **Nova Administrative Accounts**
- **Nova Disabled Objects**
- **Nova Resources**
- **Built-in Domain Controllers OU**

[Open the expandable OU tree](DIRECTORY.md)

</details>

## How access follows an employee

[Moyo](people/MOYO.md) belongs to [IT_Users](GROUPS.md#it_users), and the documented authorization path includes `DL_FS_IT_Modify`. That allowed the IT folder but did not grant access to Finance.

[Follow the full access chain](FILE_SERVICES.md) · [Explore Group Policy](POLICIES.md).

*Profiles describe documented lab exercises. A username seen in an old test is not automatically a claim that the account is still active today.*

[← Company map](../EXPLORE_NOVACORP.md)