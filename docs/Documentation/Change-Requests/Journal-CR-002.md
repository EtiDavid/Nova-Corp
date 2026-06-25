# Change Request Documentation

# CR-002 — Deploy pfSense Enterprise Firewall & Network Foundation

---

# Document Information

| Field       | Value                                                   |
| ----------- | ------------------------------------------------------- |
| Change ID   | CR-002                                                  |
| Title       | Deploy pfSense Enterprise Firewall & Network Foundation |
| Engineer    | David Eti                                               |
| Environment | Nova Corp Enterprise Lab                                |
| Status      | Completed                                               |
| Hostname    | nova-fw01                                               |
| Platform    | pfSense Community Edition                               |

---

# Executive Summary

This Change Request documents the deployment of the pfSense firewall, which establishes the first enterprise security boundary within the Nova Corp environment.

Where CR-001 provided the virtualization platform, CR-002 introduces the networking layer responsible for routing, traffic segmentation, DHCP services, firewall enforcement, backup operations and future enterprise security policies.

The firewall becomes the central networking component of Nova Corp. Every virtual machine deployed after this point communicates through pfSense, allowing traffic to be controlled, monitored and secured.

During implementation the environment evolved beyond a basic firewall deployment into a segmented enterprise network supporting multiple VLANs, dedicated management networks and backup operations.

---

# Business Objectives

Deploy a secure network foundation capable of supporting an enterprise environment.

The solution must:

* Separate internal infrastructure from the home network.
* Provide centralized routing.
* Deliver DHCP services.
* Support future VLAN segmentation.
* Prepare the environment for Active Directory.
* Support future monitoring, automation and Kubernetes workloads.
* Protect future infrastructure through firewall enforcement.

---

# Technical Objectives

The implementation must achieve the following technical goals:

* Deploy pfSense Community Edition.
* Configure WAN and LAN interfaces.
* Create an isolated internal bridge (vmbr1).
* Configure internal routing.
* Deploy VLAN architecture.
* Configure DHCP scopes.
* Validate gateway connectivity.
* Configure backup strategy.
* Configure scheduled backups.
* Configure email notifications.
* Validate backup restoration.
* Prepare the environment for Active Directory deployment.

---

# Scope

## Included

* pfSense deployment
* WAN configuration
* LAN configuration
* vmbr1 implementation
* Internal routing
* VLAN implementation
* DHCP configuration
* Firewall baseline configuration
* Scheduled backups
* Backup retention
* Email notifications
* Restore validation

---

## Excluded

The following components are intentionally outside the scope of this Change Request:

* Active Directory
* DNS
* Group Policy
* File Server
* Monitoring Stack
* Ansible
* CI/CD
* Kubernetes

These services depend on the successful completion of this networking foundation.

---

# Architecture Before

Following CR-001 the environment consisted of only the virtualization platform.

```text
Windows 11 Host
        │
VMware Workstation
        │
Proxmox
        │
Management Network
```

No internal routing existed.

No firewall existed.

Every future server would have required direct access to the home network.

---

# Architecture After

CR-002 introduces the enterprise networking layer.

```text
                  Internet
                      │
              Home Router
                      │
                  vmbr0 (WAN)
                      │
                 pfSense WAN
                      │
               pfSense Firewall
                      │
                 pfSense LAN
                      │
                 vmbr1 (LAN)
                      │
      ┌───────────────┼────────────────┐
      │               │                │
   VLAN 10         VLAN 20         VLAN 30
    MGMT            INFRA             APP
      │               │                │
      │               │                │
   Future         Domain Controllers   Linux Servers
   Management     Infrastructure       Applications
```

This architecture establishes a clear separation between the external network and all internal Nova Corp services.

---

# Infrastructure Specifications

## pfSense Virtual Machine

| Resource         | Value      |
| ---------------- | ---------- |
| Platform         | Proxmox VE |
| Operating System | pfSense CE |
| vCPU             | 2          |
| Memory           | 2 GB       |
| Disk             | 16 GB      |
| WAN Interface    | vmbr0      |
| LAN Interface    | vmbr1      |

---

# Network Design

## WAN

Purpose:

Provide connectivity to the existing home network and Internet.

Configuration:

