---
title: "DNS — How Nova Corp computers find services"
sourcePath: "docs/explore/services/DNS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/services/DNS.md"
section: "explore"
---

# DNS — How Nova Corp computers find services

DNS translates names into addresses and helps domain computers discover service locations.

Nova Corp uses AD-integrated DNS on [DC01](/reference/explore/systems/NOVA-DC01/) and [DC02](/reference/explore/systems/NOVA-DC02/). A client uses DNS not only to look up `NOVA-FILES01` but also to find available domain services.

## Two kinds of lookup

**Host record:** `nova-files01.nova.corp` → `10.10.20.20`.

**Service record (SRV):** tells a client which server offers LDAP, Kerberos or Global Catalog service.

## Connected services

[AD DS](/reference/explore/services/ACTIVE_DIRECTORY/) · [Kerberos](/reference/explore/services/KERBEROS/) · [LDAP](/reference/explore/services/LDAP/) · [SMB shares](/reference/explore/services/SMB/) · [pfSense Resolver](/reference/explore/systems/NOVA-FW01/).

## What was configured

- AD-integrated domain zone for `nova.corp`.
- DC discovery SRV records.
- Domain Controller DNS configuration and forwarder/Resolver dependencies.
- pfSense Unbound DNS Resolver is enabled; the pfSense DNS setup includes a domain override `nova.corp → 10.10.20.10` (NOVA-DC01), and an allow ACL for VPN_REMOTE `10.10.60.0/24`. These settings do not establish a DC02 failover target in the pfSense override.
- Windows domain clients pointing at internal Nova DNS servers.

## What went wrong

In an incident, the user could not open a file server by name. Direct connectivity to its IP worked, and direct queries to Nova DNS worked. The client DNS configuration was the problem, not a failed file server.

[Read the DNS investigation](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/).

<details><summary><strong>Diagnostic examples</strong></summary>

```powershell
Resolve-DnsName nova-files01.nova.corp
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"
```

```cmd
ipconfig /all
nltest /dsgetdc:nova.corp /force
```

</details>

**Setup journal:** [Active Directory and DNS](/reference/Documentation/Change-Requests/Journal-CR-003/).