# Nova Corp — Enterprise Infrastructure Lab

**A fictional company, a real hands-on infrastructure lab.**

I built Nova Corp to learn what happens *after* a server has been installed: how employees authenticate, how network access is controlled, how permissions are enforced, what breaks, how to recover, and how to hand the environment to another engineer without relying on memory.

My focus is Windows Server, Active Directory, DNS, enterprise networking, PowerShell administration, backup/recovery and incident response.

> **Operate it. Break it. Fix it. Document it.**

This is a learning environment, not a claim that I have operated a real company's production network.

**[Start the 3-minute tour](docs/START_HERE.md)** · **[View current architecture](docs/ARCHITECTURE.md)** · **[Browse CR-001 → CR-015](docs/PROJECT_STATUS.md)** · **[Read engineering stories](docs/CASE_STUDIES.md)**

## Current milestone

**Phase 2: CLOSED — CONDITIONAL PASS (21 November 2026)**

The current Windows/network foundation includes:

- nested Proxmox on VMware Workstation;
- pfSense routing/firewalling and segmented lab networks;
- two writable `nova.corp` Domain Controllers;
- internal DNS and Windows domain time;
- Group Policy;
- departmental SMB/NTFS access;
- DFS Namespace and Shadow Copies;
- PowerShell administration automation;
- Windows Server Backup and file recovery;
- AD resilience and Recycle Bin recovery;
- controlled incident exercises;
- Phase 2 validation, rollback baselines and operations runbook.

The next mandatory security gate is **CR-016 — Privileged Admin VPN and Management Plane Firewall Isolation**. It is **not** presented as completed.

## At a glance

| Area | What I built / tested | Best starting point |
| --- | --- | --- |
| Virtualization | Nested Proxmox, storage and failure/recovery testing | [CR-001](docs/Documentation/Change-Requests/Journal-CR-001.md) |
| Network | pfSense, VLANs, firewall paths, WireGuard | [CR-007](docs/Documentation/Change-Requests/Journal-CR-007.md) |
| Identity | Active Directory, DNS, two DCs, resilience | [CR-013](docs/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| Policy | Modular Group Policy and workstation controls | [CR-006](docs/Documentation/Change-Requests/Journal-CR-006.md) |
| File services | SMB/NTFS, DFS, Shadow Copies | [CR index](docs/PROJECT_STATUS.md) |
| Automation | Eight PowerShell administration scripts | [CR-011](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |
| Recovery | Windows Server Backup, System State, restore verification | [CR-012](docs/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) |
| Incident response | Blind/reversible DNS, permissions, GPO, backup and AD exercises | [CR-014](docs/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| Operational acceptance | Current-state reconciliation, management hardening, rollback and closure | [CR-015](docs/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |

## Architecture

The current text architecture is here:

**[Current architecture →](docs/ARCHITECTURE.md)**

A recruiter-facing interactive SVG is the next design step. Until then, the public documentation uses the validated current-state register rather than an older target diagram.

## Four examples of the engineering approach

### 1. A WireGuard handshake was not treated as authorization

CR-007 follows the packet path through the home router, NAT, pfSense and the remote client. It separates "the tunnel exists" from "the user can reach the correct internal service."

[Read CR-007 →](docs/Documentation/Change-Requests/Journal-CR-007.md)

### 2. A bulk-user script failed safely only after I fixed rollback

In CR-011, a weak password was rejected after the AD object had already been created. The first version reported failure but left incomplete accounts behind. I added cleanup logic and repeated the failure test.

[Read CR-011 →](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)

### 3. Backup was proven by restore, not by a green job status

The recovery work progressed from backup configuration to a real target-unavailable failure and a deleted-file restore. The recovered file's SHA-256 matched the original.

[Read CR-012 →](docs/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) · [Incident validation →](docs/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)

### 4. Final validation found a real management weakness

CR-015 found that a normal client could reach pfSense management paths more broadly than intended. The path was reproduced, corrected and regression-tested. The same closure review also found snapshot-retention pressure and reclaimed about 125.72 GiB while preserving the active rollback point.

[Read CR-015 →](docs/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)

## How I work

1. **Understand the need.**
2. **Record the baseline.**
3. **Make a controlled change.**
4. **Test the intended path.**
5. **Test the path that should be denied.**
6. **Investigate failures by layer.**
7. **Use the smallest safe repair.**
8. **Retest and document the evidence.**

The detailed journals intentionally preserve wrong assumptions, failed commands and failed injectors when they produced a useful engineering lesson.

## Operations

A concise public operator runbook is available here:

**[Phase 2 Operations Runbook →](docs/runbooks/PHASE-2-OPERATIONS-RUNBOOK.md)**

## Important limitations

This portfolio does **not** claim that:

- the lab is production-scale;
- backup storage is physically off-host;
- centralized monitoring is already implemented;
- a privileged-admin VPN is already complete;
- external WireGuard validation was repeated during CR-015;
- the pfSense certificate is enterprise-trusted.

Those items are either lab limitations or future work.

## About me

I'm **David Eti**. I am building practical experience for System Engineer, System Administrator, Infrastructure and DevOps roles by building, operating, breaking, recovering and documenting this environment.

For the cloud/CI/CD side of my work, see my separate [NovaPredict DevOps case study](https://github.com/EtiDavid/novapredict-devops-case-study).
