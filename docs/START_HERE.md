# Start Here — Nova Corp in 60 seconds

If you are reviewing this repository for a **System Engineer, System Administrator, Infrastructure or DevOps** role, this is the shortest useful path.

## What is Nova Corp?

Nova Corp is a **fictional company used as a hands-on infrastructure lab**.

I use it to practice the work that connects separate technologies into one operating environment: identity, DNS, networking, security policy, file access, automation, backup, recovery and incident response.

**Current milestone:** Phase 2 closed with a documented **Conditional Pass** on **21 November 2026**.

---

## What should make this worth a deeper look?

### I did not stop at installation

I deliberately tested:

- a Domain Controller outage;
- replication recovery;
- client DNS failure;
- Group Policy failure;
- permissions failure;
- backup-target failure;
- deleted-file restore;
- cross-service faults;
- firewall/management-access mistakes;
- snapshot-storage pressure.

### I kept the failures

The journals preserve wrong assumptions, failed injectors and corrections where they teach something useful.

### I can point to proof

- **AD resilience:** [CR-013](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)
- **PowerShell automation:** [CR-011](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)
- **Incident response:** [CR-014](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)
- **Operational acceptance:** [CR-015](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)

---

## Five numbers

- **2** writable Domain Controllers
- **8** validated PowerShell administration scripts
- **7** GPOs frozen in the Phase 2 baseline
- **20** old Proxmox snapshots retired during closure
- **125.72 GiB** reclaimed from the thin pool while preserving the active rollback point

And one result I care about more than a number:

**a deleted file was restored and its SHA-256 matched the original.**

---

## Pick your depth

### Recruiter / non-technical reviewer

1. [Current architecture](ARCHITECTURE.md)
2. [Engineering stories](CASE_STUDIES.md)
3. [Skills → evidence](SKILLS_EVIDENCE.md)

### Technical hiring manager

1. [CR-013 — AD resilience](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md)
2. [CR-014 — incident exercises](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)
3. [CR-015 — final validation](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md)
4. [Phase 2 operations runbook](runbooks/PHASE-2-OPERATIONS-RUNBOOK.md)

### Deep technical review

[Browse CR-001 → CR-015](PROJECT_STATUS.md)

---

## One important boundary

This is a **home lab**, not a production environment from an employer.

The engineering work is real hands-on work in the lab. The project also keeps unfinished work visible: CR-016 privileged-management isolation and centralized monitoring are not presented as already completed.
