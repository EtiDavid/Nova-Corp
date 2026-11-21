# Identity & Active Directory

## In plain English

Rather than create a separate local account on every computer, Nova Corp uses **Active Directory**, a central directory of accounts, computers and groups. **DNS** helps computers find the correct services. **Domain Controllers** run the directory and authentication services.

## Domain Controllers

| System | Current Phase 2 address | Purpose |
| --- | --- | --- |
| **NOVA-DC01** | `10.10.20.10` | Active Directory Domain Services and DNS |
| **NOVA-DC02** | `10.10.20.11` | A second writable Domain Controller and DNS server; holds FSMO roles at the Phase 2 baseline |

Domain: `nova.corp`. Both controllers are writable and are validated for replication, service discovery, SYSVOL and NETLOGON.

### Open related topics

- [Directory tree and organizational units](PEOPLE_AND_DEPARTMENTS.md)
- [Groups and access permissions](FILE_SERVICES.md)
- [Group Policy](POLICIES.md)
- [Recovery and failure tests](TESTS_AND_RECOVERY.md)

## What happens if DC01 is offline?

In a controlled exercise, the client continued to discover and use domain services through DC02. When DC01 returned, the directory was checked for natural convergence rather than assuming it had immediately recovered.

**Technical evidence:** [AD resilience engineering journal](../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md).

## How directory objects work

An **OU (Organizational Unit)** organizes accounts/computers, while a **security group** is used for authorization or policy filtering. These are not interchangeable: an employee can live in one OU and belong to several groups.

The interactive website will support opening an OU, selecting a (public-safe fictional) account, following the account's group memberships, and viewing applicable policies.

## What is not claimed

This page does not claim a real-time directory feed or that every historical user mentioned in a journal is still enabled now. Staff records need a current privacy-reviewed inventory before publication.
