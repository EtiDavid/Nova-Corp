# vmbr1 — Nova Corp's internal virtual switch

**Status:** UP · **Layer:** Linux bridge · **No routed IPv4 address assigned to the bridge in the B02 capture**.

## What it does

`vmbr1` carries the internal network between the pfSense firewall and company virtual machines. It allows VLAN tags so the firewall can route between different company network areas.

## Actual VM connections

| VM | Proxmox NIC | VLAN tag |
|---|---|---|
| [pfSense VM100](../vms/100.md) | `net1` | Untagged/trunk side; pfSense creates VLANs |
| [DC01 VM101](../vms/101.md) | `net0` | 20 · INFRA |
| [DC02 VM102](../vms/102.md) | `net0` | 20 · INFRA |
| [Windows client VM103](../vms/103.md) | `net0` | 40 · CLIENT |
| [File server VM104](../vms/104.md) | `net0` | 20 · INFRA |
| [Stopped VM201](../vms/201.md) | `net0` | 20 · INFRA (but VM is stopped) |

Inside pfSense, the `vtnet1` interface carries VLAN interfaces for MGMT 10, INFRA 20, APP 30, CLIENT 40 and DMZ 50. WireGuard's VPN_REMOTE is a tunnel and not an 802.1Q VLAN.

## What the B02 inventory proves

It documents the 6 listed NIC attachments on `vmbr1` and 22 Linux host interface records, many of which are internal TAP/firewall plumbing rather than separate networks.

[Network overview](../../NETWORK.md) · [INFRA](../../network/zones/INFRA.md) · [CLIENT](../../network/zones/CLIENT.md) · [VM list](../README.md).