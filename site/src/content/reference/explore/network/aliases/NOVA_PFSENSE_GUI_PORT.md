---
title: "pfSense management web ports"
sourcePath: "docs/explore/network/aliases/NOVA_PFSENSE_GUI_PORT.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/aliases/NOVA_PFSENSE_GUI_PORT.md"
section: "explore"
---

# pfSense management web ports

**Exact alias:** `NOVA_PFSENSE_GUI_PORT` · **Type:** port

## Why it exists

The two TCP ports blocked from ordinary CLIENT traffic when the destination is the firewall itself.

## Actual members

- `80`
- `443`

## Which firewall rules use it?

- [Rule 1795199640](/reference/explore/network/rules/1795199640/)

## Follow related objects

[pfSense](/reference/explore/systems/NOVA-FW01/) and [CLIENT](/reference/explore/network/zones/CLIENT/).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](/reference/explore/network/ALIASES/) · [Firewall rules](/reference/explore/network/RULES/) · [Network](/reference/explore/NETWORK/)