---
title: "NOVA-DC01 — Domain Controller 01"
sourcePath: "docs/explore/systems/NOVA-DC01.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/systems/NOVA-DC01.md"
section: "explore"
---

# NOVA-DC01 — Domain Controller 01

**Role:** The company's identity and DNS server · **Network:** Infrastructure (VLAN 20) · **Address:** `10.10.20.10`

## Why it exists

When a Nova Corp employee signs in, their computer needs to find the company's directory and authenticate the account. NOVA-DC01 is one of the two servers that provide that service.

It also answers internal DNS questions, such as where to find the domain and its services.

## Inside this server

| Open | What it does |
| --- | --- |
| **[Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/)** | Stores accounts, computers, groups and organizational units. |
| **[DNS](/reference/explore/services/DNS/)** | Helps computers locate the domain and internal services. |
| **[Kerberos / KDC](/reference/explore/services/KERBEROS/)** | Issues tickets that support domain authentication. |
| **[LDAP](/reference/explore/services/LDAP/)** | Allows directory-aware systems to query directory information. |
| **[SYSVOL & NETLOGON](/reference/explore/services/SYSVOL_NETLOGON/)** | Make shared policy and logon-related files available. |
| **[Replication](/reference/explore/systems/NOVA-DC02/)** | Keeps directory data in sync with DC02. |
| **[Backups](/reference/explore/services/BACKUPS/)** | Includes System State protection and recovery planning. |

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
| Partner | [NOVA-DC02](/reference/explore/systems/NOVA-DC02/) |

## Policies attached to the identity infrastructure

[Default Domain Policy](/reference/explore/policies/DOMAIN_PASSWORD/) is linked at the domain root. [Default Domain Controllers Policy](/reference/explore/policies/DEFAULT_DC/) is linked to the built-in Domain Controllers OU containing DC01 and DC02.

The November report documents SMB signing requirements and a **configured LDAP signing level of None** in the DC policy. The effective state of both Domain Controllers would need a separate security check before treating the GPO value as the active operating setting.

## What we tested

**Directory health:** `dcdiag` and `repadmin` were used to inspect directory services and replication.

**Service discovery:** LDAP, Kerberos and Global Catalog SRV lookups were validated against the domain.

**Failover:** DC01 was taken offline during a controlled exercise. Client authentication and resource access continued through DC02. After DC01 returned, the servers were checked for convergence.

**Recovery:** Active Directory Recycle Bin restoration was tested; object identity was compared, not just the display name.

[Explore all identity tests →](/reference/explore/TESTS_AND_RECOVERY/)

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

[Directory tree and OUs](/reference/explore/DIRECTORY/) · [IT department](/reference/explore/people/IT_DEPARTMENT/) · [Group Policy](/reference/explore/POLICIES/) · [NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/)

**How it was built:** [AD DS and DNS installation](/reference/Documentation/Change-Requests/Journal-CR-003/) · [Second DC and replication](/reference/Documentation/Change-Requests/Journal-CR-004/)

**How we proved resilience:** [AD Resilience Engineering Journal](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/)

[← All systems](/reference/explore/SYSTEMS/)