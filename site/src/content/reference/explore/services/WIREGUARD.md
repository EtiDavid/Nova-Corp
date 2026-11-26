---
title: "WireGuard — Remote access to Nova Corp"
sourcePath: "docs/explore/services/WIREGUARD.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/services/WIREGUARD.md"
section: "explore"
---

# WireGuard — Remote access to Nova Corp

## What it does

WireGuard creates an encrypted network tunnel between a remote client and Nova Corp's pfSense firewall.

The tunnel does not automatically give the user permission to reach everything.

## How a connection reaches the lab

```text
Remote laptop
   → home/Internet path
   → outer router port forwarding
   → pfSense WAN rule
   → WireGuard peer authentication
   → VPN_REMOTE firewall policy
   → approved internal destination
```

[Meet the remote laptop test participant](/reference/explore/people/ZOE/).

## Actual WireGuard configuration — 22 November 2026

pfSense runs one **enabled** tunnel and one **enabled** peer.

| Component | Recorded configuration |
| --- | --- |
| Tunnel | `tun_wg0` |
| Description | `NOVA-REMOTE-ACCESS` |
| Listening protocol/port | UDP `51820` |
| MTU | `1440` |
| Remote peer | Zoë laptop |
| Peer tunnel IP | `10.10.60.10/32` |
| pfSense gateway | `10.10.60.1/24` |

The [WAN rule](/reference/explore/network/rules/1785021391/) allows incoming WireGuard UDP packets. Inside the tunnel, [VPN_REMOTE](/reference/explore/network/zones/VPN_REMOTE/) has six filter rules: four allow selected gateway/DC traffic and two block unapproved networks.

[Inspect the approved TCP services](/reference/explore/network/aliases/NOVA_AD_TCP_PORTS/) · [UDP services](/reference/explore/network/aliases/NOVA_AD_UDP_PORTS/) · [Protected networks](/reference/explore/network/aliases/NOVA_PROTECTED_NETWORKS/).

## What Nova Corp tested

During the initial attempt, UDP packets reached pfSense but the VPN did not respond. Packet capture and rule counters helped isolate the problem to the WireGuard peer configuration, rather than routing or port forwarding. Recreating the client key pair and correcting the peer entry resolved the failure.

After the repair, approved internal DNS, Kerberos, LDAP and SMB paths were checked along with denied management paths under the tested scope.

## What comes next

A separate privileged-admin VPN and stronger management-plane isolation are the next security milestone; they are not part of the already completed remote-access setup.

[Network and firewall](/reference/explore/NETWORK/) · [pfSense](/reference/explore/systems/NOVA-FW01/) · [Full VPN engineering journal](/reference/Documentation/Change-Requests/Journal-CR-007/).