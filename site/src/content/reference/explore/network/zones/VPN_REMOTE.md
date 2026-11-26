---
title: "VPN_REMOTE — Nova Corp network area"
sourcePath: "docs/explore/network/zones/VPN_REMOTE.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/zones/VPN_REMOTE.md"
section: "explore"
---

# VPN_REMOTE — Nova Corp network area

**Interface:** `opt6` · **Device:** `tun_wg0 (WireGuard; NOT an 802.1Q VLAN)` · **Address / gateway:** `10.10.60.1/24`

## Why this network exists

Encrypted remote-access network for an external laptop.

## What is connected here?

[Zoë remote laptop](/reference/explore/people/ZOE/) was the test peer, allowed tunnel IP 10.10.60.10/32.

## Firewall rules on this interface

1. [Rule 1785000680](/reference/explore/network/rules/1785000680/)
2. [Rule 1785002175](/reference/explore/network/rules/1785002175/)
3. [Rule 1785019484](/reference/explore/network/rules/1785019484/)
4. [Rule 1785019750](/reference/explore/network/rules/1785019750/)
5. [Rule 1785020072](/reference/explore/network/rules/1785020072/)
6. [Rule 1785020180](/reference/explore/network/rules/1785020180/)

Four allow rules cover gateway ping and specific Domain Controller services; two blocks restrict other INFRA and protected networks.

## DHCP / address assignment

No pfSense DHCP scope. WireGuard peer addresses are configured separately.

## Follow a related path

[See the rules in order](/reference/explore/network/RULES/) · [pfSense](/reference/explore/systems/NOVA-FW01/) · [Network overview](/reference/explore/NETWORK/) · [Tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](/reference/explore/NETWORK/)