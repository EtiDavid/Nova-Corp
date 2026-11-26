---
title: "NOVA-DC02 — Domain Controller 02"
sourcePath: "docs/explore/systems/NOVA-DC02.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/systems/NOVA-DC02.md"
section: "explore"
---

# NOVA-DC02 — Domain Controller 02

**Role:** Second identity/DNS server · **Network:** Infrastructure (VLAN 20) · **Address:** `10.10.20.11`

## Why it exists

If a company has only one Domain Controller, losing it can interrupt logins and service discovery. Nova Corp added NOVA-DC02 so the directory and DNS would have another server.

DC02 is a **writable** Domain Controller, not merely a passive backup image.

## Inside this server

[Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [DNS](/reference/explore/services/DNS/) · [Kerberos](/reference/explore/services/KERBEROS/) · [LDAP](/reference/explore/services/LDAP/) · [SYSVOL & NETLOGON](/reference/explore/services/SYSVOL_NETLOGON/)

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

NOVA-DC02 sits in the built-in Domain Controllers OU targeted by [Default Domain Controllers Policy](/reference/explore/policies/DEFAULT_DC/). The domain-wide [Default Domain Policy](/reference/explore/policies/DOMAIN_PASSWORD/) also exists at the domain root.

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

[Read the failover and replication tests](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/)

## Connections

[NOVA-DC01](/reference/explore/systems/NOVA-DC01/) · [NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/) · [Directory / people / groups](/reference/explore/DIRECTORY/) · [Recovery](/reference/explore/services/BACKUPS/)

**Deployment story:** [Adding the second Domain Controller](/reference/Documentation/Change-Requests/Journal-CR-004/)

[← All systems](/reference/explore/SYSTEMS/)