# LDAP — Querying the company directory

**LDAP** is a protocol clients and administrative tools use to read directory information, such as people, computers, groups and attributes.

It works with **Active Directory Domain Services**, but it is not the same as Kerberos authentication.

## How it fits in Nova Corp

```text
NOVA-CLIENT
    │ DNS finds AD service records
    ▼
NOVA-DC01 / NOVA-DC02
    │ LDAP queries
    ▼
Directory objects: users, groups, OUs, computers
```

## Related components

[Active Directory](ACTIVE_DIRECTORY.md) · [DNS](DNS.md) · [Kerberos](KERBEROS.md) · [OU tree](../DIRECTORY.md) · [Security groups](../GROUPS.md).

## What was tested

The domain's LDAP service records were queried and the Domain Controllers were verified as advertising services. Directory replication and object visibility were checked on both DCs.

<details><summary><strong>Service discovery example</strong></summary>

```powershell
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
```

LDAP service discovery alone does not prove that an application can bind and query every required attribute; the tests have their own scope.

</details>

**Technical source:** [Domain resilience tests](../../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md).