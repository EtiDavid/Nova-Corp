# pfSense aliases — Reusable network objects

An **alias** is a named list of hosts, networks or ports. Nova Corp's firewall uses five aliases:

| Alias | What it represents | Where it is used |
| --- | --- | --- |
| [`NOVA_DOMAIN_CONTROLLERS`](aliases/NOVA_DOMAIN_CONTROLLERS.md) | Domain Controller host list | 2 host entries |
| [`NOVA_AD_TCP_PORTS`](aliases/NOVA_AD_TCP_PORTS.md) | Approved Active Directory TCP services | 8 port entries |
| [`NOVA_AD_UDP_PORTS`](aliases/NOVA_AD_UDP_PORTS.md) | Approved Active Directory UDP services | 5 port entries |
| [`NOVA_PROTECTED_NETWORKS`](aliases/NOVA_PROTECTED_NETWORKS.md) | Networks remote VPN users cannot freely enter | 6 network entries |
| [`NOVA_PFSENSE_GUI_PORT`](aliases/NOVA_PFSENSE_GUI_PORT.md) | pfSense management web ports | 2 port entries |

Aliases make rules readable. For example, instead of separately listing two Domain Controller IP addresses in every VPN rule, the firewall uses **NOVA_DOMAIN_CONTROLLERS**.

**Follow a connection:** [WireGuard VPN](../services/WIREGUARD.md) → [VPN_REMOTE](zones/VPN_REMOTE.md) → [AD TCP rule](rules/1785002175.md) → [NOVA_DOMAIN_CONTROLLERS](aliases/NOVA_DOMAIN_CONTROLLERS.md) → [DC01](../systems/NOVA-DC01.md) / [DC02](../systems/NOVA-DC02.md).

[← Network Gatehouse](../NETWORK.md) · [All firewall rules](RULES.md)