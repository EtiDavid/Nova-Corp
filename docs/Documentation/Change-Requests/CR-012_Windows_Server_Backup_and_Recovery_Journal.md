---
title: "CR-012 - Windows Server Backup and Recovery"
subtitle: "Nova Corp Enterprise Infrastructure Lab - Engineering Journal"
author: "Technical owner: David Eti"
date: "28 October - 5 November 2026"
geometry: margin=22mm
fontsize: 10pt
header-includes:
  - |
    \usepackage{float}
    \floatplacement{figure}{H}
---

# CR-012 - Windows Server Backup and Recovery

**Nova Corp Enterprise Infrastructure Lab**  
**Change request:** CR-012  
**Roadmap business ticket:** BKP-012 - Finance: recover a quarterly report after accidental deletion  
**Domain:** `nova.corp`  
**Hypervisor:** `nova-prox01` / Proxmox VE 9.2.2 running as a nested lab platform  
**Protected Windows workloads:** `NOVA-FILES01`, `NOVA-DC01`  
**Supporting DC:** `NOVA-DC02`  
**Primary file data volume:** `D:\` / `NovaData` on `NOVA-FILES01`  
**Independent lab backup storage:** Proxmox storage `nova-backup` mounted at `/mnt/nova-backup`  
**Journal status at publication:** **IMPLEMENTATION COMPLETE - FORMAL CLOSURE PENDING ONE NATURAL DC01 SCHEDULED-RUN EVIDENCE ITEM**  

> **Purpose of this journal:** preserve the command-level truth of CR-012: what was built, why it was built this way, what failed, what David asked during the implementation, how the failures were diagnosed, how backup and recovery were proven, and what remains before the roadmap item can be marked formally complete.

---

# 1. Executive Summary

CR-012 introduced a layered backup and recovery design for Nova Corp's Windows infrastructure. Before this change, Nova Corp already had Proxmox snapshots/backups and Windows Shadow Copies, but those mechanisms did not by themselves satisfy the roadmap requirement for tested file recovery and Active Directory-aware System State protection.

The implementation created a dedicated 300 GiB Proxmox backup repository on `/dev/sda`, mounted it persistently as `/mnt/nova-backup`, migrated legacy Proxmox backups from the root filesystem into that repository with SHA-256 verification, registered the storage as `nova-backup`, and removed the obsolete `backup-store` registration after verification.

From that repository, separate virtual backup disks were presented to the protected Windows servers:

- `NOVA-FILES01`: 100 GiB backup disk, formatted NTFS as `B:` / `NovaBackup`.
- `NOVA-DC01`: 60 GiB backup disk, formatted NTFS as `B:` / `NovaDCBackup`.

Windows Server Backup was then installed and configured:

- `NOVA-FILES01`: scheduled daily backup of `D:\NovaData` at 22:00.
- `NOVA-DC01`: scheduled daily System State backup at 23:00.

Monitoring was added for backup-target presence, filesystem health, free-space threshold, backup freshness, and recovery-version depth. Controlled failure testing proved that an unavailable backup target is detected and logged. Retention governance was added for the DC System State backups with a keep-7 policy and a safety gate that refuses pruning when no recent successful backup exists.

Recovery was tested at two levels:

1. A Finance file was deleted and restored using Windows Server Backup.
2. A second pilot file was deliberately created after the latest useful Shadow Copy, captured by Windows Server Backup, deleted, and restored to an alternate recovery path. The restored file's SHA-256 hash matched the original exactly and its ACLs were inspected.

A real scheduled FILES01 backup was also proven by temporarily changing only the schedule, allowing Windows Task Scheduler to launch the backup naturally, observing Events 1/4/14, and restoring the production schedule to 22:00.

The only remaining roadmap acceptance item is a naturally completed scheduled System State backup on `NOVA-DC01`. The DC schedule, monitoring, retention, manual System State backups, VSS writers and recovery versions are all working; the evidence item is pending only because the first normal 23:00 scheduled run had not yet occurred when this journal was generated.

## 1.1 Final control summary

| Control | Result |
|---|---|
| Separate lab backup repository created | PASS |
| Persistent Linux mount by UUID | PASS |
| Legacy Proxmox backups migrated with hash verification | PASS |
| Old Proxmox storage registration removed safely | PASS |
| FILES01 backup disk isolated from OS/data disks | PASS |
| DC01 backup disk isolated from OS disk | PASS |
| Windows Server Backup installed | PASS |
| FILES01 daily backup schedule | PASS |
| DC01 daily System State schedule | PASS |
| VSS writers validated | PASS |
| FILES01 deleted-file recovery | PASS |
| Alternate-path recovery | PASS |
| SHA-256 restore verification | PASS |
| Backup target failure alert | PASS |
| Capacity/freshness monitoring | PASS |
| FILES01 scheduled-run acceptance | PASS |
| DC01 retention automation | PASS |
| DC01 natural 23:00 scheduled-run acceptance | **PENDING EVIDENCE** |

---

# 2. Business and Technical Objective

The roadmap mission for CR-012 is to back up and restore Active Directory and file services from an independently protected target, and to measure or at least operationally define RPO and RTO.

The business context is the Finance recovery request: a user such as Moyo may accidentally delete or damage an important report. Nova Corp therefore needs more than a snapshot button. It needs a recovery design that answers:

- Where is the independent recovery copy?
- Which workload is protected?
- How often is it protected?
- How do we know the backup actually ran?
- How much data could be lost?
- How long could recovery take?
- What if the fast recovery tier, such as Previous Versions, does not contain the needed file?
- How do we recover Active Directory without performing an unsafe production restore?

The engineering objective was therefore not "install Windows Server Backup." It was to create a layered recovery system and prove the important failure paths.

---

# 3. Starting Environment

## 3.1 Proxmox host and storage baseline

The Proxmox host had two important virtual disks visible to Linux:

- `nvme0n1` - 500 GiB, holding the Proxmox system/LVM layout.
- `sda` - 300 GiB, an unused VMware virtual SATA disk selected for the dedicated backup repository.

The root filesystem was already around two-thirds used and contained legacy Proxmox backup files under `/backups`. This created two risks:

1. backups were consuming root-filesystem capacity;
2. the backup directory was not an independently mounted repository.

![Proxmox disk discovery and confirmation that `/dev/sda` was the separate 300 GiB disk selected for CR-012.](assets/01-proxmox-disk-discovery.png){ width=92% }

**What this proves:** the backup disk was identified before partitioning. The command also showed that `sda` was not the Proxmox system NVMe device.

## 3.2 Existing workloads

Relevant VMs included:

| VMID | Name | Purpose |
|---:|---|---|
| 100 | `nova-fw01` | pfSense/firewall |
| 101 | `nova-dc01` | primary domain controller |
| 102 | `nova-dc02` | secondary domain controller |
| 103 | `nova-client01` | domain client / user validation |
| 104 | `nova-files01` | file server |

`NOVA-FILES01` already had:

- `C:` - operating system
- `D:` - approximately 60 GiB `NovaData`
- Shadow Copies / Previous Versions configured from CR-010
- departmental ACLs using Nova Corp groups

`NOVA-DC01` already hosted Active Directory Domain Services and had a healthy second DC (`NOVA-DC02`) available in the environment.

## 3.3 Existing recovery mechanisms

Before CR-012, Nova Corp had multiple mechanisms that could be confused with "backup":

```text
Shadow Copies / Previous Versions
    -> fast file rollback on the same protected volume

Proxmox VM snapshots / backups
    -> hypervisor-level protection of entire virtual machines

Windows Server Backup
    -> not yet fully configured for FILES01 and DC01
