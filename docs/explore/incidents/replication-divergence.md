# Both Domain Controllers are online, but one has stale data

**Closed · PASS** · **Evidence record:** `CR-013 · Replication divergence`

## What happened?

DC02 remained online but temporarily stopped receiving AD changes; a group created on DC01 was missing on DC02.

## Why we investigated

A responding domain controller can still have stale AD directory state.

## Root cause

Inbound replication was deliberately disabled on DC02 with DISABLE_INBOUND_REPL.

## Step-by-step investigation

### Step 1. Prove replication is initially healthy

```text
repadmin /replsummary
```

**Expected / hypothesis:** 0/5 failures on both DCs.

**Actual result from the journal:** 0/5, 0% pre-test.

### Step 2. Block inbound replication on DC02

```text
repadmin /options NOVA-DC02 +DISABLE_INBOUND_REPL
repadmin /options NOVA-DC02
```

**Expected / hypothesis:** DC02 should show DISABLE_INBOUND_REPL while remaining online.

**Actual result from the journal:** Options included IS_GC and DISABLE_INBOUND_REPL.

### Step 3. Create object only on DC01

```text
New-ADGroup -Name "CR013-DivergenceTest" -GroupScope Global -GroupCategory Security -Path "CN=Users,DC=nova,DC=corp" -Server nova-dc01.nova.corp
```

**Expected / hypothesis:** New group exists on DC01.

**Actual result from the journal:** Group created on DC01.

### Step 4. Does DC02 have that group?

```text
Get-ADGroup "CR013-DivergenceTest" -Server nova-dc02.nova.corp
```

**Expected / hypothesis:** Object absent while inbound replication disabled.

**Actual result from the journal:** ADIdentityNotFoundException.

### Step 5. What does replication report?

```text
repadmin /showrepl NOVA-DC02
repadmin /replsummary
```

**Expected / hypothesis:** Error should show rejected replication.

**Actual result from the journal:** 8457 destination rejecting replication; 2/5 (40%) in observed window.

### Step 6. Restore and wait for AD convergence

```text
repadmin /options NOVA-DC02 -DISABLE_INBOUND_REPL
repadmin /replsummary
```

**Expected / hypothesis:** Group later arrives with identical GUID/SID; replication 0/5.

**Actual result from the journal:** After natural retry, object on DC02 had same GUID and SID, and 0/5 errors.

## Repair and outcome

Remove inbound-block flag, allow natural replication, compare original group GUID/SID on both DCs, then confirm replication summary returns healthy.

## Explore the real implementation

[Read the source Secondary Domain Controller and AD Resilience journal](../../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[DC01](../systems/NOVA-DC01.md) · [DC02](../systems/NOVA-DC02.md) · [Active Directory](../services/ACTIVE_DIRECTORY.md)

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
