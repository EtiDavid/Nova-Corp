# pfSense management web ports

**Exact alias:** `NOVA_PFSENSE_GUI_PORT` · **Type:** port

## Why it exists

The two TCP ports blocked from ordinary CLIENT traffic when the destination is the firewall itself.

## Actual members

- `80`
- `443`

## Which firewall rules use it?

- [Rule 1795199640](../rules/1795199640.md)

## Follow related objects

[pfSense](../../systems/NOVA-FW01.md) and [CLIENT](../zones/CLIENT.md).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](../ALIASES.md) · [Firewall rules](../RULES.md) · [Network](../../NETWORK.md)