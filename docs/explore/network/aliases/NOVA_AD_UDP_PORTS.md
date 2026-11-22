# Approved Active Directory UDP services

**Exact alias:** `NOVA_AD_UDP_PORTS` · **Type:** port

## Why it exists

Selected UDP services for DNS, Kerberos, NTP, LDAP and password operations.

## Actual members

- `53`
- `88`
- `123`
- `389`
- `464`

## Which firewall rules use it?

- [Rule 1785019484](../rules/1785019484.md)

## Follow related objects

[DNS](../../services/DNS.md) and [Kerberos](../../services/KERBEROS.md).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](../ALIASES.md) · [Firewall rules](../RULES.md) · [Network](../../NETWORK.md)