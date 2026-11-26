---
title: "Backup disk goes offline, then a file is recovered"
sourcePath: "docs/explore/incidents/backup-target-disappears.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/backup-target-disappears.md"
section: "explore"
---

# Backup disk goes offline, then a file is recovered

**Closed · PASS** · **Investigation:** `INC-CR014-05` · **Category:** Nova Corp incident response

## What happened?

A backup attempt failed because its target disk was unavailable. After recovery, a deliberately deleted file was restored and proved byte-identical.

## Why this test mattered

A green backup history isn't enough. Test a real target failure, a fresh backup and restore correctness.

## What caused it?

Windows Server Backup could not find its configured backup storage after Disk 2 was taken offline.

## Investigation — commands, expected results and actual findings

### 1. Is the backup target offline?

```text
Get-Disk -Number 2
Get-Volume -DriveLetter B
```

**Expected / hypothesis:** Disk reports Offline, B: absent.

**Actual recorded result:** Disk 2 IsOffline True; B: unavailable.

### 2. Does the real backup fail?

```text
wbadmin start backup "-templateId:{66eed636-1abb-486b-b897-0b54ead00b24}" -quiet
```

**Expected / hypothesis:** Backup fails with missing target.

**Actual recorded result:** Windows Backup cannot find any of the backup storage locations; Event ID 49.

### 3. Bring the disk back safely

```text
Set-Disk -Number 2 -IsOffline $false
Get-Volume -DriveLetter B
```

**Expected / hypothesis:** Disk/volume return Healthy/OK.

**Actual recorded result:** B: NovaBackup NTFS Healthy; freshness monitor still failed because old last success.

### 4. Does the stored backup template run after repair?

```text
wbadmin start backup "-templateId:{66eed636-1abb-486b-b897-0b54ead00b24}" -quiet
```

**Expected / hypothesis:** Backup completes; Event IDs 1/4/14.

**Actual recorded result:** Successful backup; 18 Nov Windows Backup success events 1,4,14.

### 5. Can we list the actual recovery version?

```text
wbadmin get items -version:11/18/2026-12:16 -backupTarget:B: -machine:nova-files01
```

**Expected / hypothesis:** D: NovaData included.

**Actual recorded result:** D: ~59.98 GB listed as recoverable.

### 6. Can we restore the deleted file?

```text
wbadmin start recovery -version:11/18/2026-12:16 -itemType:File -items:D:\NovaData\IT\CR014-BackupRestoreTest\CR014-Restore-Proof.txt -backupTarget:B: -machine:nova-files01 -recoveryTarget:D:\NovaData\IT\CR014-RestoreRecovered -overwrite:CreateCopy
```

**Expected / hypothesis:** One file restored to alternate directory.

**Actual recorded result:** 1 file, 176 bytes recovered; 0 failed.

### 7. Is the recovered file byte-identical?

```text
Get-FileHash -Algorithm SHA256 "D:\NovaData\IT\CR014-RestoreRecovered\CR014-Restore-Proof.txt"
```

**Expected / hypothesis:** Hash matches pre-deletion expected value.

**Actual recorded result:** Both SHA-256: 79FCAD43C927A5B19FB820E3E0BD9EE829083769AD2BE5E487C425B7820332E5.

## Repair / resolution

Bring Disk 2 online, run the existing backup template, restore a disposable deleted file to another location and compare SHA-256 hashes.

## Additional engineering lesson

The first scheduled-task trigger returned 'task settings do not allow start on demand'; the correct backup template was launched with wbadmin. A later Get-FileHash attempt failed because a PowerShell variable was null—this was a validation-command mistake, not a restore failure.

## Original tests and evidence

The full illustrated [incident engineering journal (PDF)](/journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence/) contains the execution evidence, screenshots, exact command history and troubleshooting decisions. The brief [public incident-exercise overview](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) explains the wider exercise.

The linked engineering journal identifies the original screenshots and preserves the command-by-command results.

## Explore connected services

[NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/) · [Backups](/reference/explore/services/BACKUPS/) · [Windows recovery journal](/reference/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal/).

[← All investigations](/reference/explore/TESTS_AND_RECOVERY/) · [Company explorer](/reference/EXPLORE_NOVACORP/)
