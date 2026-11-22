# local — Proxmox directory storage

**Backend:** directory (`dir`) · **Path:** `/var/lib/vz` · **Space available (last check):** 36.88% free.

## What is it used for?

Proxmox uses this directory for content types `vztmpl`, `import`, `backup` and `iso`. It also holds mounted Windows Server and VirtIO ISO images.

**Don't confuse an ISO attachment with a guest's main data disk.** They appear as CD-ROM media on the VM pages.

[Explore every VM](../README.md) · [local-lvm](local-lvm.md) · [nova-backup](nova-backup.md).