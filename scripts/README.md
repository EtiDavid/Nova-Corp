# PowerShell administration toolkit

The eight scripts below were built, tested and packaged as `CR-011-v1.0.0` in the lab. See [the full CR-011 journal](../docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) and the [plain-English summary](../docs/explore/AUTOMATION.md).

TODO(David): the script source is not in this repository yet. Copy the eight `.ps1` files from `C:\NovaCorp\PowerShell\Scripts` into this folder. Check each one first for lab passwords or other secrets; use parameters or `Get-Credential` instead.

| Script | What it does | Change request |
| --- | --- | --- |
| `New-BulkUsers.ps1` | Creates staff accounts from controlled CSV input | CR-011 |
| `Get-InactiveUsers.ps1` | Reports users who have not logged in for a chosen period | CR-011 |
| `Disable-OffboardedUser.ps1` | Disables departing users and reviews access | CR-011 |
| `Get-GroupMembership.ps1` | Reports direct and effective group membership | CR-011 |
| `Test-UserAccess.ps1` | Analyses expected SMB and NTFS access | CR-011 |
| `Get-LockedAccounts.ps1` | Finds locked accounts | CR-011 |
| `Reset-UserPassword.ps1` | Supports password operations | CR-011 |
| `Get-ADComputerReport.ps1` | Reports AD-registered computers | CR-011 |
