# Change Request Documentation
# CR-003 — Deploy Active Directory Domain Services (AD DS)

---

## Change Request Information

| Field | Value |
|---------|---------|
| Change ID | CR-003 |
| Title | Deploy Active Directory Domain Services |
| Engineer | David |
| Date | 2026-06-21 |
| Status | Completed |
| System | nova-dc01 |
| Domain | nova.corp |

---

# Objective

The objective of this change request was to deploy the identity management platform for Nova Corp by implementing Microsoft Active Directory Domain Services (AD DS) and DNS.

This deployment establishes the first centralized authentication and authorization system within the Nova Corp environment.

Moving forward, all users, computers, servers, security groups, policies, and permissions will be managed through Active Directory.

The deployment includes:

- Windows Server 2025 installation
- Static network configuration
- Active Directory Domain Services
- DNS Server role
- New Active Directory Forest
- New Domain (`nova.corp`)
- Domain Controller promotion
- DNS integration
- Active Directory validation

---

# Business Justification

Prior to this change, Nova Corp infrastructure consisted of:

```text
Proxmox
    |
pfSense
```

No centralized identity platform existed.

This created several limitations:

- No centralized authentication
- No centralized user management
- No Group Policy capability
- No computer inventory
- No domain trust relationships
- No centralized security management

Deploying Active Directory establishes the foundation for enterprise administration.

---

# Architecture Before Change

```text
Internet
    |
Home Router
192.168.178.1
    |
pfSense
192.168.178.71
LAN: 192.168.1.1
    |
vmbr1
    |
Windows Server 2025
(DHCP Client)
```

---

# Architecture After Change

```text
Internet
    |
Home Router
192.168.178.1
    |
pfSense
WAN: 192.168.178.71
LAN: 10.10.10.1
    |
vmbr1
    |
nova-dc01
10.10.10.10
DNS: 127.0.0.1
Domain: nova.corp
```

---

# Design Decisions

## Why Deploy Active Directory?

Active Directory serves as the enterprise identity platform.

It provides:

- Authentication
- Authorization
- Group Policy
- DNS Integration
- Computer Management
- User Management
- Security Group Management

Without Active Directory, each server would require standalone account management.

---

## Why Use `nova.corp`?

The domain name:

```text
nova.corp
```

was selected because:

- Easy to remember
- Clearly identifies the Nova Corp environment
- Common enterprise naming convention
- Supports future expansion

---

## Why Use `10.10.10.0/24`?

The Nova guide specifies:

```text
10.10.10.0/24
```

as the corporate LAN network.

Reasons:

- Clean enterprise addressing scheme
- Avoids overlap with common home networks
- Provides 254 usable addresses
- Simplifies future documentation

---

## Why Use Static Addressing for Domain Controller?

Domain Controllers must never rely on DHCP.

Static addressing guarantees:

```text
10.10.10.10
```

always remains reachable.

This prevents:

- DNS failures
- Authentication failures
- Replication issues
- Group Policy issues

---

# VM Deployment

## Virtual Machine

| Setting | Value |
|----------|----------|
| Name | nova-dc01 |
| OS | Windows Server 2025 Standard |
| CPU | 2 vCPU |
| RAM | 4 GB |
| Disk | 80 GB |
| Firmware | UEFI (OVMF) |
| TPM | v2.0 |
| Network | vmbr1 |
| Adapter | VirtIO |

---

# VirtIO Driver Installation

During installation Windows Server could not detect the virtual disk.

Observed behavior:

```text
No disks available for installation
```

Root cause:

```text
Windows Server does not include VirtIO drivers by default.
```

Resolution:

- Attached VirtIO driver ISO
- Selected storage driver
- Loaded driver during installation

Result:

```text
Disk 0 Unallocated Space
80 GB
```

appeared successfully.

---

# Initial Network Configuration

## DHCP Assignment

Initial address received:

```text
192.168.1.100
```

from pfSense DHCP.

Verification:

```powershell
ipconfig
```

Result:

```text
IPv4 Address : 192.168.1.100
Gateway      : 192.168.1.1
```

---

# pfSense Network Migration

The Nova guide required:

```text
10.10.10.0/24
```

LAN addressing.

LAN interface was modified from:

```text
192.168.1.1/24
```

to:

```text
10.10.10.1/24
```

---

# Incident INC-003-01

## Description

After changing the pfSense LAN network, connectivity was lost between:

```text
nova-dc01
```

and

```text
pfSense
```

---

## Symptoms

Windows obtained:

```text
10.10.10.101
```

but could not reach:

```text
10.10.10.1
```

---

## Investigation

### Verify Windows Routing

Command:

```powershell
route print
```

Result:

```text
Default Route -> 10.10.10.1
```

Route existed.

---

### Verify ARP Table

Command:

```powershell
arp -a
```

Result:

```text
No gateway entry present
```

---

### Verify pfSense ARP

Command:

```bash
arp -an
```

Result:

```text
10.10.10.101 discovered successfully
```

