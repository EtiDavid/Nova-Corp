---
title: "nova-fw01 — pfSense Firewall"
sourcePath: "docs/explore/systems/NOVA-FW01.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/systems/NOVA-FW01.md"
section: "explore"
---

# nova-fw01 — pfSense Firewall

**Role:** Network gateway, traffic filtering and WireGuard VPN · **Platform:** Proxmox VM 100

## Why it exists

The firewall decides which network areas can communicate. The goal is to let employee workstations reach necessary company services without automatically giving them access to infrastructure management pages.

## Identity and current network

- VM asset name: `nova-fw01`
- pfSense operating-system name: `pfSense.home.arpa`
- Platform: pfSense CE 2.8.1 at the Phase 2 baseline
- WAN: `192.168.178.71`
- MGMT gateway: `10.10.10.1`
- INFRA gateway: `10.10.20.1`
- CLIENT gateway: `10.10.40.1`
- VPN_REMOTE gateway: `10.10.60.1`

**[Open all eight interfaces and network zones](/reference/explore/NETWORK/)** · [Every rule](/reference/explore/network/RULES/) · [All aliases](/reference/explore/network/ALIASES/) · [NAT/gateways](/reference/explore/network/NAT_AND_GATEWAYS/)

## Verified configuration snapshot — 22 November 2026

The actual exported pfSense configuration records **eight interfaces**, **five VLANs**, **17 filter rules (13 pass, four block)**, **five aliases**, **six DHCP scopes**, **automatic outbound NAT** and **one active WireGuard tunnel with one configured peer**.

- pfSense hostname: `pfSense.home.arpa`.
- Web interface protocol: **HTTPS**.
- WAN interface: `vtnet0`, DHCP (historical runtime address `192.168.178.71`).
- Internal ports: LAN `vtnet1`, VLAN interfaces `vtnet1.10` through `vtnet1.50`.
- Remote VPN: `tun_wg0` with gateway `10.10.60.1`, **not an 802.1Q VLAN**.
- DNS Resolver: enabled; `nova.corp` forwarded to DC01 (`10.10.20.10`).
- Configured pfSense port-forward NAT rules: **none**. Port forwarding on the upstream router is a separate configuration.

## What it does

| Feature | Open |
| --- | --- |
| VLAN interfaces and routing | [Network map](/reference/explore/NETWORK/) |
| Stateful firewall / rule ordering | [All 17 individual firewall rules](/reference/explore/network/RULES/) |
| DNS Resolver | [DNS](/reference/explore/services/DNS/) |
| Remote access | [WireGuard](/reference/explore/services/WIREGUARD/) |
| Snapshot, VM backup, configuration recovery | [Recovery](/reference/explore/services/BACKUPS/) |
| Address assignment | [Six DHCP scopes](/reference/explore/network/DHCP/) |
| Rule aliases | [Five named alias objects](/reference/explore/network/ALIASES/) |
| NAT and routing | [Automatic outbound NAT and gateways](/reference/explore/network/NAT_AND_GATEWAYS/) |

## Failure and improvement

During final validation, a normal client could reach pfSense management paths more broadly than intended. The configuration was corrected and the original management reachability re-tested. DNS, AD, SMB and Internet traffic were checked afterward to ensure the fix had not broken required services.

[Read the management exposure story](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/)

The dedicated privileged-admin VPN and full management-plane isolation remain the next security gate.

## Original engineering records

[pfSense setup](/reference/Documentation/Change-Requests/Journal-CR-002/) · [WireGuard and packet-troubleshooting journal](/reference/Documentation/Change-Requests/Journal-CR-007/)

[← All systems](/reference/explore/SYSTEMS/)