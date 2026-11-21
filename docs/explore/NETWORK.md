# Network & Firewall

## In plain English

Nova Corp uses **pfSense** to route traffic between different parts of the lab and enforce rules about what may communicate. A network zone is like a department area of a building: not every visitor should have access everywhere.

## Known network zones at the Phase 2 boundary

| Zone | Network | Purpose |
| --- | --- | --- |
| MGMT / VLAN 10 | `10.10.10.0/24` | Management |
| INFRA / VLAN 20 | `10.10.20.0/24` | Domain Controllers and file server |
| APP / VLAN 30 | `10.10.30.0/24` | Reserved future application area |
| CLIENT / VLAN 40 | `10.10.40.0/24` | Domain workstations |
| DMZ / VLAN 50 | `10.10.50.0/24` | Reserved future public-facing area |
| VPN_REMOTE / VLAN 60 | `10.10.60.0/24` | WireGuard remote-access zone |

The hypervisor is currently managed from the **upstream host network**, not from the final isolated privileged-management design. This is explicitly carried forward to the next security work.

## Open the firewall

**Asset label:** nova-fw01  
**Operating-system name:** pfSense.home.arpa

What can be explored:

- [Current architecture](../ARCHITECTURE.md)
- [Remote-access engineering](../Documentation/Change-Requests/Journal-CR-007.md)
- [Security findings during final validation](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)
- [Tests and recovery](TESTS_AND_RECOVERY.md)

## About firewall rules

A complete rule browser should show the **sanitized and verified** rule list per interface, with rule order, human-readable purpose, source and destination type, permitted/blocked service, validation and revision date.

**That complete current rule inventory is not published yet.** It must be derived from an audited pfSense ruleset/export and compared with the last tested state. We must not recreate every rule from memory or expose sensitive endpoints, remote-access keys or recovery material.

## Security lesson already demonstrated

Final validation discovered unwanted management reachability from a normal client. The path was corrected, then negative management tests **and** positive DNS/AD/SMB/Internet tests verified that the repair had not broken required traffic.

## Future security work

Privileged-admin VPN and full management-plane isolation are **next**, not complete.
