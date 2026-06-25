# Change Request Documentation

# CR-001 — Deploy Proxmox Virtual Environment

---

# Document Information

| Field       | Value                              |
| ----------- | ---------------------------------- |
| Change ID   | CR-001                             |
| Title       | Deploy Proxmox Virtual Environment |
| Engineer    | David Eti                          |
| Environment | Nova Corp Enterprise Lab           |
| Status      | Completed                          |
| Hostname    | nova-prox01                        |
| Hypervisor  | Proxmox VE                         |
| Date        | *(Populate when finalized)*        |

---

# Executive Summary

This Change Request documents the deployment of the Proxmox Virtual Environment (VE), which serves as the virtualization foundation for the Nova Corp enterprise infrastructure.

Rather than installing services directly on physical hardware, Nova Corp follows a virtualized architecture. Every server, firewall, monitoring platform, and DevOps tool will operate as an independent virtual machine hosted by Proxmox.

Deploying the hypervisor first establishes a stable, recoverable, and scalable platform that allows infrastructure to be built incrementally while maintaining isolation between services.

This change represents the beginning of the Nova Corp environment. Every subsequent Change Request depends on the successful completion of this deployment.

---

# Business Objectives

The objective of this change is to establish a centralized virtualization platform capable of hosting the complete Nova Corp infrastructure.

The platform must:

* Support multiple Windows and Linux virtual machines.
* Provide isolated virtual networking.
* Support snapshots and rollback.
* Allow future expansion without reinstalling infrastructure.
* Serve as the foundation for enterprise networking, security, monitoring and automation.

---

# Technical Objectives

The implementation must achieve the following technical goals:

* Deploy Proxmox VE successfully.
* Configure a dedicated management interface.
* Enable nested virtualization.
* Configure storage pools.
* Configure package repositories.
* Validate network connectivity.
* Validate package management.
* Create an initial recovery snapshot before additional infrastructure is deployed.

---

# Scope

## Included

* VMware Workstation deployment
* Proxmox installation
* Storage configuration
* Network bridge configuration
* Repository configuration
* Initial updates
* Validation testing

## Excluded

The following components are intentionally outside the scope of this Change Request:

* pfSense Firewall
* Active Directory
* DNS
* File Server
* Monitoring
* VLANs
* Kubernetes
* CI/CD
* Backup Infrastructure

These components are implemented in later Change Requests.

---

# Architecture Overview

## Physical Architecture

```text
Windows 11 Host
        │
        ▼
VMware Workstation
        │
        ▼
Proxmox VE
(nova-prox01)
```

At this stage there are no virtual machines running inside Proxmox.

The hypervisor exists solely to provide the virtualization platform upon which the remaining infrastructure will be deployed.

---

## Target Architecture

The completed Nova Corp environment will eventually resemble the following architecture.

```text
                    Windows Host
                          │
                  VMware Workstation
                          │
                    Proxmox Hypervisor
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
   pfSense           Windows Servers      Linux Servers
      │                   │                   │
      │              Active Directory     Monitoring
      │              DNS                  Kubernetes
      │              File Services        CI/CD
      │
   VLAN Routing
```

Although only Proxmox is deployed during this Change Request, the platform is intentionally designed to support the complete environment shown above.

---

# Infrastructure Specifications

## Physical Host

| Component        | Specification     |
| ---------------- | ----------------- |
| Operating System | Windows 11 Pro    |
| Processor        | AMD Ryzen 7 3800X |
| Memory           | 64 GB DDR4        |
| Storage          | NVMe SSD          |
| Virtualization   | AMD-V             |

---

## VMware Workstation Configuration

| Component             | Value              |
| --------------------- | ------------------ |
| VMware Version        | Workstation 17.6.3 |
| vCPU                  | 8                  |
| Memory                | 24 GB              |
| Disk                  | 500 GB             |
| Firmware              | UEFI               |
| Network               | Bridged            |
| Nested Virtualization | Enabled            |

---

## Proxmox Configuration

| Setting            | Value             |
| ------------------ | ----------------- |
| Hostname           | nova-prox01       |
| Management Address | 192.168.178.26/24 |
| Default Gateway    | 192.168.178.1     |
| DNS                | Home Router       |
| Storage Pool       | local             |
| Storage Pool       | local-lvm         |

