---
title: "Proxmox VM backups and their limits"
sourcePath: "docs/explore/virtualization/BACKUPS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/virtualization/BACKUPS.md"
section: "explore"
---

# Proxmox VM backups and their limits

Proxmox can archive a whole VM using `vzdump`. A VM snapshot is different: it stays dependent on the live VM storage pool. Nova Corp uses both, for different recovery situations.

## Which virtual machines are included in the backup schedule?

Proxmox has **one recorded backup job**:

| Setting | Configured value |
|---|---|
| Job ID | `backup-c256c2c7-8fe5` |
| Schedule | **monthly** |
| VM targets | **100, 101** (pfSense and DC01) |
| Storage | `nova-backup` |
| Requested backup mode | `snapshot` |
| Compression | `zstd` |
| Retention | `keep-last=30` |

**Schedule verified on 22 November 2026:** A direct read-only check of the Proxmox backup configuration confirmed this enabled monthly job. An older scheduler file exists, but its noncomment content was just a system PATH setting—**no second active backup schedule was present in that file**. The next configured run was **1 December 2026 at 00:00 Belgian time**. A scheduled job is not proof the future backup will complete.

A configured snapshot-mode job does **not** mean every archive was captured while the VM was running. The separately recorded pfSense backup on 21 November ran in **stop mode** because the VM was stopped, even though its command requested snapshot mode.

## The six existing archives

| VM | Date in archive name | Archive |
|---|---|---|
| [pfSense VM100](/reference/explore/virtualization/vms/100/) | 21 June 2026 | `vzdump-qemu-100-2026_06_21-17_36_51.vma.zst` |
| [pfSense VM100](/reference/explore/virtualization/vms/100/) | 23 June 2026 | `vzdump-qemu-100-2026_06_23-21_00_11.vma.zst` |
| [pfSense VM100](/reference/explore/virtualization/vms/100/) | 28 October 2026 | `vzdump-qemu-100-2026_10_28-18_54_00.vma.zst` |
| [pfSense VM100](/reference/explore/virtualization/vms/100/) | 21 November 2026 | `vzdump-qemu-100-2026_11_21-00_28_10.vma.zst` |
| [DC01 VM101](/reference/explore/virtualization/vms/101/) | 21 June 2026 | `vzdump-qemu-101-2026_06_21-17_42_54.vma.zst` |
| [DC01 VM101](/reference/explore/virtualization/vms/101/) | 23 June 2026 | `vzdump-qemu-101-2026_06_23-21_00_34.vma.zst` |

There is **no Proxmox vzdump archive for VM102, VM103, VM104 or VM201 in this backup location**. That is not proof that these systems have no other recovery options: [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/) has separately tested Windows Backup and file recovery; DCs have AD recovery measures.

## Snapshot retained

[One pfSense known-good pre-CR016 snapshot](/reference/explore/virtualization/snapshots/100/). This is not a standalone archive.

## Can these backups actually restore something?

A list of backup files does not prove recovery. Nova Corp distinguishes archives from snapshots and has **performed a real file restoration test**. [Open our failed-backup and SHA256 restoration incident](/reference/explore/incidents/backup-target-disappears/).

[← Virtualization floor](/reference/explore/virtualization/README/) · [Backup systems across the lab](/reference/explore/services/BACKUPS/).