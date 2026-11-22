# VPN_REMOTE — Nova Corp network area

**Interface:** `opt6` · **Device:** `tun_wg0 (WireGuard; NOT an 802.1Q VLAN)` · **Address / gateway:** `10.10.60.1/24`

## Why this network exists

Encrypted remote-access network for an external laptop.

## What is connected here?

[Zoë remote laptop](../../people/ZOE.md) was the test peer, allowed tunnel IP 10.10.60.10/32.

## Firewall rules on this interface

1. [Rule 1785000680](../rules/1785000680.md)
2. [Rule 1785002175](../rules/1785002175.md)
3. [Rule 1785019484](../rules/1785019484.md)
4. [Rule 1785019750](../rules/1785019750.md)
5. [Rule 1785020072](../rules/1785020072.md)
6. [Rule 1785020180](../rules/1785020180.md)

Four allow rules cover gateway ping and specific Domain Controller services; two blocks restrict other INFRA and protected networks.

## DHCP / address assignment

No pfSense DHCP scope. WireGuard peer addresses are configured separately.

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The firewall's rules define which connections may pass. The linked tests demonstrate how these settings behaved during real lab exercises.

[← Network Gatehouse](../../NETWORK.md)