---
title: "pfSense aliases — Reusable network objects"
sourcePath: "docs/explore/network/ALIASES.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/ALIASES.md"
section: "explore"
---

# pfSense aliases — Reusable network objects

An **alias** is a named list of hosts, networks or ports. Nova Corp's firewall uses five aliases:

| Alias | What it represents | Where it is used |
| --- | --- | --- |
| [`NOVA_DOMAIN_CONTROLLERS`](/reference/explore/network/aliases/NOVA_DOMAIN_CONTROLLERS/) | Domain Controller host list | 2 host entries |
| [`NOVA_AD_TCP_PORTS`](/reference/explore/network/aliases/NOVA_AD_TCP_PORTS/) | Approved Active Directory TCP services | 8 port entries |
| [`NOVA_AD_UDP_PORTS`](/reference/explore/network/aliases/NOVA_AD_UDP_PORTS/) | Approved Active Directory UDP services | 5 port entries |
| [`NOVA_PROTECTED_NETWORKS`](/reference/explore/network/aliases/NOVA_PROTECTED_NETWORKS/) | Networks remote VPN users cannot freely enter | 6 network entries |
| [`NOVA_PFSENSE_GUI_PORT`](/reference/explore/network/aliases/NOVA_PFSENSE_GUI_PORT/) | pfSense management web ports | 2 port entries |

Aliases make rules readable. For example, instead of separately listing two Domain Controller IP addresses in every VPN rule, the firewall uses **NOVA_DOMAIN_CONTROLLERS**.

**Follow a connection:** [WireGuard VPN](/reference/explore/services/WIREGUARD/) → [VPN_REMOTE](/reference/explore/network/zones/VPN_REMOTE/) → [AD TCP rule](/reference/explore/network/rules/1785002175/) → [NOVA_DOMAIN_CONTROLLERS](/reference/explore/network/aliases/NOVA_DOMAIN_CONTROLLERS/) → [DC01](/reference/explore/systems/NOVA-DC01/) / [DC02](/reference/explore/systems/NOVA-DC02/).

[← Network Gatehouse](/reference/explore/NETWORK/) · [All firewall rules](/reference/explore/network/RULES/)