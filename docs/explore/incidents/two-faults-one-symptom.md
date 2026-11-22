# One broken folder hides two independent faults

**Closed · PASS** · **Investigation:** `INC-CR014-07` · **Category:** Nova Corp incident response

## What happened?

The user's IT share first appeared nonexistent. Fixing the DNS address exposed a second, unrelated authorization failure.

## Why this test mattered

Demonstrate iterative troubleshooting: after fixing one proven cause, re-run the original user test and investigate any remaining error.

## What caused it?

(1) The AD-integrated file-server DNS record was wrong on both DCs: 192.0.2.44; (2) Moyo had been removed from live IT_Users membership. Her old local token still listed the group.

## Investigation — commands, expected results and actual findings

### 1. Can the file share be found?

```text
Resolve-DnsName nova-files01.nova.corp
Test-NetConnection nova-files01.nova.corp -Port 445
```

**Expected / hypothesis:** Correct address and working SMB.

**Actual recorded result:** Name resolved to 192.0.2.44; hostname TCP/445 failed.

### 2. Is the actual server reachable by IP?

```text
Test-NetConnection 10.10.20.20 -Port 445
```

**Expected / hypothesis:** True if server is healthy.

**Actual recorded result:** True.

### 3. Is wrong DNS record present on both DCs?

```text
Resolve-DnsName nova-files01.nova.corp -Server 10.10.20.10
Resolve-DnsName nova-files01.nova.corp -Server 10.10.20.11
```

**Expected / hypothesis:** If authoritative AD data is faulty, both agree.

**Actual recorded result:** Both returned 192.0.2.44.

### 4. What changed after DNS-only repair?

```text
Clear-DnsClientCache
Test-Path "\\nova-files01\IT"
```

**Expected / hypothesis:** If no other fault, share should work.

**Actual recorded result:** Name and TCP/445 repaired; share now returned Access is denied.

### 5. Are ACLs intact?

```text
Get-SmbShareAccess -Name IT
icacls "D:\NovaData\IT"
```

**Expected / hypothesis:** IT permission groups still present.

**Actual recorded result:** SMB Change and NTFS Modify were present for DL_FS_IT_Modify.

### 6. Why does whoami show access but AD disagrees?

```text
whoami /groups | findstr /i "IT_Users"
Get-ADGroupMember IT_Users -Server nova-dc02.nova.corp
```

**Expected / hypothesis:** Compare local token vs live AD.

**Actual recorded result:** Local token had group; live AD on both DCs showed Moyo absent.

### 7. Did identity repair replicate?

```text
Get-ADGroupMember IT_Users -Server nova-dc02.nova.corp
klist
```

**Expected / hypothesis:** Moyo appears in AD; fresh CIFS ticket after new login.

**Actual recorded result:** Membership confirmed on DC02, fresh CIFS ticket for NOVA-FILES01.

### 8. Did the complete original task recover?

```text
Test-Path "\\nova-files01\IT"
Get-ChildItem "\\nova-files01\IT"
```

**Expected / hypothesis:** True and readable directory contents.

**Actual recorded result:** True; enumeration listed incident lab and restore-proof items.

## Repair / resolution

Repair and replicate the DNS record to 10.10.20.20, re-add Moyo to IT_Users and replicate; refresh authentication/session; retest the IT share and a CIFS ticket.

## Additional engineering lesson

The distinction is essential: whoami /groups reports a cached logon access token, klist reports tickets, while Get-ADGroupMember reports current AD membership. None is interchangeable.

## What proves this outcome?

The full illustrated [incident engineering journal (PDF)](../../Documentation/Change-Requests/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf) contains the execution evidence, screenshots, exact command history and troubleshooting decisions. The brief [public incident-exercise overview](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) explains the wider exercise.

Source evidence identifiers (see the full journal): `image(20261118-154529).png`; `image(20261118-155102).png`; `image(20261118-165814).png`; `image(20261118-172831).png`.

## Explore connected services

[NOVA-FILES01](../systems/NOVA-FILES01.md) · [DNS](../services/DNS.md) · [IT_Users group](../GROUPS.md) · [Moyo](../people/MOYO.md).

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
