---
title: "CLIENT — Nova Corp network area"
sourcePath: "docs/explore/network/zones/CLIENT.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/zones/CLIENT.md"
section: "explore"
---

# CLIENT — Nova Corp network area

**Interface:** `opt4` · **Device:** `vtnet1.40 (VLAN 40)` · **Address / gateway:** `10.10.40.1/24`

## Why this network exists

Windows employee workstations and user-facing tests.

## What is connected here?

[NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/) — 10.10.40.100.

## Firewall rules on this interface

1. [Rule 1795199640](/reference/explore/network/rules/1795199640/)
2. [Rule 1795195682](/reference/explore/network/rules/1795195682/)
3. [Rule 1782219813](/reference/explore/network/rules/1782219813/)

Two security blocks appear first (pfSense web ports and MGMT network). A broad allow rule follows. CR-015 tested management denial and normal DNS/AD/SMB/Internet access.

## DHCP / address assignment

10.10.40.100–10.10.40.199

## Follow a related path

[See the rules in order](/reference/explore/network/RULES/) · [pfSense](/reference/explore/systems/NOVA-FW01/) · [Network overview](/reference/explore/NETWORK/) · [Tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](/reference/explore/NETWORK/)