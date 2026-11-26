---
title: "Approved Active Directory TCP services"
sourcePath: "docs/explore/network/aliases/NOVA_AD_TCP_PORTS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/aliases/NOVA_AD_TCP_PORTS.md"
section: "explore"
---

# Approved Active Directory TCP services

**Exact alias:** `NOVA_AD_TCP_PORTS` · **Type:** port

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

- [Rule 1785002175](/reference/explore/network/rules/1785002175/)

## Follow related objects

[AD DS](/reference/explore/services/ACTIVE_DIRECTORY/), [Kerberos](/reference/explore/services/KERBEROS/), [SMB](/reference/explore/services/SMB/).

An alias groups addresses, subnets or ports. **It does not, by itself, allow traffic**; an actual firewall rule must reference it.

[← All five aliases](/reference/explore/network/ALIASES/) · [Firewall rules](/reference/explore/network/RULES/) · [Network](/reference/explore/NETWORK/)