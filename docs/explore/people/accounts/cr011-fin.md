# Alice Finance — Nova Corp directory profile

Finance account created during the PowerShell bulk-user exercises.

| Attribute | Directory snapshot: 22 November 2026 |
| --- | --- |
| Account name | `cr011.fin` |
| Location | Nova Users → Finance |
| Account enabled | **Yes** |
| Type | Fictional lab account |
| Direct groups recorded | `Finance_Users` |
| Nested resource groups | `DL_FS_Finance_Modify` (via a department group) |

## How this account connects

This account is a recorded direct member of `Finance_Users`. The group nesting leads to `DL_FS_Finance_Modify`. Actual resource access still depends on the configured SMB/NTFS permissions and the tested account session.

## Explore related parts of the lab

[Directory tree](../../DIRECTORY_SNAPSHOT_2026-11-22.md) · [Security groups](../../GROUPS.md) · [Active Directory](../../services/ACTIVE_DIRECTORY.md) · [Shared file permissions](../../FILE_SERVICES.md) · [PowerShell administration](../../AUTOMATION.md).

**Engineering evidence:** [Directory and group design](../../../Documentation/Change-Requests/Journal-CR-005.md) · [Account automation tests](../../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

*The account state shown is a dated AD snapshot, not live synchronization.*