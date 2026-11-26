---
title: "Security groups — Who is allowed to do what?"
sourcePath: "docs/explore/GROUPS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/GROUPS.md"
section: "explore"
---

# Security groups — Who is allowed to do what?

[← Directory tree](/reference/explore/DIRECTORY/) · [People](/reference/explore/PEOPLE_AND_DEPARTMENTS/) · [Files](/reference/explore/FILE_SERVICES/) · [Group Policy](/reference/explore/POLICIES/)

The documented domain has **62 security groups**, including **11 groups created for Nova Corp's departmental access model**. [See direct group memberships and resource groups](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/).

A **security group** collects accounts that share a responsibility. Instead of granting a folder permission separately to each employee, Nova Corp assigns permission to a group.

## Department groups

The directory setup created these five **Global Security** groups:

| Group | Department | Connected people or resources |
| --- | --- | --- |
| <a id="it_users"></a>**IT_Users** | IT | [David](/reference/explore/people/DAVID/), [Moyo](/reference/explore/people/MOYO/), [Isaac](/reference/explore/people/accounts/cr011-it/), [IT folder](/reference/explore/FILE_SERVICES/#it) |
| <a id="finance_users"></a>**Finance_Users** | Finance | [Finance share](/reference/explore/FILE_SERVICES/#finance) |
| <a id="hr_users"></a>**HR_Users** | HR | [HR department](/reference/explore/people/DEPARTMENTS/#human-resources) |
| <a id="sales_users"></a>**Sales_Users** | Sales | [Sales department](/reference/explore/people/DEPARTMENTS/#sales) |
| <a id="management_users"></a>**Management_Users** | Management | [Management department](/reference/explore/people/DEPARTMENTS/#management) |

The David/Moyo membership was observed during the original directory setup. Later tests revalidated Moyo's IT authorization.

## Resource permission groups

The file-access and automation journals give concrete Domain Local group examples.

| Group | Purpose | Evidence |
| --- | --- | --- |
| `DL_FS_IT_Modify` | Allows IT folder modification | Moyo membership and matching SMB+NTFS checks |
| `DL_FS_Finance_Modify` | Finance folder modification | NTFS permission review |
| `DL_FS_Finance_FullControl` | Higher-level Finance resource control | Management access test |
| `DL_FS_HR_Modify` | HR folder modification | `HR_Users` nesting |
| `DL_FS_Management_Modify` | Management folder modification | `Management_Users` nesting |
| `DL_FS_Sales_Modify` | Sales folder modification | `Sales_Users` nesting |

These permissions connect to [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/). [Explore the full five-department SMB and NTFS permission matrix](/reference/explore/files/PERMISSIONS/).

## Why two group layers?

Nova Corp uses the **AGDLP** pattern:

```mermaid
flowchart LR
    A["Account: Moyo"] --> GG["Global: IT_Users"]
    GG --> DL["Domain Local: DL_FS_IT_Modify"]
    DL --> P["IT folder: Modify"]
```

Accounts are assigned to business groups. Those groups are nested where appropriate into resource-permission groups, which are attached to folder ACLs.

## What the lab actually proved

Moyo:
- `IT_Users` (Global)
- `DL_FS_IT_Modify` (Domain Local)
- IT: allowed
- Finance: denied

[Open Moyo's profile and test](/reference/explore/people/MOYO/).

## Group Policy filtering

A security group may also target a policy.

The contractor USB policy was linked to an OU and tested with John Shaw. The `USB_Authorized` group was part of the exception design; the physical USB-device end-to-end test was deferred due to nested device-passthrough limitations.

[Read Group Policy](/reference/explore/POLICIES/).

**Engineering records:** [Identity and group creation](/reference/Documentation/Change-Requests/Journal-CR-005/) · [Test-UserAccess and membership checks](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).