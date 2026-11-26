---
title: "Identity Office — How Nova Corp signs people in"
sourcePath: "docs/explore/IDENTITY.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/IDENTITY.md"
section: "explore"
---

# Identity Office — How Nova Corp signs people in

The company's identity system is **Active Directory**, hosted on two Domain Controllers.

Imagine signing in at a Nova Corp workstation. Several connected services are involved:

1. [DNS](/reference/explore/services/DNS/) finds a Domain Controller.
2. [Kerberos/KDC](/reference/explore/services/KERBEROS/) helps authenticate the domain account.
3. [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) contains the user and computer objects.
4. [LDAP](/reference/explore/services/LDAP/) allows directory information to be queried.
5. [Group Policy](/reference/explore/POLICIES/) configures the workstation and user according to the policy design.
6. [Security groups](/reference/explore/GROUPS/) determine access to protected resources.
7. [SMB](/reference/explore/services/SMB/) provides the file-sharing path.

## Open a Domain Controller

**[NOVA-DC01](/reference/explore/systems/NOVA-DC01/)** — 10.10.20.10  
**[NOVA-DC02](/reference/explore/systems/NOVA-DC02/)** — 10.10.20.11

Both provide AD DS and DNS; DC02 also maintained client/domain continuity in a controlled DC01 outage.

## Open the directory

[Browse organizational units](/reference/explore/DIRECTORY/) · [Meet the IT accounts](/reference/explore/people/IT_DEPARTMENT/) · [Open security groups](/reference/explore/GROUPS/) · [View policies](/reference/explore/POLICIES/).

## What happens during a failure?

A Domain Controller can fail without making the entire identity service unavailable when a second healthy controller is present and clients can find it.

Nova Corp tested that case by taking DC01 offline, validating client functionality through DC02 and checking replication when DC01 returned.

[Read the failover story](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) · [Explore all tests](/reference/explore/TESTS_AND_RECOVERY/).

[← Company map](/reference/EXPLORE_NOVACORP/)