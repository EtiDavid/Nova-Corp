# nova-backup — Backup archive and VM disk storage

**Backend:** directory (`dir`) · **Path:** `/mnt/nova-backup` · **Filesystem:** ext4 on `sda1` · **Used:** 22.30% at capture.

## Why was it created?

To keep standalone Proxmox VM backup archives away from the `local-lvm` thin pool. A separate Proxmox-visible disk gives more operational separation, but this nested lab is **not independently off-site or guaranteed a separate physical failure domain**.

## What is actually on it?

The B02 inventory found **six vzdump archives**, four for pfSense VM100 and two for DC01 VM101.

It also found **two attached live qcow2 VM disks**, which are *not* the same thing as archived backups:

- [DC01 VM101](../vms/101.md): `scsi1` declared 60G, `nova-backup:101/vm-101-disk-0.qcow2`, VM backup flag `0`.
- [FILES01 VM104](../vms/104.md): `scsi2` declared 100G, `nova-backup:104/vm-104-disk-0.qcow2`, VM backup flag `0`.

This matters when evaluating resilience: a disk placed in backup storage is still a **live workload disk**, not a restorable archive simply because of its directory name.

## Explore protection

[All six archives and scheduled job](../BACKUPS.md) · [pfSense known-good snapshot](../snapshots/100.md) · [Backups across the company](../../services/BACKUPS.md).

[← Virtualization floor](../README.md)