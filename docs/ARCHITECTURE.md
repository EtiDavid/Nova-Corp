# How Nova Corp fits together

Nova Corp runs as a nested lab: a Windows host runs VMware Workstation; VMware runs Proxmox; Proxmox hosts the company's virtual machines. pfSense controls routed traffic between network segments.

This diagram shows the key systems and their roles, rather than every virtual cable.

```mermaid
flowchart TB
    H["Outer Windows host"] --> VM["VMware Workstation"]
    VM --> PVE["Proxmox: nova-prox01"]
    PVE --> FW["pfSense: nova-fw01"]
    PVE --> DC1["NOVA-DC01"]
    PVE --> DC2["NOVA-DC02"]
    PVE --> FS["NOVA-FILES01"]
    PVE --> CL["NOVA-CLIENT"]
    FW --> IN["INFRA / VLAN 20"]
    FW --> CN["CLIENT / VLAN 40"]
    IN --- DC1
    IN --- DC2
    IN --- FS
    CN --- CL
```

## Open a server

| System | Main role | Documented address |
| --- | --- | --- |
| [nova-prox01](explore/systems/NOVA-PROX01.md) | Nested hypervisor | `192.168.178.26` on upstream network |
| [nova-fw01 / pfSense](explore/systems/NOVA-FW01.md) | Firewall/router, DNS Resolver and VPN | WAN `192.168.178.71`; several internal gateways |
| [NOVA-DC01](explore/systems/NOVA-DC01.md) | AD DS and DNS | `10.10.20.10` |
| [NOVA-DC02](explore/systems/NOVA-DC02.md) | Second AD DS and DNS | `10.10.20.11` |
| [NOVA-FILES01](explore/systems/NOVA-FILES01.md) | SMB, DFS, VSS and backup | `10.10.20.20` |
| [NOVA-CLIENT](explore/systems/NOVA-CLIENT.md) | User and policy test workstation | `10.10.40.100` |

## Network zones

| Zone | Subnet | Gateway | State |
| --- | --- | --- | --- |
| Upstream | `192.168.178.0/24` | `192.168.178.1` | Proxmox management and firewall WAN |
| Legacy LAN | `10.99.99.0/24` | `10.99.99.1` | Configured older segment. TODO(David): state why it still exists and when it will be removed. |
| MGMT / VLAN 10 | `10.10.10.0/24` | `10.10.10.1` | Firewall management |
| INFRA / VLAN 20 | `10.10.20.0/24` | `10.10.20.1` | Domain Controllers and file server |
| APP / VLAN 30 | `10.10.30.0/24` | `10.10.30.1` | Reserved segment |
| CLIENT / VLAN 40 | `10.10.40.0/24` | `10.10.40.1` | Domain workstation |
| DMZ / VLAN 50 | `10.10.50.0/24` | `10.10.50.1` | Reserved segment |
| VPN_REMOTE (WireGuard tunnel, not a VLAN) | `10.10.60.0/24` | `10.10.60.1` | WireGuard peer network |

[Explore the network in plain English](explore/NETWORK.md).

## Follow a normal employee request

```mermaid
flowchart LR
    PC["Windows workstation"] --> DNS["DNS on DC01/DC02"]
    DNS --> AD["Active Directory / Kerberos"]
    AD --> G["Security groups"]
    G --> FS["DFS / SMB on FILES01"]
    FS --> ACL["SMB + NTFS access decision"]
```

[Open Active Directory](explore/services/ACTIVE_DIRECTORY.md) · [Open file permissions](explore/FILE_SERVICES.md) · [Open Group Policy](explore/POLICIES.md).

## What happens when something fails?

Nova Corp uses several recovery paths: a second Domain Controller, AD Recycle Bin, file Previous Versions, Windows Server Backup, Proxmox VM backups and pfSense rollback snapshots.

[Explore backup/recovery](explore/services/BACKUPS.md) · [Browse tests](explore/TESTS_AND_RECOVERY.md).

## What is still a lab limitation?

Proxmox is actually managed on the upstream host network, not yet inside the final privileged-management VLAN design. The dedicated admin VPN and wider management-plane security change are next. The MGMT, INFRA, APP and DMZ zones still have broad pass rules, so segmentation exists but least privilege does not yet (planned in CR-016). The environment also shares one outer physical host failure domain.

**Documented state:** 20 November 2026 asset/network validation, with Phase 2 closure on 21 November 2026.

[← Company map](EXPLORE_NOVACORP.md)