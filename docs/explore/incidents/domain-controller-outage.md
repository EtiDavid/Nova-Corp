# DC01 goes offline; DC02 keeps the company working

**Closed · PASS** · **Investigation:** `INC-CR014-06` · **Category:** Nova Corp incident response

## What happened?

The primary test Domain Controller was deliberately unavailable. Users continued to find a Domain Controller and access resources through DC02.

## Why this test mattered

Prove actual resilience, including fresh tickets and AD writes, instead of relying on a healthy green DC02 icon.

## What caused it?

Controlled outage of DC01 (not an unexpected software fault). Replication errors during outage were expected.

## Investigation — commands, expected results and actual findings

### 1. Is DC01 truly unavailable?

```text
Test-NetConnection nova-dc01.nova.corp -Port 389
```

**Expected / hypothesis:** False during outage.

**Actual recorded result:** LDAP TCP/389 False, although DNS A record still resolved.

### 2. Can DC02 serve LDAP/Kerberos?

```text
Test-NetConnection nova-dc02.nova.corp -Port 389
Test-NetConnection nova-dc02.nova.corp -Port 88
```

**Expected / hypothesis:** Both True.

**Actual recorded result:** Both True.

### 3. Does the client select DC02?

```text
nltest /dsgetdc:nova.corp /force
```

**Expected / hypothesis:** DC02 selected.

**Actual recorded result:** DC02 at 10.10.20.11 selected.

### 4. Can policies and files still work?

```text
Test-Path "\\nova-dc02\SYSVOL"
gpupdate /force
Test-Path "\\nova-files01\IT"
```

**Expected / hypothesis:** All succeed.

**Actual recorded result:** SYSVOL True; both GPO scopes refreshed; IT share True.

### 5. Can authentication work without cached Kerberos tickets?

```text
klist purge
Get-ChildItem "\\nova-dc02\SYSVOL"
klist
```

**Expected / hypothesis:** New Kerberos tickets issued by DC02.

**Actual recorded result:** klist reported Kdc Called: nova-dc02.nova.corp.

### 6. Can DC02 write while DC01 is offline?

```text
New-ADGroup -Name "CR014-DCFailoverWriteTest" -GroupScope Global -GroupCategory Security -Path "CN=Users,DC=nova,DC=corp"
```

**Expected / hypothesis:** Group created on surviving DC.

**Actual recorded result:** Created on NOVA-DC02; GUID/SID captured; appeared on DC01 after recovery.

### 7. Does replication fully recover?

```text
repadmin /showrepl NOVA-DC01
repadmin /replsummary
```

**Expected / hypothesis:** All five naming contexts converge; zero failures.

**Actual recorded result:** 0/5, 0% on both source and destination DCs; disposable group creation and deletion converged.

## Repair / resolution

Bring DC01 online, validate services and all five replication naming contexts, prove same-GUID/SID object convergence and deletion replication.

## Additional engineering lesson

FSMO roles remained on DC02. No seizure, demotion, metadata cleanup or DNS surgery was required. The journal distinguishes the meaning of repadmin /syncall NOVA-DC01 /AdeP (push) from final bidirectional health.

## Original tests and evidence

The full illustrated [incident engineering journal (PDF)](../../Documentation/Change-Requests/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf) contains the execution evidence, screenshots, exact command history and troubleshooting decisions. The brief [public incident-exercise overview](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) explains the wider exercise.

The linked engineering journal identifies the original screenshots and preserves the command-by-command results.

## Explore connected services

[DC01](../systems/NOVA-DC01.md) · [DC02](../systems/NOVA-DC02.md) · [Kerberos](../services/KERBEROS.md).

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
