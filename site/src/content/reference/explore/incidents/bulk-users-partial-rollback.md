---
title: "Bulk account creation fails halfway"
sourcePath: "docs/explore/incidents/bulk-users-partial-rollback.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/bulk-users-partial-rollback.md"
section: "explore"
---

# Bulk account creation fails halfway

**Fixed and retested** · **Evidence record:** `CR-011 · New-BulkUsers`

## What happened?

The onboarding script reported a password error but left disabled, half-created Active Directory accounts behind.

## Why we investigated

A failed automation must not leave unexpected security identities in production-like AD.

## Root cause

The original workflow created AD objects before assigning a compliant password; a policy failure halted later steps without removing the incomplete objects.

## Step-by-step investigation

### Step 1. What is the actual password rule?

```text
Get-ADDefaultDomainPasswordPolicy | Format-List MinPasswordLength,ComplexityEnabled,MaxPasswordAge
```

**Expected / hypothesis:** At least 12 characters, complexity on, max age 180d.

**Actual result from the journal:** Min 12, complexity True, max 180 days.

### Step 2. Try intentionally invalid onboarding password

```text
& $ScriptPath -CsvPath "C:\NovaCorp\PowerShell\Data\CR011-NewUsers.csv"
```

**Expected / hypothesis:** Script must report policy failure and leave no half accounts.

**Actual result from the journal:** Original version failed password policy; created disabled objects with pwdLastSet=0.

### Step 3. Identify orphaned accounts

```text
Get-ADUser -Filter 'SamAccountName -like "cr011.*"' -Properties MemberOf,pwdLastSet
```

**Expected / hypothesis:** No new partial users after a failed run.

**Actual result from the journal:** Original failure left five disabled objects with empty memberships.

### Step 4. Verify rollback path

```text
Remove-ADUser -Identity $SamAccountName -Confirm:$false -ErrorAction Stop
```

**Expected / hypothesis:** Rollback deletes account if any mandatory creation step fails.

**Actual result from the journal:** Logs recorded ROLLBACK Successful for five affected accounts.

### Step 5. Run valid onboarding

```text
& $ScriptPath -CsvPath "C:\NovaCorp\PowerShell\Data\CR011-NewUsers.csv"
```

**Expected / hypothesis:** Five enabled departmental identities created and verified.

**Actual result from the journal:** Five users created, correct OU and global group.

### Step 6. Repeat the same import

```text
& $ScriptPath -CsvPath "C:\NovaCorp\PowerShell\Data\CR011-NewUsers.csv"
```

**Expected / hypothesis:** Skip duplicates without accidental mutation.

**Actual result from the journal:** All five Skipped — User already exists.

## Repair and outcome

Add transaction-like rollback (`Remove-ADUser` on failure); rerun weak-password test, then valid-password import and duplicate/idempotency check.

## Explore the real implementation

[Read the source PowerShell Administration Toolkit journal](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [Automation](/reference/explore/AUTOMATION/) · [Directory snapshot](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/)

[← All investigations](/reference/explore/TESTS_AND_RECOVERY/) · [Company explorer](/reference/EXPLORE_NOVACORP/)
