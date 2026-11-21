# CR-015 — Phase 2 Validation and Closure

**Closure date:** 21 November 2026  
**Final result:** **CONDITIONAL PASS / PHASE 2 CLOSED**  
**Next mandatory security gate:** CR-016 — Privileged Admin VPN and Management Plane Firewall Isolation

CR-015 treated the existing lab as something that needed to be accepted and handed forward, not simply configured.

The closure review asked:

- Are the core Windows services healthy?
- Does the documentation describe the systems that actually exist?
- Are recovery paths available?
- Are important configuration baselines frozen?
- Are open risks visible and owned?
- Did final validation discover anything that still needed correction?

## What the closure review proved

### Active Directory / DNS

The final review confirmed:

- two writable Domain Controllers;
- healthy replication;
- SYSVOL and NETLOGON;
- AD DNS service discovery;
- domain time hierarchy;
- client DC discovery.

### Current-state architecture

CR-015 corrected documentation drift instead of forcing the environment to match old diagrams.

Examples:

- current client: `NOVA-CLIENT`;
- current Proxmox management: `192.168.178.26` on the upstream host network;
- pfSense VM asset label: `nova-fw01`;
- pfSense operating-system identity: `pfSense.home.arpa`.

### A real management-plane weakness was found

A normal CLIENT could initially reach pfSense management paths more broadly than intended.

The path was reproduced and then remediated.

Post-change validation included both:

- negative management-access tests;
- positive regression tests for required DNS, AD, SMB and Internet traffic.

The pfSense WebGUI was also moved from HTTP to HTTPS.

The full privileged-admin management-plane design is intentionally left for CR-016.

### Rollback baseline

Before CR-016, Nova Corp now has multiple recovery layers:

- a named pre-CR-016 pfSense Proxmox snapshot;
- a standalone pfSense VM backup on `nova-backup`;
- a private pfSense configuration export with recorded SHA-256;
- a backup of all 7 current GPOs with a hashed manifest;
- the validated CR-011 PowerShell release.

The published baseline includes the snapshot, VM backup, configuration-export and GPO-backup verification results.

### Snapshot-retention risk was fixed

During rollback preparation, the Proxmox thin pool was at **86.73%** data usage.

Twenty superseded historical snapshots were retired through Proxmox while the current pre-CR-016 rollback point was retained.

After cleanup:

- local-lvm Data%: **52.88%**
- approximately **125.72 GiB** reclaimed

This became an operational lesson: snapshots are rollback tools, not permanent archival storage.

## Closure conditions

The result is conditional rather than unconditional because the project deliberately preserves open limitations:

- external WireGuard user validation and privileged-admin isolation remain CR-016 work;
- centralized monitoring is a later observability phase;
- the nested lab still shares the outer physical-host failure domain;
- a fresh second-operator runbook test was waived after the extensive CR-014 blind incident campaign.

None of those is presented as completed work.

## Connected parts of Nova Corp

[pfSense firewall](../../explore/systems/NOVA-FW01.md) · [Proxmox](../../explore/systems/NOVA-PROX01.md) · [Domain Controllers](../../explore/IDENTITY.md) · [Group Policy](../../explore/POLICIES.md) · [Recovery](../../explore/services/BACKUPS.md) · [Incident Lab](../../explore/TESTS_AND_RECOVERY.md)

## Phase 2 result

**Phase 2 is closed.**

The Windows/network foundation has been built, tested, deliberately broken, recovered, reconciled and documented.

The next infrastructure change is the mandatory security gate:

**CR-016 — Privileged Admin VPN and Management Plane Firewall Isolation**
