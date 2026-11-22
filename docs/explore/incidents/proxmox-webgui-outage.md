# Proxmox web interface unavailable, but VMs still run

**Closed · PASS** · **Evidence record:** `FT-003 / FT-005`

## What happened?

Proxmox web management stopped responding, but SSH, the host network and the VMware console remained usable.

## Why we investigated

Avoid treating every GUI outage as a whole-server outage.

## Root cause

pveproxy web service intentionally stopped.

## Step-by-step investigation

### Step 1. Verify management service failure

```text
systemctl stop pveproxy
systemctl status pveproxy
```

**Expected / hypothesis:** inactive (dead).

**Actual result from the journal:** inactive (dead).

### Step 2. Check the browser

```text
https://192.168.178.26:8006
```

**Expected / hypothesis:** Web GUI unavailable.

**Actual result from the journal:** Unavailable.

### Step 3. Check alternate management channel

```text
ssh root@192.168.178.26
```

**Expected / hypothesis:** SSH still accessible.

**Actual result from the journal:** Available.

### Step 4. Check network vs GUI

```text
ping 8.8.8.8
```

**Expected / hypothesis:** General network continues working.

**Actual result from the journal:** Succeeded.

### Step 5. Recover service

```text
systemctl start pveproxy
systemctl status pveproxy
```

**Expected / hypothesis:** active (running); GUI returns.

**Actual result from the journal:** active (running), browser access restored.

## Repair and outcome

Start pveproxy; validate service and browser again.

## Explore the real implementation

[Read the source Proxmox failure-testing report](../../Documentation/failure-testing-report.md). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[Host](../systems/NOVA-PROX01.md) · [Proxmox virtual machine list](../virtualization/README.md)

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
