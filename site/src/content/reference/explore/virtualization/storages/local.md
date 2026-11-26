---
title: "local — Proxmox directory storage"
sourcePath: "docs/explore/virtualization/storages/local.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/virtualization/storages/local.md"
section: "explore"
---

# local — Proxmox directory storage

**Backend:** directory (`dir`) · **Path:** `/var/lib/vz` · **Space available (last check):** 36.88% free.

## What is it used for?

Proxmox uses this directory for content types `vztmpl`, `import`, `backup` and `iso`. It also holds mounted Windows Server and VirtIO ISO images.

**Don't confuse an ISO attachment with a guest's main data disk.** They appear as CD-ROM media on the VM pages.

[Explore every VM](/reference/explore/virtualization/README/) · [local-lvm](/reference/explore/virtualization/storages/local-lvm/) · [nova-backup](/reference/explore/virtualization/storages/nova-backup/).