# The file server looks down, but it is only DNS

**Closed · PASS** · **Investigation:** `INC-CR014-02` · **Category:** Nova Corp incident response

## What happened?

The IT network folder stopped opening by hostname even though its server and SMB service were healthy.

## Why this test mattered

A failed UNC path can be a DNS client configuration problem rather than an inaccessible server.

## What caused it?

NOVA-CLIENT's configured DNS server had been changed to 192.0.2.53 instead of the two Nova Domain Controller DNS addresses.

## Investigation — commands, expected results and actual findings

### 1. What did the employee see?

```text
Test-Path "\\nova-files01\IT"
Resolve-DnsName nova-files01.nova.corp
```

**Expected / hypothesis:** File share fails; normal resolver times out.

**Actual recorded result:** Test-Path False; Resolve-DnsName ERROR_TIMEOUT.

### 2. Is SMB reachable without DNS?

```text
Test-NetConnection 10.10.20.20 -Port 445
```

**Expected / hypothesis:** TCP 445 succeeds if the server and network are healthy.

**Actual recorded result:** TcpTestSucceeded True.

### 3. Does the authoritative internal DNS server work?

```text
Resolve-DnsName nova-files01.nova.corp -Server 10.10.20.10
```

**Expected / hypothesis:** Expected A record 10.10.20.20.

**Actual recorded result:** DC01 returned 10.10.20.20.

### 4. What resolver is actually configured?

```text
Get-DnsClientServerAddress -AddressFamily IPv4
```

**Expected / hypothesis:** Should be 10.10.20.10 and .11.

**Actual recorded result:** Ethernet was configured with incorrect 192.0.2.53.

### 5. Can clients discover AD after repair?

```text
Resolve-DnsName -Type SRV "_ldap._tcp.dc._msdcs.nova.corp"
nltest /dsgetdc:nova.corp /force
```

**Expected / hypothesis:** Both DC SRV entries and successful DC selection.

**Actual recorded result:** DC01/DC02 advertised; nltest selected DC01.

### 6. Does the original share work again?

```text
Test-Path "\\nova-files01\IT"
```

**Expected / hypothesis:** True.

**Actual recorded result:** True; ipconfig /all confirmed restored DNS servers.

## Repair / resolution

Restore client DNS servers to 10.10.20.10 and 10.10.20.11; clear resolver cache; verify both A and SRV records and file access.

## What proves this outcome?

The full illustrated [incident engineering journal (PDF)](../../Documentation/Change-Requests/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf) contains the execution evidence, screenshots, exact command history and troubleshooting decisions. The brief [public incident-exercise overview](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) explains the wider exercise.

Source evidence identifiers (see the full journal): `CP03-10-user-symptom-unc-fail-dns-timeout.png`; `CP03-12-root-cause-client-dns-misconfigured.png`; `CP03-15-nltest-and-share-post-repair-pass.png`.

## Explore connected services

[DNS](../services/DNS.md) · [NOVA-CLIENT](../systems/NOVA-CLIENT.md) · [NOVA-FILES01](../systems/NOVA-FILES01.md).

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
