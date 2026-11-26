---
title: "Recover an earlier version without restoring the whole server"
sourcePath: "docs/explore/files/SHADOW_COPY_RECOVERY.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/SHADOW_COPY_RECOVERY.md"
section: "explore"
---

# Recover an earlier version without restoring the whole server

A colleague changes an important file, then discovers that the earlier contents were needed. Nova Corp tested whether Windows **Shadow Copies** could preserve that older version while the live file changed.

This was an actual controlled file test on the company file server, **NOVA-FILES01**. It is different from recovering a deleted file through Windows Server Backup.

## What we did

1. Created a disposable file on the company's data volume (**D:**), with the marker `ORIGINAL-VERSION`.
2. Recorded its SHA-256 fingerprint.
3. Created a Shadow Copy of the data volume.
4. Changed the live file to `MODIFIED-LIVE-VERSION` and checked that its fingerprint changed.
5. Opened the saved Shadow Copy through a temporary read-only mount, read the older file and calculated its fingerprint.
6. Compared the original, modified and preserved versions; removed the disposable test folder and temporary mount after validation.

## What the test showed

| File version | SHA-256 comparison | Outcome |
| --- | --- | --- |
| Original file before the change | Baseline fingerprint | Recorded |
| Modified live file | **Different** from original | The file had really changed |
| Older version preserved in Shadow Copy | **Identical** to original | **PASS — original content preserved** |

The original and saved earlier version both had this SHA-256 value:

```text
68C24DE94D578E1DDC92773A3DC695C31E5F2E3314B71E4871C90E5A4E0EEB38
```

The modified live file produced a different value:

```text
FF88F9A131D834ECE439524CF6FF519DF6CC982EF696786FB4CC071A90771847
```

**Original = Shadow Copy: TRUE. Original = Modified live file: FALSE.**

The earlier version was readable and byte-for-byte identical to the original.

## Technical detail: the recorded test

<details>
<summary>Open the actual Windows test details</summary>

**Server:** `NOVA-FILES01`  
**Data volume:** `D:\` / `NovaData`  
**Disposable test file:** `D:\NovaData\IT\CR015-VSSTest\CR015-VSS-Recovery-Proof.txt`

A fresh snapshot was created with the Windows `Win32_ShadowCopy` interface:

```powershell
$VssResult = ([WMICLASS]"root\cimv2:Win32_ShadowCopy").Create(
    "D:\",
    "ClientAccessible"
)
```

The recorded command returned `ReturnValue = 0`. The saved point was later accessible at `\\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy43\`, through a temporary mount at `C:\CR015-VSS-Mount`.

The saved file was read successfully at:

```text
C:\CR015-VSS-Mount\NovaData\IT\CR015-VSSTest\CR015-VSS-Recovery-Proof.txt
```

That copy still contained `ORIGINAL-VERSION`, while the live file contained `MODIFIED-LIVE-VERSION`. SHA-256 checks produced the values shown above. The temporary mount and disposable test directory were then removed. The snapshot itself was retained in the historical record.

This walkthrough uses the saved results of the earlier infrastructure test. The commands, file contents and fingerprints above describe that recorded exercise; no new test was performed to create this page.

</details>

## What we learned — and the limits

The test proved that **one specific earlier-file version was recoverable** from a Shadow Copy, despite the live file being modified. Nova Corp separately recorded **30 Shadow Copy objects**; this test did **not** restore every one of those 30 copies.

Shadow Copies depend on the storage holding the snapshots. If that storage fails completely, they may not be available. That is why the company also uses separate Windows Server Backup recovery points.

**[See the separate deleted-file recovery test](/reference/explore/incidents/backup-target-disappears/)** — in that test, Windows Server Backup recovered a deliberately deleted file to an alternate directory, with a different matching SHA-256 fingerprint.

[Explore all Shadow Copies](/reference/explore/files/VSS/) · [How Windows backup works](/reference/explore/services/BACKUPS/) · [Visit the file server](/reference/explore/systems/NOVA-FILES01/)

[← File & Records Room](/reference/explore/files/SHARES/)
