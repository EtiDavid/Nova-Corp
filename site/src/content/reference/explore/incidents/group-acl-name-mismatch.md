---
title: "Access script wrongly denies a legitimate IT user"
sourcePath: "docs/explore/incidents/group-acl-name-mismatch.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/group-acl-name-mismatch.md"
section: "explore"
---

# Access script wrongly denies a legitimate IT user

**Fixed · PASS** · **Evidence record:** `CR-011 · Test-UserAccess`

## What happened?

An administrative access checker predicted that Moyo should be denied the IT share despite correct group membership and ACLs.

## Why we investigated

An ACL analyzer must compare the same security identity format, and its predictions must be checked against real user sessions.

## Root cause

The script compared bare `DL_FS_IT_Modify` with domain-qualified ACL identity `NOVA\DL_FS_IT_Modify` as different strings.

## Step-by-step investigation

### Step 1. Read effective AD authorization groups

```text
Get-ADAccountAuthorizationGroup moyo | Where-Object Name -like 'DL_FS_*'
```

**Expected / hypothesis:** IT resource group present.

**Actual result from the journal:** DL_FS_IT_Modify DomainLocal.

### Step 2. Run the original access analyzer

```text
& $ScriptPath -SamAccountName "moyo" -ShareName "IT"
```

**Expected / hypothesis:** A correct analyzer should predict Allow.

**Actual result from the journal:** Original script: SMBMatch False, NTFSMatch False, ExpectedAccess DENY.

### Step 3. Inspect exact ACL identity

```text
Get-SmbShareAccess -Name IT
```

**Expected / hypothesis:** Domain-qualified group name appears.

**Actual result from the journal:** NOVA\DL_FS_IT_Modify Allow Change.

### Step 4. Retest corrected IT authorization

```text
& $ScriptPath -SamAccountName "moyo" -ShareName "IT"
```

**Expected / hypothesis:** Allow at both SMB and NTFS.

**Actual result from the journal:** SMB Change, NTFS Modify, ExpectedAccess ALLOW.

### Step 5. Confirm negative separation

```text
& $ScriptPath -SamAccountName "moyo" -ShareName "Finance"
```

**Expected / hypothesis:** Finance denied for ordinary IT account.

**Actual result from the journal:** ExpectedAccess DENY.

### Step 6. Prove actual user-session behavior

```text
Test-Path "\\nova.corp\shares\IT"
Test-Path "\\nova.corp\shares\Finance"
```

**Expected / hypothesis:** IT available, Finance denied.

**Actual result from the journal:** IT True, Finance False/access denied.

## Repair and outcome

Normalize qualified and unqualified group identities; re-run positive, negative and real client-session tests.

## Explore the real implementation

[Read the source PowerShell toolkit tests](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[Moyo](/reference/explore/people/MOYO/) · [File permissions](/reference/explore/FILE_SERVICES/) · [Security groups](/reference/explore/GROUPS/)

[← All investigations](/reference/explore/TESTS_AND_RECOVERY/) · [Company explorer](/reference/EXPLORE_NOVACORP/)