| Setting            | Value       |
| ------------------ | ----------- |
| Bridge             | vmbr0       |
| Address Assignment | DHCP        |
| Upstream Gateway   | Home Router |

The WAN interface receives its address dynamically from the home router.

The WAN interface should never host internal enterprise services.

---

## LAN

Purpose:

Provide a dedicated internal enterprise network isolated from the home network.

Configuration:

| Setting         | Value         |
| --------------- | ------------- |
| Bridge          | vmbr1         |
| Initial Network | 10.99.99.0/24 |
| Gateway         | 10.99.99.1    |

Unlike vmbr0, vmbr1 has no physical network adapter attached.

It exists solely as an internal virtual switch connecting Nova Corp infrastructure.

This design ensures every internal packet must traverse the pfSense firewall before reaching another network.

---

# VLAN Architecture

As the environment evolved, the single LAN was segmented into dedicated VLANs.

| VLAN | Name   | Network       | Purpose                |
| ---- | ------ | ------------- | ---------------------- |
| 10   | MGMT   | 10.10.10.0/24 | Management interfaces  |
| 20   | INFRA  | 10.10.20.0/24 | Infrastructure servers |
| 30   | APP    | 10.10.30.0/24 | Application servers    |
| 40   | CLIENT | 10.10.40.0/24 | User workstations      |
| 50   | DMZ    | 10.10.50.0/24 | Public-facing services |

This segmentation limits broadcast traffic, improves security and allows firewall policies to be applied between departments.

---

# Design Decisions

## Why pfSense?

pfSense was selected because it combines enterprise networking capabilities with an open-source platform suitable for learning and production-style labs.

Key capabilities include:

* Stateful firewall
* Routing
* NAT
* DHCP
* DNS Resolver
* VLAN support
* VPN services
* Monitoring
* Backup integration

These features make pfSense an excellent platform for simulating enterprise networking.

---

## Why Two Network Interfaces?

A firewall separates networks.

Without separate interfaces, traffic cannot be inspected or controlled.

Nova Corp therefore implements:

```text
WAN
↓

Firewall

↓

LAN
```

Every packet entering or leaving the enterprise network must pass through pfSense.

This mirrors real-world perimeter firewall deployments.

---

## Why vmbr1?

The internal bridge provides complete isolation from the home network.

Unlike vmbr0, which connects directly to the physical LAN, vmbr1 exists entirely within Proxmox.

Every future virtual machine connects to vmbr1 rather than directly to the home router.

This guarantees that all internal communication passes through pfSense.

---

## Why VLAN Segmentation?

Rather than placing every server on a single network, Nova Corp separates systems according to their function.

Benefits include:

* Reduced broadcast domains.
* Improved security.
* Easier troubleshooting.
* Granular firewall policies.
* Better scalability.

This design closely resembles enterprise environments where servers, clients and management systems rarely share the same subnet.

---

## Why Build Firewall Rules Incrementally?

The firewall was intentionally configured with broad allow rules during the build phase.

Restrictive security policies will be introduced only after services have been deployed and validated.

This approach reduces troubleshooting complexity while infrastructure is under construction.

As additional services are introduced, firewall rules will evolve according to business requirements following the principle of least privilege.

---
# Implementation

This section documents the deployment, configuration and validation of the Nova Corp network infrastructure.

Unlike CR-001, this Change Request introduced multiple networking technologies simultaneously, including routing, VLAN segmentation, DHCP services and firewall configuration.

Each configuration was validated before introducing additional dependencies.

---

# Implementation Summary

The deployment was completed in the following phases:

1. Deploy pfSense virtual machine.
2. Configure WAN and LAN interfaces.
3. Create isolated internal bridge (vmbr1).
4. Validate Internet connectivity.
5. Configure VLAN-aware networking.
6. Create enterprise VLANs.
7. Configure VLAN gateways.
8. Configure DHCP scopes.
9. Validate inter-VLAN routing.
10. Configure backup strategy.
11. Validate backup restoration.
12. Configure email notifications.

Each phase was verified before progressing to the next.

---

# pfSense Deployment

The pfSense virtual machine was deployed onto the Proxmox hypervisor using the Community Edition installer.

The virtual machine was provisioned with dedicated WAN and LAN interfaces.

Immediately after installation the console configuration wizard was used to assign interfaces and configure initial network settings.

