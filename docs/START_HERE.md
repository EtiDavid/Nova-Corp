# Start Here — a three-minute tour of Nova Corp

Nova Corp is a fictional company I use to practice infrastructure engineering.

The goal is not to collect disconnected tutorials. Each change request starts from a business/operational need, changes the lab, validates the result, and preserves failures when they teach something useful.

**Current milestone:** Phase 2 closed with a documented conditional pass on 21 November 2026.

## 1. See the environment

Start with the current-state page:

**[Current architecture →](ARCHITECTURE.md)**

It shows the actual identities and addresses used at the Phase 2 boundary, including the places where the running environment differs from older target diagrams.

## 2. See how identity survives failure

CR-013 is one of the strongest technical journals.

It covers:

- two writable Domain Controllers;
- replication health;
- SYSVOL/NETLOGON;
- DNS/Kerberos/Global Catalog discovery;
- AD Recycle Bin;
- DC01 outage with client continuity through DC02;
- natural recovery after the DC returns;
- controlled replication divergence and recovery.

**[Open CR-013 →](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)**

## 3. See automation fail and get corrected

CR-011 builds eight PowerShell administration scripts.

The useful part is not the script count. The useful part is what failed:

- a password-policy error left half-created users;
- an access-analysis script compared group names incorrectly;
- protected identities and repeat-run behavior needed explicit controls.

**[Open CR-011 →](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)**

## 4. See controlled incident response

CR-014 deliberately exercises:

- permissions;
- DNS;
- Group Policy;
- backup/recovery;
- Domain Controller outage;
- simultaneous cross-service faults.

The external VPN incident was intentionally deferred rather than faked.

**[Open CR-014 summary →](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)**

## 5. See how Phase 2 was accepted

CR-015 performs final validation and handover.

It includes:

- current-state architecture reconciliation;
- pfSense management exposure discovered and remediated;
- HTTP → HTTPS management transport;
- rollback/configuration baselines;
- GPO export;
- snapshot-retention cleanup;
- Phase 2 operations runbook;
- visible open risks and CR-016 carry-forward.

**[Open CR-015 →](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)**

## Choose your route

| If you care about... | Open |
| --- | --- |
| Full CR-001 → CR-015 index | [Project Status](PROJECT_STATUS.md) |
| Architecture | [Architecture](ARCHITECTURE.md) |
| Troubleshooting stories | [Case Studies](CASE_STUDIES.md) |
| Operations / recovery | [Phase 2 Runbook](runbooks/PHASE-2-OPERATIONS-RUNBOOK.md) |
| Remote access | [CR-007](Documentation/Change-Requests/Journal-CR-007.md) |
| Group Policy | [CR-006](Documentation/Change-Requests/Journal-CR-006.md) |
| Backup and recovery | [CR-012](Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) |

## One important note

This is a home lab.

The systems, incidents and recovery exercises are real hands-on work inside the lab, but they are not stories from a real employer's production network.
