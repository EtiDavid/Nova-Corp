---
title: "The backup disk disappeared. Could the file return?"
summary: "An intentionally unavailable backup destination caused a genuine backup failure. The target was repaired and a file recovered byte-for-byte."
date: "November 2026"
outcome: "File restored, fingerprint matched"
status: "tested"
systems: ["nova-files01", "nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/backup-target-disappears.md"
type: "blind"
cr: "CR-014"
services: ["windows-server-backup"]
lines: ["recovery"]
segment: { from: "nova-files01", to: "nova-prox01", line: "recovery" }
pin: { col: 60, row: 48.8 }
featured: 3
shortTitle: "The backup disk disappeared. The file came back."
saw: "The backup target was gone and the backup failed."
cause: "The backup destination was unavailable, so no new backup could be written."
fix: "I repaired the target and ran a fresh backup."
proof: "A deleted file was restored with the same SHA-256 hash as the original."
copyStatus: "rewritten"
---

## The situation

Windows Server Backup could not find its designated storage when Disk 2 was deliberately taken offline.

A missing backup destination is more than a warning: it prevents the planned protection from completing.

## What we expected

The attempt should fail while the backup target was missing. After making the disk available again, the existing backup configuration should succeed. A deliberately deleted test file should then be recoverable.

## What actually happened

- Disk 2 was observed offline; the backup volume was unavailable.
- Windows Backup produced a target-location error and Event 49.
- The disk was returned online and the backup volume was healthy.
- A fresh Windows Backup run completed and recorded success events.
- A single disposable file was restored into a separate folder: **176 bytes recovered, zero failures**.
- The original and recovered file SHA-256 fingerprints were identical.

## What the proof means

The recorded test demonstrates a functioning **file-level** recovery from Windows Server Backup after a storage-target failure was repaired.

It is separate from the later Shadow Copy earlier-version test. It is **not** a tested restoration of the entire virtual machine or physical host.