The firewall then became the default gateway for every future Nova Corp server.

---

# WAN Configuration

The WAN interface was connected to:

```text
vmbr0
```

Purpose:

* Internet access
* Package downloads
* Software updates
* External connectivity

The interface obtained an address automatically from the home router using DHCP.

Validation confirmed successful upstream connectivity.

---

# LAN Configuration

The LAN interface was connected to:

```text
vmbr1
```

Unlike the WAN bridge, vmbr1 exists entirely within Proxmox and has no physical uplink.

This creates an isolated internal enterprise network.

Initially a temporary management subnet was configured before the environment evolved into the final VLAN architecture.

---

# VLAN Implementation

Following successful firewall deployment, the internal network was redesigned into multiple VLANs.

Configured VLANs:

| VLAN | Network       | Purpose        |
| ---- | ------------- | -------------- |
| 10   | 10.10.10.0/24 | Management     |
| 20   | 10.10.20.0/24 | Infrastructure |
| 30   | 10.10.30.0/24 | Applications   |
| 40   | 10.10.40.0/24 | Clients        |
| 50   | 10.10.50.0/24 | DMZ            |

Each VLAN received:

* Dedicated gateway
* DHCP scope
* Firewall interface
* Independent broadcast domain

---

# DHCP Configuration

DHCP services were configured individually for each VLAN.

Each scope provides:

* IP address allocation
* Default gateway
* DNS configuration
* Lease management

This centralized address management simplifies future infrastructure deployment.

---

# Backup Strategy

Before introducing production infrastructure, a backup strategy was implemented.

Configuration included:

* Scheduled backups
* Retention policy
* Backup storage
* Email notifications
* Restore validation

This ensures the firewall can be recovered rapidly following configuration errors or infrastructure failures.

---

# Restore Validation

Backups should never be assumed to work.

A restore test was performed to validate:

* Backup integrity
* Recovery process
* Configuration preservation

Successful restoration confirmed the backup strategy is operational.

---

# Email Notifications

Email alerts were configured to notify administrators of backup failures.

This provides early warning of operational issues that might otherwise remain undetected until recovery is required.

---

# Validation Testing

## Test 1 — WAN Connectivity

### Objective

Verify Internet connectivity.

### Validation

Successfully reached upstream gateway.

### Result

PASS

---

## Test 2 — GUI Accessibility

### Objective

Verify administrative interface availability.

### Validation

Successfully accessed the pfSense web interface.

### Result

PASS

---

## Test 3 — VLAN Gateway Validation

### Objective

Verify each VLAN interface responded correctly.

### Validation

Confirmed:

* VLAN gateways reachable
* Interface status UP
* Correct addressing

### Result

PASS

---

## Test 4 — DHCP Services

### Objective

Verify DHCP assignment.

### Validation

Clients successfully received:

* IP Address
* Gateway
* DNS Server

### Result

PASS

---

## Test 5 — Backup Execution

### Objective

Verify scheduled backup functionality.

### Validation

Backup completed successfully.

### Result

PASS

---

## Test 6 — Restore Validation

### Objective

Verify backup recovery.

### Validation

Configuration restored successfully.

### Result

PASS

---

# Incident Report — INC-003

# VLAN Connectivity Failure

---

## Symptoms

Virtual machines connected to VLAN interfaces could not communicate with pfSense.

Gateway addresses were unreachable.

Network communication failed.

---

## Initial Hypotheses

Possible causes included:

* Incorrect VLAN tagging
* Missing gateway
* Incorrect subnet
* DHCP failure
* Firewall blocking traffic

---

## Investigation

Verified:

* VLAN interfaces
* Gateway addresses
* DHCP configuration
* Proxmox bridge configuration

Each component appeared correctly configured.

---

## Root Cause

Virtual machine interfaces remained VLAN tagged while pfSense was already performing VLAN tagging on the trunk interface.

Traffic became effectively double-tagged and was not processed correctly.

---

## Resolution

Removed VLAN tags from the affected virtual machine network adapters.

Allowed pfSense to perform all VLAN tagging.

---

## Validation

Clients immediately obtained connectivity.

Gateway communication restored.

Status:

PASS

---

## Why the Fix Worked

Only one device should apply IEEE 802.1Q tags to a frame.

