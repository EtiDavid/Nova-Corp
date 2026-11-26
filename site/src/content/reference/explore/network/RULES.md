---
title: "Every firewall rule at Nova Corp"
sourcePath: "docs/explore/network/RULES.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/RULES.md"
section: "explore"
---

# Every firewall rule at Nova Corp

Nova Corp's firewall has **17 explicit filter rules: 13 PASS and 4 BLOCK**. Select a rule to see its actual tracker ID, interface, order, source, destination, protocol, services and related lab evidence.

## How to read this page

Rules are shown in their saved **order on each incoming interface**. Earlier blocks may prevent traffic that a later broad pass would otherwise permit. pfSense is a stateful firewall; this list is a configuration view, not a live packet log.

**[Back to the network map](/reference/explore/NETWORK/)** · **[Open aliases](/reference/explore/network/ALIASES/)**

<a id="wan"></a>

## WAN — [open this network](/reference/explore/network/zones/WAN/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1785021391`](/reference/explore/network/rules/1785021391/) | UDP 51820 to WireGuard listener |

<a id="lan"></a>

## LAN — [open this network](/reference/explore/network/zones/LAN/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`0100000101`](/reference/explore/network/rules/0100000101/) | Default IPv4 allow to any |
| 2 | **PASS** | [`0100000102`](/reference/explore/network/rules/0100000102/) | Default IPv6 allow to any |

<a id="mgmt"></a>

## MGMT — [open this network](/reference/explore/network/zones/MGMT/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219128`](/reference/explore/network/rules/1782219128/) | Reach MGMT gateway interface |
| 2 | **PASS** | [`1782218985`](/reference/explore/network/rules/1782218985/) | MGMT subnet to any |

<a id="infra"></a>

## INFRA — [open this network](/reference/explore/network/zones/INFRA/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219676`](/reference/explore/network/rules/1782219676/) | INFRA subnet to any |

<a id="app"></a>

## APP — [open this network](/reference/explore/network/zones/APP/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219739`](/reference/explore/network/rules/1782219739/) | APP subnet to any |

<a id="client"></a>

## CLIENT — [open this network](/reference/explore/network/zones/CLIENT/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **BLOCK** | [`1795199640`](/reference/explore/network/rules/1795199640/) | CLIENT → pfSense GUI ports 80/443 |
| 2 | **BLOCK** | [`1795195682`](/reference/explore/network/rules/1795195682/) | CLIENT → MGMT network |
| 3 | **PASS** | [`1782219813`](/reference/explore/network/rules/1782219813/) | Other CLIENT IPv4 traffic |

<a id="dmz"></a>

## DMZ — [open this network](/reference/explore/network/zones/DMZ/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219839`](/reference/explore/network/rules/1782219839/) | DMZ subnet to any |

<a id="vpn_remote"></a>

## VPN_REMOTE — [open this network](/reference/explore/network/zones/VPN_REMOTE/)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1785000680`](/reference/explore/network/rules/1785000680/) | Ping VPN gateway |
| 2 | **PASS** | [`1785002175`](/reference/explore/network/rules/1785002175/) | Approved DC TCP services |
| 3 | **PASS** | [`1785019484`](/reference/explore/network/rules/1785019484/) | Approved DC UDP services |
| 4 | **PASS** | [`1785019750`](/reference/explore/network/rules/1785019750/) | Ping DC01/DC02 |
| 5 | **BLOCK** | [`1785020072`](/reference/explore/network/rules/1785020072/) | Unapproved INFRA traffic |
| 6 | **BLOCK** | [`1785020180`](/reference/explore/network/rules/1785020180/) | Protected network areas |

## What the rules show

**CLIENT security:** two explicit blocks prevent normal client access to pfSense's own web ports and the MGMT subnet, before the broader CLIENT allow. These rules connect to the CR-015 management-hardening tests.

**VPN limitation:** four explicit VPN allows make Domain Controller services reachable; two blocks deny other INFRA and protected destinations. The remote tunnel and peer are described in [WireGuard](/reference/explore/services/WIREGUARD/).

**Broader permit areas:** MGMT, INFRA, APP and DMZ still include permissive rules. Building a VLAN is useful isolation groundwork, but doesn't establish least-privilege access without suitable firewall restrictions.

**IPv6 note:** the legacy LAN still has an IPv6 allow rule saved, while IPv6 gateway entries are disabled. These are different configuration layers.

## Open the supporting services

[Aliases and their members](/reference/explore/network/ALIASES/) · [NAT and gateways](/reference/explore/network/NAT_AND_GATEWAYS/) · [DHCP pools](/reference/explore/network/DHCP/) · [pfSense profile](/reference/explore/systems/NOVA-FW01/).

## How the rules behave

The settings below describe explicit firewall rules. To see what actually happened when a connection was allowed or blocked, open the linked network and incident tests.

[Original firewall setup journal](/reference/Documentation/Change-Requests/Journal-CR-002/) · [VPN investigation](/reference/Documentation/Change-Requests/Journal-CR-007/) · [Final management-hardening work](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/).

[← Network Gatehouse](/reference/explore/NETWORK/)