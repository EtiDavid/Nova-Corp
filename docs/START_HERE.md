# Start here — a three-minute tour

If you have a few minutes to review my work, this is the fastest route through Nova Corp.

## What is it?

Nova Corp is a fictional company that I use to practice infrastructure engineering. I run a nested virtual environment with networking, Windows domain services and a domain client. Instead of collecting disconnected tutorials, I treat changes as requests from a business: deploy a service, show that it works, investigate a failure, and document the result.

The detailed journals describe the *commands*; this guide explains where the interesting engineering decisions are.

## What I would show in an interview

**First: network and remote access.** [CR-007](Documentation/Change-Requests/Journal-CR-007.md) covers the WireGuard path through pfSense, including a handshake failure, packet-path diagnosis and checks that access stays within the intended rules. I did not complete every external Windows workstation objective, and I explain why.

**Second: automation that handles failure.** [CR-011](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) covers eight standalone PowerShell scripts. I intentionally tested invalid passwords, duplicates and protected account boundaries. The most useful lesson was that reporting an error isn't enough if a script leaves a half-created AD account behind.

**Third: recovery and validation.** The [failure-testing report](Documentation/failure-testing-report.md) records a deliberately wrong network gateway and recovery strategy. Later CR-013 work includes a two-DC failover and replication-divergence exercise; its full journal is currently in the private working repo and is not yet a public evidence link.

## My environment, simplified

- **Platform:** VMware Workstation hosting nested Proxmox.
- **Network control:** pfSense, segmented lab networks, WireGuard remote-access exercise.
- **Identity:** Windows Server Active Directory, two domain controllers and DNS.
- **Workloads:** domain client, departmental file services and access control.
- **Operational work:** backups, PowerShell administration and incident exercises.

This is a small lab with real hands-on tests, not a production deployment or a measured enterprise-scale benchmark.

## Where to go next

| Your interest | Read |
| --- | --- |
| Windows, AD and Group Policy | [Change-request index](PROJECT_STATUS.md) |
| Real troubleshooting stories | [Engineering case studies](CASE_STUDIES.md) |
| Networking / remote VPN | [CR-007 journal](Documentation/Change-Requests/Journal-CR-007.md) |
| PowerShell / identity automation | [CR-011 journal](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |
| Early failure and recovery | [Failure-testing report](Documentation/failure-testing-report.md) |

I keep the raw engineering history even when something didn't work. The project is most useful when the documentation shows both the result and the reasoning that got me there.
