# Change Request Documentation

# CR-001 — Deploy Proxmox Hypervisor

## Change Information

| Field       | Value                     |
| ----------- | ------------------------- |
| Change ID   | CR-001                    |
| Title       | Deploy Proxmox Hypervisor |
| Engineer    | David                     |
| Status      | Completed                 |
| Environment | Nova Corp Lab             |
| Hostname    | nova-prox01               |

---

# Executive Summary

The objective of this change request was to deploy Proxmox Virtual Environment (VE) as the foundational virtualization platform for the Nova Corp enterprise lab.

Proxmox serves as the primary hypervisor responsible for hosting all future infrastructure components including:

* pfSense Firewall
* Active Directory Domain Controllers
* File Servers
* Monitoring Systems
* Linux Servers
* Kubernetes Nodes
* DevOps Tooling

This deployment establishes the base platform upon which all future Nova Corp services will operate.

---

# Objectives

## Primary Goals

* Deploy Proxmox VE inside VMware Workstation
* Enable nested virtualization
* Configure management networking
* Configure storage pools
* Validate repository access
* Create recovery point for future changes

---

# Architecture

## Physical Architecture

Windows 11 Host

↓

VMware Workstation

↓

Proxmox VE (nova-prox01)

---

# Infrastructure Specifications

## Host System

| Component        | Value             |
| ---------------- | ----------------- |
| Operating System | Windows 11 Pro    |
| CPU              | AMD Ryzen 7 3800X |
| Memory           | 64 GB             |
| Storage          | ~1 TB Available   |

---

## VMware Configuration

| Component             | Value              |
| --------------------- | ------------------ |
| VMware Version        | Workstation 17.6.3 |
| vCPU                  | 8                  |
| RAM                   | 24 GB              |
| Disk                  | 500 GB NVMe        |
| Network Mode          | Bridged            |
| Nested Virtualization | Enabled            |

---

## Proxmox Configuration

| Setting        | Value             |
| -------------- | ----------------- |
| Hostname       | nova-prox01       |
| Management IP  | 192.168.178.26/24 |
| Gateway        | 192.168.178.1     |
| Storage Pool 1 | local             |
| Storage Pool 2 | local-lvm         |

---

# Storage Design

## local

Purpose:

* ISO images
* Backups
* Templates
* Container images

---

## local-lvm

Purpose:

* Virtual machine disks
* Container disks

---

# Incident Report INC-001

## Title

Nested Virtualization Failure

### Symptoms

Proxmox installer failed to boot.

VMware displayed errors indicating:

* Virtualized AMD-V/RVI unavailable
* VPMC related failures

---

## Investigation

Executed:

```bash
systeminfo
```

Observed:

* Hypervisor detected
* Windows virtualization features active
* Virtualization Based Security enabled

---

## Root Cause

Windows Hyper-V and associated virtualization components were consuming AMD-V extensions before VMware could access them.

VMware therefore could not expose virtualization extensions to the Proxmox VM.

---

## Resolution

Actions performed:

* Disabled conflicting Windows virtualization components
* Disabled Virtualization Based Security
* Rebooted host
* Revalidated virtualization support

---

## Validation

Proxmox installer booted successfully.

Status:

PASS

---

# Incident Report INC-002

## Title

Proxmox Repository Failure

### Symptoms

Package updates failed.

Observed:

```bash
401 Unauthorized
```

during repository synchronization.

---

## Investigation

Reviewed repository definitions:

```bash
/etc/apt/sources.list.d/
```

Observed:

* pve-enterprise.sources
* ceph.sources

Both pointed to enterprise repositories.

---

## Root Cause

Enterprise repositories require a valid subscription.

The lab environment does not use a paid subscription.

---

## Resolution

Disabled enterprise repositories.

Configured:

```bash
pve-no-subscription
```

repository.

Executed:

```bash
apt update
```

---

## Validation

Repository synchronization completed successfully.

Status:

PASS

---

# Technical Concepts Learned

## Hypervisor

A hypervisor is software that creates and manages virtual machines.

Proxmox acts as the Type-1 hypervisor within Nova Corp.

---

## Nested Virtualization

Nested virtualization allows a virtual machine to expose virtualization capabilities to guest operating systems.

Required because Proxmox itself is running inside VMware.

---

## Linux Bridges

Linux bridges function similarly to virtual switches.

Primary bridge:

```text
vmbr0
```

connects virtual machines to the physical network.

---

## Storage Pools

Understanding gained:

* local = files
* local-lvm = VM disks

---

# Validation Checklist

| Test                    | Result |
| ----------------------- | ------ |
| Proxmox Installation    | PASS   |
| Management Access       | PASS   |
| Storage Pools Available | PASS   |
| Repository Access       | PASS   |
| Package Updates         | PASS   |

---

# Recovery Point

Snapshot Created:

```text
CR-001-Proxmox-Installed
```

Purpose:

Known-good rollback point prior to firewall deployment.

---

# Lessons Learned

1. Nested virtualization depends on hardware virtualization access.
2. Windows virtualization services can interfere with VMware.
3. Enterprise repositories require subscriptions.
4. Linux bridges function as virtual switches.
5. Recovery points should be created before major infrastructure changes.

---

# Change Outcome

CR-001 completed successfully.

Proxmox VE is operational and ready to host enterprise infrastructure services.

Next Change Request:

CR-002 Deploy pfSense Firewall
