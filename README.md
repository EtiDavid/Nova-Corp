# Nova Corp — Explore an Enterprise Infrastructure Lab

**A fictional company. Real hands-on infrastructure engineering.**

I built Nova Corp to learn how a company’s IT systems work **together**. It has employees and departments in Active Directory, Domain Controllers and DNS, a segmented network behind pfSense, shared files with permission controls, centralized Windows policies, PowerShell administration tools and tested recovery procedures.

The interesting part is not just what I installed. It’s how the pieces connect — and what happened when they failed.

**Explore the lab visually: [novacorp.davideti.dev](https://novacorp.davideti.dev)** — a click-through tour of the company, its systems and every tested failure.

Prefer to read on GitHub? [Enter Nova Corp →](docs/EXPLORE_NOVACORP.md)

[See how everything connects](docs/ARCHITECTURE.md) · [Meet the systems](docs/explore/SYSTEMS.md) · [Browse tests and failures](docs/explore/TESTS_AND_RECOVERY.md) · [Technical evidence](docs/SKILLS_EVIDENCE.md)

## Four things I proved

**Active Directory resilience:** DC01 was taken offline in a controlled test. The workstation continued through DC02, and replication was checked when DC01 returned. [Explore DC02](docs/explore/systems/NOVA-DC02.md).

**Backup and recovery:** A backup target was deliberately disconnected. After repair and a fresh backup, a deleted file was restored with the **same SHA-256 hash** as the original. [Explore recovery](docs/explore/services/BACKUPS.md).

**PowerShell fault handling:** A bulk-user script initially left half-created accounts after a password-policy rejection. I corrected the cleanup and repeated the failure test. [Explore automation](docs/explore/AUTOMATION.md).

**Operational hardening:** Final validation uncovered unnecessary client access to pfSense management and a snapshot-storage problem. Both were addressed; `local-lvm` fell from **86.73% to 52.88%** after retiring 20 superseded snapshots. [Explore pfSense](docs/explore/systems/NOVA-FW01.md).

## Status

- **Done:** Windows infrastructure foundation (CR-001 to CR-015), signed off 21 Nov 2026 with conditions. TODO(David): list the conditions in one line.
- **Next:** CR-016, privileged admin VPN and management-plane isolation. Not started.
- **Later:** Linux, Microsoft 365 and centralized monitoring. This is a nested home lab, not an employer production network.

---

## Explore the lab

| Section | Open |
| --- | --- |
| **Systems** | [Servers, firewall, hypervisor and workstation](docs/explore/SYSTEMS.md) |
| **Identity** | [Domain Controllers → Active Directory → DNS / Kerberos / LDAP](docs/explore/services/ACTIVE_DIRECTORY.md) |
| **People & access** | [Staff accounts → OUs → groups → access](docs/explore/PEOPLE_AND_DEPARTMENTS.md) |
| **Network** | [pfSense → zones → firewall rules → VPN](docs/explore/NETWORK.md) |
| **Files** | [NOVA-FILES01 → shares → SMB/NTFS → DFS → backups](docs/explore/FILE_SERVICES.md) |
| **Policies** | [Group Policy → targeting → effective results](docs/explore/POLICIES.md) |
| **Automation** | [Eight PowerShell scripts](docs/explore/AUTOMATION.md) |
| **Recovery** | [Backups, VSS, AD recovery and restore proof](docs/explore/services/BACKUPS.md) |
| **Incidents** | [Mistakes, outages, investigations and recovery](docs/explore/TESTS_AND_RECOVERY.md) |

**[Complete component index — all fifteen completed engineering changes →](docs/explore/ALL_COMPONENTS.md)**

## One example of how the company works

Moyo signs in to a domain workstation, authenticates through the domain, and wants to open IT files. AD group membership and the file server’s permissions decide the result.

The lab verified that **IT access worked while Finance access was denied**.

**[Moyo](docs/explore/people/MOYO.md)** → [**IT_Users group**](docs/explore/GROUPS.md#it_users) → [**SMB + NTFS**](docs/explore/services/SMB.md) → [**IT folder**](docs/explore/files/it.md) → [**real-user proof**](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

## Repository map

```text
docs/
  ARCHITECTURE.md        system and network design
  FACTS.md               single source of truth for key facts
  explore/               visitor-friendly pages (mirrors the website)
  Documentation/Change-Requests/   full CR journals (source of truth)
  runbooks/              operations runbook
scripts/                 PowerShell administration toolkit
```

## For technical reviewers

[Detailed architecture](docs/ARCHITECTURE.md) · [Skills mapped to evidence](docs/SKILLS_EVIDENCE.md) · [Engineering case studies](docs/CASE_STUDIES.md) · [Full implementation journals and PDFs](docs/Documentation/Change-Requests/README.md) · [Operations runbook](docs/runbooks/PHASE-2-OPERATIONS-RUNBOOK.md)

**About me:** I'm David Eti, looking for system administrator, infrastructure and DevOps roles in Belgium and the Netherlands. [CV](https://novacorp.davideti.dev/David_Eti_Systems_Infrastructure_CV.pdf) · [Email](mailto:etidavid26@gmail.com) · [LinkedIn](https://www.linkedin.com/in/eti-david)

My separate cloud/CI/CD project: [NovaPredict DevOps](https://github.com/EtiDavid/novapredict-devops-case-study).