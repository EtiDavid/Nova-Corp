---
title: "vmbr0 — Proxmox's connection to the outside network"
sourcePath: "docs/explore/virtualization/bridges/vmbr0.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/virtualization/bridges/vmbr0.md"
section: "explore"
---

# vmbr0 — Proxmox's connection to the outside network

**Status:** UP · **Host address:** `192.168.178.26/24` · **Physical uplink:** `nic0`.

## What is a bridge?

A Proxmox Linux bridge acts like a virtual Ethernet switch. It joins the host's network port to the VM network adapters connected to it.

## Actual connections

- `nic0` → `vmbr0` → Proxmox management at `192.168.178.26:8006`.
- [pfSense VM100](/reference/explore/virtualization/vms/100/) `net0` → `vmbr0` → pfSense `vtnet0` WAN.
- pfSense WAN obtains its address from upstream DHCP; the earlier runtime address was `192.168.178.71`.

The **MGMT VLAN 10** exists inside pfSense, but **Proxmox management is currently upstream** on `vmbr0`, not hosted in that VLAN.

## Prove it

The Proxmox configuration shows `vmbr0` UP, `192.168.178.26/24` and VM100's `net0` using this bridge. CR-015 separately validated the management location and corrected the architecture registry.

[Host overview](/reference/explore/virtualization/README/) · [pfSense WAN](/reference/explore/network/zones/WAN/) · [Firewall](/reference/explore/systems/NOVA-FW01/) · [Incident: gateway failure](/reference/explore/incidents/proxmox-default-gateway/).