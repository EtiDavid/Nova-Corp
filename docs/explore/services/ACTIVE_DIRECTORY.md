# Active Directory — Nova Corp's company directory

## What is it?

Active Directory (AD) is where Nova Corp organizes Windows user accounts, computers, groups and the company’s directory structure. Computers rely on Domain Controllers to discover, authenticate and use domain resources.

**Nova Corp domain:** `nova.corp`  
**Servers:** [NOVA-DC01](../systems/NOVA-DC01.md) and [NOVA-DC02](../systems/NOVA-DC02.md).

## Why Nova Corp installed it

Without a shared directory, each machine would need separate accounts and rules. With the domain, an administrator can manage user identities, assign membership to groups, enforce workstation policies and control access to departmental resources.

## Explore its connected parts

| Component | How it fits |
| --- | --- |
| [Organizational Units (OU tree)](../DIRECTORY.md) | Keep users, computers and administrative objects organized. |
| [People and departments](../PEOPLE_AND_DEPARTMENTS.md) | Accounts belong in the right OU and department. |
| [Security groups](../GROUPS.md) | Grant resource access and sometimes target policies. |
| [Group Policy](../POLICIES.md) | Configures users and computers centrally. |
| [DNS](DNS.md) | Helps clients find Domain Controllers and services. |
| [Kerberos / KDC](KERBEROS.md) | Supplies domain authentication tickets. |
| [LDAP](LDAP.md) | Allows directory queries. |
| [SYSVOL / NETLOGON](SYSVOL_NETLOGON.md) | Distributes shared domain-policy and logon material. |
| [SMB](SMB.md) | Lets authenticated users access shared files. |
| [Backup and restore](BACKUPS.md) | Protects System State and offers deleted-object recovery. |

## How it was installed

Nova Corp initially installed AD DS and DNS on DC01, created the `nova.corp` domain and validated service records. DC02 was then joined and promoted as an additional writable Domain Controller, with replication and FSMO role handling tested.

**Read the build:** [Install AD DS and DNS](../../Documentation/Change-Requests/Journal-CR-003.md) → [Add a second DC](../../Documentation/Change-Requests/Journal-CR-004.md).

**[See the actual November 2026 directory snapshot: 16 OUs, 20 users, 62 groups, 4 computers](../DIRECTORY_SNAPSHOT_2026-11-22.md)**

## What was tested?

- Name resolution and LDAP/Kerberos service discovery.
- Directory replication across naming contexts.
- SYSVOL and NETLOGON availability.
- User/OU/group creation and replication.
- AD Recycle Bin recovery with identity preserved.
- Client continuity during DC01 outage.
- Return to normal synchronization after DC01 restarted.
- Intentional replication divergence and repair.

[Explore the resilience journal](../../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) · [All tests and incidents](../TESTS_AND_RECOVERY.md).

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