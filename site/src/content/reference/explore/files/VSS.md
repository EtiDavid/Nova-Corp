---
title: "Shadow Copies — Earlier versions of files"
sourcePath: "docs/explore/files/VSS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/VSS.md"
section: "explore"
---

# Shadow Copies — Earlier versions of files

Shadow Copies let Windows retain earlier points in time for a volume. They are useful for recovering accidentally changed or removed files without restoring an entire server.

Nova Corp has **30 recorded VSS shadow-copy objects**, attached to **two underlying volume identifiers**. The source records their Windows snapshot state and accessibility, but does not itself prove each copy has been successfully restored.

## What happens when somebody needs an older file?

Employee → File server → Previous Versions / Shadow Copy → Choose a restore point → Validate the recovered file.

**A previous-version recovery was tested too.** An administrator saved a test file, created a Shadow Copy, then changed the live file. Reading the older version returned the original contents, and its SHA-256 matched the original exactly. This proves the particular Shadow Copy test worked; it does **not** mean all 30 snapshots were individually restored. [See the complete previous-version recovery walkthrough](/reference/explore/files/SHADOW_COPY_RECOVERY/).

A **different** [backup failure-and-restore investigation](/reference/explore/incidents/backup-target-disappears/) recovered a deleted file using Windows Server Backup. It also matched the original SHA-256. Previous Versions and Windows Backup are separate recovery methods.

## All recorded restore points

<details><summary>Open the complete 30-point technical list</summary>

| # | Shadow Copy ID | Volume identifier | Created | State | Client-accessible |
| ---: | --- | --- | --- | --- | --- |
| 1 | `{D1943440-37AC-4150-A8C5-4DE052249A6E}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 10/13/2026 5:43:07 PM | `12` | True |
| 2 | `{BAD4ADDA-7B21-4AA4-AAF4-6A4DE5AB8545}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 10/13/2026 5:53:09 PM | `12` | True |
| 3 | `{6190ED7B-252C-4495-BA49-4AC81A5A3090}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 10/13/2026 6:27:43 PM | `12` | True |
| 4 | `{1951EEC6-9732-4660-B2EF-10A717A4E035}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 10/22/2026 7:00:01 AM | `12` | True |
| 5 | `{57916D25-9FFD-4AF9-B593-19DA326E8B4E}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 11/3/2026 12:00:02 PM | `12` | True |
| 6 | `{7CEE96F7-8354-4BA0-819F-E3F42F872C75}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 11/3/2026 12:00:01 PM | `12` | True |
| 7 | `{3E75CEEF-5D73-43AB-8311-8FC35E6579FF}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 11/4/2026 12:00:01 PM | `12` | True |
| 8 | `{8B454B52-ACBF-4DE1-93FA-4B2BE9C907A5}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 11/12/2026 12:00:01 PM | `12` | True |
| 9 | `{C4F2986F-538D-4A9F-BCCC-C2BD0BC0ED5B}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 11/19/2026 3:06:06 PM | `12` | True |
| 10 | `{70BE1A45-3F73-4183-A8E8-C3F7B54A9596}` | `\\?\Volume{426d7760-457b-41c6-bf9d-81b6537629f3}\` | 11/22/2026 1:46:01 PM | `12` | False |
| 11 | `{0EAFD2E6-7509-402E-AABC-3A312763FD7F}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/2/2026 8:42:26 PM | `12` | False |
| 12 | `{82CFE0F9-B098-42E2-B47E-A9EEE4602467}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/4/2026 11:36:16 AM | `12` | False |
| 13 | `{37EC515D-6D78-4067-9528-CC10D5B302C2}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/5/2026 12:46:56 PM | `12` | False |
| 14 | `{45B60F80-8D81-4944-8FE5-F58E8DE399CF}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/5/2026 1:22:45 PM | `12` | False |
| 15 | `{05538C72-769C-41B6-94C3-86CB8E415464}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/5/2026 4:45:11 PM | `12` | False |
| 16 | `{BB9C54E8-1FFC-4E86-82A4-A4420B1F9CCF}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/5/2026 6:17:19 PM | `12` | False |
| 17 | `{60401273-5947-4C13-AA82-C4624A65AEA1}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/5/2026 10:00:24 PM | `12` | False |
| 18 | `{0A5D4AF5-524F-41F4-B276-EAD2BC3C339F}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/7/2026 3:10:47 AM | `12` | False |
| 19 | `{CD23C0E8-0A27-49CF-8B6A-4F418B1B7931}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/7/2026 10:00:54 PM | `12` | False |
| 20 | `{D630AFB6-86B8-473C-8F5E-2E9E4F333037}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/8/2026 10:00:45 PM | `12` | False |
| 21 | `{56DAB804-FF80-4FF4-86C3-DA68BBEDFD01}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/11/2026 8:23:25 PM | `12` | False |
| 22 | `{80C2CBD4-DCD8-4917-A968-04F0C1C71A14}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/11/2026 10:00:32 PM | `12` | False |
| 23 | `{A00967A4-CAB0-4786-9EEC-B81347D32843}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/12/2026 10:00:29 PM | `12` | False |
| 24 | `{29213AF6-3861-4CEE-A3EF-877EE902F7D8}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/16/2026 10:24:56 PM | `12` | False |
| 25 | `{1BB436CD-06C3-4E24-9866-102CE4B747B4}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/18/2026 1:17:18 PM | `12` | False |
| 26 | `{746D06E2-2105-49EE-A794-1BD0F207C64A}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/18/2026 2:45:41 PM | `12` | False |
| 27 | `{2BBBEC84-E90D-43D0-9583-9EBAFE0466C8}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/18/2026 10:00:44 PM | `12` | False |
| 28 | `{DD7381C6-3286-4FB4-849F-630D3707536E}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/20/2026 12:47:33 PM | `12` | False |
| 29 | `{63C376E6-3E16-42D1-BA3F-BC67FF8F1E2A}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/20/2026 10:00:57 PM | `12` | False |
| 30 | `{4B7C7D1C-268E-418B-B45A-22B06532AAE8}` | `\\?\Volume{843476ac-4b1a-41cc-8586-91915855ed3b}\` | 11/22/2026 1:46:16 PM | `12` | False |

</details>

## What this does and does not protect

Shadow Copies depend on the same Windows server and its storage. They are not an independent off-site backup. For full recovery, Nova Corp separately uses Windows Backup on **B:** and Proxmox VM archives for selected VMs.

[Windows storage](/reference/explore/files/VOLUMES/) · [Windows Backup](/reference/explore/services/BACKUPS/) · [VSS engineering journal](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/) · [All shared folders](/reference/explore/files/SHARES/).
