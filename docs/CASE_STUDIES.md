# Engineering Stories — problems I actually investigated

These are short recruiter/hiring-manager entry points. The detailed journals contain the commands, outputs, failed assumptions and recovery evidence.

## Existing story — WireGuard is more than a green handshake

**Source:** [CR-007 — Remote Access VPN](Documentation/Change-Requests/Journal-CR-007.md)

A tunnel indicator is not proof that the user can reach the intended service—or that they are blocked from services they should not reach.

The work followed the path through NAT, pfSense, WireGuard and internal firewall policy rather than treating the handshake as the final test.

The remaining external-workstation/privileged-management limitations are documented and carried into CR-016.

## Existing story — bulk user creation left incomplete accounts

**Source:** [CR-011 — PowerShell Administration Toolkit](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)

A weak temporary password was rejected after an AD user object had already been created.

The first script version reported failure but left incomplete accounts behind.

The workflow was changed to clean up partial state, then the failure was repeated to prove the rollback behavior.

**Lesson:** error handling is not the same thing as state recovery.

## Existing story — the access-analysis tool was wrong

**Source:** [CR-011 — Test-UserAccess](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)

The first comparison treated an AD group name and the domain-qualified ACL identity as different strings even though they represented the same group.

The comparison logic was corrected, then the result was checked against an actual user session.

**Lesson:** a diagnostic tool can create its own misleading symptom.

## Existing story — wrong network route / recovery preparation

**Source:** [Proxmox failure-testing report](Documentation/failure-testing-report.md)

An intentionally wrong network route was used to practice baseline capture and recovery planning before changing the network used to administer the lab.

## New Phase 2 evidence now public

The next dedicated case-study writing step will turn these into four full recruiter stories:

### AD survives a Domain Controller outage

Source:
[CR-013 — AD Resilience](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)

The lab tested client/domain continuity through DC02 while DC01 was unavailable, then observed natural convergence when DC01 returned.

### Backup was proven by restore

Sources:
[CR-012 — Backup and Recovery](Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) · [CR-014 Incident Exercises](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)

A backup target was made unavailable, the failure was detected, the target repaired, a new backup completed, and a deleted file was restored with matching SHA-256.

### One user complaint had two independent root causes

Source:
[CR-014 — Incident Exercises](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)

A blind cross-service incident combined incorrect DNS data with a separate authorization failure. The investigation had to isolate both layers instead of stopping after the first repair.

### Final validation found a management weakness and a storage risk

Source:
[CR-015 — Phase 2 Validation and Closure](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)

Final acceptance found broader-than-intended pfSense management reachability from a normal client and a Proxmox thin-pool snapshot-retention problem.

The management path was remediated and regression-tested. Twenty superseded snapshots were retired, reducing local-lvm from 86.73% to 52.88%.

---

**Note:** Nova Corp is a home lab. These are controlled lab incidents and observed lab failures, not production incidents from an employer.