---

# Storage Design

Proxmox separates storage into different pools based on purpose.

## local

Purpose:

* ISO images
* VM templates
* Backup archives
* Container templates
* Configuration files

Separating installation media from virtual disks simplifies storage management and reduces accidental deletion of production virtual machines.

---

## local-lvm

Purpose:

* Virtual machine disks
* Container disks

Unlike the **local** storage pool, **local-lvm** is optimized for block storage, making it more suitable for running operating systems and workloads.

---

# Network Design

At this stage only a single management network exists.

```text
Home Router
192.168.178.1
        │
        ▼
VMware Bridged Adapter
        │
        ▼
Proxmox Management
192.168.178.26
```

Future internal networks are intentionally **not** created during this Change Request because they depend on the deployment of the pfSense firewall.

Keeping the initial networking simple reduces variables during the hypervisor installation and makes troubleshooting easier.

---

# Design Decisions

## Why Proxmox?

Several virtualization platforms were considered before implementation.

Proxmox VE was selected because it provides enterprise virtualization capabilities while remaining free and open source.

Advantages include:

* KVM virtualization
* LXC container support
* Built-in web management
* Snapshot functionality
* Backup integration
* ZFS support
* Cluster capability
* Strong community support

These features closely resemble technologies commonly encountered in enterprise environments.

---

## Why Virtualize Instead of Using Physical Hardware?

Virtualization provides several operational advantages:

* Multiple isolated servers on one machine.
* Rapid provisioning.
* Easy recovery using snapshots.
* Hardware abstraction.
* Efficient resource utilization.
* Safe testing environment.

This approach mirrors how modern enterprise data centers operate.

---

## Why VMware Workstation?

The physical host runs Windows 11.

VMware Workstation provides a mature virtualization platform capable of hosting Proxmox while supporting nested virtualization.

This allows the lab to simulate enterprise infrastructure without requiring dedicated physical servers.

---

## Why Nested Virtualization?

Nested virtualization allows one hypervisor to run inside another.

Without nested virtualization:

```text
Windows
   │
VMware
   │
Proxmox
```

would not be able to expose virtualization features to its guest virtual machines.

Enabling nested virtualization allows Proxmox to function exactly as though it were installed on dedicated hardware.

Although this introduces a small performance overhead, it provides a realistic enterprise learning environment while using existing hardware.

---
# Implementation

This section documents the deployment procedure, configuration decisions, validation activities, and incidents encountered during the installation of Proxmox Virtual Environment.

The goal was not simply to install a hypervisor, but to establish a stable and recoverable virtualization platform that would support every future Nova Corp service.

---

# Implementation Summary

The deployment consisted of the following stages:

1. Create the Proxmox virtual machine inside VMware Workstation.
2. Enable nested virtualization.
3. Install Proxmox VE.
4. Configure management networking.
5. Validate storage pools.
6. Configure package repositories.
7. Perform system updates.
8. Create the initial recovery point.

Each stage was validated before proceeding to the next.

---

# Virtual Machine Configuration

The Proxmox virtual machine was created using the specifications defined during the design phase.

## Compute Resources

| Setting                   | Value   |
| ------------------------- | ------- |
| vCPU                      | 8       |
| Memory                    | 24 GB   |
| Disk                      | 500 GB  |
| Firmware                  | UEFI    |
| Network                   | Bridged |
| Virtualization Extensions | Enabled |

The virtual machine was configured to expose AMD-V virtualization instructions to the guest operating system, allowing Proxmox to function as a fully capable hypervisor.

---

# Initial Installation

Proxmox Virtual Environment was installed using the official installation ISO.

During installation the following values were configured:

| Setting       | Value             |
| ------------- | ----------------- |
| Hostname      | nova-prox01       |
| Management IP | 192.168.178.26/24 |
| Gateway       | 192.168.178.1     |
| DNS           | Home Router       |

The management interface provides administrative access to the hypervisor through the web interface.

At this stage no production virtual machines were deployed.

---

# Repository Configuration

Following installation, package repositories were reviewed.

The default installation referenced the enterprise repositories.

Because Nova Corp is a personal learning environment without an enterprise subscription, these repositories generated authentication failures during package updates.

The enterprise repositories were disabled and replaced with the official **No-Subscription Repository**.

