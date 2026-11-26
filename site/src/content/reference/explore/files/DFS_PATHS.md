---
title: "One company address for all department shares — DFS"
sourcePath: "docs/explore/files/DFS_PATHS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/DFS_PATHS.md"
section: "explore"
---

# One company address for all department shares — DFS

Instead of memorizing five different file-server addresses, employees can start from:

```text
\\nova.corp\shares
```

This is a **domain-based DFS Namespace**. It presents a friendly path, then directs the computer to the actual SMB share on **NOVA-FILES01**.

## Open a DFS connection

| Company path | Actual folder on file server | Status |
| --- | --- | --- |
| [Finance](/reference/explore/files/finance/) — `\\nova.corp\shares\Finance` | `\\NOVA-FILES01\Finance` | Online |
| [HR](/reference/explore/files/hr/) — `\\nova.corp\shares\HR` | `\\nova-files01\HR` | Online |
| [IT](/reference/explore/files/it/) — `\\nova.corp\shares\IT` | `\\nova-files01\IT` | Online |
| [Management](/reference/explore/files/management/) — `\\nova.corp\shares\Management` | `\\nova-files01\Management` | Online |
| [Sales](/reference/explore/files/sales/) — `\\nova.corp\shares\Sales` | `\\nova-files01\Sales` | Online |

## How a request travels

```mermaid
flowchart LR
  CLIENT[Windows computer] --> PATH[\\nova.corp\shares\IT]
  PATH --> REF[DFS namespace referral]
  REF --> SMB[\\NOVA-FILES01\IT]
  SMB --> NTFS[D:\NovaData\IT ACL]
  NTFS --> FILE[File]
```

The DFS namespace itself is hosted from `C:\DFSRoots\shares` and shared as `shares` with **Everyone: Read**. That permission allows users to browse the namespace; it does **not** give everyone full access to the departmental data on `D:`. The department target still enforces its own share and NTFS rules.

There is **one configured target for each of the five DFS department links** in this setup. A working DFS path is not proof of multiple independent file-server targets.

[DFS explained](/reference/explore/services/DFS/) · [Department permissions](/reference/explore/files/PERMISSIONS/) · [File-server profile](/reference/explore/systems/NOVA-FILES01/) · [DFS implementation journal](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/)

[← Shared folders](/reference/explore/files/SHARES/)
