# Proxmox VM backups and their limits

Proxmox can archive a whole VM using `vzdump`. A VM snapshot is different: it stays dependent on the live VM storage pool. Nova Corp uses both, for different recovery situations.

## The current configured backup job

The 22 November 2026 inventory records **one enabled job**:

| Setting | Configured value |
|---|---|
| Job ID | `backup-c256c2c7-8fe5` |
| Schedule | **monthly** |
| VM targets | **100, 101** (pfSense and DC01) |
| Storage | `nova-backup` |
| Requested backup mode | `snapshot` |
| Compression | `zstd` |
| Retention | `keep-last=30` |

**Needs a current GUI cross-check:** the collector warned that a legacy `vzdump.cron` file exists. Before concluding what backup schedules are actually executing, review **Datacenter → Backup** and any legacy schedule definition.

A configured snapshot-mode job does **not** mean every archive was captured while the VM was running. The separately recorded pfSense backup on 21 November ran in **stop mode** because the VM was stopped, even though its command requested snapshot mode.

## The six existing archives

| VM | Date in archive name | Archive |
|---|---|---|
| [pfSense VM100](vms/100.md) | 21 June 2026 | `vzdump-qemu-100-2026_06_21-17_36_51.vma.zst` |
| [pfSense VM100](vms/100.md) | 23 June 2026 | `vzdump-qemu-100-2026_06_23-21_00_11.vma.zst` |
| [pfSense VM100](vms/100.md) | 28 October 2026 | `vzdump-qemu-100-2026_10_28-18_54_00.vma.zst` |
| [pfSense VM100](vms/100.md) | 21 November 2026 | `vzdump-qemu-100-2026_11_21-00_28_10.vma.zst` |
| [DC01 VM101](vms/101.md) | 21 June 2026 | `vzdump-qemu-101-2026_06_21-17_42_54.vma.zst` |
| [DC01 VM101](vms/101.md) | 23 June 2026 | `vzdump-qemu-101-2026_06_23-21_00_34.vma.zst` |

The inventory found **no Proxmox vzdump archive for VM102, VM103, VM104 or VM201 in this storage directory**. That is not proof that these systems have no other recovery options: [NOVA-FILES01](../systems/NOVA-FILES01.md) has separately tested Windows Backup and file recovery; DCs have AD recovery measures.

## Snapshot retained

[One pfSense known-good pre-CR016 snapshot](snapshots/100.md). This is not a standalone archive.

## Why this matters to a recruiter

The important skill isn't collecting backup filenames. It's distinguishing an archive from a snapshot, understanding the failure domain, and **performing a real restore test**. [Open our failed-backup and SHA256 restoration incident](../incidents/backup-target-disappears.md).

[← Virtualization floor](README.md) · [Backup systems across the lab](../services/BACKUPS.md).