# Domain Controller host list

**Exact alias:** `NOVA_DOMAIN_CONTROLLERS` · **Type:** host

## Why it exists

The DNS and Active Directory servers that remote clients are allowed to contact.

## Actual members

- `10.10.20.10`
- `10.10.20.11`

## Which firewall rules use it?

- [Rule 1785002175](../rules/1785002175.md)
- [Rule 1785019484](../rules/1785019484.md)
- [Rule 1785019750](../rules/1785019750.md)

## Follow related objects

[DC01](../../systems/NOVA-DC01.md) and [DC02](../../systems/NOVA-DC02.md).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](../ALIASES.md) · [Firewall rules](../RULES.md) · [Network](../../NETWORK.md)