In Nova Corp, pfSense performs VLAN tagging while virtual machines remain connected to the trunk without individual VLAN tags.

---

## Prevention

Future virtual machines connected to vmbr1 should remain untagged unless intentionally connected to an access network.

Document the trunk design before deploying additional servers.

---

# Incident Report — INC-004

# Firewall Rules Not Taking Effect

---

## Symptoms

Firewall rules were configured correctly but traffic continued to behave as though the previous rule set was active.

Expected communication remained blocked.

---

## Initial Hypotheses

Possible causes included:

* Incorrect rule order
* Wrong interface
* Stateful firewall cache
* Routing issue
* pfSense configuration failure

---

## Investigation

Rules were reviewed and validated.

Routing configuration appeared correct.

Configuration matched the intended design.

Despite this, traffic still behaved unexpectedly.

---

## Root Cause

The firewall configuration was not fully applied until pfSense was restarted.

After rebooting, the updated rule set became active.

---

## Resolution

Restarted pfSense.

Validated firewall behaviour after reboot.

---

## Validation

Traffic immediately behaved according to the configured rule set.

Status:

PASS

---

## Why the Fix Worked

Although pfSense normally applies firewall changes immediately, certain internal services or state information can occasionally require a restart before all components reload correctly.

Restarting the firewall forced all networking services and packet filtering components to reload using the updated configuration.

---

## Prevention

If firewall behaviour differs from the configured rules:

* Verify rule order.
* Verify interface assignment.
* Apply changes.
* Inspect firewall logs.
* Restart pfSense only after configuration has been validated.

A reboot should be treated as a troubleshooting step rather than the first solution.

---

# Operational Notes

The firewall is intentionally configured with permissive rules during the infrastructure build.

As Nova Corp grows, firewall policies will evolve based on business requirements.

Future services such as Active Directory, monitoring, Kubernetes and CI/CD will each introduce new firewall rules following the principle of least privilege.

The firewall should therefore be viewed as a living security policy rather than a one-time configuration.

---
# Technical Concepts

This section summarizes the networking technologies introduced during CR-002.

The objective is to create a concise engineering reference that explains the purpose of each technology within the Nova Corp environment.

---

# Firewall

A firewall is a network security device that controls traffic moving between different networks.

Unlike a router, which simply forwards packets, a firewall makes decisions based on security policies.

In Nova Corp, pfSense becomes the security boundary between the home network and every internal enterprise service.

Every packet entering or leaving the enterprise network passes through the firewall.

---

# WAN

WAN (Wide Area Network) represents the external network.

Within Nova Corp the WAN interface connects pfSense to the home router and ultimately to the Internet.

Responsibilities include:

* Internet connectivity
* Software updates
* External communication

Enterprise services should never be hosted directly on the WAN interface.

---

# LAN

LAN (Local Area Network) represents the protected internal enterprise network.

Initially Nova Corp operated with a single LAN before evolving into multiple VLANs.

The LAN exists to isolate enterprise resources from external networks.

---

# Virtual Bridges

Proxmox uses Linux Bridges to connect virtual machines.

## vmbr0

Purpose:

* Physical connectivity
* Internet access
* WAN traffic

Connected directly to the physical network adapter.

---

## vmbr1

Purpose:

* Internal enterprise network
* Isolated virtual switch
* Communication between enterprise virtual machines

Unlike vmbr0, vmbr1 has no physical connection.

Every internal packet must therefore pass through pfSense before reaching another network.

This creates a realistic enterprise network topology.

---

# VLANs

A VLAN (Virtual Local Area Network) divides one physical network into multiple logical networks.

Instead of placing every server on one subnet, Nova Corp separates infrastructure according to business function.

Current VLAN design:

| VLAN | Purpose             |
| ---- | ------------------- |
| 10   | Management          |
| 20   | Infrastructure      |
| 30   | Application Servers |
| 40   | Client Devices      |
| 50   | DMZ                 |

Benefits include:

* Reduced broadcast traffic
* Better security
* Easier troubleshooting
* Independent firewall policies
* Improved scalability

---

# Trunk vs Access Connections

One of the most important concepts learned during this Change Request was the difference between trunk and access connections.

A trunk connection carries traffic for multiple VLANs simultaneously.

```text
Switch
   │
Trunk
   │
pfSense
```

