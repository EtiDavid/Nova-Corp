---
title: "Old snapshots fill the Proxmox thin pool"
sourcePath: "docs/explore/incidents/proxmox-snapshot-pressure.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/proxmox-snapshot-pressure.md"
section: "explore"
---

# Old snapshots fill the Proxmox thin pool

**Resolved · capacity risk reduced** · **Evidence record:** `CR-015 · CP-015-07`

## What happened?

Proxmox local-lvm reached 86.73% usage while many obsolete snapshots were retained.

## Why we investigated

Snapshots consume storage headroom and depend on the same underlying thin pool. They are not a substitute for standalone backups.

## Root cause

Twenty historical VM snapshots were retained long after their original change checkpoints.

## Step-by-step investigation

### Step 1. Measure actual capacity

```text
pvesm status
lvs -o lv_name,lv_size,data_percent,metadata_percent,lv_attr
```

**Expected / hypothesis:** Thin pool usage revealed before any cleanup.

**Actual result from the journal:** local-lvm 86.73% used; 337,775,077 KiB.

### Step 2. Inventory snapshots before deletion

```text
qm listsnapshot 100
qm listsnapshot 101
qm listsnapshot 102
qm listsnapshot 104
```

**Expected / hypothesis:** Understand historical dependencies and keep current rollback.

**Actual result from the journal:** 6 snapshots VM100, 4 VM101, 4 VM102, 6 VM104 to retire.

### Step 3. Remove obsolete snapshot points

```text
qm delsnapshot <VMID> <snapshot-name>
```

**Expected / hypothesis:** Old points removed while approved rollback remains.

**Actual result from the journal:** Twenty historical snapshots removed; no backup archives deleted.

### Step 4. Verify what remained

```text
qm listsnapshot 100
pvesm status
```

**Expected / hypothesis:** Only pre-CR016 known-good snapshot retained; thinpool lower.

**Actual result from the journal:** 1 retained on VM100; local-lvm 52.88%, ~125.72 GiB reclaimed.

### Step 5. Check later capacity again

```text
pvesm status
```

**Expected / hypothesis:** Capacity remains safely below the former pressure level.

**Actual result:** At a later check, local-lvm was **53.67% used (46.33% free)**; the cleanup improvement was maintained.

## Repair and outcome

Deliberately remove twenty obsolete snapshots through qm delsnapshot, preserve the pre-CR-016 pfSense snapshot and existing vzdump archives.

## Explore the real implementation

[Read the source Phase 2 validation and closure summary](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[Storage](/reference/explore/virtualization/storages/local-lvm/) · [pfSense snapshot](/reference/explore/virtualization/snapshots/100/) · [Backups](/reference/explore/services/BACKUPS/)

[← All investigations](/reference/explore/TESTS_AND_RECOVERY/) · [Company explorer](/reference/EXPLORE_NOVACORP/)
