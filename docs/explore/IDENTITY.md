# Identity Office — How Nova Corp signs people in

The company's identity system is **Active Directory**, hosted on two Domain Controllers.

Imagine signing in at a Nova Corp workstation. Several connected services are involved:

1. [DNS](services/DNS.md) finds a Domain Controller.
2. [Kerberos/KDC](services/KERBEROS.md) helps authenticate the domain account.
3. [Active Directory](services/ACTIVE_DIRECTORY.md) contains the user and computer objects.
4. [LDAP](services/LDAP.md) allows directory information to be queried.
5. [Group Policy](POLICIES.md) configures the workstation and user according to the policy design.
6. [Security groups](GROUPS.md) determine access to protected resources.
7. [SMB](services/SMB.md) provides the file-sharing path.

## Open a Domain Controller

**[NOVA-DC01](systems/NOVA-DC01.md)** — 10.10.20.10  
**[NOVA-DC02](systems/NOVA-DC02.md)** — 10.10.20.11

Both provide AD DS and DNS; DC02 also maintained client/domain continuity in a controlled DC01 outage.

## Open the directory

[Browse organizational units](DIRECTORY.md) · [Meet the IT accounts](people/IT_DEPARTMENT.md) · [Open security groups](GROUPS.md) · [View policies](POLICIES.md).

## What happens during a failure?

A Domain Controller can fail without making the entire identity service unavailable when a second healthy controller is present and clients can find it.

Nova Corp tested that case by taking DC01 offline, validating client functionality through DC02 and checking replication when DC01 returned.

[Read the failover story](../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) · [Explore all tests](TESTS_AND_RECOVERY.md).

[← Company map](../EXPLORE_NOVACORP.md)