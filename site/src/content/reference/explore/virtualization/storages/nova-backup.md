---
title: "nova-backup — Backup archive and VM disk storage"
sourcePath: "docs/explore/virtualization/storages/nova-backup.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/virtualization/storages/nova-backup.md"
section: "explore"
---

# nova-backup — Backup archive and VM disk storage

**Backend:** directory (`dir`) · **Path:** `/mnt/nova-backup` · **Filesystem:** ext4 on `sda1` · **Free space (last check):** 77.70%.

## Why was it created?

To keep standalone Proxmox VM backup archives away from the `local-lvm` thin pool. A separate Proxmox-visible disk gives more operational separation, but this nested lab is **not independently off-site or guaranteed a separate physical failure domain**.

## What is actually on it?

Nova Corp stores **six vzdump archives**, four for pfSense VM100 and two for DC01 VM101.

It also holds **two attached live qcow2 VM disks**, which are *not* the same thing as archived backups:

- [DC01 VM101](/reference/explore/virtualization/vms/101/): `scsi1` declared 60G, `nova-backup:101/vm-101-disk-0.qcow2`, VM backup flag `0`.
- [FILES01 VM104](/reference/explore/virtualization/vms/104/): `scsi2` declared 100G, `nova-backup:104/vm-104-disk-0.qcow2`, VM backup flag `0`.

This matters when evaluating resilience: a disk placed in backup storage is still a **live workload disk**, not a restorable archive simply because of its directory name.

## Explore protection

[All six archives and scheduled job](/reference/explore/virtualization/BACKUPS/) · [pfSense known-good snapshot](/reference/explore/virtualization/snapshots/100/) · [Backups across the company](/reference/explore/services/BACKUPS/).

[← Virtualization floor](/reference/explore/virtualization/README/)