# LAN — Nova Corp network area

**Interface:** `lan` · **Device:** `vtnet1` · **Address / gateway:** `10.99.99.1/24`

## Why this network exists

The older untagged internal LAN segment.

## What is connected here?

This is a configured legacy network, distinct from the newer labeled VLANs.

## Firewall rules on this interface

1. [Rule 0100000101](../rules/0100000101.md)
2. [Rule 0100000102](../rules/0100000102.md)

Two broad default allow rules remain: one IPv4, one IPv6. The presence of the IPv6 rule does not prove IPv6 routing is working.

## DHCP / address assignment

10.99.99.100–10.99.99.199

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](../../NETWORK.md)