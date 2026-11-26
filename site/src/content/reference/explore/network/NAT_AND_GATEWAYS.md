---
title: "NAT and gateways — Leaving the Nova Corp network"
sourcePath: "docs/explore/network/NAT_AND_GATEWAYS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/NAT_AND_GATEWAYS.md"
section: "explore"
---

# NAT and gateways — Leaving the Nova Corp network

A **gateway** forwards traffic from one network to another. **Network Address Translation (NAT)** rewrites addresses for certain network connections, such as traffic leaving toward the wider internet.

## Network gateways

| Gateway entry | Status | What it is |
| --- | --- | --- |
| `WAN_DHCP` | Enabled | Dynamic IPv4 gateway on WAN |
| `WAN_DHCP6` | Disabled | IPv6 gateway |
| `LAN_DHCP6` | Disabled | IPv6 gateway |

The current WAN address is obtained using DHCP. Its WAN address can change; the last observed address was `192.168.178.71`.

## NAT configuration

Outbound NAT mode is **Automatic**. There are **no manually configured outbound NAT entries** and **no pfSense port-forward entries** in pfSense.

The remote-access setup also used port forwarding on the **upstream home router**. An upstream router forwarding rule is not expected to appear as a local pfSense NAT rule.

## Follow a route

[NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/) → [CLIENT](/reference/explore/network/zones/CLIENT/) → [pfSense](/reference/explore/systems/NOVA-FW01/) → [WAN](/reference/explore/network/zones/WAN/) → upstream router.

[Remote WireGuard](/reference/explore/services/WIREGUARD/) → [WAN firewall rule](/reference/explore/network/rules/1785021391/) → [VPN_REMOTE](/reference/explore/network/zones/VPN_REMOTE/).

[← Network Gatehouse](/reference/explore/NETWORK/)