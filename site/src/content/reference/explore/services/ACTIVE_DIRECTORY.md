---
title: "Active Directory — Nova Corp's company directory"
sourcePath: "docs/explore/services/ACTIVE_DIRECTORY.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/services/ACTIVE_DIRECTORY.md"
section: "explore"
---

# Active Directory — Nova Corp's company directory

## What is it?

Active Directory (AD) is where Nova Corp organizes Windows user accounts, computers, groups and the company’s directory structure. Computers rely on Domain Controllers to discover, authenticate and use domain resources.

**Nova Corp domain:** `nova.corp`  
**Servers:** [NOVA-DC01](/reference/explore/systems/NOVA-DC01/) and [NOVA-DC02](/reference/explore/systems/NOVA-DC02/).

## Why Nova Corp installed it

Without a shared directory, each machine would need separate accounts and rules. With the domain, an administrator can manage user identities, assign membership to groups, enforce workstation policies and control access to departmental resources.

## Explore its connected parts

| Component | How it fits |
| --- | --- |
| [Organizational Units (OU tree)](/reference/explore/DIRECTORY/) | Keep users, computers and administrative objects organized. |
| [People and departments](/reference/explore/PEOPLE_AND_DEPARTMENTS/) | Accounts belong in the right OU and department. |
| [Security groups](/reference/explore/GROUPS/) | Grant resource access and sometimes target policies. |
| [Group Policy](/reference/explore/POLICIES/) | Configures users and computers centrally. |
| [DNS](/reference/explore/services/DNS/) | Helps clients find Domain Controllers and services. |
| [Kerberos / KDC](/reference/explore/services/KERBEROS/) | Supplies domain authentication tickets. |
| [LDAP](/reference/explore/services/LDAP/) | Allows directory queries. |
| [SYSVOL / NETLOGON](/reference/explore/services/SYSVOL_NETLOGON/) | Distributes shared domain-policy and logon material. |
| [SMB](/reference/explore/services/SMB/) | Lets authenticated users access shared files. |
| [Backup and restore](/reference/explore/services/BACKUPS/) | Protects System State and offers deleted-object recovery. |

## How it was installed

Nova Corp initially installed AD DS and DNS on DC01, created the `nova.corp` domain and validated service records. DC02 was then joined and promoted as an additional writable Domain Controller, with replication and FSMO role handling tested.

**Read the build:** [Install AD DS and DNS](/reference/Documentation/Change-Requests/Journal-CR-003/) → [Add a second DC](/reference/Documentation/Change-Requests/Journal-CR-004/).

**[See the actual November 2026 directory snapshot: 16 OUs, 20 users, 62 groups, 4 computers](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/)**

## What was tested?

- Name resolution and LDAP/Kerberos service discovery.
- Directory replication across naming contexts.
- SYSVOL and NETLOGON availability.
- User/OU/group creation and replication.
- AD Recycle Bin recovery with identity preserved.
- Client continuity during DC01 outage.
- Return to normal synchronization after DC01 restarted.
- Intentional replication divergence and repair.

[Explore the resilience journal](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) · [All tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

<details><summary><strong>Technical check examples</strong></summary>

```cmd
repadmin /replsummary
repadmin /showrepl NOVA-DC01
dcdiag /test:Advertising /test:NetLogons /test:SysVolCheck
```

```powershell
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
```

</details>