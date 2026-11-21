# NOVA-DC01 — Domain Controller 01

**Role:** The company's identity and DNS server · **Network:** Infrastructure (VLAN 20) · **Address:** `10.10.20.10`

## Why it exists

When a Nova Corp employee signs in, their computer needs to find the company's directory and authenticate the account. NOVA-DC01 is one of the two servers that provide that service.

It also answers internal DNS questions, such as where to find the domain and its services.

## Inside this server

| Open | What it does |
| --- | --- |
| **[Active Directory](../services/ACTIVE_DIRECTORY.md)** | Stores accounts, computers, groups and organizational units. |
| **[DNS](../services/DNS.md)** | Helps computers locate the domain and internal services. |
| **[Kerberos / KDC](../services/KERBEROS.md)** | Issues tickets that support domain authentication. |
| **[LDAP](../services/LDAP.md)** | Allows directory-aware systems to query directory information. |
| **[SYSVOL & NETLOGON](../services/SYSVOL_NETLOGON.md)** | Make shared policy and logon-related files available. |
| **[Replication](NOVA-DC02.md)** | Keeps directory data in sync with DC02. |
| **[Backups](../services/BACKUPS.md)** | Includes System State protection and recovery planning. |

## Technical profile

| Item | Documented Phase 2 baseline |
| --- | --- |
| Hostname | `NOVA-DC01.nova.corp` |
| OS | Windows Server 2025 Standard |
| Address | `10.10.20.10/24` |
| Gateway | `10.10.20.1` |
| Configured DNS order | `10.10.20.11`, `10.10.20.10` |
| Roles | AD DS, DNS |
| Key services | NTDS, DNS, Netlogon |
| Partner | [NOVA-DC02](NOVA-DC02.md) |

## What we tested

**Directory health:** `dcdiag` and `repadmin` were used to inspect directory services and replication.

**Service discovery:** LDAP, Kerberos and Global Catalog SRV lookups were validated against the domain.

**Failover:** DC01 was taken offline during a controlled exercise. Client authentication and resource access continued through DC02. After DC01 returned, the servers were checked for convergence.

**Recovery:** Active Directory Recycle Bin restoration was tested; object identity was compared, not just the display name.

[Explore all identity tests →](../TESTS_AND_RECOVERY.md)

<details><summary><strong>Useful investigation commands</strong></summary>

```powershell
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"
```

```cmd
dcdiag /test:Advertising /test:SysVolCheck /test:NetLogons
repadmin /replsummary
repadmin /showrepl NOVA-DC01
```

These are examples of the tested diagnostic methods, not a live result feed.

</details>

## Related parts of Nova Corp

[Directory tree and OUs](../DIRECTORY.md) · [IT department](../people/IT_DEPARTMENT.md) · [Group Policy](../POLICIES.md) · [NOVA-CLIENT](NOVA-CLIENT.md)

**How it was built:** [AD DS and DNS installation](../../Documentation/Change-Requests/Journal-CR-003.md) · [Second DC and replication](../../Documentation/Change-Requests/Journal-CR-004.md)

**How we proved resilience:** [AD Resilience Engineering Journal](../../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)

[← All systems](../SYSTEMS.md)