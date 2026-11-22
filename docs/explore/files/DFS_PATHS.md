# One company address for all department shares — DFS

Instead of memorizing five different file-server addresses, employees can start from:

```text
\\nova.corp\shares
```

This is a **domain-based DFS Namespace**. It presents a friendly path, then directs the computer to the actual SMB share on **NOVA-FILES01**.

## Open a DFS connection

| Company path | Actual folder on file server | Status |
| --- | --- | --- |
| [Finance](finance.md) — `\\nova.corp\shares\Finance` | `\\NOVA-FILES01\Finance` | Online |
| [HR](hr.md) — `\\nova.corp\shares\HR` | `\\nova-files01\HR` | Online |
| [IT](it.md) — `\\nova.corp\shares\IT` | `\\nova-files01\IT` | Online |
| [Management](management.md) — `\\nova.corp\shares\Management` | `\\nova-files01\Management` | Online |
| [Sales](sales.md) — `\\nova.corp\shares\Sales` | `\\nova-files01\Sales` | Online |

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

[DFS explained](../services/DFS.md) · [Department permissions](PERMISSIONS.md) · [File-server profile](../systems/NOVA-FILES01.md) · [DFS implementation journal](../../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf)

[← Shared folders](SHARES.md)