This allows security updates and package maintenance while remaining compatible with the Community Edition.

---

# Validation Testing

Each deployment stage was validated before continuing.

## Test 1 — Management Interface

### Objective

Verify administrative access to the Proxmox web interface.

### Validation

Successfully accessed:

```text
https://192.168.178.26:8006
```

### Result

PASS

---

## Test 2 — Storage Pools

### Objective

Verify storage pools were created correctly.

### Validation

Confirmed the presence of:

* local
* local-lvm

### Result

PASS

---

## Test 3 — Repository Synchronization

### Objective

Verify package repositories function correctly.

### Command

```bash
apt update
```

### Expected Result

Package indexes download successfully.

### Actual Result

Repository synchronization completed successfully after repository correction.

### Result

PASS

---

## Test 4 — Package Upgrade

### Objective

Verify package installation functionality.

### Command

```bash
apt full-upgrade
```

### Result

System packages upgraded successfully.

### Result

PASS

---

# Incident Report — INC-001

# Nested Virtualization Failure

---

## Symptoms

During the initial deployment the Proxmox installer failed to boot correctly inside VMware Workstation.

VMware displayed virtualization-related errors including:

* AMD-V/RVI unavailable
* VPMC related failures
* Hardware virtualization unavailable

The installation could not proceed.

---

## Initial Hypothesis

Possible causes included:

* VMware configuration error
* Nested virtualization disabled
* Windows Hyper-V conflict
* BIOS virtualization disabled
* Virtualization Based Security (VBS)

---

## Evidence Collection

The following command was executed from Windows:

```powershell
systeminfo
```

The output indicated:

* Hypervisor detected
* Virtualization services active
* Windows operating as a hypervisor

This suggested another hypervisor was already consuming the CPU virtualization extensions.

---

## Root Cause

Windows Hyper-V and related virtualization technologies had reserved AMD-V instructions before VMware started.

Because VMware could not access these virtualization extensions, it was unable to expose them to the Proxmox virtual machine.

Without AMD-V, Proxmox cannot function as a hypervisor.

---

## Resolution

The following actions were completed:

* Disabled Hyper-V
* Disabled Virtualization Based Security
* Disabled conflicting Windows virtualization features
* Rebooted the physical host
* Revalidated virtualization support

---

## Validation

The Proxmox installer booted successfully after the host reboot.

Nested virtualization operated normally.

Status:

PASS

---

## Why the Fix Worked

A processor can only expose hardware virtualization extensions to one hypervisor at a time.

By disabling Hyper-V, VMware regained exclusive access to AMD-V.

VMware was then able to pass these instructions through to Proxmox using nested virtualization.

---

## Prevention

Before deploying nested hypervisors:

* Verify BIOS virtualization is enabled.
* Disable Hyper-V if VMware Workstation is being used.
* Verify nested virtualization is enabled in VMware.
* Reboot after changing Windows virtualization settings.

---

# Incident Report — INC-002

# Enterprise Repository Authentication Failure

---

## Symptoms

Package updates failed immediately after installation.

The following error appeared during synchronization:

```text
401 Unauthorized
```

---

## Initial Hypothesis

Possible causes included:

* Internet connectivity
* DNS failure
* Repository outage
* Authentication failure

---

## Evidence Collection

Repository definitions were inspected.

Observed repository files:

```text
/etc/apt/sources.list.d/
```

Contained:

* pve-enterprise.sources
* ceph.sources

These repositories pointed to the enterprise subscription service.

---

## Root Cause

The default Proxmox installation enables repositories that require a paid enterprise subscription.

Because Nova Corp uses the Community Edition, authentication failed.

---

## Resolution

Completed the following:

* Disabled enterprise repositories.
* Enabled the official No-Subscription repository.
* Updated package indexes.

Executed:

```bash
apt update
```

---

## Validation

Repository synchronization completed successfully.

Package upgrades installed normally.

Status:

PASS

---

## Why the Fix Worked

The Community Edition repository does not require authentication.

Replacing the enterprise repository allowed package management to communicate with publicly available package mirrors.

---

## Prevention

Always verify repository configuration immediately after installing Proxmox Community Edition.

Do not assume the default repositories match the edition being deployed.

---

# Operational Notes

Before deploying any production virtual machines, verify:

