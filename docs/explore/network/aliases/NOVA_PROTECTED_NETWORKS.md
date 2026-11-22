# Networks remote VPN users cannot freely enter

**Exact alias:** `NOVA_PROTECTED_NETWORKS` · **Type:** network

## Why it exists

A group of protected destinations, including management, application, employee, DMZ, legacy LAN and upstream host networks.

## Actual members

- `10.10.10.0/24`
- `10.10.30.0/24`
- `10.10.40.0/24`
- `10.10.50.0/24`
- `10.99.99.0/24`
- `192.168.178.0/24`

## Which firewall rules use it?

- [Rule 1785020180](../rules/1785020180.md)

## Follow related objects

[MGMT](../zones/MGMT.md), [APP](../zones/APP.md), [CLIENT](../zones/CLIENT.md), [DMZ](../zones/DMZ.md), [LAN](../zones/LAN.md), [WAN](../zones/WAN.md).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](../ALIASES.md) · [Firewall rules](../RULES.md) · [Network](../../NETWORK.md)