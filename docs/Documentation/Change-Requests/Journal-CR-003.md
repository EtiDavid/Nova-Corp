# Change Request Documentation

# CR-003 — Deploy Active Directory Domain Services & Enterprise DNS

---

# Document Information

| Field                     | Value                                                    |
| ------------------------- | -------------------------------------------------------- |
| Change ID                 | CR-003                                                   |
| Title                     | Deploy Active Directory Domain Services & Enterprise DNS |
| Engineer                  | David Eti                                                |
| Environment               | Nova Corp Enterprise Lab                                 |
| Status                    | Completed                                                |
| Primary Domain Controller | nova-dc01                                                |
| Platform                  | Windows Server 2025                                      |
| Domain                    | nova.corp                                                |

---

# Executive Summary

This Change Request documents the deployment of Microsoft's Active Directory Domain Services (AD DS) and the Enterprise DNS infrastructure for the Nova Corp environment.

While CR-001 established the virtualization platform and CR-002 introduced enterprise networking, CR-003 introduces centralized identity management.

Before this implementation, servers operated independently and authentication was performed locally. There was no central directory service, no enterprise authentication mechanism and no authoritative internal DNS infrastructure.

By deploying Active Directory, Nova Corp transitions from a routed network into a centrally managed enterprise where users, computers and future services share a common identity platform.

This Change Request also establishes the DNS architecture that will support every future Windows and Linux workload deployed within Nova Corp.

The implementation was completed using Microsoft's recommended architecture, where Active Directory and DNS operate as an integrated service while pfSense remains responsible for network routing and DNS resolution for client devices.

---

# Change Window Timeline

> **Note:** Replace the placeholder times below with the actual implementation timestamps recorded during the deployment.

| Time  | Activity                                   |
| ----- | ------------------------------------------ |
| 09:00 | Change Window Opened                       |
| 09:05 | Recovery Snapshot Created                  |
| 09:20 | Windows Server Validation                  |
| 09:35 | Static IP Configuration Verified           |
| 09:50 | Active Directory Domain Services Installed |
| 10:15 | Server Promoted to Domain Controller       |
| 10:30 | Automatic Reboot Completed                 |
| 10:45 | Active Directory Validation                |
| 11:00 | DNS Zone Validation                        |
| 11:15 | SRV Record Verification                    |
| 11:40 | Infrastructure VLAN Migration Began        |
| 11:50 | Incident INC-005 Declared                  |
| 12:25 | Connectivity Restored                      |
| 12:40 | DNS Forwarders Configured                  |
| 12:55 | pfSense Domain Override Configured         |
| 13:10 | End-to-End DNS Validation                  |
| 13:20 | Change Window Closed                       |

---

# Dependency Review

CR-003 depends upon the successful completion of the previous infrastructure layers.

## CR-001 — Deploy Proxmox Virtual Environment

Provides:

* Enterprise virtualization platform
* Virtual networking
* Storage
* Snapshot capability
* Recovery platform

Without CR-001, the Windows Server virtual machine could not exist.

---

## CR-002 — Deploy pfSense Enterprise Firewall & Network Foundation

Provides:

* Internal routing
* VLAN architecture
* Enterprise firewall
* DHCP services
* Backup strategy
* Restore capability

Without CR-002, Active Directory would have no secure enterprise network in which to operate.

---

# Success Criteria

This Change Request is considered complete only when all of the following conditions have been successfully validated.

* Windows Server deployed
* Static IP configured
* Active Directory Domain Services installed
* DNS Server installed
* Server promoted to Domain Controller
* Domain **nova.corp** created
* DNS zones verified
* SRV records verified
* Infrastructure VLAN migration completed successfully
* DNS Forwarders configured
* pfSense Domain Override configured
* End-to-end DNS resolution validated
* Documentation completed

---

# Business Objectives

Deploy centralized identity management for the Nova Corp enterprise environment.

The solution must provide:

* Centralized authentication
* Centralized authorization
* Enterprise directory services
* Enterprise DNS
* Foundation for Group Policy
* Foundation for file services
* Foundation for certificate services
* Foundation for future Linux integration
* Foundation for Kubernetes and cloud authentication

