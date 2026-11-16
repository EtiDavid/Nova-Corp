# Nova Corp — Enterprise Infrastructure Lab

**A fictional company, a real hands-on infrastructure lab.**

I built Nova Corp to understand what happens *after* a server has been installed: how employees authenticate, how network access is controlled, how permissions are enforced, what breaks, and how to recover without making the problem worse.

My focus is Windows Server, Active Directory, DNS, enterprise networking, PowerShell administration and incident response. I plan changes, test them from the user's point of view, deliberately investigate failures, and keep the commands and evidence—even when my first attempt was wrong.

> **Operate it. Break it. Fix it. Document it.**  
> This is a learning environment, not a claim that I have operated a real company's production network.

**[Start the 3-minute tour](docs/START_HERE.md)** · **[Browse completed work](docs/PROJECT_STATUS.md)** · **[Read troubleshooting stories](docs/CASE_STUDIES.md)**

## At a glance

| Area | What I have worked on | Where to look |
| --- | --- | --- |
| Virtualization and recovery | Nested Proxmox on VMware Workstation; initial network and failure tests | [CR-001](docs/Documentation/Change-Requests/Journal-CR-001.md) · [failure-testing report](docs/Documentation/failure-testing-report.md) |
| Network and remote access | pfSense, segmented networks, WireGuard, firewall paths and negative-access tests | [CR-007](docs/Documentation/Change-Requests/Journal-CR-007.md) |
| Identity and workstation management | Active Directory, two domain controllers, DNS, OUs and Group Policy | [CR index](docs/PROJECT_STATUS.md) |
| File access and recovery | Departmental shares, NTFS permissions, DFS and Shadow Copies | [CR index](docs/PROJECT_STATUS.md) |
| Safe administration | Eight PowerShell administration scripts, validation, rollback and repeat-run behavior | [CR-011](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |
| Incident investigation | Hypothesis-led diagnostics, controlled fault exercises and recovery checks | [Engineering stories](docs/CASE_STUDIES.md) |

**Status note (reviewed 16 November 2026):** The public repository contains historical journals through CR-011. More recent technical work, including CR-012/CR-013 and active CR-014 incident exercises, is recorded in a separate private working repository. I am reviewing and sanitizing that evidence before publishing it here. **Published documentation is not the same as the full state of the lab.**

## How the systems fit together

```text
                  Home / external network
                            |
                      Home router
                            |
                    VMware Workstation
                            |
                     Nested Proxmox
                            |
                         pfSense
                    /       |       \
          Management    Server network   Remote VPN
                            |                |
             +--------------+------+     WireGuard
             |              |      |
          NOVA-DC01     NOVA-DC02  NOVA-FILES01
             |              |      |
             +--- AD DS / DNS -----+--- SMB / NTFS / DFS
                            |
                       Domain client
```

*Simplified logical view, not a complete physical wiring diagram or a claim that every service is available from every network. For network restrictions and actual tests, see the journals. A graphical architecture diagram is planned for the website.*

## Three problems worth reading

**1. WireGuard connected, but access still had to be proven.** In [CR-007](docs/Documentation/Change-Requests/Journal-CR-007.md), I worked through a handshake problem caused by peer key configuration, checked traffic paths across NAT and firewall layers, and tested which internal services a remote client could and could not reach. Not every external-workstation objective was completed; the journal records the remaining Windows Home limitations.

**2. Bulk user creation left half-created accounts.** In [CR-011](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md), a password-policy rejection exposed a flaw: the script returned an error but left disabled accounts behind. I added cleanup/rollback logic, tested the failure again and verified that the incomplete users no longer remained.

**3. An access-checking script was wrong even though permissions were right.** In [CR-011](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md), the first comparison treated `DL_FS_IT_Modify` and `NOVA\DL_FS_IT_Modify` as different groups. I corrected the matching logic and checked both authorized IT access and denied Finance access. The script is an ACL analysis tool, so I also validated actual access in a user session.

[Read the short versions and find the source evidence →](docs/CASE_STUDIES.md)

## How I work

1. **Understand the need.** What problem does this service solve for the fictional company?
2. **Build a baseline.** Record the initial state and define what a working result should look like.
3. **Make a controlled change.** Consider dependencies, access boundaries and rollback.
4. **Test from more than one angle.** A successful command alone is not proof that the intended result happened.
5. **Investigate the failures.** Keep failed commands, wrong assumptions and the tests that ruled them out.
6. **Validate and document.** Include both positive and negative tests where appropriate.

The journals are intentionally detailed; this README and the linked guide are the shorter route for someone evaluating the project.

## Find the evidence

- **[3-minute guided tour](docs/START_HERE.md)** — what the lab is and what to open first.
- **[Change-request index and honest progress](docs/PROJECT_STATUS.md)** — published files versus current engineering status.
- **[Engineering case studies](docs/CASE_STUDIES.md)** — problem, diagnosis, result and source journal.
- **[CR-011 PowerShell administration journal](docs/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)** — eight scripts and the failure cases they had to survive.
- **[CR-007 remote-access journal](docs/Documentation/Change-Requests/Journal-CR-007.md)** — WireGuard, firewall and packet-path evidence.
- **[Initial failure-testing report](docs/Documentation/failure-testing-report.md)** — intentionally broken Proxmox network configuration and recovery.

## What's next

The lab continues with incident exercises and later security, Linux, Microsoft workplace and operations work under an approved 33-change-request roadmap. **Planned work is not presented as implemented.** My next portfolio tasks are a sanitized architecture diagram, selected screenshots with captions, publicly reviewable later journals and a small visual site at **`novacorp.etidavid.dev`**. That address is a plan, **not a live-site claim**.

## About me

I'm **David Eti**, and I'm building practical experience for System Engineer, System Administrator, Infrastructure and DevOps roles. I learn best by building something, checking what I actually understand, and working through the problems that come with operating it.

For the cloud deployment and CI/CD side of my work, see my separate [NovaPredict DevOps case study](https://github.com/EtiDavid/novapredict-devops-case-study).
