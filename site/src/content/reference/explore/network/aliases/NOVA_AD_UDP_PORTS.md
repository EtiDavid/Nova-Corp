---
title: "Approved Active Directory UDP services"
sourcePath: "docs/explore/network/aliases/NOVA_AD_UDP_PORTS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/aliases/NOVA_AD_UDP_PORTS.md"
section: "explore"
---

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

- [Rule 1785019484](/reference/explore/network/rules/1785019484/)

## Follow related objects

[DNS](/reference/explore/services/DNS/) and [Kerberos](/reference/explore/services/KERBEROS/).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](/reference/explore/network/ALIASES/) · [Firewall rules](/reference/explore/network/RULES/) · [Network](/reference/explore/NETWORK/)