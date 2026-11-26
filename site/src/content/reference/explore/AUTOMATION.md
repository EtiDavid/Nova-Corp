---
title: "PowerShell Administration Toolkit"
sourcePath: "docs/explore/AUTOMATION.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/AUTOMATION.md"
section: "explore"
---

# PowerShell Administration Toolkit

## Why Nova Corp built it

Managing employee accounts by hand is slow, repetitive and easy to get wrong. The lab built eight PowerShell scripts to help with common IT administration tasks.

## Explore the eight scripts

| Script | What it does | Real lesson from testing |
| --- | --- | --- |
| `New-BulkUsers.ps1` | Creates staff accounts from controlled CSV input | A password rejection initially left half-created users; rollback/cleanup was fixed |
| `Get-InactiveUsers.ps1` | Reports users who have not logged in for a chosen period | Never-logged-in accounts and threshold behavior need careful interpretation |
| `Disable-OffboardedUser.ps1` | Disables departing users and reviews access | Preview, group cleanup and protected-account checks matter |
| `Get-GroupMembership.ps1` | Reports direct/effective membership | Primary group handling required SID-aware logic |
| `Test-UserAccess.ps1` | Analyzes expected SMB/NTFS access | Initially mismatched a bare group name and domain-qualified ACL identity |
| `Get-LockedAccounts.ps1` | Finds locked accounts | Tested using controlled account lockout |
| `Reset-UserPassword.ps1` | Supports password operations | Requires safeguards and verification |
| `Get-ADComputerReport.ps1` | Reports AD-registered computers | Useful for inventory and administration |

## Follow a user lifecycle

```mermaid
flowchart LR
    HR["New employee record"] --> PRE["Validate input"]
    PRE --> CREATE["Create AD account"]
    CREATE --> OU["Put in department OU"]
    OU --> GG["Join security group"]
    GG --> CHECK["Verify / log"]
    CHECK --> SHARE["Use approved resources"]
```

If account creation fails mid-way, the corrected script cleans up partial state instead of leaving a half-configured employee.

## Verified release

The eight scripts were parser-checked, hashed and packaged as `CR-011-v1.0.0`.

## Connections

[Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [People](/reference/explore/PEOPLE_AND_DEPARTMENTS/) · [Security groups](/reference/explore/GROUPS/) · [File access](/reference/explore/FILE_SERVICES/) · [Incidents](/reference/explore/TESTS_AND_RECOVERY/).

**Full script-by-script proof:** [PowerShell Administration Toolkit journal](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).