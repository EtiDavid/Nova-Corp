# External VPN fault test — deferred, not faked

**Deferred to next security gate** · **Investigation:** `INC-CR014-04` · **Category:** Nova Corp incident response

## What happened?

The planned independent external-laptop VPN failure test was not run during the Phase 2 incident exercise.

## Why this test mattered

A valid external VPN test requires a separate external laptop/network and real handshake/traffic evidence; a virtual console simulation is not the same.

## What caused it?

The external test laptop was unavailable during CR-014. No fault injection or observed repair outcome exists for this test.

## Investigation — commands, expected results and actual findings

### 1. Was a real external laptop available?

```text
Document equipment and network prerequisites (no command executed)
```

**Expected / hypothesis:** Independent device and network available before injection.

**Actual recorded result:** Prerequisite not met.

### 2. Was the blind VPN incident injected?

```text
No command executed
```

**Expected / hypothesis:** Only run after rollback, client and connectivity checks.

**Actual recorded result:** Not run. No PASS claimed.

### 3. What already exists from earlier VPN project?

```text
See the separate WireGuard handshake case
```

**Expected / hypothesis:** Earlier VPN handshake troubleshooting has evidence.

**Actual recorded result:** CR-007 historical handshake incident succeeded; it is not this deferred CR-014 exercise.

## Repair / resolution

Perform external peer + privileged administrative VPN and management-plane validation during the approved later security gate (CR-016).

## What proves this outcome?

The full illustrated [incident engineering journal (PDF)](../../Documentation/Change-Requests/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf) contains the execution evidence, screenshots, exact command history and troubleshooting decisions. The brief [public incident-exercise overview](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) explains the wider exercise.

## Explore connected services

[WireGuard](../services/WIREGUARD.md) · [Firewall rules](../network/RULES.md).

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
