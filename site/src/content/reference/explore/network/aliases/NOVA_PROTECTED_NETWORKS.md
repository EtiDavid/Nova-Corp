---
title: "Networks remote VPN users cannot freely enter"
sourcePath: "docs/explore/network/aliases/NOVA_PROTECTED_NETWORKS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/aliases/NOVA_PROTECTED_NETWORKS.md"
section: "explore"
---

# Networks remote VPN users cannot freely enter

**Exact alias:** `NOVA_PROTECTED_NETWORKS` · **Type:** network

## Why it exists

A group of protected destinations, including management, application, employee, DMZ, legacy LAN and upstream host networks.

## Actual members

- `10.10.10.0/24`
- `10.10.30.0/24`
- `10.10.40.0/24`
- `10.10.50.0/24`
- `10.99.99.0/24`
- `192.168.178.0/24`

## Which firewall rules use it?

- [Rule 1785020180](/reference/explore/network/rules/1785020180/)

## Follow related objects

[MGMT](/reference/explore/network/zones/MGMT/), [APP](/reference/explore/network/zones/APP/), [CLIENT](/reference/explore/network/zones/CLIENT/), [DMZ](/reference/explore/network/zones/DMZ/), [LAN](/reference/explore/network/zones/LAN/), [WAN](/reference/explore/network/zones/WAN/).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](/reference/explore/network/ALIASES/) · [Firewall rules](/reference/explore/network/RULES/) · [Network](/reference/explore/NETWORK/)