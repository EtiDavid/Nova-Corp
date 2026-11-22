# Backups & Recovery — Proving that data can return

## The problem

A successful backup job does not mean a file can actually be recovered. Nova Corp designed several recovery layers and then tested failure and restoration.

## Recovery layers

| Situation | Recovery option | Connected asset |
| --- | --- | --- |
| File overwritten / older version needed | [Shadow Copies](VSS.md) | [NOVA-FILES01](../systems/NOVA-FILES01.md) |
| File deleted / alternate-path restore needed | Windows Server Backup | NOVA-FILES01, `B:` backup target |
| AD object accidentally deleted | AD Recycle Bin | [DC01](../systems/NOVA-DC01.md) / [DC02](../systems/NOVA-DC02.md) |
| Domain Controller recovery planning | System State backup | NOVA-DC01 |
| pfSense config change fails | Config export / whole-VM backup / known-good snapshot | [nova-fw01](../systems/NOVA-FW01.md) |
| Hypervisor VM recovery | Proxmox VM backups | [nova-prox01](../systems/NOVA-PROX01.md) |

**[Inspect the actual Proxmox backup job and six archive records](../virtualization/BACKUPS.md)** · [Snapshot inventory](../virtualization/snapshots/100.md) · [Real restore investigation](../incidents/backup-target-disappears.md).

## Backup storage

**Proxmox:** `nova-backup` was created on a separate Proxmox-visible disk and used for six VM backup archives (four pfSense, two DC01). Proxmox also holds two **live qcow2 VM disks** attached from this same store, not archives. The current PVE backup job is **monthly**, targets only VM100/101 and has a legacy cron warning requiring a GUI schedule check. This is not an off-site or independent physical-host failure domain.

**Windows Server:** FILES01 uses a dedicated backup disk (drive `B:`), Windows Server Backup and a scheduled health-check policy.

**AD:** DC01 System State protection was configured to capture directory-aware recovery material. A complete System State restore is **not** documented as tested. The backup schedule shown below is historical, not a live schedule dashboard.

## When the company backs up its systems

The latest documented check on **22 November 2026** confirmed these Windows backup settings. These are recorded configurations and available restore points, not a live dashboard.

| Protected system | What is backed up | Daily schedule | Available recovery points at last check |
| --- | --- | --- | ---: |
| [Company file server](../systems/NOVA-FILES01.md) | Company documents on **D:**, backed up to **B:** | **22:00** | **20** |
| [Directory server](../systems/NOVA-DC01.md) | **Active Directory System State**, backed up to its own **B:** drive | **23:00** | **3** |

Both systems recorded a successful backup completion on 22 November. FILES01's backup destination was healthy with approximately 98% free space; DC01's dedicated destination was healthy with approximately 46% free.

**Recovery points are not the same as completed restore tests.** The company's file-recovery and earlier-version tests are described below; a complete Domain Controller System State restoration has **not** been demonstrated. Backups are inside the nested home lab, not independently stored off-site.

<details><summary>Technical note — backup monitoring</summary>

The file server's Windows Backup job succeeded at the last recorded check. Its **separate backup-health monitoring task** had returned a nonzero result at its last execution, so that monitoring outcome still requires investigation. A successful backup job alone does not prove every surrounding monitoring check has passed.

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

**Earlier-file versions were tested separately:** a file was changed after a Shadow Copy was taken, and the stored earlier version matched the original SHA-256. [Explore Shadow Copies](VSS.md) · [See the earlier-version recovery test](../files/SHADOW_COPY_RECOVERY.md).

## What can still fail

The backup disks are separate inside the nested lab, but the wider environment shares the outer physical host. Snapshots are fast rollback tools; they are not replacements for independent backups.

[See the exact file recovery commands and matching SHA-256](../incidents/backup-target-disappears.md) · [Read the complete backup engineering journal](../../Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) · [Read the recovery incident](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) · [Final snapshot retention review](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).