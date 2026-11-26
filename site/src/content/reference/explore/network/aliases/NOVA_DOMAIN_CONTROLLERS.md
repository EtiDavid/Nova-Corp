---
title: "Domain Controller host list"
sourcePath: "docs/explore/network/aliases/NOVA_DOMAIN_CONTROLLERS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/aliases/NOVA_DOMAIN_CONTROLLERS.md"
section: "explore"
---

# Domain Controller host list

**Exact alias:** `NOVA_DOMAIN_CONTROLLERS` · **Type:** host

## Why it exists

The DNS and Active Directory servers that remote clients are allowed to contact.

## Actual members

- `10.10.20.10`
- `10.10.20.11`

## Which firewall rules use it?

- [Rule 1785002175](/reference/explore/network/rules/1785002175/)
- [Rule 1785019484](/reference/explore/network/rules/1785019484/)
- [Rule 1785019750](/reference/explore/network/rules/1785019750/)

## Follow related objects

[DC01](/reference/explore/systems/NOVA-DC01/) and [DC02](/reference/explore/systems/NOVA-DC02/).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](/reference/explore/network/ALIASES/) · [Firewall rules](/reference/explore/network/RULES/) · [Network](/reference/explore/NETWORK/)