---

# Technical Objectives

The implementation must achieve the following technical goals.

* Deploy Windows Server.
* Configure static network settings.
* Install Active Directory Domain Services.
* Install the DNS Server role.
* Promote the server to Domain Controller.
* Create the **nova.corp** Active Directory forest.
* Validate Active Directory health.
* Verify DNS zones.
* Verify SRV records.
* Migrate the Domain Controller to the Infrastructure VLAN.
* Configure DNS Forwarders.
* Configure pfSense Domain Override.
* Validate enterprise DNS resolution.

---

# Scope

## Included

* Windows Server deployment
* Static IP configuration
* Active Directory installation
* DNS Server installation
* Domain Controller promotion
* Creation of the **nova.corp** forest and domain
* DNS validation
* SRV record validation
* Infrastructure VLAN migration
* DNS Forwarders
* pfSense DNS integration
* End-to-end DNS validation

---

## Excluded

The following components are intentionally outside the scope of this Change Request.

* Secondary Domain Controller (CR-004)
* FSMO role planning
* Group Policy Objects
* Organizational Unit structure
* Certificate Services
* File Server
* Monitoring Platform
* Ansible
* Kubernetes

These services depend upon the successful completion of CR-003.

---

# Architecture Before

Following CR-002, Nova Corp possessed enterprise networking but no centralized identity platform.

```text
                    Internet
                        │
                  Home Router
                        │
                    pfSense
                        │
                 Enterprise VLANs
                        │
              Windows Server (Standalone)
```

Authentication remained local to each machine.

No directory service existed.

No authoritative internal DNS infrastructure existed.

---

# Architecture After

Following CR-003, the Windows Server became the enterprise identity provider.

```text
                    Internet
                        │
                  Home Router
                        │
                     pfSense
                 DNS Resolver
                        │
        Domain Override (nova.corp)
                        │
                 nova-dc01
          Active Directory Domain Services
                        │
          Active Directory Integrated DNS
                        │
        Users • Computers • Authentication
```

The Domain Controller now becomes the authoritative source for identity and internal DNS within Nova Corp.

---

# Infrastructure Specifications

## Domain Controller

| Setting          | Value                    |
| ---------------- | ------------------------ |
| Hostname         | nova-dc01                |
| Operating System | Windows Server 2025      |
| Domain           | nova.corp                |
| VLAN             | Infrastructure (VLAN 20) |
| IP Address       | 10.10.20.10              |
| Gateway          | 10.10.20.1               |
| Preferred DNS    | 10.10.20.10              |

---

# Active Directory Architecture

The first Domain Controller provides multiple enterprise services simultaneously.

* Active Directory Domain Services
* Active Directory Integrated DNS
* Kerberos Authentication
* LDAP Directory Services
* Computer Account Management
* User Authentication
* Dynamic DNS Registration

Rather than deploying these as individual products, Microsoft integrates them into a single directory platform.

This integration allows Windows computers to automatically locate authentication services, discover resources and apply centralized policies.

---

# Enterprise DNS Architecture

Nova Corp implements a layered DNS architecture.

```text
                 Client
                    │
                    ▼
            pfSense DNS Resolver
                    │
      Domain Override (nova.corp)
                    │
                    ▼
               nova-dc01
       Active Directory DNS Server
            │                 │
            │                 │
      Internal Zone      Internet Queries
       (nova.corp)              │
                                ▼
                       DNS Forwarders
                    ┌────────┴────────┐
                    │                 │
               Cloudflare         Google
                 1.1.1.1           8.8.8.8
```

This architecture clearly separates responsibilities.

* **pfSense** acts as the enterprise DNS resolver for client devices.
* **Active Directory** acts as the authoritative DNS server for the `nova.corp` domain.

---

# Design Decisions

## Why Active Directory?

Enterprise environments require centralized identity management.

Instead of maintaining users and permissions independently on every server, Active Directory provides a single source of truth for authentication, authorization and directory services.

