# krbtgt — Nova Corp directory profile

Built-in Kerberos service identity used internally by Active Directory for ticket operations. Disabled status is normal; it is not an employee login.

| Attribute | Directory snapshot: 22 November 2026 |
| --- | --- |
| Account name | `krbtgt` |
| Location | Built-in Users container |
| Account enabled | **No** |
| Type | Built-in system account |
| Direct company groups | None recorded in this inventory |

## How this account connects

The directory export did not record a direct membership in a Nova Corp department group for this identity. That does not imply the account has no Windows built-in or primary-group membership.

The krbtgt account participates in Kerberos internals; it is not expected to be enabled as an interactive user.

## Explore related parts of the lab

[Directory tree](../../DIRECTORY_SNAPSHOT_2026-11-22.md) · [Security groups](../../GROUPS.md) · [Active Directory](../../services/ACTIVE_DIRECTORY.md) · [Shared file permissions](../../FILE_SERVICES.md) · [PowerShell administration](../../AUTOMATION.md).

**Engineering evidence:** [Directory and group design](../../../Documentation/Change-Requests/Journal-CR-005.md) · [Account automation tests](../../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

*The account state shown is a dated AD snapshot, not live synchronization.*