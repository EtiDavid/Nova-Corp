# local-lvm — The thin-provisioned VM disk pool

**Backend:** `lvmthin` · **Volume group:** `pve` · **Thinpool:** `data` · **Used:** **53.67%** at 22 November 2026, 16:03.

## What is a thin pool?

Thin provisioning gives VMs virtual disk sizes without immediately allocating all those bytes physically. Snapshots also depend on this storage pool. If it fills, guest writes and snapshots can fail.

The B02 source records the thin pool as **371.41 GiB**, with **53.67% data use** and **2.08% metadata use**.

## The storage incident we investigated

Before Phase 2 closure, numerous old snapshots had pushed data utilization to **86.73%**. [Read the exact investigation and cleanup](../../incidents/proxmox-snapshot-pressure.md).

Twenty historical snapshots were removed, preserving one known-good pre-security-change pfSense snapshot. Usage immediately afterward was **52.88%**; this later inventory records **53.67%**.

## Which VM disks use it?

[pfSense VM100](../vms/100.md), [DC01 VM101](../vms/101.md), [DC02 VM102](../vms/102.md), [Windows client VM103](../vms/103.md), [File server VM104](../vms/104.md) and [VM201](../vms/201.md) have one or more volumes here.

**A VM snapshot is not an independent backup.** An unavailable or damaged thin pool can affect both original VM disks and their snapshots.

[Storage map](../README.md) · [Backups](../BACKUPS.md).