```

The CR deliberately separated these concepts instead of treating them as interchangeable.

---

# 4. Design Decisions

## 4.1 Dedicated Proxmox backup repository

The 300 GiB `/dev/sda` disk was used as a dedicated filesystem mounted at:

```text
/mnt/nova-backup
```

The filesystem label was:

```text
NOVA_BACKUP
```

The Proxmox storage ID was:

```text
nova-backup
```

### Why

The design keeps backup data away from the Proxmox root filesystem and gives the lab a distinct storage path that can be mounted, monitored, and reasoned about independently.

### Lab limitation

This is **independent at the virtual-disk/storage-layout level inside the lab**, not a true off-site or separate-physical-host backup. A real production design would normally add another failure domain: separate storage hardware, another host, a backup appliance, cloud/object storage, tape, or an off-site copy. CR-012 must not be documented as if it achieved a full 3-2-1 backup architecture.

## 4.2 Separate guest backup disks

The Windows backup targets were created as separate virtual disks backed by `nova-backup`:

```text
nova-backup -> FILES01 B: (100 GiB)
nova-backup -> DC01    B: (60 GiB)
```

The disks were attached with `backup=0` in Proxmox so that a guest backup disk would not itself be recursively included as part of the VM backup payload.

## 4.3 Two recovery tiers for files

The file-server recovery order is:

```text
Previous Versions
      ↓ if no suitable version exists
Windows Server Backup
      ↓ if whole VM is unavailable
Proxmox VM recovery
```

This gives fast operational recovery first, then an independent Windows backup copy, then hypervisor-level disaster recovery.

## 4.4 AD-aware System State for the domain controller

For `NOVA-DC01`, Windows Server Backup protects System State so that Active Directory, SYSVOL, Registry and related components are captured through Windows/VSS-aware mechanisms.

A Proxmox VM backup remains useful for whole-VM recovery, but it is not treated as a substitute for understanding AD-aware recovery.

## 4.5 Monitoring thresholds

The monitoring policy implemented during CR-012 uses:

| Setting | FILES01 | DC01 |
|---|---:|---:|
| Daily scheduled backup | 22:00 | 23:00 |
| Pre-check | 21:45 | 22:45 |
| Post-check | 00:05 | 01:05 |
| Retention task | n/a | 01:15 |
| Freshness alert | >26 hours | >26 hours |
| Free-space threshold | <20% free | <20% free |
| Recovery-version target | >=7 desired | keep latest 7 |

The 26-hour freshness threshold is an alert tolerance, **not** the target RPO. The nominal schedule is daily, so the design target is approximately 24 hours between successful backups.

---

# 5. Prerequisites and Safety Checks

Before destructive storage work, the lab validated disk identity and existing state.

Important safety questions were:

```text
Is /dev/sda really the new 300 GiB disk?
Does it contain a filesystem or partition table?
Is it mounted anywhere?
Is any VM actively using it?
Can the existing backup files be preserved before old storage is removed?
```

The original `storage.cfg`, `/etc/fstab`, backup job configuration and other important configuration files were copied before changes where appropriate.

### Safety principle used

> A disk command is only safe after the target has been identified independently by size, model, current partitions, mount state and role.

---

# 6. Implementation

## 6.1 Checkpoint 1 - Identify and prepare the 300 GiB backup disk

The disk was inspected with commands including:

```bash
lsblk -o NAME,SIZE,MODEL,SERIAL,TYPE,FSTYPE,MOUNTPOINTS
fdisk -l /dev/sda
wipefs /dev/sda
```

The evidence showed `/dev/sda` as a 300 GiB VMware virtual disk with no active filesystem signatures.

### Learner question - What is a partition table?

A partition table is the disk's map. It tells the operating system where partitions begin and end and what type of layout the disk uses. It is not the filesystem itself.

A simple mental model is:

```text
physical/virtual disk
    ↓
partition table (map)
    ↓
partition(s)
    ↓
filesystem(s)
    ↓
files/directories
```

### `parted` failure preserved

The first planned command was:

```bash
parted -s /dev/sda mklabel gpt
```

but the host returned:

```text
-bash: parted: command not found
```

This failure was not hidden. The lab switched to `fdisk`, which was already available.

### GPT partition creation with `fdisk`

The actual sequence used was:

```text
fdisk /dev/sda
g        # create GPT disklabel
n        # create partition 1
<Enter>  # default first sector
<Enter>  # default last sector, use whole disk
w        # write changes
```

![`/dev/sda1` created as a single 300 GiB partition.](assets/02-sda-partition-created.png){ width=88% }

### Expected

One partition should occupy the disk, with no filesystem yet.

### Actual

`lsblk` showed `sda1` at 300 GiB and the `FSTYPE` field was still empty.

### Conclusion

**PASS** - the disk had a GPT partition layout and was ready for formatting.

### Why GPT and not MBR?

GPT was selected because it is the modern partitioning scheme, supports very large disks and many partitions, stores redundant partition metadata and works cleanly with modern systems. This disk is only 300 GiB, so MBR could technically work, but GPT is the better modern default.

---

## 6.2 Checkpoint 2 - Format the repository as ext4

The partition was formatted:

```bash
mkfs.ext4 -L NOVA_BACKUP /dev/sda1
```

Verification:

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS /dev/sda
lsblk -f /dev/sda
blkid /dev/sda1
```

![ext4 filesystem creation, label `NOVA_BACKUP` and filesystem UUID.](assets/03-ext4-format-uuid.png){ width=90% }

Observed filesystem UUID:

```text
00d4f4e4-4c27-4b01-9282-add0175f1196
```

### Why ext4?

The repository is mounted by the Linux-based Proxmox host. ext4 is a mature, journaled Linux filesystem and is appropriate for a simple directory-backed Proxmox storage target.

---

## 6.3 Checkpoint 3 - Mount and validate the repository

The mount point was created:

```bash
mkdir -p /mnt/nova-backup
```

The filesystem was mounted:

```bash
mount /dev/sda1 /mnt/nova-backup
```

Verification:

```bash
findmnt /mnt/nova-backup
df -hT /mnt/nova-backup
```

A write/read test was performed:

```bash
echo "Nova Corp CR-012 backup repository test" > /mnt/nova-backup/cr012-write-test.txt
cat /mnt/nova-backup/cr012-write-test.txt
ls -lh /mnt/nova-backup
```

### Learner question - What does mounting mean?

Formatting creates a filesystem on the partition. Mounting connects that filesystem into Linux's directory tree.

```text
/dev/sda1
   ↓ mount
/mnt/nova-backup
   ↓
files become accessible here
```

Without mounting, the filesystem exists but is not attached at a normal directory path for applications to use.

### Controlled unmount/remount test

The repository was unmounted, then remounted by UUID. The original test file remained, proving the data was on the filesystem rather than in the empty mount-point directory.

---

## 6.4 Checkpoint 4 - Make the mount persistent with `/etc/fstab`

The original file was protected first:

```bash
cp /etc/fstab /etc/fstab.cr012-before
cat /etc/fstab
```

![`/etc/fstab` baseline captured before adding the backup repository.](assets/04-fstab-baseline.png){ width=88% }

The persistent entry added was:

```text
UUID=00d4f4e4-4c27-4b01-9282-add0175f1196 /mnt/nova-backup ext4 defaults 0 2
```

After unmounting, `mount -a` was used to test the configuration. systemd warned that it still had the old version cached, so:

```bash
systemctl daemon-reload
```

was run and the mount was verified again with `findmnt`.

![Persistent UUID-based mount validated; the legacy `/backups` dataset is also visible for migration.](assets/05-fstab-persistent-old-backups.png){ width=92% }

### Learner question - Why UUID instead of `/dev/sda1` for persistence?

A device name such as `/dev/sda1` can change when hardware enumeration changes. A filesystem UUID identifies the specific filesystem and is therefore safer for long-term `fstab` configuration.

### `/etc/fstab` field breakdown

```text
UUID=...   /mnt/nova-backup   ext4   defaults   0   2
```

| Field | Meaning |
|---|---|
| `UUID=...` | filesystem to mount |
| `/mnt/nova-backup` | mount point |
| `ext4` | filesystem type |
| `defaults` | normal mount options |
| `0` | do not use legacy `dump` backup flag |
| `2` | filesystem check order after root |

