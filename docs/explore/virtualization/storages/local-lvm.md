# local-lvm — The thin-provisioned VM disk pool

**Space available (last check):** **46.33% free** · **Type:** LVM thin-provisioned VM disk storage · **Volume group:** `pve`

## What is a thin pool?

Thin provisioning gives VMs virtual disk sizes without immediately allocating all those bytes physically. Snapshots also depend on this storage pool. If it fills, guest writes and snapshots can fail.

The thin pool has **371.41 GiB** of provisioned capacity. At the latest check it was **53.67% used**, with **2.08% metadata use**.

## The storage incident we investigated

Before Phase 2 closure, numerous old snapshots had pushed data utilization to **86.73%**. [Read the exact investigation and cleanup](../../incidents/proxmox-snapshot-pressure.md).

Twenty historical snapshots were removed, preserving one known-good pre-security-change pfSense snapshot. Usage immediately afterward was **52.88%**; it was **53.67%** at the latest check.

## Which VM disks use it?

[pfSense VM100](../vms/100.md), [DC01 VM101](../vms/101.md), [DC02 VM102](../vms/102.md), [Windows client VM103](../vms/103.md), [File server VM104](../vms/104.md) and [VM201](../vms/201.md) have one or more volumes here.

**A VM snapshot is not an independent backup.** An unavailable or damaged thin pool can affect both original VM disks and their snapshots.

[Storage map](../README.md) · [Backups](../BACKUPS.md).