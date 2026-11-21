# Moyo Agunbiade — IT access tested end to end

## Role

Moyo was used as an IT-department account in the Nova Corp lab and, later, as a real domain-user context for resource-authorization testing.

| Field | Documented value |
| --- | --- |
| Name | Moyo Agunbiade |
| Tested logon | `moyo` |
| Department | IT |
| OU (directory setup) | `Nova Users → IT` |
| Global security group | `IT_Users` |
| Resource permission group (tested) | `DL_FS_IT_Modify` |

## What can this account access?

| Resource | Expected / tested |
| --- | --- |
| [IT share](../FILE_SERVICES.md#it) | **ALLOW** |
| [Finance share](../FILE_SERVICES.md#finance) | **DENY** |

These results were confirmed by both group/ACL analysis and a real user-session access test.

## Why that matters

The lab originally found an error in the access-analysis script: one check compared `DL_FS_IT_Modify` with `NOVA\DL_FS_IT_Modify` and incorrectly treated them as different groups. The comparison was fixed and the tests repeated.

The real user result remained: IT allowed, Finance denied.

## Follow the connection

[Moyo](MOYO.md) → [IT_Users](../GROUPS.md#it_users) → `DL_FS_IT_Modify` → [SMB / NTFS permissions](../services/SMB.md) → [NOVA-FILES01](../systems/NOVA-FILES01.md).

**Detailed proof:** [PowerShell access-analysis journal](../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) · [Original group placement](../../Documentation/Change-Requests/Journal-CR-005.md).

[← People & Departments](../PEOPLE_AND_DEPARTMENTS.md)