---

## 6.5 Checkpoint 5 - Preserve and migrate legacy Proxmox backups

The old `/backups` directory contained approximately 31 GiB of historical `vzdump` backup data for VMs 100 and 101.

Before copying, SHA-256 checksums were generated:

```bash
cd /backups
find . -type f -print0 | sort -z | xargs -0 sha256sum > /root/cr012-old-backups.sha256
cat /root/cr012-old-backups.sha256
wc -l /root/cr012-old-backups.sha256
```

![Twelve legacy backup files hashed before migration.](assets/06-old-backup-sha256-baseline.png){ width=92% }

The data was copied with `rsync`:

```bash
rsync -aH --info=progress2 /backups/ /mnt/nova-backup/
```

Validation included file count, size and checksum verification:

```bash
find /mnt/nova-backup/dump -type f | wc -l
cd /mnt/nova-backup
sha256sum -c /root/cr012-old-backups.sha256
```

All listed files returned `OK`.

### Learner question - `rsync` vs `cp`, `scp`, and `mv`

- `cp` copies locally and is fine for simple copies.
- `mv` relocates/renames; on the same filesystem it may simply change directory metadata, and on different filesystems it effectively copies then removes the source.
- `scp` copies across SSH and is useful between hosts.
- `rsync` is designed for robust synchronization and can preserve metadata, report progress, and efficiently resume/re-run by sending only differences.

`rsync` was chosen because the migration involved a sizeable backup dataset where progress visibility and safe re-runs were useful.

### Learner question - What does `sha256sum -c` do?

The checksum file contained the original file paths and SHA-256 values. `sha256sum -c` recalculated each destination file and compared the new hash to the saved baseline.

David correctly reasoned that another valid method would be to generate a second checksum file from the destination and compare the two lists. The `-c` method simply performs the compare directly against the saved baseline.

---

## 6.6 Checkpoint 6 - Register `nova-backup` in Proxmox

The existing Proxmox storage configuration was backed up:

```bash
cp /etc/pve/storage.cfg /root/storage.cfg.cr012-before
```

The new storage was registered:

```bash
pvesm add dir nova-backup \
  --path /mnt/nova-backup \
  --content backup
```

Validation:

```bash
cat /etc/pve/storage.cfg
pvesm status
pvesm list nova-backup
```

The migrated `vzdump` files appeared through the new storage ID.

### Learner question - What is `pvesh`?

`pvesh` is Proxmox's shell interface to the Proxmox VE API. It lets an administrator query and modify API-backed configuration from the command line.

Example used during CR-012:

```bash
pvesh get /cluster/backup --output-format json-pretty
```

This was used to inspect the existing scheduled backup job and determine that it still referenced the old storage ID.

![`pvesh` and configuration search used to find the existing Proxmox backup job dependency on `backup-store`.](assets/07-pvesh-backup-job-audit.png){ width=92% }

The job storage target was updated to `nova-backup`, then verified in `/etc/pve/jobs.cfg` and through `pvesh`.

---

## 6.7 Checkpoint 7 - Remove the obsolete `backup-store` registration

Only after:

- the data was copied,
- checksums passed,
- `nova-backup` listed the migrated backups,
- the Proxmox job was repointed,

was the old storage registration removed:

```bash
pvesm remove backup-store
```

Verification:

```bash
pvesm status
cat /etc/pve/storage.cfg
pvesm list nova-backup
```

![Old `backup-store` registration removed while migrated backups remain visible through `nova-backup`.](assets/08-old-storage-removed.png){ width=92% }

**Conclusion:** PASS - no backup files were deleted by removing the storage configuration entry.

---

## 6.8 Checkpoint 8 - Present a dedicated Windows backup disk to FILES01

To let Windows Server Backup use the independent repository, `nova-backup` was temporarily permitted to hold VM images as well as Proxmox backups:

```bash
pvesm set nova-backup --content backup,images
```

A 100 GiB disk was added to VM 104 (`nova-files01`) on `nova-backup` with `backup=0`.

![FILES01 hardware view showing `scsi2` on `nova-backup` and `backup=0`.](assets/09-files01-proxmox-backup-disk.png){ width=95% }

### Why `backup=0`?

The new virtual disk is itself the Windows backup destination. Including it in the VM's own Proxmox backup would create unnecessary recursive backup growth and blur recovery boundaries.

### Why guest-level Windows backup if Proxmox already backs up VMs?

The two layers solve different problems:

```text
Proxmox VM backup
    -> whole-machine recovery

Windows Server Backup on FILES01
    -> file/volume-aware recovery with Windows catalogue and recovery workflow

Windows Server Backup System State on DC01
    -> AD-aware system recovery
```

---

## 6.9 Checkpoint 9 - Initialize and format the FILES01 backup disk

Inside `NOVA-FILES01`, the new disk initially appeared as:

```text
Disk 2
100 GiB
RAW
Offline
ReadOnly
```

The disk was brought online and made writable:

```powershell
Set-Disk -Number 2 -IsOffline $false
Set-Disk -Number 2 -IsReadOnly $false
```

It was initialized as GPT, partitioned and formatted NTFS as `B:` with label `NovaBackup`.

### Learner question - What does "initialize disk" mean?

Initializing writes the partition-table structure to a RAW disk. It prepares the disk to hold partitions; it does **not** itself create the final NTFS volume or user data.

The conceptual sequence is:

```text
RAW disk
  ↓ Initialize-Disk GPT
partition table exists
  ↓ New-Partition
partition exists
  ↓ Format-Volume NTFS
filesystem exists
  ↓ drive letter B:
usable Windows volume
```

![FILES01 `B:` validated as healthy NTFS and Windows Server Backup feature installed.](assets/10-files01-wsb-feature-volume.png){ width=90% }

---

## 6.10 Checkpoint 10 - Install Windows Server Backup on FILES01

The feature was installed:

```powershell
Install-WindowsFeature Windows-Server-Backup -IncludeManagementTools
```

Verification:

```powershell
Get-WindowsFeature Windows-Server-Backup
Get-Command wbadmin
wbadmin get versions
```

At first, `wbadmin get versions` correctly reported that no backup existed.

### VSS writers

`vssadmin list writers` was used before backup testing.

A **VSS writer** is an application/service component that cooperates with Volume Shadow Copy Service to place its data into a consistent state while a snapshot is created.

For example:

- `NTDS Writer` coordinates Active Directory database state.
- `Registry Writer` coordinates registry data.
- `System Writer` coordinates protected Windows system files.

A writer showing:

```text
State: [1] Stable
Last error: No error
```

is healthy and available for VSS-aware backup operations.

---

## 6.11 Checkpoint 11 - Create a controlled Finance recovery file

A disposable Finance report was created under:

```text
D:\NovaData\Finance\CR012-Quarterly-Report-Q3-2026.txt
```

Its content, ACLs, SDDL, timestamps and SHA-256 hash were recorded before destructive testing.

This created a known object with evidence that could be deleted and recovered safely.

### ACL notation learned

In `icacls` output:

- `(I)` means the ACE is inherited.
- `(F)` means Full Control.
- `(M)` means Modify.
- `(RX)` means Read and Execute.
- `(OI)` means object inherit (files).
- `(CI)` means container inherit (folders).

---

## 6.12 Checkpoint 12 - First FILES01 backup and restore

A Windows Server Backup copy of `D:` was created to `B:`.

The GUI showed a successful backup and the recovery catalogue became available.

![Windows Server Backup GUI showing scheduled FILES01 protection of `NovaData (D:)` to `NovaBackup (B:)`.](assets/11-files01-wsb-gui-schedule.png){ width=95% }

The test Finance file was deleted and recovered using Windows Server Backup.

![`wbadmin` file recovery completed successfully for the Finance test report.](assets/13-file-recovery-original-path.png){ width=90% }

The restored file's content, hash and ACLs were validated.

### Learner question - Is there a GUI to browse thousands of backup files?

