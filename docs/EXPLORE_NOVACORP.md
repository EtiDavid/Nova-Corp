# Explore Nova Corp

**Nova Corp is a fictional company. The systems and tests are real work performed in a home lab.**

Imagine joining the IT team at a small company. You need to understand its employees, identity system, network, file storage, security controls, and recovery options.

This is the **human-friendly map of what exists**. You do not need to know what a "CR" is. The technical journals are linked only when you want deeper evidence.

## Choose where to explore

| Go to | What you will discover |
| --- | --- |
| **[Computers & Servers](explore/SYSTEMS.md)** | Open the profile of a Domain Controller, file server, firewall, hypervisor, or workstation. |
| **[Identity & Active Directory](explore/IDENTITY.md)** | How employees sign in, why there are two Domain Controllers, DNS, and the directory structure. |
| **[People & Departments](explore/PEOPLE_AND_DEPARTMENTS.md)** | The company's organizational units, staff-account model, groups, and how profiles will work. |
| **[Network & Firewall](explore/NETWORK.md)** | What pfSense does, what each network zone means, and how access is restricted. |
| **[File Storage & Access](explore/FILE_SERVICES.md)** | Department folders, SMB/NTFS, DFS, Shadow Copies and who should have access. |
| **[Rules & Group Policy](explore/POLICIES.md)** | How user/computer settings are applied and how their effect is tested. |
| **[Tests, Failures & Recovery](explore/TESTS_AND_RECOVERY.md)** | What broke, how it was diagnosed, what was repaired, and what proves recovery. |

## Suggested first journey

**Employee needs a file → Windows sign-in → Active Directory → group membership → file-server access → recovery if the file is deleted.**

Try it by reading:

[People & Departments](explore/PEOPLE_AND_DEPARTMENTS.md) → [Identity](explore/IDENTITY.md) → [File Access](explore/FILE_SERVICES.md) → [Tests & Recovery](explore/TESTS_AND_RECOVERY.md).

## What is already interactive?

These GitHub pages are linked **reading paths**, not the eventual graphical website. The fully interactive map, expandable directory, clickable nodes, filters, screenshots, and profiles are specified in the website blueprint. They are not falsely presented as existing features.

## For technical reviewers

- [Architecture and addresses](ARCHITECTURE.md)
- [Skills mapped to evidence](SKILLS_EVIDENCE.md)
- [All engineering records](Documentation/Change-Requests/README.md)
- [Phase 2 operations runbook](runbooks/PHASE-2-OPERATIONS-RUNBOOK.md)

**Note:** CR means *Change Request*: a documented unit of engineering work. You do not need the CR numbers to explore the company.

## Building the full interactive explorer

The detailed, continuously updated product and engineering blueprint is [Nova Corp World Explorer — Source of Truth](site/NOVACORP-EXPLORER-SOURCE-OF-TRUTH.md). It defines clickable system profiles, OU/staff/group/GPO relationships, firewall-rule browsing, evidence views, design tokens, technology stack and the release process.