This simplifies administration while improving consistency and security.

---

## Why Install DNS on the Domain Controller?

Active Directory depends upon DNS to function correctly.

DNS is responsible for advertising Domain Controller services through SRV records, allowing clients to locate authentication, LDAP and Kerberos services automatically.

Without DNS, Active Directory cannot function.

---

## Why Does the Domain Controller Use Itself for DNS?

The Domain Controller hosts the authoritative DNS zone for **nova.corp**.

By pointing to itself, it always queries the authoritative source first.

Requests for Internet domains that do not exist internally are forwarded to external DNS providers through configured DNS Forwarders.

---

## Why Does pfSense Use a Domain Override?

Client devices use pfSense as their DNS resolver.

Rather than attempting to answer queries for **nova.corp**, pfSense forwards those requests directly to the Domain Controller.

This creates a clear separation of responsibilities.

* **pfSense** resolves public Internet names.
* **Active Directory** resolves enterprise resources.

This layered design closely mirrors enterprise best practices.

---

## Why Migrate the Domain Controller to the Infrastructure VLAN?

The temporary LAN network was used only during the initial deployment and validation of Windows Server.

Once the enterprise VLAN architecture was operational, the Domain Controller was migrated to the dedicated Infrastructure VLAN (VLAN 20).

This aligns with the long-term network design by isolating infrastructure services from management, client and application networks, while allowing firewall policies to be applied between security zones.

The migration also ensured that all future infrastructure servers would reside within the correct enterprise subnet from the beginning.

---

# Implementation

This section documents the deployment, configuration, migration and validation of the first Active Directory Domain Controller within the Nova Corp environment.

Unlike previous Change Requests, this implementation introduced the first enterprise identity service. Every future Windows server, workstation and many Linux services will depend on the infrastructure deployed during this Change Request.

The implementation was completed incrementally, validating each dependency before progressing to the next stage.

---

# Implementation Timeline

The deployment followed the sequence below.

1. Validate Windows Server installation.
2. Configure static network settings.
3. Install Active Directory Domain Services.
4. Install DNS Server role.
5. Promote the server to Domain Controller.
6. Create the **nova.corp** forest.
7. Validate Active Directory health.
8. Verify DNS zone creation.
9. Verify automatic SRV record registration.
10. Migrate the Domain Controller from the temporary LAN to the Infrastructure VLAN.
11. Resolve Infrastructure VLAN connectivity issue.
12. Configure DNS Forwarders.
13. Configure pfSense Domain Override.
14. Validate complete enterprise DNS resolution.

Each stage was validated before continuing.

---

# Static Network Configuration

Before promoting the server, a permanent network configuration was assigned.

| Setting       | Value       |
| ------------- | ----------- |
| IP Address    | 10.10.20.10 |
| Gateway       | 10.10.20.1  |
| Preferred DNS | 10.10.20.10 |

A Domain Controller should always use a static IP address.

Changing the address after deployment can affect DNS records, client communication and replication with future Domain Controllers.

---

# Active Directory Domain Services Installation

The **Active Directory Domain Services (AD DS)** role was installed using Server Manager.

During installation Windows automatically selected the DNS Server role.

This behaviour is expected.

Active Directory depends heavily on DNS for locating authentication services and cannot function without it.

---

# Domain Controller Promotion

Following role installation, the server was promoted to the first Domain Controller within the Nova Corp environment.

Promotion performed the following operations automatically:

* Created the **nova.corp** forest.
* Created the **nova.corp** domain.
* Installed the Active Directory database.
* Created the SYSVOL share.
* Installed Active Directory Integrated DNS.
* Registered initial DNS records.
* Configured authentication services.
* Restarted the server.

Following the reboot, **nova-dc01** became the authoritative identity provider for Nova Corp.

---

# DNS Validation

Following promotion, DNS Manager was used to validate the newly created DNS infrastructure.

The following were confirmed.

* Forward Lookup Zone
* Active Directory Integrated Zone
* _msdcs container
* _tcp records
* _udp records
* _sites container
* Host (A) record for nova-dc01