Yes. Windows Server Backup's Recover wizard is designed to select a backup date, recovery type and file/folder tree without requiring the operator to remember every file name. `wbadmin` remains useful for repeatability, scripting and evidence.

---

## 6.13 Checkpoint 13 - Understand Shadow Copies versus Windows Server Backup

The Finance folder already had Previous Versions from CR-010.

![Explorer Previous Versions tab showing Shadow Copy-based file history.](assets/12-previous-versions-gui.png){ width=82% }

### Shadow Copies

Shadow Copies are fast point-in-time versions of a volume. They are excellent for operational recovery when a user overwrites or deletes a file and a suitable shadow copy exists.

They are **not equivalent to independent backup** because they normally live on storage associated with the protected server/volume.

### Windows Server Backup

Windows Server Backup creates a separate backup copy on the `B:` target and maintains a recovery catalogue.

### VSS relationship

Windows Server Backup itself can use VSS to create a consistent point-in-time source while writing the actual backup elsewhere. Therefore "VSS" and "backup" are related but not identical concepts.

---

## 6.14 Checkpoint 14 - Configure FILES01 daily scheduled backup

The FILES01 policy was configured for:

```text
Backup items: NovaData (D:)
Destination: NovaBackup (B:)
Schedule: 22:00 daily
Advanced option: VSS Copy Backup
```

`wbadmin enable backup` was used to display and verify the policy.

The Windows Backup scheduled task was also inspected through Task Scheduler and PowerShell.

---

## 6.15 Checkpoint 15 - Shadow Copy schedule verification and time correction

The existing Previous Versions task was inspected with:

```powershell
$ShadowTask = Get-ScheduledTask |
    Where-Object {$_.TaskName -like "ShadowCopyVolume*"}

$ShadowTask.Triggers | Format-List *
$ShadowTask | Get-ScheduledTaskInfo
```

The schedule was validated as two daily triggers, 07:00 and 12:00. During the work, Windows time was found to be one hour behind. The time zone and domain time hierarchy were investigated with:

```powershell
Get-Date
Get-TimeZone
w32tm /query /status
w32tm /query /source
w32tm /stripchart /computer:nova-dc02 /samples:5 /dataonly
```

The server was resynchronized and the time source corrected.

### Why time matters for backup

Recovery point timestamps, event logs, scheduled jobs and incident timelines are only reliable if the server clock is trustworthy.

---

## 6.16 Checkpoint 16 - Configure DC01 System State backup

A separate 60 GiB disk on `nova-backup` was attached to VM 101 with a serial identifying it as the DC backup disk.

Inside Windows it was brought online, initialized as GPT, formatted NTFS and assigned `B:` / `NovaDCBackup`.

Windows Server Backup was installed and System State backup was tested.

The backup catalogue showed `System State` as a recoverable component.

### Why System State matters on a domain controller

System State includes components required for AD-aware recovery, including Active Directory data, SYSVOL and Registry-related state. It is a logical Windows recovery mechanism, not simply a copy of the VM disk.

### VSS writer validation

`vssadmin list writers` confirmed the important writers were stable.

![NTDS Writer stable with no error after System State backup.](assets/20-ntds-writer-stable.png){ width=78% }

A later System State backup took approximately 55 minutes 10 seconds in the nested lab.

![Measured DC01 System State backup duration: approximately 55 minutes.](assets/19-dc-system-state-duration.png){ width=55% }

This is a measured **backup duration**, not a measured DC restore RTO.

---

## 6.17 Checkpoint 17 - Configure DC01 schedule and missed-run behavior

The DC System State schedule was set to 23:00 daily.

The Microsoft Windows Backup task was inspected:

```powershell
$WBTask = Get-ScheduledTask `
    -TaskPath "\Microsoft\Windows\Backup\" `
    -TaskName "Microsoft-Windows-WindowsBackup"

$WBTask.Settings |
    Select-Object StartWhenAvailable,WakeToRun,RestartCount,RestartInterval
```

Observed:

```text
StartWhenAvailable : True
WakeToRun          : False
RestartCount       : 0
```

### Learner question - What happens if the server is off at backup time?

If the VM is powered off, Windows and Task Scheduler are not running, so the guest-level backup cannot execute at 23:00. `StartWhenAvailable=True` allows the Windows task to catch up when the task becomes available again, but `WakeToRun=False` means the task itself does not power on the VM.

This was observed operationally: DC01 had been off, so the health monitor later found the latest backup to be 48.82 hours old.

---

## 6.18 Checkpoint 18 - FILES01 monitoring and alerting

A PowerShell monitor was created:

```text
C:\NovaAdmin\Scripts\Test-NovaBackupHealth.ps1
```

It checks:

1. Does `B:` exist?
2. Is the volume healthy?
3. Is free space above 20%?
4. Is the latest successful backup no older than 26 hours?
5. How many recovery versions are available?

Event model:

```text
4100 - Information - healthy
4101 - Error       - backup/target problem
4102 - Warning     - retention depth below target
```

A healthy test produced Event 4100.

![FILES01 backup health monitor PASS and Event 4100 evidence.](assets/15-files01-monitor-pass.png){ width=88% }

### Controlled failure injection - backup target unavailable

Disk 2 was deliberately taken offline:

```powershell
Set-Disk -Number 2 -IsOffline $true
```

The monitor correctly reported:

```text
Nova Corp backup health check FAILED.
Backup volume B: is unavailable.
```

Event Viewer recorded Event 4101 as an Error.

![Event Viewer showing NovaBackupMonitor Event 4101 after the backup target was deliberately made unavailable.](assets/16-event-viewer-monitor-failure.png){ width=96% }

The disk was brought back online:

```powershell
Set-Disk -Number 2 -IsOffline $false
```

and the monitor returned to Event 4100.

### Expected

An unavailable backup target must be detected before administrators assume nightly backups are safe.

### Actual

4101 was generated while `B:` was unavailable and 4100 returned after repair.

### Conclusion

**PASS** - the failure detector and recovery-state logging worked.

---

## 6.19 Checkpoint 19 - Schedule the FILES01 monitor

The monitor was registered to run as `SYSTEM`, independent of an interactive administrator session.

Triggers:

```text
21:45 - pre-backup health check
00:05 - post-backup freshness/health check
```

![Task Scheduler showing the two daily Nova Backup Health Monitor triggers.](assets/17-task-scheduler-monitor-triggers.png){ width=96% }

### Why pre- and post-checks?

The pre-check validates target presence, health and current backup freshness before the nightly job. The post-check occurs just beyond the 26-hour freshness threshold: if the 22:00 backup fails, the previous day's backup becomes stale and the monitor can generate an error.

---

## 6.20 Checkpoint 20 - Retention and least-privilege governance on FILES01

`icacls B:\` and `Get-Acl B:\` showed that the root volume inherited broad built-in Windows permissions, while the actual `B:\WindowsImageBackup` directory had a much tighter ACL involving Administrators, Backup Operators and Creator Owner.

### Learner question - What is `BUILTIN\Users`?

`BUILTIN` is not the `nova.corp` domain. It refers to Windows built-in local security groups. Examples:

```text
BUILTIN\Administrators
BUILTIN\Users
BUILTIN\Backup Operators
```

Domain identities appear with the domain prefix, for example:

```text
NOVA\DL_FS_Finance_Modify
```

### `B$` administrative share

`Get-SmbShare` showed `B$`, which is Windows' hidden administrative share for the fixed drive. It is not the same as intentionally publishing a normal user share.

A real user-session test from `NOVA-CLIENT01` using Moyo produced **Access denied**, proving that a normal domain user could not browse the backup repository through the administrative share.

### Retention target

FILES01 uses a desired minimum of 7 recovery versions. Because standard WSB file/volume backup does not expose the same simple keep-N command used for System State cleanup, the FILES01 monitor treats fewer than 7 versions as a warning while capacity and freshness remain the hard failure conditions.

---

## 6.21 Checkpoint 21 - DC01 monitoring

A separate monitor was created:

```text
C:\NovaAdmin\Scripts\Test-NovaDCBackupHealth.ps1
```

Event model:

```text
4200 - Information - healthy
4201 - Error       - backup/target/freshness failure
4202 - Warning     - System State recovery depth below target
```

When first run, it found:

```text
Last successful DC backup: 48.82 hours old
System State recovery versions: 1
Policy target: 7
```

![DC monitor correctly detecting a stale backup after the VM had been offline.](assets/18-dc-monitor-stale-error.png){ width=90% }

This was a genuine RPO/freshness violation, not a script bug.

A fresh System State backup was then completed and the monitor changed from Error to Warning because only the retention-depth target remained unmet.

A scheduled-task execution later completed with `LastTaskResult = 0` and Event 4202.

![DC monitor scheduled execution succeeded; only the two-of-seven retention-depth warning remained.](assets/22-dc-monitor-scheduled-warning.png){ width=92% }

---

## 6.22 Checkpoint 22 - DC01 keep-7 retention policy

A retention wrapper was created:

```text
C:\NovaAdmin\Scripts\Invoke-NovaDCBackupRetention.ps1
```

It uses the supported System State cleanup pattern:

```powershell
wbadmin delete systemstatebackup -keepVersions:7 ...
```

but adds a safety gate:

```text
Was there a recent successful backup?
        ↓ no
