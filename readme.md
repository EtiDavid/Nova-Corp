# Nova Corp — Enterprise Infrastructure Engineering Lab

> **A fictional company. Real hands-on infrastructure engineering.**

I built Nova Corp to practice the work behind a small enterprise Windows environment: **identity, networking, policy, file services, automation, backup, recovery and incident response**.

The project is not presented as production experience. It is a documented lab where I build a change, validate it, deliberately test failure paths, recover it, and preserve the evidence.

**Current milestone:** **Phase 2 closed — Conditional Pass (21 Nov 2026)**  
**Next security gate:** **CR-016 — Privileged Admin VPN & Management Plane Isolation**

### Start here

**[60-second overview](docs/START_HERE.md)** · **[Current architecture](docs/ARCHITECTURE.md)** · **[Skills → evidence](docs/SKILLS_EVIDENCE.md)** · **[Engineering stories](docs/CASE_STUDIES.md)** · **[CR-001 → CR-015](docs/PROJECT_STATUS.md)**

---

## What I can demonstrate today

| Capability | Evidence |
| --- | --- |
| **Active Directory & DNS** | Two writable DCs, AD-integrated DNS, SRV discovery, SYSVOL/NETLOGON, time hierarchy and replication validation |
| **Resilience** | Controlled DC outage, continued client/domain operation through DC02, natural convergence after recovery |
| **Networking & security** | pfSense, segmented VLANs, firewall policy, WireGuard, positive/negative management-path testing |
| **Windows administration** | Group Policy, users/OUs/groups, SMB/NTFS, DFS, Shadow Copies |
| **PowerShell automation** | 8 administration scripts with parser checks, hashes, failure handling and versioned release |
| **Backup & recovery** | Windows Server Backup, backup-target failure, fresh backup, deleted-file restore and SHA-256 verification |
| **Incident response** | Controlled DNS, permissions, GPO, backup, DC and cross-service troubleshooting exercises |
| **Operational discipline** | Change journals, rollback plans, current-state reconciliation, runbook and closure/risk registers |

**[See the exact CRs and proof for each skill →](docs/SKILLS_EVIDENCE.md)**

---

## A few concrete results

- **2 writable Domain Controllers** validated for replication and client failover.
- **8 PowerShell administration scripts** frozen as a validated release.
- **7 current GPOs** exported and reconciled in the Phase 2 baseline.
- **Backup restore verified by SHA-256**, not only by a successful job status.
- **20 superseded Proxmox snapshots retired** during final validation.
- **local-lvm reduced from 86.73% to 52.88%**, reclaiming about **125.72 GiB**.
- A normal-client **pfSense management exposure was discovered during acceptance**, corrected and regression-tested.

These are lab results, not employer production metrics.

---

## The environment in one sentence

**Windows host → VMware Workstation → nested Proxmox → pfSense → segmented Nova Corp networks → Active Directory/DNS, file services and domain clients.**

Current core systems:

| System | Role |
| --- | --- |
| `nova-prox01` | Nested Proxmox hypervisor |
| `nova-fw01` / `pfSense.home.arpa` | Routing, firewalling, DNS Resolver, WireGuard |
| `NOVA-DC01` | AD DS + DNS |
| `NOVA-DC02` | AD DS + DNS + resilience / FSMO |
| `NOVA-FILES01` | SMB, DFS, Shadow Copies, Windows Server Backup |
| `NOVA-CLIENT` | Domain-joined validation workstation |

**[Open the current architecture →](docs/ARCHITECTURE.md)**

---

## Four engineering stories worth reading

### 1. AD kept working when a Domain Controller went offline
I took DC01 offline in a controlled test, validated client/domain services through DC02, then observed natural convergence when DC01 returned.

**[Read CR-013 →](docs/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)**

### 2. Backup was proven by restore
A backup target was deliberately made unavailable, the real failure was detected, the target repaired, a new backup completed, and a deleted file was restored with the **same SHA-256** as the original.

**[Read the incident summary →](docs/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)**

### 3. My automation failed — and I fixed the state, not only the error message
A bulk-user script hit password-policy failure after creating AD objects. I added cleanup/rollback behavior and repeated the test.

**[Read CR-011 →](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)**

### 4. Final acceptance found two real operational risks
CR-015 exposed broader-than-intended pfSense management reachability from a normal client and excessive snapshot retention. The access path was hardened and the storage problem was cleaned up without removing the active rollback point.

**[Read CR-015 →](docs/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)**

**[Browse all engineering stories →](docs/CASE_STUDIES.md)**

---

## How I work

```text
Need
  → Baseline
  → Controlled change
  → Positive test
  → Negative/security test
  → Failure analysis
  → Minimum repair
  → Regression test
  → Evidence
  → Documentation
```

The journals intentionally preserve useful mistakes, failed commands and failed injectors instead of rewriting the project as if everything worked first time.

---

## Repository map

| If you want... | Go here |
| --- | --- |
| Fast recruiter/hiring-manager tour | [Start Here](docs/START_HERE.md) |
| Current technical design | [Architecture](docs/ARCHITECTURE.md) |
| Skills mapped to proof | [Skills & Evidence](docs/SKILLS_EVIDENCE.md) |
| Troubleshooting / recovery stories | [Case Studies](docs/CASE_STUDIES.md) |
| CR status and chronology | [Project Status](docs/PROJECT_STATUS.md) |
| Full change-request index | [Change Requests](docs/Documentation/Change-Requests/README.md) |
| Operating procedures | [Phase 2 Runbook](docs/runbooks/PHASE-2-OPERATIONS-RUNBOOK.md) |

---

## Scope and limitations

<details>
<summary><strong>What I am not claiming</strong></summary>

This is a home lab and learning environment.

I am **not** claiming that:

- I operated these systems for a real employer;
- the environment is production-scale;
- backup storage is physically off-host;
- centralized monitoring is already implemented;
- the privileged-admin VPN / final management-plane design is already complete;
- the pfSense certificate is enterprise-trusted;
- every future roadmap item already exists.

Those gaps are documented and carried into later change requests instead of being hidden.

</details>

---

## About me

I'm **David Eti**. I am building practical experience for **System Engineer, System Administrator, Infrastructure and DevOps** roles by building, operating, breaking, recovering and documenting this environment.

For the cloud/CI/CD side of my work, see my separate [NovaPredict DevOps case study](https://github.com/EtiDavid/novapredict-devops-case-study).
