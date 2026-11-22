# Administrator — Nova Corp directory profile

Built-in privileged domain administration account. This is not a fictional staff employee; it is a Windows/Active Directory system identity.

| Attribute | Directory snapshot: 22 November 2026 |
| --- | --- |
| Account name | `Administrator` |
| Location | Built-in Users container |
| Account enabled | **Yes** |
| Type | Built-in system account |
| Direct groups recorded | `Administrators`, `Domain Admins`, `Enterprise Admins`, `Schema Admins`, `Group Policy Creator Owners` |

## How this account connects

This account is a recorded direct member of `Administrators`, `Domain Admins`, `Enterprise Admins`, `Schema Admins`, `Group Policy Creator Owners`. Actual resource access still depends on the configured SMB/NTFS permissions and the tested account session.

The privileged memberships listed above are current **direct** memberships in the exported directory. The profile does not reveal credentials or administrative session material.

## Explore related parts of the lab

[Directory tree](../../DIRECTORY_SNAPSHOT_2026-11-22.md) · [Security groups](../../GROUPS.md) · [Active Directory](../../services/ACTIVE_DIRECTORY.md) · [Shared file permissions](../../FILE_SERVICES.md) · [PowerShell administration](../../AUTOMATION.md).

**Engineering evidence:** [Directory and group design](../../../Documentation/Change-Requests/Journal-CR-005.md) · [Account automation tests](../../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

*The account state shown is a dated AD snapshot, not live synchronization.*