Do not prune anything
        ↓ yes
Are more than 7 System State versions present?
        ↓ no
No pruning required
        ↓ yes
Keep newest 7
```

At the time of testing only two versions existed, so Event 4210 recorded:

```text
No System State pruning required. Available versions: 2. Retention target: 7.
```

![DC retention job correctly refusing unnecessary deletion with only two recovery versions present.](assets/21-dc-retention-event.png){ width=88% }

The permanent schedule is:

```text
22:45 - pre-check
23:00 - System State backup
01:05 - post-check
01:15 - retention enforcement
```

---

## 6.23 Checkpoint 23 - Alternate-path recovery when Previous Versions is not sufficient

A second pilot file was created:

```text
D:\NovaData\Finance\CR012-Alternate-Recovery-Test.txt
```

Original SHA-256:

```text
73BCAD07BF23CA97C527A9C15B6404762D0FCFDBB21881EB53946E2667A90371
```

The file was intentionally created **after** the latest useful Finance Shadow Copy and then captured by a new Windows Server Backup recovery point at 16:44.

The file was deleted and `Test-Path` returned `False`.

Because no suitable Previous Version contained the file, Windows Server Backup was used to recover it to a staging path:

```text
D:\NovaData\Recovery\CR012\CR012-Alternate-Recovery-Test.txt
```

The production path was deliberately left untouched during validation.

Hash comparison:

```powershell
$OriginalHash -eq $RecoveredHash
```

returned:

```text
True
```

![Alternate-path recovery integrity verification: original and recovered SHA-256 values match exactly.](assets/23-alternate-restore-hash-match.png){ width=88% }

### Expected

A file unavailable in the relevant Previous Versions set should still be recoverable from the independent WSB recovery point, and the restored copy should match the original bytes.

### Actual

Recovery succeeded to the alternate path, ACLs were present, the production Finance path remained empty, and SHA-256 matched.

### Conclusion

**PASS** - the layered recovery model was proven.

---

## 6.24 Checkpoint 24 - Prove a naturally scheduled FILES01 backup

The built-in Microsoft Windows Backup task was first tested with `Start-ScheduledTask`. Windows rejected the request:

```text
The task settings do not allow the task to start on demand.
```

This was preserved as a useful finding rather than hidden.

### First schedule-change attempt failed

The first attempt tried to modify the schedule while re-adding `B:`:

```powershell
wbadmin enable backup `
    -addtarget:B: `
    -include:D: `
    -schedule:$TestTime `
    -vssCopy `
    -quiet
```

Windows rejected it because `B:` was already registered as a backup target.

### Corrected method

Only the schedule was changed:

```powershell
$TestTime = (Get-Date).AddMinutes(5).ToString("HH:mm")
wbadmin enable backup -schedule:$TestTime -quiet
```

The policy then showed 18:17 and Task Scheduler's next run time changed accordingly.

![Temporary FILES01 schedule changed to 18:17 without re-adding the existing backup target.](assets/24-files01-temp-schedule.png){ width=90% }

No manual `wbadmin start backup` command was run. At 18:17 Windows launched the backup naturally.

Event evidence:

```text
18:17:05 Event 1  - backup operation started
18:17:19 Event 4  - backup operation finished successfully
18:17:19 Event 14 - backup operation completed
```

![Events 1, 4 and 14 proving the FILES01 backup was launched by the configured schedule and completed successfully.](assets/25-files01-scheduled-events.png){ width=90% }

The production policy was then restored:

```powershell
wbadmin enable backup -schedule:22:00 -quiet
wbadmin enable backup
```

![FILES01 production schedule restored to 22:00 after the acceptance test.](assets/26-files01-schedule-restored.png){ width=90% }

### Conclusion

**PASS** - FILES01 has a completed scheduled backup acceptance test.

---

# 7. Script and Configuration Breakdown

## 7.1 `/etc/fstab` persistent repository entry

```text
UUID=00d4f4e4-4c27-4b01-9282-add0175f1196 /mnt/nova-backup ext4 defaults 0 2
```

Purpose: ensure the backup repository is mounted automatically and predictably after host reboot.

## 7.2 Proxmox storage configuration

Conceptual final entry:

```text
dir: nova-backup
    path /mnt/nova-backup
    content backup,images
```

`images` was enabled so the repository could also back the dedicated guest backup virtual disks. The repository still contains Proxmox `vzdump` backups.

## 7.3 FILES01 monitor logic

Main checks:

```text
Get-Volume B:
  -> exists?
  -> Healthy?
  -> >=20% free?

Microsoft-Windows-Backup Event ID 4
  -> latest success <=26h?

wbadmin get versions -backupTarget:B:
  -> version count >= desired target?
```

Severity:

```text
4100 healthy
4101 hard failure
4102 retention warning
```

## 7.4 DC01 monitor logic

Same operational pattern, but recovery depth is specifically System State and uses separate event IDs:

```text
4200 healthy
4201 hard failure
4202 retention warning
```

## 7.5 DC retention wrapper

The wrapper protects against the unsafe sequence:

```text
backup failed
    ↓
cleanup still deletes old copies
```

It first checks for a recent successful backup and only then considers keep-7 pruning.

---

# 8. Validation Tests

## 8.1 Repository write validation

### Expected

Data written under `/mnt/nova-backup` survives unmount/remount and the filesystem is reported as ext4 from `/dev/sda1`.

### Actual

The CR-012 test file remained after remount and `findmnt` showed `/dev/sda1` mounted on `/mnt/nova-backup`.

### Conclusion

**PASS**.

## 8.2 Legacy backup migration integrity

### Expected

Every destination backup file should match the original SHA-256 baseline.

### Actual

`sha256sum -c /root/cr012-old-backups.sha256` returned `OK` for all 12 files.

### Conclusion

**PASS**.

## 8.3 FILES01 backup-target failure detection

### Expected

Taking the backup disk offline should cause the monitor to generate an error.

### Actual

Event 4101 reported `Backup volume B: is unavailable.`

### Conclusion

**PASS**.

## 8.4 FILES01 backup-target recovery

### Expected

After returning the disk online, the monitor should return to healthy state.

### Actual

`Get-Volume B` returned Healthy/OK and the monitor generated Event 4100.

### Conclusion

**PASS**.

## 8.5 FILES01 user-access isolation

### Expected

A normal domain user must not be able to browse the backup drive through `\\nova-files01\B$`.

### Actual

Moyo received `Access is denied` and was prompted for administrator credentials.

### Conclusion

**PASS**.

## 8.6 Finance restore integrity

### Expected

Restored file should match original content and permissions.

### Actual

Recovery succeeded; hash and ACL checks passed.

### Conclusion

