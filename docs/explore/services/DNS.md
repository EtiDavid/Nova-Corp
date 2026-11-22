# DNS — How Nova Corp computers find services

DNS translates names into addresses and helps domain computers discover service locations.

Nova Corp uses AD-integrated DNS on [DC01](../systems/NOVA-DC01.md) and [DC02](../systems/NOVA-DC02.md). A client uses DNS not only to look up `NOVA-FILES01` but also to find available domain services.

## Two kinds of lookup

**Host record:** `nova-files01.nova.corp` → `10.10.20.20`.

**Service record (SRV):** tells a client which server offers LDAP, Kerberos or Global Catalog service.

## Connected services

[AD DS](ACTIVE_DIRECTORY.md) · [Kerberos](KERBEROS.md) · [LDAP](LDAP.md) · [SMB shares](SMB.md) · [pfSense Resolver](../systems/NOVA-FW01.md).

## What was configured

- AD-integrated domain zone for `nova.corp`.
- DC discovery SRV records.
- Domain Controller DNS configuration and forwarder/Resolver dependencies.
- pfSense Unbound DNS Resolver is enabled; the actual 22 November XML contains a domain override `nova.corp → 10.10.20.10` (NOVA-DC01), and an allow ACL for VPN_REMOTE `10.10.60.0/24`. This source does not establish a DC02 failover target in the pfSense override.
- Windows domain clients pointing at internal Nova DNS servers.

## What went wrong

In an incident, the user could not open a file server by name. Direct connectivity to its IP worked, and direct queries to Nova DNS worked. The client DNS configuration was the problem, not a failed file server.

[Read the DNS investigation](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md).

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

**Setup journal:** [Active Directory and DNS](../../Documentation/Change-Requests/Journal-CR-003.md).