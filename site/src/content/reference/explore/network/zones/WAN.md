---
title: "WAN — Nova Corp network area"
sourcePath: "docs/explore/network/zones/WAN.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/zones/WAN.md"
section: "explore"
---

# WAN — Nova Corp network area

**Interface:** `wan` · **Device:** `vtnet0` · **Address / gateway:** `DHCP (runtime address last recorded as 192.168.178.71)`

## Why this network exists

The firewall's connection toward the upstream home router.

## What is connected here?

[Upstream Proxmox management](/reference/explore/systems/NOVA-PROX01/) is in the outer network, not the MGMT VLAN.

## Firewall rules on this interface

1. [Rule 1785021391](/reference/explore/network/rules/1785021391/)

The WAN pass rule allows WireGuard UDP 51820 to the pfSense WAN address.

## DHCP / address assignment

WAN obtains its own address using upstream DHCP; no pfSense LAN-style DHCP scope.

## Follow a related path

[See the rules in order](/reference/explore/network/RULES/) · [pfSense](/reference/explore/systems/NOVA-FW01/) · [Network overview](/reference/explore/NETWORK/) · [Tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](/reference/explore/NETWORK/)