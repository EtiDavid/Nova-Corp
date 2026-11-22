# Every firewall rule at Nova Corp

Nova Corp's firewall has **17 explicit filter rules: 13 PASS and 4 BLOCK**. Select a rule to see its actual tracker ID, interface, order, source, destination, protocol, services and related lab evidence.

## How to read this page

Rules are shown in their saved **order on each incoming interface**. Earlier blocks may prevent traffic that a later broad pass would otherwise permit. pfSense is a stateful firewall; this list is a configuration view, not a live packet log.

**[Back to the network map](../NETWORK.md)** · **[Open aliases](ALIASES.md)**

<a id="wan"></a>

## WAN — [open this network](zones/WAN.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1785021391`](rules/1785021391.md) | UDP 51820 to WireGuard listener |

<a id="lan"></a>

## LAN — [open this network](zones/LAN.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`0100000101`](rules/0100000101.md) | Default IPv4 allow to any |
| 2 | **PASS** | [`0100000102`](rules/0100000102.md) | Default IPv6 allow to any |

<a id="mgmt"></a>

## MGMT — [open this network](zones/MGMT.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219128`](rules/1782219128.md) | Reach MGMT gateway interface |
| 2 | **PASS** | [`1782218985`](rules/1782218985.md) | MGMT subnet to any |

<a id="infra"></a>

## INFRA — [open this network](zones/INFRA.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219676`](rules/1782219676.md) | INFRA subnet to any |

<a id="app"></a>

## APP — [open this network](zones/APP.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219739`](rules/1782219739.md) | APP subnet to any |

<a id="client"></a>

## CLIENT — [open this network](zones/CLIENT.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **BLOCK** | [`1795199640`](rules/1795199640.md) | CLIENT → pfSense GUI ports 80/443 |
| 2 | **BLOCK** | [`1795195682`](rules/1795195682.md) | CLIENT → MGMT network |
| 3 | **PASS** | [`1782219813`](rules/1782219813.md) | Other CLIENT IPv4 traffic |

<a id="dmz"></a>

## DMZ — [open this network](zones/DMZ.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1782219839`](rules/1782219839.md) | DMZ subnet to any |

<a id="vpn_remote"></a>

## VPN_REMOTE — [open this network](zones/VPN_REMOTE.md)

| Priority | Action | Rule | What it does |
| ---: | --- | --- | --- |
| 1 | **PASS** | [`1785000680`](rules/1785000680.md) | Ping VPN gateway |
| 2 | **PASS** | [`1785002175`](rules/1785002175.md) | Approved DC TCP services |
| 3 | **PASS** | [`1785019484`](rules/1785019484.md) | Approved DC UDP services |
| 4 | **PASS** | [`1785019750`](rules/1785019750.md) | Ping DC01/DC02 |
| 5 | **BLOCK** | [`1785020072`](rules/1785020072.md) | Unapproved INFRA traffic |
| 6 | **BLOCK** | [`1785020180`](rules/1785020180.md) | Protected network areas |

## What the rules show

**CLIENT security:** two explicit blocks prevent normal client access to pfSense's own web ports and the MGMT subnet, before the broader CLIENT allow. These rules connect to the CR-015 management-hardening tests.

**VPN limitation:** four explicit VPN allows make Domain Controller services reachable; two blocks deny other INFRA and protected destinations. The remote tunnel and peer are described in [WireGuard](../services/WIREGUARD.md).

**Broader permit areas:** MGMT, INFRA, APP and DMZ still include permissive rules. Building a VLAN is useful isolation groundwork, but doesn't establish least-privilege access without suitable firewall restrictions.

**IPv6 note:** the legacy LAN still has an IPv6 allow rule saved, while IPv6 gateway entries are disabled. These are different configuration layers.

## Open the supporting services

[Aliases and their members](ALIASES.md) · [NAT and gateways](NAT_AND_GATEWAYS.md) · [DHCP pools](DHCP.md) · [pfSense profile](../systems/NOVA-FW01.md).

## How the rules behave

The settings below describe explicit firewall rules. To see what actually happened when a connection was allowed or blocked, open the linked network and incident tests.

[Original firewall setup journal](../../Documentation/Change-Requests/Journal-CR-002.md) · [VPN investigation](../../Documentation/Change-Requests/Journal-CR-007.md) · [Final management-hardening work](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).

[← Network Gatehouse](../NETWORK.md)