An access connection belongs to only one VLAN.

```text
Switch
   │
Access
   │
Client
```

Within Nova Corp:

* vmbr1 acts as the trunk.
* pfSense performs VLAN tagging.
* Virtual machines remain untagged unless intentionally connected to a single access VLAN.

Understanding this distinction was critical to resolving the VLAN connectivity issue encountered during implementation.

---

# Routing

Routing is the process of moving packets between different networks.

Without routing:

```text
10.10.20.x
```

cannot communicate with

```text
10.10.30.x
```

pfSense becomes the router responsible for forwarding traffic between Nova Corp VLANs.

Every VLAN therefore has its own gateway.

---

# DHCP

Dynamic Host Configuration Protocol (DHCP) automatically provides network configuration to devices.

Instead of manually configuring every virtual machine, DHCP assigns:

* IP address
* Subnet mask
* Default gateway
* DNS server

This greatly simplifies infrastructure deployment as additional servers are introduced.

---

# Backups

Backups provide the ability to recover from configuration mistakes, corruption or hardware failure.

A backup should never be considered successful until a restore has been tested.

During this Change Request:

* Scheduled backups were configured.
* Email notifications were enabled.
* Restore testing was successfully completed.

This established the first disaster recovery capability within Nova Corp.

---

# Engineering Notes

## Why create vmbr1?

Connecting every virtual machine directly to vmbr0 would bypass the firewall entirely.

By introducing vmbr1, every internal server must communicate through pfSense.

This mirrors how enterprise environments isolate internal infrastructure.

---

## Why use VLANs?

As infrastructure grows, placing every system on one network becomes difficult to manage.

VLANs provide logical separation without requiring additional physical network hardware.

This allows security policies to be applied between departments while sharing the same physical infrastructure.

---

## Why were firewall rules kept simple initially?

During infrastructure construction, broad firewall policies reduce troubleshooting complexity.

Restrictive security policies are introduced only after services have been validated.

This follows an incremental deployment philosophy.

---

## Why test restores instead of only backups?

A backup file has no value unless it can be restored successfully.

Recovery validation is therefore considered just as important as backup creation.

Nova Corp treats backup verification as a mandatory deployment step.

---

# Operational Standards

The following operational principles were established during CR-002.

## Validate Before Expanding

New infrastructure should not be deployed until the underlying network has been fully validated.

---

## Evidence Before Assumptions

Configuration changes should be driven by observed evidence rather than guessing.

When troubleshooting:

Observe

↓

Collect Evidence

↓

Form Hypothesis

↓

Test

↓

Fix

↓

Validate

---

## Backup Before Major Changes

Every significant infrastructure modification should begin with:

* Backup
* Snapshot
* Rollback plan

Recovery should never depend upon memory alone.

---

## Keep Security Incremental

Firewall rules should evolve alongside infrastructure.

Avoid implementing highly restrictive security policies before services exist.

Build first.

Secure second.

Harden continuously.

---

# Validation Summary

| Validation Item     | Status |
| ------------------- | ------ |
| WAN Connectivity    | PASS   |
| LAN Connectivity    | PASS   |
| VLAN Interfaces     | PASS   |
| DHCP Services       | PASS   |
| Routing             | PASS   |
| Backup Execution    | PASS   |
| Restore Testing     | PASS   |
| Email Notifications | PASS   |

---

# Lessons Learned

The deployment introduced several important networking and operational concepts.

1. Enterprise firewalls are central routing devices, not simply packet filters.

2. VLANs provide logical segmentation without requiring additional physical hardware.

3. Only one device should perform VLAN tagging on a trunk.

4. Backup validation is just as important as backup creation.

5. Building infrastructure incrementally reduces troubleshooting complexity.

6. Security policies should evolve alongside business requirements.

7. Every networking problem should be approached systematically using evidence rather than assumptions.

8. Well-documented recovery procedures are part of the infrastructure, not an afterthought.

---

# Recovery Point

## Snapshot

```text
CR-002-pfSense-Network-Foundation
```

## Backup

Configuration backup successfully created.

Restore successfully validated.

Email notifications operational.

The environment can now be safely recovered before introducing Active Directory.

---

# What This Enables

Completion of CR-002 establishes the enterprise networking foundation required for all remaining infrastructure.

