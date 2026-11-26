---
title: "Finance Test — Nova Corp directory profile"
sourcePath: "docs/explore/people/accounts/fin-test.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/accounts/fin-test.md"
section: "explore"
---

# Finance Test — Nova Corp directory profile

Fictional Finance test identity used in account-authorization and lockout scenarios.

| Account detail | Last documented setting |
| --- | --- |
| Account name | `fin.test` |
| Location | Nova Users → Finance |
| Account enabled | **Yes** |
| Type | Fictional lab account |
| Direct groups recorded | `Finance_Users` |
| Nested resource groups | `DL_FS_Finance_Modify` (via a department group) |

## How this account connects

This account is a direct member of `Finance_Users`. The group nesting leads to `DL_FS_Finance_Modify`. Opening a shared folder also requires suitable SMB and NTFS permissions.

## Explore related parts of the lab

[Directory tree](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/) · [Security groups](/reference/explore/GROUPS/) · [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [Shared file permissions](/reference/explore/FILE_SERVICES/) · [PowerShell administration](/reference/explore/AUTOMATION/).

**Engineering evidence:** [Directory and group design](/reference/Documentation/Change-Requests/Journal-CR-005/) · [Account automation tests](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).

*Account state reflects the last documented directory check.*