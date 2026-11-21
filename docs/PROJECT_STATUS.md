# Nova Corp — Project Status and Public Evidence

**Reviewed:** 21 November 2026  
**Current milestone:** **Phase 2 closed — CONDITIONAL PASS**  
**Next mandatory security gate:** **CR-016 — Privileged Admin VPN and Management Plane Firewall Isolation**

This page distinguishes:

- **engineering status** — what was built/tested in the lab;
- **publication status** — what is currently available in this public repository;
- **future roadmap** — what is planned but not yet claimed as implemented.

## CR-001 → CR-015

| CR | Subject | Engineering status | Public evidence |
| --- | --- | --- | --- |
| CR-001 | Proxmox virtual platform | COMPLETE | [Journal](Documentation/Change-Requests/Journal-CR-001.md) · [Failure tests](Documentation/failure-testing-report.md) |
| CR-002 | pfSense / network foundation | COMPLETE | [Journal](Documentation/Change-Requests/Journal-CR-002.md) |
| CR-003 | Active Directory and DNS | COMPLETE | [Journal](Documentation/Change-Requests/Journal-CR-003.md) |
| CR-004 | Additional Domain Controller / HA foundation | COMPLETE | [Journal](Documentation/Change-Requests/Journal-CR-004.md) |
| CR-005 | OU / users / groups / AGDLP foundation | COMPLETE | [Journal](Documentation/Change-Requests/Journal-CR-005.md) |
| CR-006 | Group Policy and workstation security | COMPLETE | [Journal](Documentation/Change-Requests/Journal-CR-006.md) |
| CR-007 | WireGuard remote access | COMPLETE with documented external-workstation limitations | [Journal](Documentation/Change-Requests/Journal-CR-007.md) |
| CR-008 | File Server deployment | COMPLETE | [PDF](Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) |
| CR-009 | Departmental shares and drive mapping | COMPLETE | [PDF](Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) |
| CR-010 | DFS and Shadow Copies | COMPLETE | [PDF](Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) |
| CR-011 | PowerShell Administration Toolkit | COMPLETE / validated `CR-011-v1.0.0` | [Markdown](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) · [PDF](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.pdf) |
| CR-012 | Windows Server Backup and Recovery | IMPLEMENTATION COMPLETE; historical publication had one pending natural schedule item, later recovery controls validated downstream | [Markdown](Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) · [PDF](Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.pdf) |
| CR-013 | Secondary DC and AD Resilience | COMPLETE / PASS | [Markdown](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) · [PDF](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.pdf) |
| CR-014 | Phase 2 Incident Exercises | COMPLETE / PASS; external VPN incident deferred to CR-016 | [Summary](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) · [Engineering PDF](Documentation/Change-Requests/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf) |
| CR-015 | Phase 2 Validation and Closure | **CLOSED — CONDITIONAL PASS** | [Closure summary](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |

## Phase 2 closure conditions

Phase 2 is closed, but not every future security/operations feature is complete.

Still open:

- CR-016 privileged-admin VPN / management-plane isolation;
- genuine external user/admin VPN validation;
- later centralized monitoring/observability;
- accepted home-lab shared physical-host failure domain.

A fresh independent second-operator runbook test was also waived after the extensive CR-014 blind incident campaign. That exception is documented rather than hidden.

## Current operations material

- [Current Architecture](ARCHITECTURE.md)
- [Phase 2 Operations Runbook](runbooks/PHASE-2-OPERATIONS-RUNBOOK.md)
- [Engineering Case Studies](CASE_STUDIES.md)

## Publication quality work still in progress

Some historical Markdown journals reference screenshot assets that are not yet present in the public tree, particularly CR-011, CR-012 and CR-013.

The technical journals remain public, but the screenshot set is being curated rather than dumping every raw lab image into the portfolio.

The next portfolio steps are:

1. repair/curate the missing visual evidence;
2. design the main architecture SVG;
3. write the first four dedicated recruiter case studies;
4. build the interactive story-map website.

Future CRs are not listed as implemented until their own evidence exists.
