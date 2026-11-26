---
title: "Moyo Agunbiade — IT access tested end to end"
sourcePath: "docs/explore/people/MOYO.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/MOYO.md"
section: "explore"
---

# Moyo Agunbiade — IT access tested end to end

## Role

Moyo was used as an IT-department account in the Nova Corp lab and, later, as a real domain-user context for resource-authorization testing.

| Field | Documented value |
| --- | --- |
| Name | Moyo Agunbiade |
| Tested logon | `moyo` |
| Account enabled (last checked) | Yes |
| Department | IT |
| OU (directory setup) | `Nova Users → IT` |
| Global security group | `IT_Users` |
| Resource permission group (tested) | `DL_FS_IT_Modify` |

## What can this account access?

| Resource | Expected / tested |
| --- | --- |
| [IT share](/reference/explore/files/it/) | **ALLOW** |
| [Finance share](/reference/explore/files/finance/) | **DENY** |

The latest documented directory shows Moyo is still in the IT OU, enabled and a direct member of `IT_Users`. The allowed/denied results were separately confirmed by group/ACL analysis and a real user-session access test.

## Why that matters

The lab originally found an error in the access-analysis script: one check compared `DL_FS_IT_Modify` with `NOVA\DL_FS_IT_Modify` and incorrectly treated them as different groups. The comparison was fixed and the tests repeated.

The real user result remained: IT allowed, Finance denied.

## Follow the connection

[Moyo](/reference/explore/people/MOYO/) → [IT_Users](/reference/explore/GROUPS/#it_users) → `DL_FS_IT_Modify` → [SMB / NTFS permissions](/reference/explore/services/SMB/) → [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/).

**Detailed proof:** [PowerShell access-analysis journal](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/) · [Original group placement](/reference/Documentation/Change-Requests/Journal-CR-005/).

[← People & Departments](/reference/explore/PEOPLE_AND_DEPARTMENTS/)