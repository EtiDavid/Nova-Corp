# Approved Active Directory TCP services

**Exact alias:** `NOVA_AD_TCP_PORTS` · **Type:** port · **Source:** pfSense configuration, 22 November 2026.

## Why it exists

Selected TCP services required for domain work, including DNS, Kerberos, LDAP, SMB, Global Catalog and dynamic RPC.

## Actual members

- `53`
- `88`
- `135`
- `389`
- `445`
- `464`
- `3268`
- `49152:65535`

## Which firewall rules use it?

- [Rule 1785002175](../rules/1785002175.md)

## Follow related objects

[AD DS](../../services/ACTIVE_DIRECTORY.md), [Kerberos](../../services/KERBEROS.md), [SMB](../../services/SMB.md).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](../ALIASES.md) · [Firewall rules](../RULES.md) · [Network](../../NETWORK.md)