---
title: "One department's folder: the namespace was there, the server wasn't."
summary: "I took the only DFS folder target for a department offline on purpose. Moyo's Z: drive still showed, but Windows could not open the path."
date: "2026"
outcome: "Single-target DFS does not give high availability; service restored"
status: "tested"
systems: ["nova-files01","nova-client"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf"
type: "controlled"
cr: "CR-010"
services: ["dfs"]
lines: ["files"]
segment: null
pin: { col: 66, row: 40.2 }
shortTitle: "One department's folder: the namespace was there, the server wasn't."
saw: "I took the folder targets for Sales and IT offline on purpose, then watched Moyo's workstation."
cause: "The namespace is not highly available when a department has only one folder target. I expected the path to fail, and it did."
fix: "Moyo's Z: drive still existed, but Windows could not open the DFS path. The drive mapping, the namespace and the share on the server all existed. Only the DFS target was offline."
proof: "I set the targets back online with Set-DfsnFolderTarget, and Test-Path on Moyo's Z: returned True."
limits: "This tested single-target DFS only. It does not show behavior with a second target, and the test was repeated on the Sales and IT folders only."
copyStatus: "rewritten"
---

## What I tested

**Question:** does the DFS namespace keep a department's folder available if its only target goes offline? A drive can exist, the namespace can exist and the share can exist, and the folder can still be out of reach.

### 1. Baseline

```powershell
Get-DfsnFolderTarget -Path "\\nova.corp\shares\Sales" | Format-Table Path,TargetPath,State -AutoSize
Test-Path "\\nova.corp\shares\Sales"
```

**Actual:** the target was Online and the path was reachable.

### 2. Take the target offline

```powershell
Set-DfsnFolderTarget -Path "\\nova.corp\shares\Sales" -TargetPath "\\nova-files01\Sales" -State Offline
```

I did the same for IT so I could see the impact from Moyo's workstation. **Actual:** Moyo's Z: mapping was still there as a drive, but Windows could not open the DFS path.

**What it proves:** the drive mapping exists, the namespace exists and the share on the server exists, but the DFS target is offline, so file access fails.

{{evidence:dfs-single-target-error}}


### 3. Bring it back

I set both targets back to Online with the same command. **Actual:** `Test-Path "Z:\"` returned True.
