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

## Backup storage

**Proxmox:** `nova-backup` was created on a separate Proxmox-visible disk and used for VM backup archives. It is not an off-site or independent physical-host failure domain.

**Windows Server:** FILES01 uses a dedicated backup disk (drive `B:`), Windows Server Backup and a scheduled health-check policy.

**AD:** DC01 System State protection was configured to capture directory-aware recovery material.

## Schedule documented during the backup change

| Workload | Historical daily backup schedule |
| --- | --- |
| FILES01 | 22:00 |
| DC01 System State | 23:00 |

The original backup project included freshness and capacity monitoring checks. Continuous centralized observability is separate future work.

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

## What can still fail

The backup disks are separate inside the nested lab, but the wider environment shares the outer physical host. Snapshots are fast rollback tools; they are not replacements for independent backups.

[Read the complete backup engineering journal](../../Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) · [Read the recovery incident](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) · [Final snapshot retention review](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).