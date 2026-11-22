# Sales Test — Nova Corp directory profile

Active test identity in the Sales department; distinct from disabled cr011.sales.

| Attribute | Directory snapshot: 22 November 2026 |
| --- | --- |
| Account name | `sales.test` |
| Location | Nova Users → Sales |
| Account enabled | **Yes** |
| Type | Fictional lab account |
| Direct groups recorded | `Sales_Users` |
| Nested resource groups | `DL_FS_Sales_Modify` (via a department group) |

## How this account connects

This account is a recorded direct member of `Sales_Users`. The group nesting leads to `DL_FS_Sales_Modify`. Actual resource access still depends on the configured SMB/NTFS permissions and the tested account session.

## Explore related parts of the lab

[Directory tree](../../DIRECTORY_SNAPSHOT_2026-11-22.md) · [Security groups](../../GROUPS.md) · [Active Directory](../../services/ACTIVE_DIRECTORY.md) · [Shared file permissions](../../FILE_SERVICES.md) · [PowerShell administration](../../AUTOMATION.md).

**Engineering evidence:** [Directory and group design](../../../Documentation/Change-Requests/Journal-CR-005.md) · [Account automation tests](../../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

*The account state shown is a dated AD snapshot, not live synchronization.*