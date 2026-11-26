# PowerShell administration toolkit

The eight scripts below were built, tested and packaged as `CR-011-v1.0.0` in the lab. See [the full CR-011 journal](../docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) and the [plain-English summary](../docs/explore/AUTOMATION.md).

The script source is not published in this repository yet; it is being reviewed for lab-specific values first. Until then, the CR-011 journal documents what each script does, how it was tested and the failures it handled.

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
