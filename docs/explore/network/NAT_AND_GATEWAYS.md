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

[NOVA-CLIENT](../systems/NOVA-CLIENT.md) → [CLIENT](zones/CLIENT.md) → [pfSense](../systems/NOVA-FW01.md) → [WAN](zones/WAN.md) → upstream router.

[Remote WireGuard](../services/WIREGUARD.md) → [WAN firewall rule](rules/1785021391.md) → [VPN_REMOTE](zones/VPN_REMOTE.md).

[← Network Gatehouse](../NETWORK.md)