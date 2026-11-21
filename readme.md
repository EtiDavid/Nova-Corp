# Nova Corp | Explore a simulated company's IT infrastructure

**A fictional company. A real hands-on enterprise infrastructure lab.**

I built Nova Corp to learn how the parts of a company's IT environment work **together**: employees sign in, computers find services, departmental files have access controls, networks are separated, administrators apply policies, and systems can be tested and recovered when something fails.

I'm David Eti, building practical experience for **System Engineer, System Administrator, Infrastructure and DevOps** roles. This is my home lab—not a claim of employment or production operations.

### [🏢 Explore Nova Corp — start with the company, not the documentation →](docs/EXPLORE_NOVACORP.md)

**Other ways in:** [See the architecture](docs/ARCHITECTURE.md) · [Investigate failures](docs/explore/TESTS_AND_RECOVERY.md) · [Skills and proof](docs/SKILLS_EVIDENCE.md)

---

## What's inside Nova Corp?

| Explore | What you can learn |
| --- | --- |
| **[Computers & Servers](docs/explore/SYSTEMS.md)** | What the two Domain Controllers, file server, firewall, hypervisor and client actually do. |
| **[People & Departments](docs/explore/PEOPLE_AND_DEPARTMENTS.md)** | How employees, departmental OUs and security groups are organized. |
| **[Active Directory & DNS](docs/explore/IDENTITY.md)** | How computers find the domain and people authenticate; how the second DC provides resilience. |
| **[Network & Firewall](docs/explore/NETWORK.md)** | Why different networks exist and how pfSense restricts communication. |
| **[Files & Permissions](docs/explore/FILE_SERVICES.md)** | How departments share files without receiving unrestricted access to other departments. |
| **[Rules & Group Policy](docs/explore/POLICIES.md)** | How Windows settings are managed centrally and tested. |
| **[Failures & Recovery](docs/explore/TESTS_AND_RECOVERY.md)** | Real lab failures, investigation steps, fixes, and restore/validation results. |

*These GitHub pages are a navigable reading guide. The interactive visual company explorer is being designed; it is not live yet.*

---

## What I actually demonstrated

**Identity resilience.** Two writable Domain Controllers were validated. In a controlled outage, client/domain services continued through the second controller, followed by replication recovery.

**Recovery instead of backup theatre.** A backup target was deliberately made unavailable. After diagnosis and repair, a deleted file was restored and its SHA-256 matched the original.

**Useful automation.** Eight PowerShell administration scripts were validated; a bulk-user script was corrected after a password failure left partially created accounts.

**Security and operational review.** Final testing uncovered an unintended normal-client management path to pfSense; it was corrected and tested against both denied and allowed traffic.

**Storage discipline.** Twenty obsolete snapshots were retired; Proxmox thin-pool utilization fell from **86.73% to 52.88%** while the active rollback point was preserved.

[Open the evidence-led investigations →](docs/CASE_STUDIES.md)

---

## Current progress

**Windows infrastructure foundation: Phase 2 closed with documented conditions (21 November 2026).**

The next security project is stronger privileged-administrator VPN and management-plane isolation. Centralized monitoring is later work. Neither is presented as already completed.

The lab remains nested in VMware and shares the outer host's physical failure domain.

---

## For technical reviewers

Want the exact commands, failures, tests, screenshots and journal sources?

- [Skills → supporting evidence](docs/SKILLS_EVIDENCE.md)
- [Current architecture, names and network zones](docs/ARCHITECTURE.md)
- [Full engineering record index](docs/Documentation/Change-Requests/README.md)
- [Phase 2 operations runbook](docs/runbooks/PHASE-2-OPERATIONS-RUNBOOK.md)
- [Project status and roadmap](docs/PROJECT_STATUS.md)

In the detailed engineering records, **CR = Change Request**, a documented piece of work. You do **not** need to know or navigate by CR numbers to explore Nova Corp.

For my separate cloud/DevOps work, see [NovaPredict](https://github.com/EtiDavid/novapredict-devops-case-study).

---

**What the lab is not:** a production environment, a fictional employee-count claim, a live management dashboard, or an assertion that unfinished security/monitoring work is complete.