Layer 2 communication confirmed.

---

### Verify Firewall Rules

Command:

```bash
pfctl -sr
```

Result:

```text
Default Allow LAN to Any
```

Firewall not blocking traffic.

---

### Verify Interface Status

Command:

```bash
ifconfig vtnet1
```

Result:

```text
Interface UP
Status Active
```

---

## Root Cause

pfSense interface changes had not been fully activated.

LAN services remained in a transitional state.

---

## Resolution

Performed full pfSense reboot.

After reboot:

```powershell
ping 10.10.10.1
```

Result:

```text
Success
```

---

# Static Domain Controller Configuration

Network configuration changed from DHCP to static.

## Final Configuration

| Setting | Value |
|----------|----------|
| IP Address | 10.10.10.10 |
| Subnet Mask | 255.255.255.0 |
| Gateway | 10.10.10.1 |
| Preferred DNS | 127.0.0.1 |

---

# AD DS Installation

Installed Roles:

```text
Active Directory Domain Services
DNS Server
```

Installed using:

```text
Server Manager
→ Add Roles and Features
```

---

# Domain Controller Promotion

Selected:

```text
Add a new forest
```

Forest Root Domain:

```text
nova.corp
```

NetBIOS Name:

```text
NOVA
```

Automatically generated.

---

# What Promotion Created

Promotion created:

- Active Directory Database
- SYSVOL
- DNS Zone
- Kerberos Services
- Domain Controller Services
- Authentication Infrastructure

---

# Active Directory Verification

Opened:

```text
Tools
→ Active Directory Users and Computers
```

Verified:

```text
nova.corp
```

appeared successfully.

Standard containers created:

```text
Builtin
Computers
Domain Controllers
ForeignSecurityPrincipals
Managed Service Accounts
Users
```

---

# DNS Verification

Opened:

```text
Tools
→ DNS
```

Verified:

```text
Forward Lookup Zones
```

Contained:

```text
nova.corp
_msdcs.nova.corp
```

Status:

```text
Running
```

---

# Validation Tests

| Test ID | Description | Method | Status |
|----------|----------|----------|----------|
| T1 | Verify Static IP | ipconfig | PASS |
| T2 | Verify Gateway Reachability | ping 10.10.10.1 | PASS |
| T3 | Verify Internet Access | ping 8.8.8.8 | PASS |
| T4 | Verify AD DS Installation | Server Manager | PASS |
| T5 | Verify DNS Installation | DNS Manager | PASS |
| T6 | Verify Domain Creation | ADUC | PASS |
| T7 | Verify Domain Controller Promotion | Server Manager | PASS |
| T8 | Verify DNS Zones | DNS Manager | PASS |
| T9 | Verify AD Health | dcdiag | PASS |
| T10 | Verify DNS Health | dcdiag /test:dns | PASS |
| T11 | Verify User Creation | ADUC | PASS |

---

# Validation Finding

## Test User Login

Created test user:

```text
David.Test
```

Attempted login directly to:

```text
nova-dc01
```

Observed:

```text
The sign-in method you're trying to use isn't allowed.
```

---

## Root Cause

Domain Controllers restrict local interactive logons for standard users.

This is expected enterprise security behavior.

Normal users should authenticate through domain-joined workstations rather than directly on Domain Controllers.

---

## Conclusion

Not a deployment failure.

Validation deferred to:

```text
CR-004
Deploy Windows Client Workstation
```

---

# Lessons Learned

### 1. Active Directory Requires DNS

AD depends heavily on DNS.

Without DNS:

- Domain joins fail
- Authentication fails
- Service discovery fails

---

### 2. Domain Controllers Require Static IPs

Static addressing prevents identity service outages.

---

### 3. Reboots Matter

Network configuration changes may require service reloads or full system reboots before becoming fully operational.

---

### 4. Authentication and Authorization Are Different

User creation succeeded.

Login failed due to authorization restrictions.

This demonstrated:

```text
Authentication ≠ Authorization
```

---

### 5. Enterprise Validation Requires Evidence

Assumptions were avoided.

Every major component was verified using:

```powershell
ipconfig
route print
arp -a
ping
dcdiag
dcdiag /test:dns
```

and

```bash
arp -an
pfctl -sr
ifconfig vtnet1
```

---

# Change Closure

All objectives defined for CR-003 have been completed successfully.

Delivered components:

- Windows Server 2025
- Active Directory Domain Services
- DNS Server
- Domain Controller
- New Forest
- New Domain (`nova.corp`)
- Enterprise IP Scheme (`10.10.10.0/24`)
- Validation and Health Checks

The Nova Corp identity platform is now operational and ready for workstation onboarding.

---

# Final Status

```text
CR-003
Deploy Active Directory Domain Services

STATUS: CLOSED
```

---

# Next Change Request

```text
CR-004
Deploy Windows Client Workstation
```

Objective:

- Deploy Windows Client
- Join Domain
- Validate User Authentication
- Validate DNS Resolution
- Validate Group Policy Readiness