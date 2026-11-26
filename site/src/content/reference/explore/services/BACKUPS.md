---
title: "Backups & Recovery — Proving that data can return"
sourcePath: "docs/explore/services/BACKUPS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/services/BACKUPS.md"
section: "explore"
---

# Backups & Recovery — Proving that data can return

## The problem

A successful backup job does not mean a file can actually be recovered. Nova Corp designed several recovery layers and then tested failure and restoration.

## Recovery layers

| Situation | Recovery option | Connected asset |
| --- | --- | --- |
| File overwritten / older version needed | [Shadow Copies](/reference/explore/services/VSS/) | [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/) |
| File deleted / alternate-path restore needed | Windows Server Backup | NOVA-FILES01, `B:` backup target |
| AD object accidentally deleted | AD Recycle Bin | [DC01](/reference/explore/systems/NOVA-DC01/) / [DC02](/reference/explore/systems/NOVA-DC02/) |
| Domain Controller recovery planning | System State backup | NOVA-DC01 |
| pfSense config change fails | Config export / whole-VM backup / known-good snapshot | [nova-fw01](/reference/explore/systems/NOVA-FW01/) |
| Hypervisor VM recovery | Proxmox VM backups | [nova-prox01](/reference/explore/systems/NOVA-PROX01/) |

**[Inspect the actual Proxmox backup job and six archive records](/reference/explore/virtualization/BACKUPS/)** · [Snapshot inventory](/reference/explore/virtualization/snapshots/100/) · [Real restore investigation](/reference/explore/incidents/backup-target-disappears/).

## Backup storage

**Proxmox:** `nova-backup` holds six documented whole-VM archive files (four for pfSense and two for DC01). The same store also contains two **live virtual-machine disks**, which are not backup archives. The last verified Proxmox configuration (22 November 2026) contained one enabled **monthly backup job for those two systems**. A separate older scheduler file contained **no active backup-job entry**. The backup destination is not physically independent from the home-lab host.

**Windows Server:** FILES01 uses a dedicated backup disk (drive `B:`), Windows Server Backup and a scheduled health-check policy.

**AD:** DC01 has a verified scheduled System State backup and three recorded System State-capable recovery points. A complete Domain Controller System State restoration is **not** documented as tested. The schedule below is the last checked configuration, not a live dashboard.

## When the company backs up its systems

The latest documented check on **22 November 2026** confirmed these Windows backup settings. These are recorded configurations and available restore points, not a live dashboard.

| Protected system | What is backed up | Daily schedule | Available recovery points at last check |
| --- | --- | --- | ---: |
| [Company file server](/reference/explore/systems/NOVA-FILES01/) | Company documents on **D:**, backed up to **B:** | **22:00** | **20** |
| [Directory server](/reference/explore/systems/NOVA-DC01/) | **Active Directory System State**, backed up to its own **B:** drive | **23:00** | **3** |

Both systems recorded a successful backup completion on 22 November. FILES01's backup destination was healthy with approximately 98% free space; DC01's dedicated destination was healthy with approximately 46% free.

**Recovery points are not the same as completed restore tests.** The company's file-recovery and earlier-version tests are described below; a complete Domain Controller System State restoration has **not** been demonstrated. Backups are inside the nested home lab, not independently stored off-site.

<details><summary>Technical note — backup monitoring</summary>

The file server's latest recorded backup succeeded. Its separate health-check script was then run manually and **passed**: backup disk healthy, about 98% free, and 20 recovery points available. An earlier run of the scheduled monitoring task had returned an unexpected nonzero result, whose cause was not established. One successful manual check does not prove every scheduled health check has worked.

</details>

The lab includes backup freshness and capacity checks. Continuous centralized observability is separate future work.

## The strongest restore proof

During incident testing:

1. The backup target was taken offline.
2. The backup failed because its storage location could not be found.
3. The disk was brought back online.
4. A fresh backup was completed.
5. A disposable file was deleted.
6. The file was restored to an alternate location.
7. **Original and recovered SHA-256 matched exactly.**

This is stronger than a screenshot of a green backup-job status.

**Earlier-file versions were tested separately:** a file was changed after a Shadow Copy was taken, and the stored earlier version matched the original SHA-256. [Explore Shadow Copies](/reference/explore/services/VSS/) · [See the earlier-version recovery test](/reference/explore/files/SHADOW_COPY_RECOVERY/).

## What can still fail

The backup disks are separate inside the nested lab, but the wider environment shares the outer physical host. Snapshots are fast rollback tools; they are not replacements for independent backups.

[See the exact file recovery commands and matching SHA-256](/reference/explore/incidents/backup-target-disappears/) · [Read the complete backup engineering journal](/reference/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal/) · [Read the recovery incident](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) · [Final snapshot retention review](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/).