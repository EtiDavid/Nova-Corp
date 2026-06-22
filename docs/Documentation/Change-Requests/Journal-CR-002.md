# Change Request Documentation

# CR-002 — Deploy pfSense Firewall

## Change Information

| Field     | Value                   |
| --------- | ----------------------- |
| Change ID | CR-002                  |
| Title     | Deploy pfSense Firewall |
| Engineer  | David                   |
| Status    | Completed               |
| Hostname  | nova-fw01               |

---

# Executive Summary

The objective of this change request was to deploy pfSense as the primary security gateway for the Nova Corp environment.

pfSense establishes the first true security boundary inside Nova Corp and becomes responsible for:

* Routing
* NAT
* DHCP
* Firewalling
* Future VLAN Segmentation

All future Nova Corp infrastructure will reside behind this firewall.

---

# Architecture Before

Internet

↓

Home Router (192.168.178.1)

↓

vmbr0

↓

Proxmox

---

# Architecture After

Internet

↓

Home Router

↓

vmbr0

↓

pfSense WAN

↓

pfSense Firewall

↓

pfSense LAN

↓

vmbr1

↓

Internal Infrastructure

* nova-dc01
* nova-files01
* nova-monitor01
* Linux Servers

---

# Design Decisions

## Why Two Interfaces?

A firewall must separate security zones.

Implemented:

* WAN → External Network
* LAN → Internal Network

Without separation the firewall would not be performing meaningful routing or security enforcement.

---

## Why vmbr1?

vmbr1 was created as an isolated internal switch.

No physical NIC attached.

Purpose:

Provide protected internal connectivity for all future Nova Corp systems.

---

# VM Specifications

## nova-fw01

| Resource | Value  |
| -------- | ------ |
| CPU      | 2 vCPU |
| Memory   | 2 GB   |
| Disk     | 16 GB  |
| WAN      | vmbr0  |
| LAN      | vmbr1  |

---

# Networking Configuration

## WAN

| Setting    | Value  |
| ---------- | ------ |
| Interface  | vtnet0 |
| Bridge     | vmbr0  |
| Addressing | DHCP   |

Assigned Address:

```text
192.168.178.71
```

---

## LAN

| Setting   | Value          |
| --------- | -------------- |
| Interface | vtnet1         |
| Bridge    | vmbr1          |
| Network   | 192.168.1.0/24 |

Gateway:

```text
192.168.1.1
```

DHCP Range:

```text
192.168.1.100 - 192.168.1.199
```

---

# Storage Configuration

## File System

ZFS

Reasons:

* Checksumming
* Data integrity validation
* Compression
* Snapshot support

---

## Partition Scheme

GPT

Reasons:

* Modern standard
* Large disk support
* UEFI compatibility
* Flexible partitioning

---

# Edition Selection

## pfSense CE

Selected.

Reasons:

* Free
* Open Source
* Suitable for lab environment

---

## pfSense Plus

Reviewed but not selected.

Reasons:

* Requires subscription
* Additional enterprise features not currently required

---

# Validation Tests

## Test 1

Verify WAN Interface

Result:

```text
192.168.178.71
```

Status:

PASS

---

## Test 2

Verify LAN Interface

Result:

```text
192.168.1.1
```

Status:

PASS

---

## Test 3

Verify GUI Service

Command:

```bash
sockstat -4 -l | grep 443
```

Result:

```text
nginx listening on port 443
```

Status:

PASS

---

## Test 4

Verify Firewall Rules

Command:

```bash
pfctl -sr
```

Result:

* Anti-lockout rule present
* Default LAN allow rule present

Status:

PASS

---

## Test 5

Verify Neighbor Discovery

Command:

```bash
arp -an
```

Observed:

```text
192.168.178.1
192.168.178.26
192.168.178.37
```

Status:

PASS

---

## Test 6

Verify Gateway Reachability

Command:

```bash
ping 192.168.178.1
```

Result:

Successful.

Status:

PASS

---

# Troubleshooting Investigation

## Problem

Unable to access:

```text
https://192.168.178.71
```

from external systems.

---

## Hypothesis 1

Web GUI service unavailable.

### Test

```bash
sockstat -4 -l | grep 443
```

### Result

nginx actively listening.

### Conclusion

Service operational.

---

## Hypothesis 2

Firewall blocking management traffic.

### Test

```bash
pfctl -sr
```

### Result

Firewall rules loaded correctly.

### Conclusion

No obvious service blockage.

---

## Hypothesis 3

Layer 2 connectivity failure.

### Test

```bash
arp -an
```

### Result

Neighbor discovery functioning.

### Conclusion

WAN connectivity operational.

---

## Hypothesis 4

Web service validation.

### Test

```bash
curl -k https://192.168.178.71
```

### Result

HTML content returned successfully.

### Conclusion

GUI confirmed operational.

---

## Final Assessment

pfSense services are functioning correctly.

Observed behavior aligns with pfSense default security posture that discourages management through the WAN interface.

Further validation will occur after deployment of internal LAN clients.

---

# Key Concepts Learned

## WAN and LAN Separation

Routing requires different networks on each side.

Correct:

```text
WAN = 192.168.178.0/24
LAN = 192.168.1.0/24
```

Incorrect:

```text
WAN = 192.168.178.0/24
LAN = 192.168.178.0/24
```

---

## Virtual Bridges

vmbr0:

External network bridge.

vmbr1:

Internal isolated bridge.

---

## Firewall Architecture

Future systems must use:

```text
vmbr1
```

to ensure all traffic traverses pfSense.

---

# Lessons Learned

1. Firewalls separate networks rather than simply blocking traffic.
2. WAN and LAN must exist on different subnets.
3. Internal systems should never connect directly to vmbr0.
4. Evidence-based troubleshooting is essential.
5. Service validation should begin at the lowest technical layer possible.

---

# Change Outcome

CR-002 completed successfully.

pfSense deployed and operational.

Nova Corp now has a dedicated security boundary and internal network ready for Active Directory deployment.

Next Change Request:

CR-003 Deploy Active Directory Domain Controller