These records confirmed that Active Directory and DNS integrated successfully.

---

# SRV Record Verification

Before continuing, the automatic registration of Active Directory service records was verified.

Validation confirmed registration of services including:

* LDAP
* Kerberos
* Global Catalog
* Domain Controller Locator

These records allow Windows clients to automatically locate authentication services without requiring manual configuration.

Successful registration confirmed a healthy Active Directory installation.

---

# Infrastructure VLAN Migration

Initially, the Domain Controller operated on the temporary deployment network.

Following completion of the enterprise VLAN architecture, the server was migrated to the dedicated Infrastructure VLAN.

Migration included:

* Changing the IP address to **10.10.20.10**
* Changing the gateway to **10.10.20.1**
* Removing the temporary LAN configuration
* Connecting the server to the Infrastructure network

This aligned the Domain Controller with the long-term Nova Corp network design.

---

# Incident Report — INC-005

# Infrastructure VLAN Migration Failure

---

## Symptoms

Immediately after migrating **nova-dc01** from the temporary LAN to the Infrastructure VLAN, network connectivity was lost.

Observed behaviour included:

* Unable to ping the VLAN gateway.
* Unable to access the pfSense web interface.
* No communication from the Domain Controller to pfSense.
* Internet connectivity unavailable.

Interestingly, pfSense itself was still able to successfully ping the Domain Controller.

This indicated that Layer 2 connectivity still existed and that the server itself remained operational.

---

## Initial Hypotheses

Possible causes included:

* Incorrect IP configuration.
* Incorrect gateway.
* Incorrect subnet mask.
* Windows Firewall.
* Incorrect VLAN tagging.
* Proxmox bridge configuration.
* Missing VLAN interface.
* pfSense firewall policy.

---

## Investigation

Troubleshooting followed an evidence-based approach.

### Step 1

Verified Windows network configuration.

Confirmed:

* Correct IP address.
* Correct subnet.
* Correct gateway.
* Correct DNS server.

No issues identified.

---

### Step 2

Verified Proxmox networking.

Confirmed:

* Virtual machine connected to **vmbr1**.
* VLAN-aware bridge enabled.
* Interface operational.

No issues identified.

---

### Step 3

Verified pfSense VLAN configuration.

Confirmed:

* Infrastructure VLAN existed.
* Interface enabled.
* Gateway configured correctly.

No issues identified.

---

### Step 4

Connectivity testing.

Results:

* pfSense ➜ Domain Controller

**Success**

* Domain Controller ➜ pfSense

**Failure**

This observation proved the Domain Controller was reachable from the firewall, but traffic originating from the Infrastructure VLAN was being blocked.

---

## Root Cause

The Infrastructure VLAN interface had been created successfully, but no firewall rules had yet been configured for that interface.

Unlike the default LAN interface, newly created VLAN interfaces do **not** automatically inherit allow rules.

Traffic entering VLAN 20 therefore matched the implicit default deny rule.

This prevented the Domain Controller from communicating with pfSense even though routing and addressing were correct.

---

## Resolution

Created firewall rules on the Infrastructure VLAN allowing traffic during the infrastructure build phase.

Applied the updated firewall configuration.

Following additional validation, pfSense was restarted to ensure all networking services were operating with the updated configuration.

---

## Validation

Successful validation confirmed:

* Domain Controller could ping the gateway.
* Domain Controller could access the pfSense web interface.
* Internet connectivity restored.
* Active Directory remained operational.
* DNS services operational.

**Status: PASS**

---

## Why the Fix Worked

Every interface in pfSense maintains an independent firewall policy.

Creating a VLAN interface alone does not permit traffic.

By creating explicit allow rules on the Infrastructure VLAN, traffic was evaluated against the new policy instead of the default deny rule.

Once permitted, communication immediately resumed.

---

## Engineering Principle

**Never assume a newly created interface inherits firewall rules from another interface.**

Every new interface should be treated as a new security boundary requiring its own policy.

This lesson became the standard approach for all future VLAN deployments within Nova Corp.

