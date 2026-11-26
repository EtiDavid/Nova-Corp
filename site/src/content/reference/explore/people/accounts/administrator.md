---
title: "Administrator — Nova Corp directory profile"
sourcePath: "docs/explore/people/accounts/administrator.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/accounts/administrator.md"
section: "explore"
---

# Administrator — Nova Corp directory profile

Built-in privileged domain administration account. This is not a fictional staff employee; it is a Windows/Active Directory system identity.

| Account detail | Last documented setting |
| --- | --- |
| Account name | `Administrator` |
| Location | Built-in Users container |
| Account enabled | **Yes** |
| Type | Built-in system account |
| Direct groups recorded | `Administrators`, `Domain Admins`, `Enterprise Admins`, `Schema Admins`, `Group Policy Creator Owners` |

## How this account connects

This account is a direct member of `Administrators`, `Domain Admins`, `Enterprise Admins`, `Schema Admins`, `Group Policy Creator Owners`. Opening a shared folder also requires suitable SMB and NTFS permissions.

These are the account's **direct group memberships**. Built-in and primary-group relationships are handled separately.

## Explore related parts of the lab

[Directory tree](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/) · [Security groups](/reference/explore/GROUPS/) · [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [Shared file permissions](/reference/explore/FILE_SERVICES/) · [PowerShell administration](/reference/explore/AUTOMATION/).

**Engineering evidence:** [Directory and group design](/reference/Documentation/Change-Requests/Journal-CR-005/) · [Account automation tests](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).

*Account state reflects the last documented directory check.*