---
title: "Company File Centre — Shared folders, access and recovery"
sourcePath: "docs/explore/files/SHARES.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/SHARES.md"
section: "explore"
---

# Company File Centre — Shared folders, access and recovery

Employees work with shared folders instead of storing every document on their own PC. Nova Corp uses a Windows file server, **five departmental shares**, a company-wide DFS address and security groups to control access.

## Choose a department

| Folder | What it's for | Open it |
| --- | --- | --- |
| **Finance** | Nova Corp Finance Department | [Explore permissions & people](/reference/explore/files/finance/) |
| **HR** | Nova Corp HR Department | [Explore permissions & people](/reference/explore/files/hr/) |
| **IT** | Nova Corp IT Department | [Explore permissions & people](/reference/explore/files/it/) |
| **Management** | Nova Corp Management Department | [Explore permissions & people](/reference/explore/files/management/) |
| **Sales** | Nova Corp Sales Department | [Explore permissions & people](/reference/explore/files/sales/) |

## Follow a file request

```mermaid
flowchart LR
  P[Employee] --> G[Department group]
  G --> A[Resource permission group]
  A --> DFS[Company DFS address]
  DFS --> SMB[NOVA-FILES01 SMB share]
  SMB --> ACL[NTFS folder permissions]
  ACL --> FILE[Allowed file access]
```

A person needs permission at **both** the SMB share and the NTFS folder. The shared DFS address is a convenient route, not a bypass around those checks.

[**Explore the permission matrix**](/reference/explore/files/PERMISSIONS/) · [Follow every DFS link](/reference/explore/files/DFS_PATHS/) · [Browse all 11 shares, including Windows administrative shares](/reference/explore/files/ADMIN_SHARES/).

## Recovery and version history

The file server has [Windows backup storage](/reference/explore/files/VOLUMES/), [30 recorded shadow-copy points](/reference/explore/files/VSS/), and a [real recovery test in which a deleted file was restored with the same SHA-256 hash](/reference/explore/incidents/backup-target-disappears/).

[File-server profile](/reference/explore/systems/NOVA-FILES01/) · [SMB explained](/reference/explore/services/SMB/) · [Complete Windows file-server journal](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/)

[← Explore Nova Corp](/reference/EXPLORE_NOVACORP/)
