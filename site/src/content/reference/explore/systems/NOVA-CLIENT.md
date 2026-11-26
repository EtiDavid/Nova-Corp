---
title: "NOVA-CLIENT — Domain Workstation"
sourcePath: "docs/explore/systems/NOVA-CLIENT.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/systems/NOVA-CLIENT.md"
section: "explore"
---

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

1. [DNS](/reference/explore/services/DNS/) finds the domain services.
2. [Kerberos](/reference/explore/services/KERBEROS/) handles authentication tickets.
3. [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) stores the account and groups.
4. [Group Policy](/reference/explore/POLICIES/) applies relevant computer/user rules.
5. [SMB and DFS](/reference/explore/FILE_SERVICES/) provide authorized file access.
6. [pfSense](/reference/explore/systems/NOVA-FW01/) controls routed paths between networks.

## Workstation Group Policy

NOVA-CLIENT is registered in **Nova-Computers → Workstations**, linked to [NOVA-SEC-Workstation-Baseline](/reference/explore/policies/WORKSTATION_BASELINE/). That policy sets Windows Firewall profiles, turns off AutoPlay and disables the SMBv1 server component by registry value.

User policies such as the [company wallpaper](/reference/explore/policies/WALLPAPER/) and [drive mapping](/reference/explore/policies/DRIVE_MAPPING/) are linked through the **Nova Users** OU and depend on which user is signed in.

## Employee-perspective tests

- DC01 outage and DC02 continuity;
- wallpaper and contractor USB policy processing;
- policy failures and recovery;
- normal-user IT share access and Finance denial;
- client DNS misconfiguration diagnosis;
- blocked management access after firewall hardening;
- positive DNS/AD/SMB/Internet regression after security changes.

[Browse the tests](/reference/explore/TESTS_AND_RECOVERY/)

[← All systems](/reference/explore/SYSTEMS/)