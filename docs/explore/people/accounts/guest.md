# Guest — Nova Corp directory profile

Built-in Guest account, disabled in the captured directory. It is not a staff member.

| Attribute | Directory snapshot: 22 November 2026 |
| --- | --- |
| Account name | `Guest` |
| Location | Built-in Users container |
| Account enabled | **No** |
| Type | Built-in system account |
| Direct groups recorded | `Guests` |

## How this account connects

This account is a recorded direct member of `Guests`. Actual resource access still depends on the configured SMB/NTFS permissions and the tested account session.

## Explore related parts of the lab

[Directory tree](../../DIRECTORY_SNAPSHOT_2026-11-22.md) · [Security groups](../../GROUPS.md) · [Active Directory](../../services/ACTIVE_DIRECTORY.md) · [Shared file permissions](../../FILE_SERVICES.md) · [PowerShell administration](../../AUTOMATION.md).

**Engineering evidence:** [Directory and group design](../../../Documentation/Change-Requests/Journal-CR-005.md) · [Account automation tests](../../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

*The account state shown is a dated AD snapshot, not live synchronization.*