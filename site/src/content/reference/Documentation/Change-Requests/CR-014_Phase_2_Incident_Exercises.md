---
title: "CR-014 — Phase 2 Incident Exercises"
sourcePath: "docs/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md"
section: "Documentation"
---

# CR-014 — Phase 2 Incident Exercises

**Status:** COMPLETE / PASS with one explicit deferral  
**Scope:** controlled troubleshooting and recovery exercises across the Phase 2 Windows foundation

CR-014 was designed to answer a different question from the build change requests:

> Can the environment be diagnosed and recovered when the user-visible symptom is misleading?

The exercises were deliberately reversible. Root causes were withheld during blind investigations where practical, failed injectors were preserved instead of being rewritten out of the story, and every repair had to be validated from the user/service perspective.

## Incident summary

| Incident | Result | What it tested |
| --- | --- | --- |
| Share / NTFS permissions | PASS | Authentication, group membership, share permissions, NTFS permissions and user-token state |
| DNS / DC discovery | PASS | Separating name resolution from server/service availability |
| Group Policy | PASS | GPO processing, SYSVOL dependency, targeting and effective result |
| VPN → internal resource | **DEFERRED TO CR-016** | Genuine external-device and privileged-management validation |
| Backup / recovery | PASS | Target-unavailable failure, repair, fresh backup and file restore |
| Domain Controller / AD | PASS | DC outage, continuity, recovery and replication health |
| Cross-service misleading symptom | PASS | Two simultaneous faults with independent root causes |

## Strong examples

### DNS looked like a file-server outage

The client could not reach the file share by name.

Instead of rebooting the file server, the investigation separated layers:

- direct TCP/445 to the known file-server IP worked;
- direct DNS query to an internal Nova DNS server worked;
- the client's configured DNS path was wrong.

After restoring the correct DNS configuration, domain discovery and file access were retested successfully.

### Backup success was not treated as recovery proof

The backup target was deliberately made unavailable.

The stored Windows Server Backup job produced a real failure. After the target was returned to service, a new backup completed.

A disposable file was then deleted and restored to an alternate path. Original and recovered SHA-256 matched:

`79FCAD43C927A5B19FB820E3E0BD9EE829083769AD2BE5E487C425B7820332E5`

### Cross-service incident

The final blind exercise combined two independent faults behind one user complaint:

1. incorrect DNS data for the file server;
2. the user's authorization path was changed.

The operator had to separate name resolution from network reachability and authorization rather than assuming one root cause explained everything.

## Important limitation

The external VPN incident was not fabricated.

The required genuinely external test device was unavailable, so the external-user / privileged-admin validation was carried forward to **CR-016 — Privileged Admin VPN and Management Plane Firewall Isolation**.

## Connected parts of Nova Corp

[Domain Controllers](/reference/explore/IDENTITY/) · [File server](/reference/explore/systems/NOVA-FILES01/) · [DNS](/reference/explore/services/DNS/) · [Group Policy](/reference/explore/POLICIES/) · [Recovery](/reference/explore/services/BACKUPS/) · [All investigations](/reference/explore/TESTS_AND_RECOVERY/)

## Full historical record

The public engineering PDF remains available here:

[CR-014 Engineering Journal and Evidence](/journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence/)

The engineering PDF contains the complete incident execution record.