* Management interface accessible.
* Package repositories functioning.
* Storage pools healthy.
* System fully updated.
* Recovery snapshot created.

This checklist becomes the baseline health verification for every future Nova Corp deployment.

---
# Technical Concepts

This section summarizes the key technologies introduced during this Change Request.

The objective is not to provide exhaustive theory, but to create a concise engineering reference that can be reviewed quickly before future deployments.

---

# Hypervisor

A hypervisor is software responsible for creating, running and managing virtual machines.

Instead of installing multiple operating systems directly on physical hardware, the hypervisor abstracts the hardware and shares it between isolated virtual machines.

For Nova Corp, Proxmox becomes the infrastructure layer that hosts every future server.

Without the hypervisor, none of the remaining Change Requests can exist.

---

# Type-1 vs Type-2 Hypervisors

Hypervisors are generally classified into two categories.

## Type-1 Hypervisor

Runs directly on hardware.

Examples:

* Proxmox VE
* VMware ESXi
* Microsoft Hyper-V Server

Advantages:

* Better performance
* Direct hardware access
* Enterprise deployments

---

## Type-2 Hypervisor

Runs on top of an existing operating system.

Examples:

* VMware Workstation
* VirtualBox

Advantages:

* Easier for desktop labs
* Simple installation
* Excellent for testing

---

## Nova Corp Implementation

Although Proxmox is technically a Type-1 hypervisor, it is running inside VMware Workstation.

The architecture therefore becomes:

```text
Windows Host
        │
VMware Workstation
(Type-2)
        │
Proxmox VE
(Type-1)
        │
Future Infrastructure
```

This approach allows enterprise infrastructure to be simulated using a single physical workstation.

---

# Nested Virtualization

Nested virtualization allows one hypervisor to expose hardware virtualization features to another hypervisor.

Without nested virtualization:

```text
Windows
    │
VMware
    │
Proxmox
```

Proxmox would not be capable of creating virtual machines.

With nested virtualization enabled:

```text
Windows
     │
VMware
     │
AMD-V
     │
Proxmox
     │
Virtual Machines
```

This capability is fundamental to the Nova Corp lab.

---

# Linux Bridge

A Linux Bridge behaves similarly to a physical Ethernet switch.

Virtual machines connect to bridges rather than physical network adapters.

The primary bridge created during this Change Request is:

```text
vmbr0
```

At this stage:

```text
Home Router
      │
      ▼
vmbr0
      │
      ▼
Proxmox Management
```

Future Change Requests will introduce:

* vmbr1
* VLAN-aware bridges
* Internal enterprise networking

---

# Storage Pools

Proxmox separates storage according to purpose.

## local

Stores:

* ISO images
* Backups
* Templates
* Container images

Think of this as the "file storage" area.

---

## local-lvm

Stores:

* Virtual machine disks
* Container disks

Think of this as the "production storage" area where operating systems actually run.

Separating these storage pools simplifies management and improves organization.

---

# Recovery Snapshots

A snapshot captures the state of a virtual machine at a specific point in time.

Snapshots allow administrators to roll back failed changes without reinstalling an operating system.

Nova Corp follows a simple operational rule:

> Every major Change Request must end with a recovery point before the next Change Request begins.

This greatly reduces risk during experimentation.

---

# Engineering Notes

## Why build Proxmox before everything else?

Every future service depends on a functioning virtualization platform.

Installing Active Directory before Proxmox would be equivalent to constructing a building before pouring the foundation.

Infrastructure should always be deployed from the lowest dependency upward.

---

## Why only one network initially?

Complexity should be introduced gradually.

Beginning with a single management network allows the hypervisor to be validated before introducing routing, VLANs and firewalls.

Reducing variables simplifies troubleshooting.

---

## Why perform validation after every change?

Infrastructure should never be assumed to be functioning.

Every significant change must be verified before the next dependency is introduced.

Following this principle makes failures easier to isolate.

---

# Validation Summary

| Validation Item          | Status |
| ------------------------ | ------ |
| Proxmox Installation     | PASS   |
| Management Interface     | PASS   |
| Repository Configuration | PASS   |
| Package Updates          | PASS   |
| Storage Pools            | PASS   |
| Initial System Health    | PASS   |

---

# Lessons Learned

The deployment provided several important engineering lessons.

