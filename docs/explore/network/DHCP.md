# DHCP — How Nova Corp computers receive IP addresses

DHCP automatically offers an IP address to clients joining a network. Each enabled scope has a range from which addresses can be assigned.

Nova Corp's pfSense firewall has six enabled DHCP address pools:

| Network | Address pool |
| --- | --- |
| [LAN](zones/LAN.md) | `10.99.99.100–10.99.99.199` |
| [MGMT](zones/MGMT.md) | `10.10.10.100–10.10.10.199` |
| [INFRA](zones/INFRA.md) | `10.10.20.100–10.10.20.199` |
| [APP](zones/APP.md) | `10.10.30.100–10.10.30.199` |
| [CLIENT](zones/CLIENT.md) | `10.10.40.100–10.10.40.199` |
| [DMZ](zones/DMZ.md) | `10.10.50.100–10.10.50.199` |

WireGuard is configured separately; it does **not** have a traditional pfSense DHCP scope here.

The DHCP scope list is a configuration inventory. It does not establish that every pool currently has clients, and important servers use specific static addresses.

[Open the client workstation](../systems/NOVA-CLIENT.md) · [Network zones](../NETWORK.md) · [pfSense](../systems/NOVA-FW01.md).

[← Network Gatehouse](../NETWORK.md)