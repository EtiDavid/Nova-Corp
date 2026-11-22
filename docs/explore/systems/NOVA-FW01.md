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

**[Open all eight interfaces and network zones](../NETWORK.md)** · [Every rule](../network/RULES.md) · [All aliases](../network/ALIASES.md) · [NAT/gateways](../network/NAT_AND_GATEWAYS.md)

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
| VLAN interfaces and routing | [Network map](../NETWORK.md) |
| Stateful firewall / rule ordering | [All 17 individual firewall rules](../network/RULES.md) |
| DNS Resolver | [DNS](../services/DNS.md) |
| Remote access | [WireGuard](../services/WIREGUARD.md) |
| Snapshot, VM backup, configuration recovery | [Recovery](../services/BACKUPS.md) |
| Address assignment | [Six DHCP scopes](../network/DHCP.md) |
| Rule aliases | [Five named alias objects](../network/ALIASES.md) |
| NAT and routing | [Automatic outbound NAT and gateways](../network/NAT_AND_GATEWAYS.md) |

## Failure and improvement

During final validation, a normal client could reach pfSense management paths more broadly than intended. The configuration was corrected and the original management reachability re-tested. DNS, AD, SMB and Internet traffic were checked afterward to ensure the fix had not broken required services.

[Read the management exposure story](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)

The dedicated privileged-admin VPN and full management-plane isolation remain the next security gate.

## Original engineering records

[pfSense setup](../../Documentation/Change-Requests/Journal-CR-002.md) · [WireGuard and packet-troubleshooting journal](../../Documentation/Change-Requests/Journal-CR-007.md)

[← All systems](../SYSTEMS.md)