1. Hardware virtualization can only be consumed by one hypervisor at a time.

2. Evidence should always be collected before attempting a fix.

3. Default software configurations are not always appropriate for lab environments.

4. Separating storage by function improves long-term maintainability.

5. Building infrastructure layer-by-layer simplifies troubleshooting.

6. Recovery points should become part of every deployment workflow rather than an afterthought.

7. Understanding *why* a configuration exists is more valuable than memorizing commands.

---

# Recovery Point

## Snapshot

```text
CR-001-Proxmox-Installed
```

Purpose:

Provides a known-good rollback point before deploying pfSense and internal networking.

Rollback should always be considered before introducing infrastructure that depends on the hypervisor.

---

# What This Enables

Successful completion of CR-001 establishes the foundation for the remaining Nova Corp environment.

The following Change Requests depend directly on this deployment:

* CR-002 — Deploy pfSense Firewall
* CR-003 — Deploy Active Directory Domain Controller
* CR-004 — Deploy Secondary Domain Controller
* CR-005 — Deploy File Server
* CR-006 — Deploy Monitoring Stack
* CR-007 — Deploy Automation Infrastructure
* Future Kubernetes Cluster
* Future CI/CD Platform
* Future Cloud Integration

Without CR-001, none of the above services can exist.

---

# Final Change Outcome

## Status

**SUCCESSFUL**

Proxmox Virtual Environment has been successfully deployed, validated and documented.

The virtualization platform is stable, fully operational and ready to host the remaining Nova Corp enterprise infrastructure.

All validation tests passed following remediation of the identified installation issues.

The environment now provides:

* Enterprise-grade virtualization
* Stable management access
* Functional package management
* Organized storage
* Recovery capability through snapshots

This Change Request officially establishes the foundation of the Nova Corp Enterprise Lab.

---

# Closing Statement

CR-001 represents far more than the installation of a hypervisor.

It establishes the first layer of a dependency-driven enterprise infrastructure where every future service will build upon the one before it.

The principles introduced in this Change Request—evidence-based troubleshooting, incremental deployment, validation before progression and thorough documentation—will remain the standard for every subsequent Change Request within the Nova Corp project.

---
# Appendix A — Commands Used

# CR-001 — Deploy Proxmox Virtual Environment

This appendix documents the commands used throughout CR-001.

The purpose is not to memorize commands, but to understand **when** they are useful and **what evidence** they provide during troubleshooting.

---

## Windows Host

### systeminfo

```powershell
systeminfo
```

### Purpose

Display operating system information and virtualization status.

### Used During

INC-001 — Nested Virtualization Failure

### What We Verified

* Hypervisor detected
* Windows virtualization services enabled
* Hyper-V consuming AMD-V instructions

### Why It Was Important

This command confirmed the issue was not with VMware or Proxmox, but with the Windows virtualization stack.

---

## Proxmox

### apt update

```bash
apt update
```

### Purpose

Synchronize package indexes with configured repositories.

### Used During

Repository validation.

### What We Verified

* Repository connectivity
* Repository authentication
* Internet connectivity

### Why It Was Important

Confirmed the repository configuration was functioning correctly after replacing the Enterprise repository.

---

### apt full-upgrade

```bash
apt full-upgrade
```

### Purpose

Upgrade installed packages.

### Used During

Initial system validation.

### What We Verified

* Package management operational
* Repository configuration correct
* System successfully updated

---

## Repository Investigation

Reviewed:

```text
/etc/apt/sources.list.d/
```

### Purpose

Inspect configured package repositories.

### Used During

INC-002 — Repository Authentication Failure

### What We Learned

Confirmed the system was using Enterprise repositories that require a paid subscription.

---

# Troubleshooting Toolkit Learned

| Command            | Purpose                    | Evidence Provided                          |
| ------------------ | -------------------------- | ------------------------------------------ |
| `systeminfo`       | Windows system information | Hyper-V and virtualization status          |
| `apt update`       | Synchronize repositories   | Repository connectivity and authentication |
| `apt full-upgrade` | Upgrade packages           | Package management health                  |

---

# Engineering Takeaway

Commands should never be executed simply because they are common.

Each command should answer a specific engineering question.

During CR-001 every command was selected to gather evidence, reduce possible causes and verify the success of corrective actions.
