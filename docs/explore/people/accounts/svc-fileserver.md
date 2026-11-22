# svc_fileserver — Nova Corp directory profile

Service identity created for file-server-related operations. The file server's actual configured service logon is a separate configuration fact.

| Account detail | Last documented setting |
| --- | --- |
| Account name | `svc_fileserver` |
| Location | Nova Service Accounts |
| Account enabled | **Yes** |
| Type | Service identity |
| Direct company groups | None recorded in this inventory |

## How this account connects

This account has no direct Nova Corp department-group membership in the directory. Windows built-in and primary-group memberships may still apply.

## Explore related parts of the lab

[Directory tree](../../DIRECTORY_SNAPSHOT_2026-11-22.md) · [Security groups](../../GROUPS.md) · [Active Directory](../../services/ACTIVE_DIRECTORY.md) · [Shared file permissions](../../FILE_SERVICES.md) · [PowerShell administration](../../AUTOMATION.md).

**Engineering evidence:** [Directory and group design](../../../Documentation/Change-Requests/Journal-CR-005.md) · [Account automation tests](../../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

*Account state reflects the last documented directory check.*