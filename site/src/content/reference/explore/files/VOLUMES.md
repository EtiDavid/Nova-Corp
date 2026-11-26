---
title: "The file server's storage volumes"
sourcePath: "docs/explore/files/VOLUMES.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/VOLUMES.md"
section: "explore"
---

# The file server's storage volumes

NOVA-FILES01 uses separate Windows volumes for the operating system, company data and backup storage. The figures below are the **space available at the last recorded check**; this is not a live storage monitor.

| Drive | Purpose | Total capacity | Space free (last checked) |
| --- | --- | ---: | ---: |
| **C:** | Windows Server and DFS namespace | 63.15 GiB | **34.39 GiB (54.5%)** |
| **D:** | Shared company documents | 59.98 GiB | **59.49 GiB (99.2%)** |
| **B:** | Windows Server Backup target | 99.98 GiB | **97.98 GiB (98.0%)** |

Other recorded volumes include small unlettered system partitions and mounted installer/driver media. They are not additional company document drives.

## Storage and backup are different layers

- **D:** contains `D:\NovaData` and the five real departmental folders.
- **B:** is labeled `NovaBackup` and is used as Windows Server Backup storage on FILES01.
- **C:** contains the `C:\DFSRoots\shares` namespace root.
- Proxmox also has storage named `nova-backup`; that is a **different** Proxmox directory store for VM-level archives and selected live qcow2 disks, not the same Windows B: drive.

[See the backup failure and successful file restoration](/reference/explore/incidents/backup-target-disappears/) · [Explore Shadow Copies](/reference/explore/files/VSS/) · [Proxmox storage](/reference/explore/virtualization/storages/nova-backup/).

[← File Centre](/reference/explore/files/SHARES/)
