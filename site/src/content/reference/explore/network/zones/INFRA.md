---
title: "INFRA — Nova Corp network area"
sourcePath: "docs/explore/network/zones/INFRA.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/zones/INFRA.md"
section: "explore"
---

# INFRA — Nova Corp network area

**Interface:** `opt2` · **Device:** `vtnet1.20 (VLAN 20)` · **Address / gateway:** `10.10.20.1/24`

## Why this network exists

Home of the company’s directory and file servers.

## What is connected here?

[DC01](/reference/explore/systems/NOVA-DC01/) — 10.10.20.10 · [DC02](/reference/explore/systems/NOVA-DC02/) — 10.10.20.11 · [FILES01](/reference/explore/systems/NOVA-FILES01/) — 10.10.20.20.

## Firewall rules on this interface

1. [Rule 1782219676](/reference/explore/network/rules/1782219676/)

The explicit INFRA filter rule broadly permits IPv4 traffic originating on this interface; firewall-zone membership alone is not strong segmentation.

## DHCP / address assignment

10.10.20.100–10.10.20.199

## Follow a related path

[See the rules in order](/reference/explore/network/RULES/) · [pfSense](/reference/explore/systems/NOVA-FW01/) · [Network overview](/reference/explore/NETWORK/) · [Tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](/reference/explore/NETWORK/)