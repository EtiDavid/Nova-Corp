# Company File Centre — Shared folders, access and recovery

Employees work with shared folders instead of storing every document on their own PC. Nova Corp uses a Windows file server, **five departmental shares**, a company-wide DFS address and security groups to control access.

## Choose a department

| Folder | What it's for | Open it |
| --- | --- | --- |
| **Finance** | Nova Corp Finance Department | [Explore permissions & people](finance.md) |
| **HR** | Nova Corp HR Department | [Explore permissions & people](hr.md) |
| **IT** | Nova Corp IT Department | [Explore permissions & people](it.md) |
| **Management** | Nova Corp Management Department | [Explore permissions & people](management.md) |
| **Sales** | Nova Corp Sales Department | [Explore permissions & people](sales.md) |

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

[**Explore the permission matrix**](PERMISSIONS.md) · [Follow every DFS link](DFS_PATHS.md) · [Browse all 11 shares, including Windows administrative shares](ADMIN_SHARES.md).

## Recovery and version history

The file server has [Windows backup storage](VOLUMES.md), [30 recorded shadow-copy points](VSS.md), and a [real recovery test in which a deleted file was restored with the same SHA-256 hash](../incidents/backup-target-disappears.md).

[File-server profile](../systems/NOVA-FILES01.md) · [SMB explained](../services/SMB.md) · [Complete Windows file-server journal](../../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf)

[← Explore Nova Corp](../../EXPLORE_NOVACORP.md)
