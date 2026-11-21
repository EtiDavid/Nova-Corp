# NOVA-CLIENT — Domain Workstation

**Role:** Employee-facing Windows test workstation · **Address:** `10.10.40.100`

## What it does

This is the Windows workstation used to verify Nova Corp from an employee's perspective.

The important question is not simply whether servers are running, but whether someone signed into a normal workstation can find the domain, receive the right policies and open only the files they are allowed to access.

## Documented baseline

- Hostname: `NOVA-CLIENT.nova.corp`
- OS: Windows 11 Pro
- CLIENT network: VLAN 40, `10.10.40.100/24`
- Gateway: `10.10.40.1`
- DNS servers: `10.10.20.10` and `10.10.20.11`
- Domain: `nova.corp`

Earlier documentation called the machine `nova-client01`; the November 2026 live inventory confirmed the actual Windows hostname `NOVA-CLIENT`.

## Follow what happens during sign-in

1. [DNS](../services/DNS.md) finds the domain services.
2. [Kerberos](../services/KERBEROS.md) handles authentication tickets.
3. [Active Directory](../services/ACTIVE_DIRECTORY.md) stores the account and groups.
4. [Group Policy](../POLICIES.md) applies relevant computer/user rules.
5. [SMB and DFS](../FILE_SERVICES.md) provide authorized file access.
6. [pfSense](NOVA-FW01.md) controls routed paths between networks.

## Employee-perspective tests

- DC01 outage and DC02 continuity;
- wallpaper and contractor USB policy processing;
- policy failures and recovery;
- normal-user IT share access and Finance denial;
- client DNS misconfiguration diagnosis;
- blocked management access after firewall hardening;
- positive DNS/AD/SMB/Internet regression after security changes.

[Browse the tests](../TESTS_AND_RECOVERY.md)

[← All systems](../SYSTEMS.md)