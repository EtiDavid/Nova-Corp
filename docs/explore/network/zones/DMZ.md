# DMZ — Nova Corp network area

**Interface:** `opt5` · **Device:** `vtnet1.50 (VLAN 50)` · **Address / gateway:** `10.10.50.1/24` · **Verified configuration:** 22 November 2026.

## Why this network exists

Network reserved for externally exposed applications later in the project.

## What is connected here?

No public-facing DMZ server is confirmed as running in the Phase 2 inventory.

## Firewall rules on this interface

1. [Rule 1782219839](../rules/1782219839.md)

The exported explicit IPv4 rule is a broad pass; stronger DMZ restrictions are not yet implemented.

## DHCP / address assignment

10.10.50.100–10.10.50.199

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The exported settings describe the firewall configuration; they are not a substitute for observing actual packets and client behavior.

[← Network Gatehouse](../../NETWORK.md)