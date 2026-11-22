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

[Department shares](SHARES.md) · [DFS address](DFS_PATHS.md) · [Exact SMB and NTFS rules](TECHNICAL_ACL_DETAILS.md).
