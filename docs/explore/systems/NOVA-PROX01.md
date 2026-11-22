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

**[Open the complete virtualization floor — all six VMs, their NICs, disks and storage](../virtualization/README.md)**

## Technical profile

- Hostname: `nova-prox01.nova.local`
- Proxmox VE manager: **9.2.2** at 22 November 2026, with running kernel **7.0.2-6-pve**
- Base OS: Debian 13.5
- Management: `vmbr0` at `192.168.178.26/24`
- Gateway: `192.168.178.1`
- Built-in storage: `local`, `local-lvm`
- Backup repository: `nova-backup` on a separate Proxmox-visible disk

The original target design placed management in the MGMT VLAN. Actual inventory showed it still on the upstream host network. The site records the running state rather than pretending the target was already achieved.

## Storage and recovery

The standalone pfSense VM backup was written to `nova-backup`. A current pre-security-change pfSense snapshot was retained as a rollback point.

An audit found many obsolete historical snapshots. Twenty were removed using Proxmox, reducing thin-pool consumption from 86.73% to 52.88%. The later B02 inventory measured **53.67%**. [See the incident and exact tests](../incidents/proxmox-snapshot-pressure.md).

[Explore the three current storages](../virtualization/README.md#storage-and-recovery) · [six archives and monthly backup job](../virtualization/BACKUPS.md) · [one retained snapshot](../virtualization/snapshots/100.md).

## Actual B02 host inventory

The read-only 22 November capture found **six VMs**, five running and one stopped (VM201). There are seven virtual NICs, 28 disk/media attachments (including CD-ROM/ISO media), three storage backends, one retained snapshot and six Proxmox backup archives. Two additional **live qcow2 disks** reside on `nova-backup`; they are not backup archives. The current configured PVE job is monthly and targets VMs 100/101; the legacy cron file needs a GUI check before asserting exact active scheduling.

[All six VM profiles](../virtualization/README.md) · [vmbr0](../virtualization/bridges/vmbr0.md) · [vmbr1](../virtualization/bridges/vmbr1.md).

## Related systems

[pfSense](NOVA-FW01.md) · [DC01](NOVA-DC01.md) · [DC02](NOVA-DC02.md) · [File server](NOVA-FILES01.md) · [Client](NOVA-CLIENT.md)

[Initial hypervisor installation](../../Documentation/Change-Requests/Journal-CR-001.md) · [Recovery and capacity cleanup](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)

[← All systems](../SYSTEMS.md)