# Kerberos and the KDC — Domain authentication

When a Nova Corp employee signs in, Windows can use **Kerberos** tickets instead of sending a password to every service.

The **Key Distribution Center (KDC)** is part of the Domain Controller's AD DS authentication services. In normal Active Directory operation, Domain Controllers provide Kerberos service.

## Plain-English example

1. A user signs in on [NOVA-CLIENT](../systems/NOVA-CLIENT.md).
2. The computer discovers a Domain Controller using [DNS](DNS.md).
3. Kerberos exchanges tickets with the DC/KDC.
4. The user can then request access to a service such as [SMB file sharing](SMB.md), subject to authorization.

Authentication is **not** the same as permission. A valid domain user may still be denied a Finance share.

## Connected Nova services

[DC01](../systems/NOVA-DC01.md) · [DC02](../systems/NOVA-DC02.md) · [AD DS](ACTIVE_DIRECTORY.md) · [LDAP](LDAP.md) · [SMB](SMB.md) · [NOVA-CLIENT](../systems/NOVA-CLIENT.md).

## What was tested

The resilience campaign validated Kerberos SRV discovery, domain services during the DC01 outage, Windows time hierarchy and client continuity through DC02.

<details><summary><strong>Useful technical checks</strong></summary>

```powershell
Resolve-DnsName -Type SRV "_kerberos._tcp.nova.corp"
```

```cmd
klist
w32tm /query /status
nltest /dsgetdc:nova.corp /force
```

</details>

**Deep evidence:** [AD resilience and service discovery](../../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md).