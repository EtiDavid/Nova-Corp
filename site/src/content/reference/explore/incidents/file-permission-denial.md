---
title: "A folder suddenly denies an employee access"
sourcePath: "docs/explore/incidents/file-permission-denial.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/file-permission-denial.md"
section: "explore"
---

# A folder suddenly denies an employee access

**Closed · PASS** · **Investigation:** `INC-CR014-01` · **Category:** Nova Corp incident response

## What happened?

Moyo could see the IT share, but one subfolder refused read and write access.

## Why this test mattered

Separate share connectivity from folder permissions. Windows combines SMB share rights, NTFS access control lists and the user's logon token.

## What caused it?

An explicit NTFS DENY entry for NOVA\moyo on D:\NovaData\IT\CR014-IncidentLab overrode inherited IT-group Modify permission.

## Investigation — commands, expected results and actual findings

### 1. Is the incident folder visible?

```text
Test-Path "\\nova-files01\IT\CR014-IncidentLab"
```

**Expected / hypothesis:** True if the path resolves (not sufficient to establish file access).

**Actual recorded result:** True. Visibility alone did not guarantee access.

### 2. Can Moyo read the test file?

```text
Get-Content "\\nova-files01\IT\CR014-IncidentLab\Incident-Test.txt"
```

**Expected / hypothesis:** Read fails under injected NTFS denial.

**Actual recorded result:** Access denied / UnauthorizedAccessException.

### 3. Is network name resolution and SMB intact?

```text
Resolve-DnsName nova-files01.nova.corp
Test-NetConnection nova-files01.nova.corp -Port 445
```

**Expected / hypothesis:** DNS resolves to 10.10.20.20; TCP 445 succeeds.

**Actual recorded result:** Correct DNS, TCP connection succeeds; parent IT share remains accessible.

### 4. Does Moyo still have an IT token?

```text
whoami /groups | findstr /i "DL_FS_IT_Modify"
```

**Expected / hypothesis:** IT resource authorization group is present.

**Actual recorded result:** NOVA\DL_FS_IT_Modify present and enabled.

### 5. Is the root share permission healthy?

```text
Get-SmbShareAccess -Name IT
```

**Expected / hypothesis:** IT Modify group has Change at SMB layer.

**Actual recorded result:** NOVA\DL_FS_IT_Modify Allow/Change.

### 6. What does the child folder ACL say?

```text
icacls "D:\NovaData\IT\CR014-IncidentLab"
```

**Expected / hypothesis:** Explicit deny should be visible alongside inherited allow.

**Actual recorded result:** Explicit NOVA\moyo DENY plus inherited DL_FS_IT_Modify Modify.

### 7. Does minimal repair restore work?

```text
Get-Content "\\nova-files01\IT\CR014-IncidentLab\Incident-Test.txt"
```

**Expected / hypothesis:** Read and write work after removing only the deny ACE.

**Actual recorded result:** Folder traversal, reading and creation of Moyo-PostRepair.txt PASS.

## Repair / resolution

Remove only the Moyo-specific explicit DENY; leave IT-group Modify and administrative permissions intact.

## Original tests and evidence

The full illustrated [incident engineering journal (PDF)](/journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence/) contains the execution evidence, screenshots, exact command history and troubleshooting decisions. The brief [public incident-exercise overview](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) explains the wider exercise.

The linked engineering journal identifies the original screenshots and preserves the command-by-command results.

## Explore connected services

[IT department](/reference/explore/people/IT_DEPARTMENT/) · [File permissions](/reference/explore/FILE_SERVICES/) · [Moyo](/reference/explore/people/MOYO/).

[← All investigations](/reference/explore/TESTS_AND_RECOVERY/) · [Company explorer](/reference/EXPLORE_NOVACORP/)
