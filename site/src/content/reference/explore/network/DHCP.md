---
title: "DHCP — How Nova Corp computers receive IP addresses"
sourcePath: "docs/explore/network/DHCP.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/DHCP.md"
section: "explore"
---

# DHCP — How Nova Corp computers receive IP addresses

DHCP automatically offers an IP address to clients joining a network. Each enabled scope has a range from which addresses can be assigned.

Nova Corp's pfSense firewall has six enabled DHCP address pools:

| Network | Address pool |
| --- | --- |
| [LAN](/reference/explore/network/zones/LAN/) | `10.99.99.100–10.99.99.199` |
| [MGMT](/reference/explore/network/zones/MGMT/) | `10.10.10.100–10.10.10.199` |
| [INFRA](/reference/explore/network/zones/INFRA/) | `10.10.20.100–10.10.20.199` |
| [APP](/reference/explore/network/zones/APP/) | `10.10.30.100–10.10.30.199` |
| [CLIENT](/reference/explore/network/zones/CLIENT/) | `10.10.40.100–10.10.40.199` |
| [DMZ](/reference/explore/network/zones/DMZ/) | `10.10.50.100–10.10.50.199` |

WireGuard is configured separately; it does **not** have a traditional pfSense DHCP scope here.

The DHCP scope list is a configuration inventory. It does not establish that every pool currently has clients, and important servers use specific static addresses.

[Open the client workstation](/reference/explore/systems/NOVA-CLIENT/) · [Network zones](/reference/explore/NETWORK/) · [pfSense](/reference/explore/systems/NOVA-FW01/).

[← Network Gatehouse](/reference/explore/NETWORK/)