---

# DNS Forwarders

Once Active Directory functionality had been validated, DNS Forwarders were configured.

Configured Forwarders:

* Cloudflare — **1.1.1.1**
* Google Public DNS — **8.8.8.8**

Although Internet name resolution was already functioning through Root Hints, explicit Forwarders were configured to better reflect enterprise best practice.

Forwarders provide a controlled upstream DNS path while reducing recursive lookups performed by the Domain Controller.

---

# pfSense Domain Override

The pfSense DNS Resolver was configured with a Domain Override.

| Domain    | Destination |
| --------- | ----------- |
| nova.corp | 10.10.20.10 |

This configuration ensures that any request for **nova.corp** is forwarded directly to the authoritative DNS server hosted on **nova-dc01**.

Public Internet queries continue to be resolved by pfSense.

---

# Validation Testing

## Test 1 — Domain Controller Promotion

### Evidence

* Promotion completed successfully.
* Automatic reboot completed.
* Server identified as a Domain Controller.

**Status: PASS**

---

## Test 2 — DNS Zone Validation

### Evidence

Confirmed presence of:

* nova.corp
* _msdcs
* _sites
* _tcp
* _udp

**Status: PASS**

---

## Test 3 — SRV Record Validation

### Evidence

Confirmed successful registration of LDAP and Kerberos service records.

**Status: PASS**

---

## Test 4 — Infrastructure VLAN Migration

### Evidence

Confirmed:

* Gateway reachable.
* pfSense GUI accessible.
* Internet connectivity restored.

**Status: PASS**

---

## Test 5 — DNS Forwarders

### Evidence

Forwarders successfully configured.

External name resolution validated.

**Status: PASS**

---

## Test 6 — pfSense Domain Override

### Evidence

DNS Lookup performed from pfSense.

Query:

```
nova-dc01.nova.corp
```

Returned:

```
10.10.20.10
```

This confirmed pfSense correctly forwarded **nova.corp** queries to the Domain Controller.

**Status: PASS**

---

# Operational Notes

During this Change Request, Nova Corp transitioned from a routed network into an enterprise identity platform.

The networking incident encountered during the Infrastructure VLAN migration reinforced an important operational principle:

Infrastructure services should only be migrated after the underlying network has been fully validated.

This lesson influenced the deployment strategy for all subsequent servers added to the Nova Corp environment.

---

# Technical Concepts

This section summarizes the major technologies introduced during CR-003.

Rather than serving as a textbook, these notes capture the concepts learned while building the Nova Corp environment.

The objective is to create a concise engineering reference that can be reviewed quickly before future deployments or technical interviews.

---

# Active Directory Domain Services (AD DS)

Active Directory is Microsoft's centralized directory service.

It provides a single source of truth for managing:

* Users
* Computers
* Groups
* Authentication
* Authorization
* Enterprise resources

Instead of maintaining separate accounts on every server, all identity information is stored centrally within the directory.

## Why Nova Corp Uses It

As Nova Corp grows, every server and workstation will rely on Active Directory for authentication and centralized management.

Without Active Directory, every server would need to manage users independently, resulting in duplicated administration and inconsistent security.

---

# Domain Controller

A Domain Controller is a server running Active Directory Domain Services.

Its responsibilities include:

* Authenticating users
* Authenticating computers
* Storing directory information
* Providing Kerberos authentication
* Hosting the authoritative DNS zone

Within Nova Corp:

```text
Hostname:
nova-dc01

Role:
Primary Domain Controller
```

Future Domain Controllers will replicate this information to provide redundancy and high availability.

---

# Forest

A Forest is the highest logical boundary within Active Directory.

It contains:

* Domains
* Trust relationships
* Directory schema
* Global configuration

Nova Corp currently contains one forest:

```text
nova.corp
```

As the environment grows, additional domains could exist within the same forest.

---

# Domain

A Domain is an administrative and security boundary.

It provides:

* Authentication
* User management
* Computer management
* Group Policy
* DNS namespace

Nova Corp currently operates a single domain.

