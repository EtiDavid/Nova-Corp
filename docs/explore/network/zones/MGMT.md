# MGMT — Nova Corp network area

**Interface:** `opt1` · **Device:** `vtnet1.10 (VLAN 10)` · **Address / gateway:** `10.10.10.1/24` · **Verified configuration:** 22 November 2026.

## Why this network exists

Management network and firewall management interface.

## What is connected here?

[pfSense](../../systems/NOVA-FW01.md) has its gateway here. [Proxmox](../../systems/NOVA-PROX01.md) is still managed on the separate upstream host network.

## Firewall rules on this interface

1. [Rule 1782219128](../rules/1782219128.md)
2. [Rule 1782218985](../rules/1782218985.md)

Two broad pass rules exist on MGMT; the CLIENT side separately blocks traffic headed for MGMT. Full privileged management isolation remains upcoming work.

## DHCP / address assignment

10.10.10.100–10.10.10.199

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The exported settings describe the firewall configuration; they are not a substitute for observing actual packets and client behavior.

[← Network Gatehouse](../../NETWORK.md)