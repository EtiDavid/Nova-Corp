# Management Test — Nova Corp directory profile

Fictional management identity used for resource authorization analysis, including a Finance Full Control test.

| Account detail | Last documented setting |
| --- | --- |
| Account name | `mgmt.test` |
| Location | Nova Users → Management |
| Account enabled | **Yes** |
| Type | Fictional lab account |
| Direct groups recorded | `Management_Users` |
| Nested resource groups | `DL_FS_Management_Modify`, `DL_FS_Finance_FullControl` (via a department group) |

## How this account connects

This account is a direct member of `Management_Users`. The group nesting leads to `DL_FS_Management_Modify` and `DL_FS_Finance_FullControl`. Opening a shared folder also requires suitable SMB and NTFS permissions.

## Explore related parts of the lab

[Directory tree](../../DIRECTORY_SNAPSHOT_2026-11-22.md) · [Security groups](../../GROUPS.md) · [Active Directory](../../services/ACTIVE_DIRECTORY.md) · [Shared file permissions](../../FILE_SERVICES.md) · [PowerShell administration](../../AUTOMATION.md).

**Engineering evidence:** [Directory and group design](../../../Documentation/Change-Requests/Journal-CR-005.md) · [Account automation tests](../../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

*Account state reflects the last documented directory check.*