```text
nova.corp
```

---

# DNS

The Domain Name System translates human-readable names into IP addresses.

Within Active Directory, DNS performs an additional role.

Rather than simply resolving hostnames, it also advertises enterprise services.

This is why Active Directory cannot function correctly without DNS.

---

# A Record

An A Record maps a hostname to an IPv4 address.

Example from Nova Corp:

```text
nova-dc01.nova.corp

↓

10.10.20.10
```

This allows users and systems to locate the Domain Controller using its hostname instead of remembering an IP address.

---

# SRV Records

Service (SRV) Records advertise where services are located.

Examples include:

* LDAP
* Kerberos
* Global Catalog

Unlike an A Record, which identifies a server, an SRV Record identifies the location of a specific service.

When a workstation joins the domain, it first queries DNS for SRV records.

Those records tell the client which Domain Controller provides authentication services.

This explains why SRV record validation formed an important part of this Change Request.

---

# DNS Forwarders

A DNS Forwarder sends unresolved DNS queries to another DNS server.

Within Nova Corp:

```text
Internal Query

↓

Active Directory DNS

↓

Unknown?

↓

Cloudflare
Google
```

Rather than contacting Internet Root Servers directly, the Domain Controller forwards Internet requests to trusted upstream providers.

---

# Root Hints

Root Hints are built into the Windows DNS Server.

They allow the server to contact Internet Root DNS Servers directly when Forwarders are not configured.

During implementation we discovered that Internet name resolution already worked before configuring Forwarders.

This occurred because Windows automatically used Root Hints.

This became one of the most valuable learning moments during CR-003.

---

# DNS Resolver

A DNS Resolver answers DNS queries on behalf of clients.

Within Nova Corp:

```text
Clients

↓

pfSense Resolver

↓

Active Directory
```

Clients never communicate directly with Internet DNS servers.

Instead, they query pfSense, which then forwards enterprise queries to Active Directory when required.

---

# Authoritative DNS

An Authoritative DNS Server owns a DNS zone.

Within Nova Corp:

```text
Zone

nova.corp

↓

Authoritative Server

nova-dc01
```

Only the Domain Controller is authoritative for the **nova.corp** zone.

pfSense intentionally is **not**.

---

# Domain Override

A Domain Override instructs the pfSense DNS Resolver to forward queries for a specific domain to another DNS server.

Within Nova Corp:

```text
Client

↓

pfSense

↓

Query for:

nova.corp

↓

Forward

↓

nova-dc01
```

This allows pfSense and Active Directory to share DNS responsibilities without conflict.

---

# LDAP

Lightweight Directory Access Protocol (LDAP) is the protocol used to query and modify directory information.

Examples include:

* User accounts
* Groups
* Organizational Units
* Computer objects

Although users rarely interact with LDAP directly, it is one of the core protocols used by Active Directory.

---

# Kerberos

Kerberos is the authentication protocol used by Active Directory.

Instead of repeatedly transmitting passwords across the network, Kerberos uses time-limited authentication tickets.

This provides:

* Strong authentication
* Mutual trust
* Single Sign-On (SSO)

Future domain-joined computers within Nova Corp will authenticate using Kerberos.

---

# Engineering Notes

## Why does the Domain Controller point to itself for DNS?

Because it hosts the authoritative DNS zone.

The Domain Controller should always query itself first before forwarding unresolved requests externally.

---

## Why doesn't pfSense become authoritative for nova.corp?

Because pfSense is responsible for DNS resolution.

Active Directory is responsible for directory-aware DNS.

Separating these responsibilities creates a cleaner enterprise architecture.

---

## Why did DNS work before we configured Forwarders?

Windows DNS automatically used Root Hints.

This demonstrated the difference between Root Hints and DNS Forwarders and reinforced the importance of understanding default system behaviour before making assumptions.

---

## Why verify SRV Records?

Successful Domain Controller promotion alone does not guarantee a healthy Active Directory deployment.

SRV records prove that clients will be able to locate authentication services automatically.

---

## Why migrate the Domain Controller after networking was completed?

