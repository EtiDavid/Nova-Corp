# Employee workstation reaches firewall administration

**Remediated · PASS** · **Evidence record:** `CR-015 · CP-015-01`

## What happened?

A normal company workstation could reach management paths that should have been protected.

## Why we investigated

VLAN separation doesn't automatically establish least privilege. A security fix needs both a denied-access test and a regression check of legitimate business traffic.

## Root cause

The CLIENT ingress rule set allowed more management access than the intended Phase 2 trust model.

## Step-by-step investigation

### Step 1. Prove management exposure before change

```text
Test-NetConnection 10.10.10.1 -Port 443
```

**Expected / hypothesis:** Before remediation this should reveal unwanted reachability.

**Actual result from the journal:** Connection succeeded before targeted blocks.

### Step 2. Validate rollback and trusted admin path

```text
Use Proxmox VM console and protected pfSense configuration backup
```

**Expected / hypothesis:** Avoid permanent lockout.

**Actual result from the journal:** Console/recovery path verified before changing listener/rules.

### Step 3. Confirm the management-plane rule order

```text
Firewall > Rules > CLIENT
```

**Expected / hypothesis:** Specific GUI/MGMT blocks should be above broad CLIENT permit.

**Actual result from the journal:** Post-change config shows GUI TCP80/443 block, MGMT block, then general allow.

### Step 4. Verify management negative control

```text
Test-NetConnection 10.10.10.1 -Port 443
Test-NetConnection 10.10.10.1 -Port 80
```

**Expected / hypothesis:** Ordinary CLIENT connections to admin ports fail.

**Actual result from the journal:** Ports blocked after remediation.

### Step 5. Verify business-service positive controls

```text
Test-NetConnection 10.10.20.20 -Port 445
Resolve-DnsName nova.corp
```

**Expected / hypothesis:** SMB/DNS still work; AD and internet remain usable.

**Actual result from the journal:** CR-015 acceptance validated DNS, AD, SMB and Internet after corrections.

### Step 6. Verify IPv4-only design state

```text
Inspect pfSense gateway list and IPv6 interfaces
```

**Expected / hypothesis:** WAN_DHCP IPv4 active; no IPv6 default gateway.

**Actual result from the journal:** Result reconciled with intended IPv4-only runtime.

## Repair and outcome

Move pfSense WebGUI to HTTPS, add specific CLIENT blocks for pfSense GUI ports and MGMT subnet ahead of general allow; correct overbroad intermediate firewall rule.

## Engineering note

The intermediate 'This Firewall' rule was too broad; its destination/port scope was corrected. Full privileged-admin VPN and management-plane isolation remain a later CR-016 gate.

## Explore the real implementation

[Read the source Phase 2 validation and closure summary](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[CLIENT rule order](../network/RULES.md#client) · [pfSense](../systems/NOVA-FW01.md) · [Management zone](../network/zones/MGMT.md)

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
