# INFRA — Nova Corp network area

**Interface:** `opt2` · **Device:** `vtnet1.20 (VLAN 20)` · **Address / gateway:** `10.10.20.1/24` · **Verified configuration:** 22 November 2026.

## Why this network exists

Home of the company’s directory and file servers.

## What is connected here?

[DC01](../../systems/NOVA-DC01.md) — 10.10.20.10 · [DC02](../../systems/NOVA-DC02.md) — 10.10.20.11 · [FILES01](../../systems/NOVA-FILES01.md) — 10.10.20.20.

## Firewall rules on this interface

1. [Rule 1782219676](../rules/1782219676.md)

The explicit INFRA filter rule broadly permits IPv4 traffic originating on this interface; firewall-zone membership alone is not strong segmentation.

## DHCP / address assignment

10.10.20.100–10.10.20.199

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The exported settings describe the firewall configuration; they are not a substitute for observing actual packets and client behavior.

[← Network Gatehouse](../../NETWORK.md)