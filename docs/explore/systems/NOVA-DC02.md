# NOVA-DC02 — Domain Controller 02

**Role:** Second identity/DNS server · **Network:** Infrastructure (VLAN 20) · **Address:** `10.10.20.11`

## Why it exists

If a company has only one Domain Controller, losing it can interrupt logins and service discovery. Nova Corp added NOVA-DC02 so the directory and DNS would have another server.

DC02 is a **writable** Domain Controller, not merely a passive backup image.

## Inside this server

[Active Directory](../services/ACTIVE_DIRECTORY.md) · [DNS](../services/DNS.md) · [Kerberos](../services/KERBEROS.md) · [LDAP](../services/LDAP.md) · [SYSVOL & NETLOGON](../services/SYSVOL_NETLOGON.md)

## Technical profile

| Item | Documented Phase 2 baseline |
| --- | --- |
| Hostname | `NOVA-DC02.nova.corp` |
| OS | Windows Server 2025 Standard |
| Address | `10.10.20.11/24` |
| Gateway | `10.10.20.1` |
| Configured DNS order | `10.10.20.11`, `10.10.20.10` |
| Services | NTDS, DNS, Netlogon |
| Directory | Writable DC, Global Catalog |
| FSMO ownership | DC02 held FSMO roles during the validated resilience exercise |

## Domain Controller Group Policy

NOVA-DC02 sits in the built-in Domain Controllers OU targeted by [Default Domain Controllers Policy](../policies/DEFAULT_DC.md). The domain-wide [Default Domain Policy](../policies/DOMAIN_PASSWORD.md) also exists at the domain root.

The November policy report documents configuration; the earlier resilience tests establish the Domain Controller services that were actually exercised.

## What we tested

The controlled outage deliberately stopped DC01, then checked whether clients could still find DC02 and access the required domain services. When DC01 returned, replication was examined before declaring recovery.

Another test deliberately created a replication divergence. It was detected, corrected and checked for successful convergence.

<details><summary><strong>What makes the test convincing?</strong></summary>

A server appearing "Running" does not prove users can log in. The investigation included:

- service discovery;
- SYSVOL/NETLOGON;
- client-side authentication/resource access;
- replication status across naming contexts;
- behavior during the outage and after restoration.

</details>

[Read the failover and replication tests](../../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)

## Connections

[NOVA-DC01](NOVA-DC01.md) · [NOVA-CLIENT](NOVA-CLIENT.md) · [Directory / people / groups](../DIRECTORY.md) · [Recovery](../services/BACKUPS.md)

**Deployment story:** [Adding the second Domain Controller](../../Documentation/Change-Requests/Journal-CR-004.md)

[← All systems](../SYSTEMS.md)