**PASS**.

## 8.7 Alternate-path restore integrity

### Expected

Recovered staging copy should have the exact same SHA-256 value while the original production path remains absent.

### Actual

Hash comparison returned `True`; `Test-Path` on the original Finance path returned `False`.

### Conclusion

**PASS**.

## 8.8 DC VSS writer health

### Expected

Critical writers should be stable with no errors after System State backup.

### Actual

NTDS Writer and other writers displayed `State: [1] Stable` and `Last error: No error`.

### Conclusion

**PASS**.

## 8.9 FILES01 scheduled-run acceptance

### Expected

Task Scheduler should launch the backup at the configured temporary time without a manual backup command.

### Actual

Events 1/4/14 were recorded at 18:17 and the production schedule was restored to 22:00.

### Conclusion

**PASS**.

## 8.10 DC01 scheduled-run acceptance

### Expected

The normal 23:00 System State schedule should produce a completed scheduled backup and new recovery version.

### Actual at journal publication

The job is configured and `StartWhenAvailable=True`, but the first natural 23:00 completion had not yet occurred.

### Conclusion

**PENDING EVIDENCE** - not failed; simply not yet observed.

---

# 9. Failure Tests and Troubleshooting

CR-012 deliberately preserves the failures because they are part of the engineering evidence.

## 9.1 `parted` not installed

**Symptom**

```text
-bash: parted: command not found
```

**Root cause:** the selected utility was not installed on the Proxmox host.

**Resolution:** use available `fdisk` to create a GPT disklabel and partition.

**Lesson:** do not turn a missing utility into an unnecessary package-install change when an existing supported tool can safely perform the task.

## 9.2 systemd `fstab` cache warning

After editing `/etc/fstab`, `mount -a` reported that systemd still used the old version.

**Resolution:** `systemctl daemon-reload`, then revalidate with `findmnt`.

**Lesson:** configuration files and systemd's loaded state are related but not identical.

## 9.3 Backup-target offline test

The backup disk was deliberately taken offline. Windows lost the `B:` volume and `wbadmin start backup` failed because the backup location could not be found.

**Resolution:** restore the disk online and re-run the health monitor.

**Preventive control added:** `NovaBackupMonitor` Event 4101 alerting.

## 9.4 DC backup freshness violation

The DC monitor reported the latest successful backup was 48.82 hours old.

**Root cause:** the DC had been powered off and therefore could not execute the in-guest scheduled job.

**Resolution:** perform a fresh System State backup and verify writers/recovery versions.

**Lesson:** a schedule is not evidence that a backup occurred. Freshness monitoring is required.

## 9.5 Built-in Windows Backup task refused manual on-demand start

`Start-ScheduledTask` returned that the task settings do not allow the task to start on demand.

**Resolution:** do not modify the Microsoft-managed task merely for testing. Instead, temporarily change the WSB schedule and let Windows launch it naturally.

## 9.6 First temporary schedule modification rejected

The command tried to re-add `B:` with `-addtarget:B:` while changing the time. Windows returned:

```text
The specified location B: has already been added as a backup storage location.
```

**Resolution:** modify only `-schedule` on the existing policy.

**Lesson:** distinguish changing an existing WSB policy from recreating or extending the target list.

---

# 10. Logs and Reports

Important evidence locations include:

```text
Windows Event Log:
  Microsoft-Windows-Backup

Application log sources:
  NovaBackupMonitor
  NovaDCBackupMonitor
  NovaDCBackupRetention

WSB restore logs:
  C:\WINDOWS\Logs\WindowsServerBackup\...
```

Key event IDs used in this CR:

| Source | ID | Meaning in this lab |
|---|---:|---|
| Microsoft-Windows-Backup | 1 | backup started |
| Microsoft-Windows-Backup | 4 | backup finished successfully |
| Microsoft-Windows-Backup | 14 | backup operation completed |
| NovaBackupMonitor | 4100 | FILES01 healthy |
| NovaBackupMonitor | 4101 | FILES01 failure/error |
| NovaBackupMonitor | 4102 | FILES01 retention warning |
| NovaDCBackupMonitor | 4200 | DC backup healthy |
| NovaDCBackupMonitor | 4201 | DC backup failure/freshness error |
| NovaDCBackupMonitor | 4202 | DC retention-depth warning |
| NovaDCBackupRetention | 4210 | retention task healthy/no prune needed |
| NovaDCBackupRetention | 4211 | prune skipped for safety |
| NovaDCBackupRetention | 4212 | retention cleanup failure |

---

# 11. Security Considerations

## 11.1 Least privilege

The backup target is not intended as a normal employee share. A real normal-user test confirmed that Moyo could not browse `B$`.

The `WindowsImageBackup` directory showed tighter ACLs than the drive root, with administrative/backup-specific principals rather than Finance/HR user groups.

## 11.2 Backup isolation

The Windows backup disks are backed by `nova-backup`, separate from the VM OS/data storage at the Proxmox configuration level.

However, this is still a home-lab/nested environment. It is not ransomware-proof immutable storage and it is not off-site.

## 11.3 `backup=0`

The dedicated guest backup disks were excluded from VM-level backup to avoid recursive copies and uncontrolled storage growth.

## 11.4 Recovery authorization

The roadmap's Finance scenario requires authorization before data is released. The technical ability to restore a file does not automatically authorize returning confidential Finance data to any requester.

---

# 12. Rollback and Recovery

## 12.1 Linux mount rollback

The original `fstab` baseline was retained as:

```text
/etc/fstab.cr012-before
```

If the persistent mount entry caused boot/mount problems, the backup line could be removed/restored using the baseline file.

## 12.2 Proxmox storage rollback

`storage.cfg` was copied before registration changes. Storage IDs can be re-added without altering the underlying files, provided the repository and path remain intact.

## 12.3 Backup-job rollback

The Proxmox job and WSB policies were inspected before modification. The FILES01 acceptance test explicitly restored its production schedule to 22:00 after the temporary test.

## 12.4 File restore safety

The preferred high-confidence restore workflow is:

```text
restore to alternate path
        ↓
verify content
        ↓
verify SHA-256
        ↓
verify ACL/owner
        ↓
approve
        ↓
return to production
```

This avoids overwriting live data before the backup copy has been inspected.

## 12.5 Domain-controller recovery safety

An unsafe production DC restore was deliberately **not** performed merely to satisfy a checklist. The recovery plan uses the healthy `NOVA-DC02` and requires isolated validation before reconnecting a restored DC when whole-VM recovery is involved.

---

# 13. Command Reference

## 13.1 Linux storage discovery

```bash
lsblk -o NAME,SIZE,MODEL,SERIAL,TYPE,FSTYPE,MOUNTPOINTS
fdisk -l /dev/sda
wipefs /dev/sda
```

Purpose: identify the correct target and prove current state before destructive operations.

## 13.2 GPT partition creation

```bash
fdisk /dev/sda
# g -> n -> defaults -> w
```

Purpose: create a modern partition map and single full-size data partition.

## 13.3 ext4 filesystem creation

```bash
mkfs.ext4 -L NOVA_BACKUP /dev/sda1
blkid /dev/sda1
```

Purpose: create and identify the filesystem.

## 13.4 Mount validation

```bash
mount /dev/sda1 /mnt/nova-backup
findmnt /mnt/nova-backup
df -hT /mnt/nova-backup
```

## 13.5 Proxmox storage

```bash
pvesm add dir nova-backup --path /mnt/nova-backup --content backup
pvesm status
pvesm list nova-backup
pvesh get /cluster/backup --output-format json-pretty
```

## 13.6 Integrity migration

```bash
find . -type f -print0 | sort -z | xargs -0 sha256sum > /root/cr012-old-backups.sha256
rsync -aH --info=progress2 /backups/ /mnt/nova-backup/
sha256sum -c /root/cr012-old-backups.sha256
```

## 13.7 Windows disk inspection

```powershell
Get-Disk
Get-Partition
Get-Volume
```

