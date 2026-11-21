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

## Technical profile

- Hostname: `nova-prox01.nova.local`
- Proxmox VE: 9.2.2 at the Phase 2 baseline
- Base OS: Debian 13.5
- Management: `vmbr0` at `192.168.178.26/24`
- Gateway: `192.168.178.1`
- Built-in storage: `local`, `local-lvm`
- Backup repository: `nova-backup` on a separate Proxmox-visible disk

The original target design placed management in the MGMT VLAN. Actual inventory showed it still on the upstream host network. The site records the running state rather than pretending the target was already achieved.

## Storage and recovery

The standalone pfSense VM backup was written to `nova-backup`. A current pre-security-change pfSense snapshot was retained as a rollback point.

An audit found many obsolete historical snapshots. Twenty were removed using Proxmox, reducing thin-pool consumption from 86.73% to 52.88%.

[Explore storage, snapshots and recovery](../services/BACKUPS.md)

## Related systems

[pfSense](NOVA-FW01.md) · [DC01](NOVA-DC01.md) · [DC02](NOVA-DC02.md) · [File server](NOVA-FILES01.md) · [Client](NOVA-CLIENT.md)

[Initial hypervisor installation](../../Documentation/Change-Requests/Journal-CR-001.md) · [Recovery and capacity cleanup](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)

[← All systems](../SYSTEMS.md)