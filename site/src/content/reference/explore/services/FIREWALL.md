---
title: "pfSense firewall — Who can reach which service?"
sourcePath: "docs/explore/services/FIREWALL.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/services/FIREWALL.md"
section: "explore"
---

# pfSense firewall — Who can reach which service?

A firewall checks traffic against ordered rules. When a Windows workstation connects to a server, that connection may cross the pfSense router and be allowed or blocked by the rules on its incoming network interface.

Nova Corp's firewall has **17 filter rules**: **13 allow and 4 block**.

## Start with the rules

**[Explore all 17 rules, in interface order](/reference/explore/network/RULES/)**.

Each rule has a profile describing its source, destination, action, protocol, port, aliases, the reason it exists and its related evidence.

## What makes a rule work?

A rule contains an **interface**, **source**, **destination**, **service/port**, **action** and **position**. The first matching rule and pfSense's stateful handling determine whether the traffic is permitted.

The three CLIENT rules are a useful example:

1. [Block CLIENT access to the pfSense GUI ports](/reference/explore/network/rules/1795199640/) (TCP 80 and 443).
2. [Block CLIENT access to the management network](/reference/explore/network/rules/1795195682/).
3. [Allow other CLIENT IPv4 traffic](/reference/explore/network/rules/1782219813/).

The first two are checked before the broader third rule.

## Remote-access rules

[VPN_REMOTE](/reference/explore/network/zones/VPN_REMOTE/) allows selected DNS, Kerberos, LDAP, SMB and related Domain Controller ports, plus certain ICMP traffic. It then blocks access to unapproved INFRA and protected networks.

[Open the WireGuard connection](/reference/explore/services/WIREGUARD/) · [Open port and host aliases](/reference/explore/network/ALIASES/).

## Seeing the rules in action

The listed rules describe how the firewall is configured. Nova Corp also tested that ordinary workstations cannot reach protected management paths, while DNS, Active Directory, file sharing and Internet access still work.

The presence of a separate VLAN doesn't, by itself, guarantee strict isolation. Some of our zones intentionally retain broad pass rules, and stronger privileged management isolation is future work.

[Read the management-hardening investigation](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/).

[← Network Gatehouse](/reference/explore/NETWORK/)