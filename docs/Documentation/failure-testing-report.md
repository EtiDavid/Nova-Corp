# Nova Corp

## Milestone 1 - Proxmox Hypervisor Validation

### Failure Testing Report

---

# FT-001 - Network Misconfiguration Recovery

## Objective

Validate understanding of Linux routing, default gateways, and network recovery procedures by intentionally introducing an incorrect gateway configuration.

---

## Initial State

**Host:** `nova-prox01`

**Management IP:** `192.168.178.26/24`

**Gateway:** `192.168.178.1`

**Network Bridge:** `vmbr0`

**Status:** Operational

---

## Baseline Verification

### Command

```bash
ip route
```

### Output

```text
default via 192.168.178.1 dev vmbr0
192.168.178.0/24 dev vmbr0
```

### Observation

The default route forwards traffic destined outside the local subnet to the home router (`192.168.178.1`).

---

## Recovery Preparation

### Recovery Method 1 - VMware Snapshot

**Snapshot Name**

```text
CR-001-Proxmox-Installed
```

Purpose:

* Full rollback of Proxmox VM

---

### Recovery Method 2 - Configuration Backup

```bash
cp /etc/network/interfaces /etc/network/interfaces.bak
```

Purpose:

* Restore original network configuration

---

### Recovery Method 3 - Out-of-Band Access

**VMware Console**

Purpose:

* Maintain host access even if networking fails

---

## Failure Injection

### Original Configuration

```text
gateway 192.168.178.1
```

### Modified Configuration

```text
gateway 192.168.178.254
```

### Apply Configuration

```bash
ifreload -a
```

---

## Hypothesis

Expected results:

1. Local network communication continues to work.
2. Internet connectivity fails.
3. Package updates fail.
4. Proxmox GUI remains accessible from local devices.

Reasoning:

Devices on the same subnet communicate directly through Layer 2 switching and do not require a gateway.

Traffic destined outside the subnet requires the default route.

---

## Validation Testing

### Test 1

```bash
ping 192.168.178.1
```

**Expected:** Success

**Actual:** Success

**Result:** PASS

---

### Test 2

```bash
ping 8.8.8.8
```

**Expected:** Failure

**Actual:** Failure

**Result:** PASS

---

### Test 3

```bash
apt update
```

**Expected:** Failure

**Actual:** Failure

**Result:** PASS

---

### Test 4

Access Proxmox GUI

**Expected:** Accessible

**Actual:** Accessible

**Result:** PASS

---

## Root Cause Analysis

The incorrect default gateway prevented traffic from leaving the local subnet.

Local communication remained functional because devices on the `192.168.178.0/24` network communicate directly without using a router.

External communication failed because packets were forwarded to a nonexistent gateway.

---

## Recovery

Restore:

```text
gateway 192.168.178.1
```

Apply:

```bash
ifreload -a
```

Validation:

```bash
ping 8.8.8.8
apt update
```

Result:

* Connectivity restored
* Package updates restored

---

## Lessons Learned

* Default gateways are only used for destinations outside the local subnet.
* Local connectivity can remain operational while internet connectivity fails.
* Running configuration and saved configuration are separate concepts.
* Recovery planning should occur before making changes.
* Comparing local and remote connectivity is an effective troubleshooting technique.

---

# FT-003 - Management Interface Failure

## Objective

Validate the ability to recover a failed management interface using CLI access.

---

## Initial State

### Service

```text
pveproxy
```

### Status

```text
active (running)
```

Purpose:

Provides HTTPS access to the Proxmox management interface on port `8006`.

---

## Hypothesis

Stopping `pveproxy` should:

* Disable Proxmox GUI
* Disable web shell
* Leave networking operational
* Leave virtualization operational
* Leave SSH operational

---

## Failure Injection

### Stop Service

```bash
systemctl stop pveproxy
```

### Verification

```bash
systemctl status pveproxy
```

Result:

```text
inactive (dead)
```

---

## Validation Testing

### Test 1 - GUI Access

```text
https://192.168.178.26:8006
```

**Expected:** Unavailable

**Actual:** Unavailable

**Result:** PASS

---

### Test 2 - SSH Access

```bash
ssh root@192.168.178.26
```

**Expected:** Available

**Actual:** Available

**Result:** PASS

---

### Test 3 - Network Connectivity

```bash
ping 8.8.8.8
```

**Expected:** Success

**Actual:** Success

**Result:** PASS

---

### Test 4 - VMware Console

**Expected:** Available

**Actual:** Available

**Result:** PASS

---

## Root Cause Analysis

Only the Proxmox web service was stopped.

The Linux kernel, networking stack, SSH service, storage services, and virtualization components remained operational.

The incident affected management access only.

---

## Recovery

### Start Service

```bash
systemctl start pveproxy
```

### Verify

```bash
systemctl status pveproxy
```

Result:

```text
active (running)
```

GUI access restored successfully.

---

## Lessons Learned

* GUI failure does not imply server failure.
* SSH is a critical recovery path.
* VMware console acts as out-of-band management access.
* Infrastructure services operate independently.
* Troubleshooting should narrow the scope before implementing fixes.

---

# FT-005 - GUI Recovery Methodology

## Objective

Develop a structured troubleshooting process for future management interface incidents.

---

## Investigation Workflow

### Step 1

Verify host reachability.

```bash
ping <host-ip>
```

---

### Step 2

Verify SSH access.

```bash
ssh root@<host-ip>
```

---

### Step 3

Verify service status.

```bash
systemctl status pveproxy
```

---

### Step 4

Verify listening ports.

```bash
ss -tulpn | grep 8006
```

---

### Step 5

Review service logs.

```bash
journalctl -u pveproxy
```

---

### Step 6

Identify root cause.

---

### Step 7

Implement corrective action.

---

### Step 8

Validate recovery.

---

## Key Lesson

A server should not be considered down simply because the GUI is unavailable.

The correct question is:

> Which component is unavailable?

not

> Is the entire server unavailable?

---

# Failure Testing Outcome

## Status

PASS

## Recovery Validation

PASS

## Operational Readiness

PASS

## Approved For

**CR-002 - Deploy pfSense Firewall**
