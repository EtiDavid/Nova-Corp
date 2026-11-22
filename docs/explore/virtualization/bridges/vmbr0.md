# vmbr0 — Proxmox's connection to the outside network

**Status:** UP · **Host address:** `192.168.178.26/24` · **Physical uplink:** `nic0`.

## What is a bridge?

A Proxmox Linux bridge acts like a virtual Ethernet switch. It joins the host's network port to the VM network adapters connected to it.

## Actual connections

- `nic0` → `vmbr0` → Proxmox management at `192.168.178.26:8006`.
- [pfSense VM100](../vms/100.md) `net0` → `vmbr0` → pfSense `vtnet0` WAN.
- pfSense WAN obtains its address from upstream DHCP; the earlier runtime address was `192.168.178.71`.

The **MGMT VLAN 10** exists inside pfSense, but **Proxmox management is currently upstream** on `vmbr0`, not hosted in that VLAN.

## Prove it

The 22 November Proxmox inventory shows `vmbr0` UP, `192.168.178.26/24` and VM100's `net0` using this bridge. CR-015 separately validated the management location and corrected the architecture registry.

[Host overview](../README.md) · [pfSense WAN](../../network/zones/WAN.md) · [Firewall](../../systems/NOVA-FW01.md) · [Incident: gateway failure](../../incidents/proxmox-default-gateway.md).