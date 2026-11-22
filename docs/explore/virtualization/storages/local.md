# local — Proxmox directory storage

**Backend:** directory (`dir`) · **Path:** `/var/lib/vz` · **Used:** 63.12% in the 22 November 2026 B02 capture.

## What is it used for?

The source storage configuration allows content types `vztmpl`, `import`, `backup` and `iso`. In the collected VM configuration, this store holds mounted Windows Server and VirtIO ISO images.

**Don't confuse an ISO attachment with a guest's main data disk.** They appear as CD-ROM media in the 28 attachment inventory.

[Explore every VM](../README.md) · [local-lvm](local-lvm.md) · [nova-backup](nova-backup.md).