The following Change Requests depend directly on this implementation:

* CR-003 — Deploy Active Directory Domain Controller
* CR-004 — Deploy Secondary Domain Controller
* CR-005 — Deploy File Services
* CR-006 — Deploy Monitoring Platform
* CR-007 — Deploy Automation Platform
* Future Kubernetes Cluster
* Future CI/CD Platform
* Future Cloud Integration

Every future server deployed within Nova Corp will communicate through the network foundation established during this Change Request.

---

# Final Change Outcome

## Status

**SUCCESSFUL**

The Nova Corp network foundation has been successfully deployed, validated and documented.

The environment now provides:

* Enterprise firewall
* Internal routing
* VLAN segmentation
* DHCP services
* Backup strategy
* Restore capability
* Email alerting
* Recovery planning

Most importantly, the environment now possesses a dedicated enterprise network capable of supporting every future Nova Corp workload.

---

# Closing Statement

CR-002 marks the transition from a standalone virtualization platform to a true enterprise network.

The introduction of pfSense, internal routing, VLAN segmentation and disaster recovery transforms Nova Corp into an environment where future services can be deployed securely and predictably.

The engineering principles introduced during this Change Request—incremental deployment, evidence-based troubleshooting, validated recovery and network segmentation—will continue to guide every subsequent phase of the Nova Corp project.

---

# Appendix A — Commands Used

# CR-002 — Deploy pfSense Enterprise Firewall & Network Foundation

This appendix documents the commands used while deploying and troubleshooting the Nova Corp network infrastructure.

Each command represents evidence collected during investigation rather than routine administration.

---

## ping

```bash
ping <IP Address>
```

### Purpose

Verify Layer 3 connectivity.

### Used During

* Gateway validation
* VLAN troubleshooting
* Internet connectivity testing

### What We Verified

* Gateway reachable
* Remote hosts reachable
* Routing functioning correctly

---

## arp

```bash
arp -an
```

### Purpose

Display the ARP table.

### Used During

Initial pfSense deployment.

### What We Verified

* Neighbor discovery
* Layer 2 communication
* MAC address resolution

### Why It Was Important

Confirmed the firewall could communicate on the local network before investigating higher networking layers.

---

## pfctl

```bash
pfctl -sr
```

### Purpose

Display active firewall rules.

### Used During

Firewall troubleshooting.

### What We Verified

* Rules successfully loaded
* Anti-lockout rule present
* Default LAN rules active

---

## sockstat

```bash
sockstat -4 -l
```

### Purpose

Display listening services.

### Used During

GUI accessibility investigation.

### What We Verified

Confirmed nginx was actively listening on TCP port 443.

This proved the management service itself was functioning.

---

## curl

```bash
curl -k https://<pfSense-IP>
```

### Purpose

Retrieve the web interface directly.

### Used During

GUI troubleshooting.

### What We Verified

Received HTML successfully.

Confirmed the web service was operational even when browser access appeared problematic.

---

## ifconfig

```bash
ifconfig
```

### Purpose

Display interface configuration.

### Used During

VLAN troubleshooting.

### What We Verified

* Interface status
* IP addresses
* VLAN interfaces
* Link state

---

# Troubleshooting Toolkit Learned

| Command          | Purpose                | Evidence Provided                     |
| ---------------- | ---------------------- | ------------------------------------- |
| `ping`           | Layer 3 connectivity   | Reachability between hosts            |
| `arp -an`        | Layer 2 validation     | Neighbor discovery and MAC resolution |
| `pfctl -sr`      | Firewall inspection    | Active firewall rule set              |
| `sockstat -4 -l` | Service validation     | GUI service listening on port 443     |
| `curl -k`        | Web service validation | Verified HTTPS responses directly     |
| `ifconfig`       | Interface inspection   | VLANs, addressing and interface state |

---

# Engineering Takeaway

One of the most valuable lessons from CR-002 was learning to troubleshoot from the bottom of the network stack upward.

Rather than assuming the firewall was responsible for every networking problem, evidence was gathered progressively:

1. Verify Layer 1/2 connectivity.
2. Verify interface configuration.
3. Verify routing.
4. Verify firewall rules.
5. Verify services.

This systematic approach reduced guesswork and made root causes significantly easier to identify.
