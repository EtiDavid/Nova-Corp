# Nova Corp — Current Architecture

**Validated current state:** 21 November 2026  
**Scope:** Phase 2 closure / pre-CR-016

This page is the public text version of the current architecture. The interactive SVG is a separate design step and will be added later.

## Core systems

| System | Current identity | Address / zone | Role |
| --- | --- | --- | --- |
| pfSense firewall VM | `nova-fw01` | WAN `192.168.178.71` + internal gateways | Firewall, routing, DNS Resolver, WireGuard |
| pfSense OS | `pfSense.home.arpa` | same appliance | OS identity |
| Proxmox | `nova-prox01.nova.local` | `192.168.178.26/24` | Nested hypervisor |
| Domain Controller 1 | `NOVA-DC01.nova.corp` | `10.10.20.10/24` | AD DS, DNS |
| Domain Controller 2 | `NOVA-DC02.nova.corp` | `10.10.20.11/24` | AD DS, DNS, resilience / FSMO |
| File server | `NOVA-FILES01.nova.corp` | `10.10.20.20/24` | SMB, DFS, Shadow Copies, Windows Server Backup |
| Domain client | `NOVA-CLIENT.nova.corp` | `10.10.40.100/24` | User/workstation validation |

## Network zones

| Zone | Subnet | Gateway | Current purpose |
| --- | --- | --- | --- |
| Upstream host | `192.168.178.0/24` | `192.168.178.1` | Outer VMware/host network |
| Legacy LAN | `10.99.99.0/24` | `10.99.99.1` | Legacy / minimal current use |
| MGMT / VLAN 10 | `10.10.10.0/24` | `10.10.10.1` | Management zone |
| INFRA / VLAN 20 | `10.10.20.0/24` | `10.10.20.1` | Domain Controllers and file server |
| APP / VLAN 30 | `10.10.30.0/24` | `10.10.30.1` | Reserved for application services |
| CLIENT / VLAN 40 | `10.10.40.0/24` | `10.10.40.1` | Domain client/workstation |
| DMZ / VLAN 50 | `10.10.50.0/24` | `10.10.50.1` | Reserved for public-facing services |
| VPN_REMOTE / VLAN 60 | `10.10.60.0/24` | `10.10.60.1` | WireGuard peers |

## Simplified logical flow

```text
Windows host
  |
  +-- VMware Workstation
        |
        +-- Nested Proxmox
              |
              +-- pfSense
              |     |
              |     +-- VLAN 20 / INFRA
              |     |     +-- NOVA-DC01
              |     |     +-- NOVA-DC02
              |     |     +-- NOVA-FILES01
              |     |
              |     +-- VLAN 40 / CLIENT
              |     |     +-- NOVA-CLIENT
              |     |
              |     +-- VLAN 60 / VPN_REMOTE
              |
              +-- additional lab VMs
```

## Identity flow

```text
NOVA-CLIENT
   |
   +--> internal DNS
   |      +--> NOVA-DC01
   |      +--> NOVA-DC02
   |
   +--> Kerberos / LDAP / AD
          +--> NOVA-DC01
          +--> NOVA-DC02
```

Both Domain Controllers are writable and provide directory/DNS services.

CR-013 includes the stronger resilience proof: DC01 was taken offline in a controlled exercise and client/domain services continued through DC02.

## File-access flow

```text
User
  -> AD group membership
  -> department authorization groups
  -> SMB share permission
  -> NTFS permission
  -> NOVA-FILES01
```

DFS provides a domain-based namespace so users can use a logical path instead of depending on the server name directly.

## Recovery layers

```text
File change/deletion
  -> Shadow Copies when appropriate
  -> Windows Server Backup for independent file recovery

Directory object deletion
  -> AD Recycle Bin where appropriate

pfSense change failure
  -> configuration export / VM backup / known-good snapshot
```

## Important current limitations

- Proxmox is currently managed from the upstream host network, not yet from the final privileged-management design.
- External ordinary-user versus privileged-admin VPN isolation is a CR-016 task.
- Centralized monitoring/dashboarding is not yet implemented.
- The nested environment ultimately shares the outer physical-host failure domain.

The architecture page describes what exists now, not the final roadmap target.