## 13.8 Windows backup feature

```powershell
Install-WindowsFeature Windows-Server-Backup -IncludeManagementTools
Get-WindowsFeature Windows-Server-Backup
Get-Command wbadmin
```

## 13.9 Backup catalogue

```powershell
wbadmin get versions -backupTarget:B:
wbadmin get items -version:<version> -backupTarget:B:
```

## 13.10 File backup/recovery

```powershell
wbadmin start backup -backupTarget:B: -include:D: -vssCopy -quiet
```

```powershell
wbadmin start recovery `
  -version:<version> `
  -itemType:File `
  -items:"D:\NovaData\Finance\file.txt" `
  -backupTarget:B: `
  -machine:nova-files01 `
  -recoveryTarget:"D:\NovaData\Recovery\CR012" `
  -overwrite:CreateCopy `
  -quiet
```

## 13.11 VSS health

```powershell
vssadmin list writers
vssadmin list shadows
vssadmin list shadowstorage
```

## 13.12 Hash verification

```powershell
Get-FileHash -Algorithm SHA256 <path>
```

## 13.13 Scheduled task verification

```powershell
Get-ScheduledTask
Get-ScheduledTaskInfo
```

## 13.14 Backup events

```powershell
Get-WinEvent -LogName "Microsoft-Windows-Backup" -MaxEvents 10
```

---

# 14. Evidence Screenshots

The figures embedded throughout this journal are the primary evidence set. Key evidence includes:

1. Proxmox disk identity before formatting.
2. GPT partition creation.
3. ext4 filesystem UUID.
4. `/etc/fstab` baseline and persistent mount.
5. legacy backup checksum baseline.
6. Proxmox backup-job dependency audit.
7. old storage removal with backups preserved.
8. FILES01 backup disk placement on `nova-backup`.
9. Windows Server Backup installation and volume validation.
10. Windows Server Backup GUI schedule.
11. Previous Versions GUI.
12. file recovery transcript.
13. health-monitor pass/failure events.
14. monitoring Task Scheduler triggers.
15. DC stale-backup detection.
16. DC backup duration.
17. NTDS Writer health.
18. DC retention event.
19. alternate-path SHA-256 match.
20. FILES01 natural scheduled-run events and restored production schedule.

---

# 15. Lessons Learned and Learner Questions

This section deliberately preserves the conceptual questions raised during the implementation because they are part of the study value of the lab.

## 15.1 Partition table versus filesystem

A partition table maps regions of a disk. A filesystem organizes files inside a partition. Creating GPT does not create ext4; formatting ext4 does not itself mount the filesystem.

## 15.2 Mounting and persistence

A mount connects a filesystem to the Linux directory tree. `/etc/fstab` describes filesystems that should be mounted automatically. UUID is preferred because it tracks the filesystem rather than relying on a device name that can change.

## 15.3 `cp`, `mv`, `scp`, and `rsync`

The commands solve different transfer problems. `rsync` was chosen for backup migration because it is restart-friendly, metadata-aware and gives useful transfer progress.

## 15.4 Hashes prove content identity

A matching SHA-256 value means the compared file bytes are identical for practical integrity verification in this lab. The hash does not prove that the file is semantically correct or authorized; it proves the content did not change between the two measured copies.

## 15.5 `pvesh` versus `pvesm`

`pvesm` focuses on Proxmox storage management. `pvesh` is a general shell client for the Proxmox API tree and is useful for inspecting other cluster configuration such as scheduled backup jobs.

## 15.6 Proxmox backup versus Windows Server Backup

The Proxmox layer protects whole VMs. Windows Server Backup gives guest-aware recovery. On a DC, System State has special operational value because it understands AD-related Windows components.

## 15.7 VSS writers

Writers are not backup files. They are coordination components that help produce a consistent snapshot of applications/services. `Stable / No error` is an important pre/post backup health signal.

## 15.8 RPO

RPO is the maximum acceptable data-loss window, expressed in time. A daily backup schedule implies roughly a 24-hour target backup interval. The 26-hour monitor is an alert threshold, not the target RPO itself.

## 15.9 RTO

RTO is the acceptable restoration/service-recovery time. The lab measured some operations, but it did not pretend that a 253-byte file restoration time is a full production RTO for FILES01, nor that a 55-minute System State **backup** duration is a DC restore RTO.

## 15.10 Disk initialization and GPT

A RAW Windows disk must be initialized before normal partitions can be created. GPT is the modern partition format and is preferred even when a small disk would still fit within MBR's limits.

## 15.11 `BUILTIN\Users`

`BUILTIN` indicates Windows built-in local groups, not the `NOVA` domain. Domain principals are named with the `NOVA\` prefix.

## 15.12 What happens when a server is powered off?

In-guest scheduling cannot execute while the OS is off. Monitoring inside the same server also cannot alert while that server is completely unavailable. A future enterprise monitoring layer should therefore observe backups externally as well.

---

# 16. Acceptance Criteria

The roadmap operational checkpoint requires all of the following.

| Acceptance criterion | Evidence | Status |
|---|---|---|
| At least one completed scheduled backup of each supported workload | FILES01 natural 18:17 scheduled test passed. DC01 natural 23:00 run not yet observed. | **PENDING** |
| Deleted file recovered and hash/ACL verified | Finance recovery plus alternate-path SHA-256 match | PASS |
| DC recovery documentation reviewed; unsafe production-style restores avoided | DC recovery decision tree and System State design | PASS |
| Actual RPO/RTO recorded and backup failure alert tested | 24h nominal/26h alert logic, measured operation times, 4101/4201 failure tests | PASS |

## 16.1 Implementation mission status

| Roadmap implementation item | Status |
|---|---|
| Inventory workloads/data/recovery dependencies | PASS |
| Choose independent backup target | PASS |
| Configure DC System State and file-server backup | PASS |
| Set retention, schedule, least privilege and capacity alerts | PASS |
| Restore deleted pilot to alternate path and compare with Shadow Copies | PASS |
| Verify restored content by checksum and permissions | PASS |
| Draft DC recovery decision tree including isolated restore concept | PASS |
| Record recovery points, times, failure modes and escalation | PASS |

---

# 17. Final State

## 17.1 FILES01

```text
Data volume:                D: NovaData
Backup target:              B: NovaBackup
Backup schedule:            22:00 daily
Previous Versions:          07:00 and 12:00
Monitor:                    21:45 and 00:05
Free-space threshold:       20%
Freshness threshold:        26 hours
Desired recovery depth:     7 versions
Scheduled acceptance test:  PASS
Alternate-path restore:     PASS
SHA-256 verification:       PASS
```

## 17.2 DC01

```text
Backup type:                System State
Backup target:              B: NovaDCBackup
Backup schedule:            23:00 daily
Monitor:                    22:45 and 01:05
Retention task:             01:15
Retention policy:           keep newest 7
Free-space threshold:       20%
Freshness threshold:        26 hours
Manual System State backup: PASS
VSS writer health:          PASS
Natural scheduled run:      PENDING EVIDENCE
```

## 17.3 Proxmox repository

```text
Device:          /dev/sda1
Filesystem:      ext4
Label:           NOVA_BACKUP
Mount:           /mnt/nova-backup
Persistent by:   filesystem UUID in /etc/fstab
Proxmox ID:      nova-backup
Contents:        backup,images
Legacy backups:  migrated and SHA-256 verified
```

---

# 18. Snapshot / Backup Evidence and Closure Boundary

The engineering boundary at journal publication is stable enough to begin CR-013, but the roadmap's CR-012 formal closure flag should remain pending until the first natural DC01 23:00 scheduled System State run is captured.

When that run completes, the final evidence update should include:

```powershell
Get-ScheduledTaskInfo `
    -TaskPath "\Microsoft\Windows\Backup\" `
    -TaskName "Microsoft-Windows-WindowsBackup" |
    Select LastRunTime,NextRunTime,LastTaskResult
