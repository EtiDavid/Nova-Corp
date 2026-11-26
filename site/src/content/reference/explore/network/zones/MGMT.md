---
title: "MGMT — Nova Corp network area"
sourcePath: "docs/explore/network/zones/MGMT.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/zones/MGMT.md"
section: "explore"
---

# MGMT — Nova Corp network area

**Interface:** `opt1` · **Device:** `vtnet1.10 (VLAN 10)` · **Address / gateway:** `10.10.10.1/24`

## Why this network exists

Management network and firewall management interface.

## What is connected here?

[pfSense](/reference/explore/systems/NOVA-FW01/) has its gateway here. [Proxmox](/reference/explore/systems/NOVA-PROX01/) is still managed on the separate upstream host network.

## Firewall rules on this interface

1. [Rule 1782219128](/reference/explore/network/rules/1782219128/)
2. [Rule 1782218985](/reference/explore/network/rules/1782218985/)

Two broad pass rules exist on MGMT; the CLIENT side separately blocks traffic headed for MGMT. Full privileged management isolation remains upcoming work.

## DHCP / address assignment

10.10.10.100–10.10.10.199

## Follow a related path

[See the rules in order](/reference/explore/network/RULES/) · [pfSense](/reference/explore/systems/NOVA-FW01/) · [Network overview](/reference/explore/NETWORK/) · [Tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](/reference/explore/NETWORK/)