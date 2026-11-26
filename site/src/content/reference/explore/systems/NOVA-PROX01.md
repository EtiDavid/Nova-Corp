---
title: "nova-prox01 — Proxmox Hypervisor"
sourcePath: "docs/explore/systems/NOVA-PROX01.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/systems/NOVA-PROX01.md"
section: "explore"
---

# nova-prox01 — Proxmox Hypervisor

**Role:** Runs the virtual servers behind Nova Corp · **Current management address:** `192.168.178.26`

## Why it exists

The lab needs somewhere to run its firewall, Domain Controllers, file server and workstations. Proxmox provides the virtual-machine platform. Proxmox itself runs nested inside VMware Workstation on the outer Windows host.

```text
Windows host
    ↓
VMware Workstation
    ↓
nova-prox01 / Proxmox
    ├── nova-fw01 / pfSense
    ├── NOVA-DC01
    ├── NOVA-DC02
    ├── NOVA-FILES01
    └── NOVA-CLIENT
```

**[Open the complete virtualization floor — all six VMs, their NICs, disks and storage](/reference/explore/virtualization/README/)**

## Technical profile

- Hostname: `nova-prox01.nova.local`
- Proxmox VE: **9.2.2** · Linux kernel: **7.0.2-6-pve** (last checked)
- Base OS: Debian 13.5
- Management: `vmbr0` at `192.168.178.26/24`
- Gateway: `192.168.178.1`
- Built-in storage: `local`, `local-lvm`
- Backup repository: `nova-backup` on a separate Proxmox-visible disk

The original target design placed management in the MGMT VLAN. Actual inventory showed it still on the upstream host network. The site records the running state rather than pretending the target was already achieved.

## Storage and recovery

The standalone pfSense VM backup was written to `nova-backup`. A current pre-security-change pfSense snapshot was retained as a rollback point.

An audit found many obsolete historical snapshots. Twenty were removed using Proxmox, reducing thin-pool consumption from 86.73% to 52.88%. The latest check showed **53.67% used**, or **46.33% free**. [See the incident and exact tests](/reference/explore/incidents/proxmox-snapshot-pressure/).

[Explore the three current storages](/reference/explore/virtualization/README/#storage-and-recovery) · [six archives and monthly backup job](/reference/explore/virtualization/BACKUPS/) · [one retained snapshot](/reference/explore/virtualization/snapshots/100/).

## Inside the virtual data centre

Proxmox hosts **six VMs**: five running and one stopped (VM201). There are seven virtual NICs, 28 disk/media attachments (including CD-ROM/ISO media), three storage backends, one retained snapshot and six Proxmox backup archives. Two additional **live qcow2 disks** reside on `nova-backup`; they are not backup archives. The recorded Proxmox backup job is monthly and selects VMs 100/101. An older schedule file also exists and needs checking before treating that as the only schedule.

[All six VM profiles](/reference/explore/virtualization/README/) · [vmbr0](/reference/explore/virtualization/bridges/vmbr0/) · [vmbr1](/reference/explore/virtualization/bridges/vmbr1/).

## Related systems

[pfSense](/reference/explore/systems/NOVA-FW01/) · [DC01](/reference/explore/systems/NOVA-DC01/) · [DC02](/reference/explore/systems/NOVA-DC02/) · [File server](/reference/explore/systems/NOVA-FILES01/) · [Client](/reference/explore/systems/NOVA-CLIENT/)

[Initial hypervisor installation](/reference/Documentation/Change-Requests/Journal-CR-001/) · [Recovery and capacity cleanup](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/)

[← All systems](/reference/explore/SYSTEMS/)