```

```powershell
wbadmin get versions -backupTarget:B:
```

```powershell
Get-WinEvent `
    -LogName "Microsoft-Windows-Backup" `
    -MaxEvents 8 |
    Select TimeCreated,Id,LevelDisplayName,Message |
    Format-List
```

Required final proof:

```text
LastTaskResult = 0
new System State recovery version exists
backup start/success/completion events exist
```

At that point the remaining acceptance criterion can be changed from **PENDING** to **PASS / COMPLETE** and a final known-good Proxmox snapshot/restore point can be recorded if appropriate before major CR-013 changes.

---

# 19. RPO/RTO and Recovery Decision Tree

## 19.1 RPO record

### FILES01

Nominal Windows Server Backup interval:

```text
24 hours
```

Freshness alarm:

```text
>26 hours
```

Previous Versions add faster intra-day recovery opportunities at 07:00 and 12:00 where a suitable snapshot contains the required file.

### DC01

Nominal System State interval:

```text
24 hours
```

Freshness alarm:

```text
>26 hours
```

A real violation was observed at 48.82 hours when the DC had been powered off.

## 19.2 Measured time observations

| Operation | Measured result | Interpretation |
|---|---:|---|
| DC01 recent System State backup | ~55m 10s | backup duration in nested lab; not restore RTO |
| Tiny file restore engine operation | completed within same logged second | useful proof of mechanism, not a full production RTO |
| FILES01 natural scheduled backup test | ~14 seconds for test run events | environment/test-state specific |

## 19.3 File recovery decision tree

```text
User reports deleted/corrupt file
            |
            v
Verify authorization and exact path
            |
            v
Suitable Previous Version exists?
       /                 \
     yes                  no
      |                    |
Open/restore VSS       Windows Server Backup
      |                    |
Verify content         Restore to staging path
      |                    |
      +-----------> Hash + ACL + content checks
                           |
                           v
                 Return approved file to production
```

## 19.4 Domain controller recovery decision tree

```text
AD/DC incident
    |
    v
Is NOVA-DC02 healthy and replicating?
    | yes
    +--> preserve healthy DC; diagnose logical problem first
    |
    | no / whole DC loss
    v
Choose recovery layer
    |
    +--> System State for AD-aware recovery
    |
    +--> Proxmox whole-VM recovery where appropriate
              |
              v
      isolate restored instance
              |
      validate AD/DNS/SYSVOL/replication
              |
      reconnect only after validation
```

---

# 20. Failure Modes and Escalation Matrix

| Failure mode | First response | Escalate when |
|---|---|---|
| User deletes/overwrites file | Check Previous Versions | No suitable version |
| No suitable Shadow Copy | Use WSB recovery catalogue | WSB version unavailable/corrupt |
| `B:` missing/offline | Check disk/volume and monitor event | target cannot be restored quickly |
| Free space <20% | capacity investigation | backup exhaustion risk persists |
| Last backup >26h | inspect schedule, server state, target and events | RPO breach/repeated failure |
| FILES01 VM unavailable | Proxmox recovery | VM backup unavailable or app consistency uncertain |
| DC System State stale | restore backup operations first | repeated >26h breach |
| AD corruption | use healthy DC and AD-safe recovery planning | replication/integrity uncertain |
| Whole DC lost | isolated VM/System State recovery | never reconnect unvalidated restored DC |

---

# 21. Career / Interview Evidence

A factual CR-012 statement can be made only from what was actually proven:

> Built and validated a layered backup/recovery design for a Windows lab estate using Proxmox storage, Windows Server Backup, VSS/System State, PowerShell health monitoring, retention controls and SHA-256 restore verification; deliberately tested backup-target failure and alternate-path file recovery.

A useful STAR story from this CR is the backup-target outage:

**Situation:** the Windows backup destination was intentionally made unavailable to test whether backup failures could be detected before recovery was needed.  
**Task:** create a monitor that distinguished healthy, warning and failed backup states.  
**Action:** checked volume presence/health, capacity, last successful backup and recovery-version count; logged structured Application events; scheduled pre/post checks; then took the backup disk offline and restored it.  
**Result:** the monitor generated a 4101 Error while the target was unavailable and returned to 4100 healthy after repair, proving the detection and recovery path.

---

# 22. Conclusion

CR-012 transformed Nova Corp's backup posture from a collection of snapshots and legacy backup files into an evidence-backed, layered recovery design.

The most important engineering lessons were:

1. **A snapshot is not automatically a tested backup.**
2. **A schedule is not proof that a backup ran.** Monitor freshness and events.
3. **Backup storage must be identified and protected before destructive disk work.**
4. **Recovery must be tested, not merely configured.**
5. **A restored file should be validated by content, hash and permissions.**
6. **Previous Versions and Windows Server Backup solve related but different recovery problems.**
7. **Active Directory needs AD-aware recovery thinking; a VM copy alone is not the entire operational story.**
8. **Failures and failed commands are part of the evidence.** The missing `parted` utility, `fstab` reload warning, unavailable `B:` target, stale DC backup, on-demand task restriction and rejected `-addtarget:B:` modification all improved the final design.
9. **Lab isolation is not the same as production off-site resilience.** The repository is separated inside the lab architecture but remains on the same overall physical lab environment.
10. **Formal closure must match the roadmap.** CR-012 remains one evidence item short of 100% completion until DC01's natural scheduled 23:00 System State run is captured.

**Current status:** **IMPLEMENTATION COMPLETE / FORMAL ACCEPTANCE PENDING DC01 NATURAL SCHEDULED RUN**.

**Next roadmap item:** **CR-013 - Secondary Domain Controller and AD Resilience**.

---

# Appendix A - Final Monitoring Schedule

```text
NOVA-FILES01
21:45  Nova Backup Health Monitor - pre-check
22:00  Windows Server Backup - D: -> B:
00:05  Nova Backup Health Monitor - post-check

NOVA-DC01
22:45  Nova DC Backup Health Monitor - pre-check
23:00  Windows Server Backup - System State -> B:
01:05  Nova DC Backup Health Monitor - post-check
01:15  Nova DC Backup Retention - keep newest 7 when safe
```

# Appendix B - Important Backup Paths

```text
Proxmox repository:
/mnt/nova-backup

FILES01:
D:\NovaData
B:\WindowsImageBackup
C:\NovaAdmin\Scripts\Test-NovaBackupHealth.ps1

DC01:
B:\WindowsImageBackup
C:\NovaAdmin\Scripts\Test-NovaDCBackupHealth.ps1
C:\NovaAdmin\Scripts\Invoke-NovaDCBackupRetention.ps1
```

# Appendix C - Evidence Index

| Figure | Evidence | What it proves |
|---:|---|---|
| 1 | disk discovery | correct 300 GiB target identified |
| 2 | `sda1` | partition created |
| 3 | ext4/UUID | filesystem correctly created |
| 4-5 | `fstab` | persistent mount design and validation |
| 6 | checksum baseline | old backup integrity baseline |
| 7 | `pvesh` | dependency audit of scheduled Proxmox job |
| 8 | storage removal | old storage entry removed without losing backups |
| 9 | FILES01 hardware | backup disk located on `nova-backup`, `backup=0` |
| 10-11 | Windows backup setup | FILES01 target and schedule configured |
| 12 | Previous Versions | separate Shadow Copy recovery tier |
| 13 | restore transcript | deleted Finance file recovered |
| 15-17 | monitor evidence | health/failure detection and scheduling |
| 18-22 | DC evidence | stale detection, backup duration, VSS writer health, retention |
| 23 | SHA-256 compare | alternate-path recovery integrity |
| 24-26 | scheduled acceptance | natural FILES01 scheduler launch and production-time restoration |

# Appendix D - Pending Closure Update

When the DC01 23:00 scheduled run completes, update this journal with:

```text
Date/time:
LastTaskResult:
New System State version identifier:
Events 1/4/14 timestamps:
Post-check Event 4200/4202:
Formal CR-012 status: PASS / COMPLETE
Final rollback snapshot/reference:
```
