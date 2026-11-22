# APP — Nova Corp network area

**Interface:** `opt3` · **Device:** `vtnet1.30 (VLAN 30)` · **Address / gateway:** `10.10.30.1/24`

## Why this network exists

Network reserved for application workloads.

## What is connected here?

No application server has been confirmed as deployed in this area in the Phase 2 inventory.

## Firewall rules on this interface

1. [Rule 1782219739](../rules/1782219739.md)

An IPv4 pass-to-any rule is configured even though the zone is not yet populated.

## DHCP / address assignment

10.10.30.100–10.10.30.199

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](../../NETWORK.md)