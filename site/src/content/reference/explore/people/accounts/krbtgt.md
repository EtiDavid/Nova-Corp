---
title: "krbtgt — Nova Corp directory profile"
sourcePath: "docs/explore/people/accounts/krbtgt.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/accounts/krbtgt.md"
section: "explore"
---

# krbtgt — Nova Corp directory profile

Built-in Kerberos service identity used internally by Active Directory for ticket operations. Disabled status is normal; it is not an employee login.

| Account detail | Last documented setting |
| --- | --- |
| Account name | `krbtgt` |
| Location | Built-in Users container |
| Account enabled | **No** |
| Type | Built-in system account |
| Direct company groups | None recorded in this inventory |

## How this account connects

This account has no direct Nova Corp department-group membership in the directory. Windows built-in and primary-group memberships may still apply.

The krbtgt account participates in Kerberos internals; it is not expected to be enabled as an interactive user.

## Explore related parts of the lab

[Directory tree](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/) · [Security groups](/reference/explore/GROUPS/) · [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [Shared file permissions](/reference/explore/FILE_SERVICES/) · [PowerShell administration](/reference/explore/AUTOMATION/).

**Engineering evidence:** [Directory and group design](/reference/Documentation/Change-Requests/Journal-CR-005/) · [Account automation tests](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).

*Account state reflects the last documented directory check.*