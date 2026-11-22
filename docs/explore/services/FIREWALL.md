# pfSense firewall — Who can reach which service?

A firewall checks traffic against ordered rules. When a Windows workstation connects to a server, that connection may cross the pfSense router and be allowed or blocked by the rules on its incoming network interface.

Nova Corp's firewall has **17 filter rules**: **13 allow and 4 block**.

## Start with the rules

**[Explore all 17 rules, in interface order](../network/RULES.md)**.

Each rule has a profile describing its source, destination, action, protocol, port, aliases, the reason it exists and its related evidence.

## What makes a rule work?

A rule contains an **interface**, **source**, **destination**, **service/port**, **action** and **position**. The first matching rule and pfSense's stateful handling determine whether the traffic is permitted.

The three CLIENT rules are a useful example:

1. [Block CLIENT access to the pfSense GUI ports](../network/rules/1795199640.md) (TCP 80 and 443).
2. [Block CLIENT access to the management network](../network/rules/1795195682.md).
3. [Allow other CLIENT IPv4 traffic](../network/rules/1782219813.md).

The first two are checked before the broader third rule.

## Remote-access rules

[VPN_REMOTE](../network/zones/VPN_REMOTE.md) allows selected DNS, Kerberos, LDAP, SMB and related Domain Controller ports, plus certain ICMP traffic. It then blocks access to unapproved INFRA and protected networks.

[Open the WireGuard connection](WIREGUARD.md) · [Open port and host aliases](../network/ALIASES.md).

## Seeing the rules in action

The listed rules describe how the firewall is configured. Nova Corp also tested that ordinary workstations cannot reach protected management paths, while DNS, Active Directory, file sharing and Internet access still work.

The presence of a separate VLAN doesn't, by itself, guarantee strict isolation. Some of our zones intentionally retain broad pass rules, and stronger privileged management isolation is future work.

[Read the management-hardening investigation](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).

[← Network Gatehouse](../NETWORK.md)