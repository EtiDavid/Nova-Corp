---
title: "vmbr1 — Nova Corp's internal virtual switch"
sourcePath: "docs/explore/virtualization/bridges/vmbr1.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/virtualization/bridges/vmbr1.md"
section: "explore"
---

# vmbr1 — Nova Corp's internal virtual switch

**Status:** UP · **Type:** Linux virtual switch · **Host IP:** none assigned

## What it does

`vmbr1` carries the internal network between the pfSense firewall and company virtual machines. It allows VLAN tags so the firewall can route between different company network areas.

## Actual VM connections

| VM | Proxmox NIC | VLAN tag |
|---|---|---|
| [pfSense VM100](/reference/explore/virtualization/vms/100/) | `net1` | Untagged/trunk side; pfSense creates VLANs |
| [DC01 VM101](/reference/explore/virtualization/vms/101/) | `net0` | 20 · INFRA |
| [DC02 VM102](/reference/explore/virtualization/vms/102/) | `net0` | 20 · INFRA |
| [Windows client VM103](/reference/explore/virtualization/vms/103/) | `net0` | 40 · CLIENT |
| [File server VM104](/reference/explore/virtualization/vms/104/) | `net0` | 20 · INFRA |
| [Stopped VM201](/reference/explore/virtualization/vms/201/) | `net0` | 20 · INFRA (but VM is stopped) |

Inside pfSense, the `vtnet1` interface carries VLAN interfaces for MGMT 10, INFRA 20, APP 30, CLIENT 40 and DMZ 50. WireGuard's VPN_REMOTE is a tunnel and not an 802.1Q VLAN.

## What's connected to this switch?

Six virtual network adapters connect to `vmbr1`: pfSense's internal interface and the five Windows/spare VMs listed above. Proxmox also has internal TAP and firewall interfaces that help carry this traffic; they are **not** 22 separate company networks.

[Network overview](/reference/explore/NETWORK/) · [INFRA](/reference/explore/network/zones/INFRA/) · [CLIENT](/reference/explore/network/zones/CLIENT/) · [VM list](/reference/explore/virtualization/README/).