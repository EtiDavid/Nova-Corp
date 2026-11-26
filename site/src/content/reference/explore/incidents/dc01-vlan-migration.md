---
title: "Domain Controller loses network after VLAN migration"
sourcePath: "docs/explore/incidents/dc01-vlan-migration.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/dc01-vlan-migration.md"
section: "explore"
---

# Domain Controller loses network after VLAN migration

**Closed · PASS** · **Evidence record:** `INC-005 · CR-003`

## What happened?

After DC01 moved into the infrastructure VLAN, DC01 could not reach the gateway even though the firewall could reach the VM.

## Why we investigated

A virtual NIC with correct IP settings does not guarantee traffic may cross a newly added firewall interface.

## Root cause

VLAN20 existed and was correctly tagged, but the new pfSense INFRA interface lacked allow rules, so traffic entering INFRA hit the default block.

## Step-by-step investigation

### Step 1. Check Windows IP settings

```text
ipconfig /all
```

**Expected / hypothesis:** Static address/subnet/gateway/DNS match INFRA design.

**Actual result from the journal:** Correct.

### Step 2. Check Proxmox bridge and tag

```text
Inspect VM101 net0 on vmbr1 with tag 20
```

**Expected / hypothesis:** Tagged internal network on vlan-aware vmbr1.

**Actual result from the journal:** Configuration confirmed.

### Step 3. Check pfSense interface

```text
Inspect Interfaces > INFRA
```

**Expected / hypothesis:** VLAN20 interface enabled and has 10.10.20.1.

**Actual result from the journal:** Confirmed.

### Step 4. Compare direction of reachability

```text
ping 10.10.20.1 from DC01; ping DC01 from pfSense
```

**Expected / hypothesis:** Both should work when policy is correct.

**Actual result from the journal:** pfSense→DC01 succeeded; DC01→pfSense failed.

### Step 5. Apply matching interface firewall rule

```text
Inspect pfSense Firewall > Rules > INFRA; add initial pass rule
```

**Expected / hypothesis:** Outbound traffic from INFRA becomes permitted.

**Actual result from the journal:** Gateway, WebGUI, internet, AD and DNS services restored.

## Repair and outcome

Add and apply the necessary initial INFRA firewall pass rule; recheck gateway, DNS, internet, AD.

## Explore the real implementation

[Read the source Active Directory and VLAN migration journal](/reference/Documentation/Change-Requests/Journal-CR-003/). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[DC01](/reference/explore/systems/NOVA-DC01/) · [INFRA zone](/reference/explore/network/zones/INFRA/) · [Firewall](/reference/explore/services/FIREWALL/)

[← All investigations](/reference/explore/TESTS_AND_RECOVERY/) · [Company explorer](/reference/EXPLORE_NOVACORP/)
