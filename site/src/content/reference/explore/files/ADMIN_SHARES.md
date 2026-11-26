---
title: "The other five Windows file shares"
sourcePath: "docs/explore/files/ADMIN_SHARES.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/ADMIN_SHARES.md"
section: "explore"
---

# The other five Windows file shares

Windows also creates administrative SMB shares. Nova Corp has **11 SMB shares in total**: five department shares, one DFS namespace share and five built-in shares.

| Share | Local path | Purpose | Main access control |
| --- | --- | --- | --- |
| `ADMIN$` | `C:\WINDOWS` | Remote Admin | BUILTIN\Administrators Full, BUILTIN\Backup Operators Full, NT AUTHORITY\INTERACTIVE Full |
| `B$` | `B:\` | Default share | BUILTIN\Administrators Full, BUILTIN\Backup Operators Full, NT AUTHORITY\INTERACTIVE Full |
| `C$` | `C:\` | Default share | BUILTIN\Administrators Full, BUILTIN\Backup Operators Full, NT AUTHORITY\INTERACTIVE Full |
| `D$` | `D:\` | Default share | BUILTIN\Administrators Full, BUILTIN\Backup Operators Full, NT AUTHORITY\INTERACTIVE Full |
| `IPC$` | `(IPC endpoint)` | Remote IPC | BUILTIN\Administrators Full, BUILTIN\Backup Operators Full, NT AUTHORITY\INTERACTIVE Full |

**`ADMIN$`, `B$`, `C$`, `D$`, and `IPC$`** are built-in administrative/IPC connections, not normal departmental folders. Their permissions are separate from the business share model.

The **sixth non-administrative share**, `shares`, is a DFS namespace at `C:\DFSRoots\shares`, with `Everyone: Read` on the namespace SMB layer. It provides referrals to department targets rather than granting access to all data.

[Department shares](/reference/explore/files/SHARES/) · [DFS address](/reference/explore/files/DFS_PATHS/) · [Exact SMB and NTFS rules](/reference/explore/files/TECHNICAL_ACL_DETAILS/).