Critical infrastructure should only be migrated after the supporting network has been validated.

Although this migration exposed a firewall configuration issue, resolving it early strengthened the overall architecture and established a repeatable migration process for future servers.

---

# Operational Standards

The following engineering standards were established during CR-003.

## Validate DNS Before Domain Joins

A healthy DNS infrastructure is a prerequisite for Active Directory.

Never attempt to troubleshoot authentication before validating DNS.

---

## Domain Controllers Require Static Addressing

Never deploy production Domain Controllers using DHCP.

Infrastructure services should always have predictable network identities.

---

## Validate Service Discovery

Always verify:

* DNS Zones
* SRV Records
* Host Records

before considering Active Directory deployment complete.

---

## Infrastructure First

Validate networking before migrating production services.

This lesson was reinforced during the Infrastructure VLAN migration.

---

## Separate Responsibilities

Nova Corp follows a layered architecture.

* Proxmox provides virtualization.
* pfSense provides networking.
* Active Directory provides identity.
* DNS Forwarders provide Internet name resolution.

Each service performs one responsibility well rather than overlapping responsibilities.

---

# Validation Summary

| Validation Item               | Status |
| ----------------------------- | ------ |
| Active Directory Installed    | PASS   |
| Domain Controller Promotion   | PASS   |
| DNS Zone Created              | PASS   |
| A Record Verified             | PASS   |
| SRV Records Verified          | PASS   |
| Infrastructure VLAN Migration | PASS   |
| DNS Forwarders Configured     | PASS   |
| pfSense Domain Override       | PASS   |
| End-to-End DNS Resolution     | PASS   |

---

# Lessons Learned

1. Active Directory is fundamentally dependent on DNS.

2. DNS within Active Directory provides service discovery, not only hostname resolution.

3. Successful Domain Controller promotion should always be followed by DNS validation.

4. Root Hints and DNS Forwarders provide different methods of resolving Internet names.

5. pfSense and Active Directory can share DNS responsibilities without conflict.

6. Every new firewall interface requires its own firewall policy.

7. Infrastructure migration should occur only after validating the supporting network.

8. Evidence-based troubleshooting consistently produces better outcomes than trial-and-error.

9. Enterprise architecture is built through clear separation of responsibilities rather than combining services unnecessarily.

10. Understanding *why* a technology works is more valuable than memorizing the installation steps.

---

# Recovery Point

## Snapshot

```text
CR-003-ActiveDirectory-Deployed
```

Purpose:

Provides a stable rollback point before introducing:

* Secondary Domain Controller
* Active Directory Replication
* FSMO Planning
* Group Policy
* Organizational Units

---

# What This Enables

Successful completion of CR-003 establishes the identity layer of the Nova Corp infrastructure.

The following Change Requests now become possible.

* CR-004 — Deploy Secondary Domain Controller
* FSMO Role Management
* Active Directory Replication
* Organizational Unit Design
* Group Policy Objects (GPO)
* File Server Integration
* Domain-Joined Linux Servers
* Certificate Services
* Enterprise Authentication for Future Applications

Every future workload requiring centralized authentication now depends upon the services implemented during this Change Request.

---

# Final Change Outcome

## Status

**SUCCESSFUL**

Nova Corp now operates a fully functional Active Directory environment supported by an enterprise DNS architecture.

The environment provides:

* Centralized identity management
* Enterprise authentication
* Active Directory Integrated DNS
* Service discovery
* DNS forwarding
* Layered DNS architecture
* Validated enterprise networking

Most importantly, Nova Corp now possesses the identity platform upon which every future enterprise service will depend.

---

# Closing Statement

CR-003 represents one of the most significant milestones within the Nova Corp project.

The environment has evolved from isolated virtual machines into a centrally managed enterprise where authentication, DNS and networking operate together as an integrated platform.

The concepts introduced during this Change Request—identity management, DNS architecture, service discovery and evidence-based troubleshooting—will influence every future deployment within Nova Corp.

This Change Request establishes the foundation upon which the remaining enterprise infrastructure will be built.
