---
title: "The backup disk disappeared. The file came back."
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
limits: "Restoring one file is not a whole-server restore, and the backups sit on the same nested lab host, so this is not off-site recovery."
copyStatus: "rewritten"
---
