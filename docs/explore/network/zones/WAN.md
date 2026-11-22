# WAN — Nova Corp network area

**Interface:** `wan` · **Device:** `vtnet0` · **Address / gateway:** `DHCP (runtime address last recorded as 192.168.178.71)` · **Verified configuration:** 22 November 2026.

## Why this network exists

The firewall's connection toward the upstream home router.

## What is connected here?

[Upstream Proxmox management](../../systems/NOVA-PROX01.md) is in the outer network, not the MGMT VLAN.

## Firewall rules on this interface

1. [Rule 1785021391](../rules/1785021391.md)

The WAN pass rule allows WireGuard UDP 51820 to the pfSense WAN address.

## DHCP / address assignment

WAN obtains its own address using upstream DHCP; no pfSense LAN-style DHCP scope.

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The exported settings describe the firewall configuration; they are not a substitute for observing actual packets and client behavior.

[← Network Gatehouse](../../NETWORK.md)