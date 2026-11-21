# Computers & Servers

Think of this as the equipment directory for Nova Corp. Choose a system to understand its job, its dependencies, and where its validation evidence lives.

| System | Why the company needs it | Explore |
| --- | --- | --- |
| **NOVA-DC01** | Identity server: helps computers discover the domain and authenticate users. | [Domain Controllers](IDENTITY.md#domain-controllers) |
| **NOVA-DC02** | Second identity server: provides resilience when DC01 is unavailable. | [Resilience and replication](IDENTITY.md#what-happens-if-dc01-is-offline) |
| **NOVA-FILES01** | Stores departmental folders and supports recovery. | [File server](FILE_SERVICES.md) |
| **nova-fw01 / pfSense** | Routes traffic between network zones and enforces firewall rules. | [Network & Firewall](NETWORK.md) |
| **nova-prox01 / Proxmox** | Runs the virtual machines in the nested lab. | [Virtualization](../ARCHITECTURE.md) |
| **NOVA-CLIENT** | Domain-joined Windows workstation used for user-side acceptance tests. | [Client and domain use](IDENTITY.md) |

These are current-state Phase 2 roles—not a claim that there are no other virtual machines in the lab.

## How the systems work together

A user on **NOVA-CLIENT** finds **NOVA-DC01/DC02** through DNS, authenticates to the domain, and then reaches authorized folders on **NOVA-FILES01**. **pfSense** routes and filters cross-network traffic. **Proxmox** hosts the environment.

**[Full current architecture →](../ARCHITECTURE.md)**

## What the interactive site will add

Each system will get a stable URL, clickable diagram node, purpose, roles, dependencies, current documented configuration, relevant policies, incidents, screenshot evidence, and full technical journal links.

Nothing on this page is a direct connection to a live server.
