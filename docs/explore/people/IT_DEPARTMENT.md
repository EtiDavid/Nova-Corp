# IT Department

IT is the team used to administer Nova Corp's domain, servers, workstations and support tasks.

## Directory location

`nova.corp → Nova Users → IT`

Security group: [IT_Users](../GROUPS.md#it_users)

## People in the original directory exercise

- [David Eti](DAVID.md)
- [Moyo Agunbiade](MOYO.md)

The historical account/group exercise placed both users in the IT OU and IT_Users group. The separate account-access tests provide additional proof for Moyo.

## What IT works with

[Domain Controllers](../SYSTEMS.md) · [PowerShell administration](../AUTOMATION.md) · [Group Policy](../POLICIES.md) · [File services](../FILE_SERVICES.md) · [Incident investigations](../TESTS_AND_RECOVERY.md)

## Example: employee needs the IT share

1. Sign in using a domain account.
2. Account belongs to `IT_Users`.
3. Its authorization includes `DL_FS_IT_Modify`.
4. Share and NTFS permissions permit the required access.
5. A user-side test confirms the result.

[Follow Moyo's real tested access path](MOYO.md) · [View the original group journal](../../Documentation/Change-Requests/Journal-CR-005.md).

[← Departments](DEPARTMENTS.md)