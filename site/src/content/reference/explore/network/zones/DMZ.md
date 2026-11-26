---
title: "DMZ — Nova Corp network area"
sourcePath: "docs/explore/network/zones/DMZ.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/zones/DMZ.md"
section: "explore"
---

# DMZ — Nova Corp network area

**Interface:** `opt5` · **Device:** `vtnet1.50 (VLAN 50)` · **Address / gateway:** `10.10.50.1/24`

## Why this network exists

Network reserved for externally exposed applications later in the project.

## What is connected here?

No public-facing DMZ server is confirmed as running in the Phase 2 inventory.

## Firewall rules on this interface

1. [Rule 1782219839](/reference/explore/network/rules/1782219839/)

The current IPv4 rule is a broad pass. Tighter DMZ restrictions have not yet been implemented.

## DHCP / address assignment

10.10.50.100–10.10.50.199

## Follow a related path

[See the rules in order](/reference/explore/network/RULES/) · [pfSense](/reference/explore/systems/NOVA-FW01/) · [Network overview](/reference/explore/NETWORK/) · [Tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](/reference/explore/NETWORK/)