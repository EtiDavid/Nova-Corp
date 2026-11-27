---
title: "Old snapshots filled the storage."
summary: "Proxmox thin-pool use reached 86.73%. A deliberate cleanup removed obsolete checkpoints while preserving approved rollback and backup archives."
date: "November 2026"
outcome: "Storage pressure reduced; archives retained"
status: "tested"
systems: ["nova-prox01", "nova-fw01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/proxmox-snapshot-pressure.md"
type: "real"
cr: "CR-015"
services: ["proxmox-backups"]
lines: ["platform"]
segment: null
pin: { col: 30, row: 50 }
shortTitle: "Old snapshots filled the storage."
saw: "Proxmox storage was 86.73% full while I was preparing a rollback point."
cause: "Twenty old snapshots were kept long after their changes were finished. CR-008 had already warned that the thin volumes could outgrow the pool."
fix: "I deleted the 20 obsolete snapshots and kept the current pre-CR-016 pfSense snapshot and the existing backup archives."
proof: "Usage fell from 86.73% to 52.88%, about 125.72 GiB freed, and a later check showed 53.67%."
limits: "Deleting snapshots is not a backup and not a restore test. A whole-VM restore from the Proxmox archives has not been demonstrated."
copyStatus: "rewritten"
---
