---
title: "local-lvm — The thin-provisioned VM disk pool"
sourcePath: "docs/explore/virtualization/storages/local-lvm.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/virtualization/storages/local-lvm.md"
section: "explore"
---

# local-lvm — The thin-provisioned VM disk pool

**Space available (last check):** **46.33% free** · **Type:** LVM thin-provisioned VM disk storage · **Volume group:** `pve`

## What is a thin pool?

Thin provisioning gives VMs virtual disk sizes without immediately allocating all those bytes physically. Snapshots also depend on this storage pool. If it fills, guest writes and snapshots can fail.

The thin pool has **371.41 GiB** of provisioned capacity. At the latest check it was **53.67% used**, with **2.08% metadata use**.

## The storage incident we investigated

Before Phase 2 closure, numerous old snapshots had pushed data utilization to **86.73%**. [Read the exact investigation and cleanup](/reference/explore/incidents/proxmox-snapshot-pressure/).

Twenty historical snapshots were removed, preserving one known-good pre-security-change pfSense snapshot. Usage immediately afterward was **52.88%**; it was **53.67%** at the latest check.

## Which VM disks use it?

[pfSense VM100](/reference/explore/virtualization/vms/100/), [DC01 VM101](/reference/explore/virtualization/vms/101/), [DC02 VM102](/reference/explore/virtualization/vms/102/), [Windows client VM103](/reference/explore/virtualization/vms/103/), [File server VM104](/reference/explore/virtualization/vms/104/) and [VM201](/reference/explore/virtualization/vms/201/) have one or more volumes here.

**A VM snapshot is not an independent backup.** An unavailable or damaged thin pool can affect both original VM disks and their snapshots.

[Storage map](/reference/explore/virtualization/README/) · [Backups](/reference/explore/virtualization/BACKUPS/).