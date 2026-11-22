# Proxmox gateway failure — local works, internet breaks

**Closed · PASS** · **Evidence record:** `FT-001`

## What happened?

The hypervisor kept working on the local subnet but lost access outside it after a deliberately incorrect default gateway.

## Why we investigated

An administrator must know why a system can be accessible by IP locally while updates and internet connectivity fail.

## Root cause

Incorrect gateway 192.168.178.254 instead of 192.168.178.1 on vmbr0.

## Step-by-step investigation

### Step 1. Confirm healthy default route

```text
ip route
```

**Expected / hypothesis:** Default via 192.168.178.1 dev vmbr0.

**Actual result from the journal:** Healthy baseline showed 192.168.178.1.

### Step 2. Create reversible incident

```text
cp /etc/network/interfaces /etc/network/interfaces.bak
# Edit gateway to 192.168.178.254
ifreload -a
```

**Expected / hypothesis:** Local subnet remains; internet fails.

**Actual result from the journal:** Failure reproduced after applying incorrect gateway.

### Step 3. Can router still be reached locally?

```text
ping 192.168.178.1
```

**Expected / hypothesis:** Success (same subnet).

**Actual result from the journal:** Success.

### Step 4. Does external routing work?

```text
ping 8.8.8.8
apt update
```

**Expected / hypothesis:** Both should fail with wrong gateway.

**Actual result from the journal:** Ping failed; package update failed.

### Step 5. Does the local GUI still respond?

```text
https://192.168.178.26:8006
```

**Expected / hypothesis:** Accessible from local devices.

**Actual result from the journal:** Accessible.

### Step 6. Recover networking

```text
ifreload -a
ping 8.8.8.8
apt update
```

**Expected / hypothesis:** Internet and updates return after restoring gateway.

**Actual result from the journal:** Connectivity and package updates restored.

## Repair and outcome

Restore gateway 192.168.178.1 and reapply network configuration.

## Explore the real implementation

[Read the source Proxmox failure-testing report](../../Documentation/failure-testing-report.md). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[Hypervisor](../systems/NOVA-PROX01.md) · [Virtualization map](../virtualization/README.md)

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
