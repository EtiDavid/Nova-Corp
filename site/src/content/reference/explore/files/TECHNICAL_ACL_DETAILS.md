---
title: "Technical reference — Actual SMB and NTFS access entries"
sourcePath: "docs/explore/files/TECHNICAL_ACL_DETAILS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/TECHNICAL_ACL_DETAILS.md"
section: "explore"
---

# Technical reference — Actual SMB and NTFS access entries

These are the configured access rules on Nova Corp's **11 SMB shares** and **14 inspected folders**. The table retains Windows account names, inherited/explicit flags and permission strings as observed. It can be expanded by share; no nested folder tree beyond the first level was checked here.

## Network share permissions — 27 rules

| SMB share | Principal | Action | Access |
| --- | --- | --- | --- |
| `ADMIN$` | `BUILTIN\Administrators` | Allow | **Full** |
| `ADMIN$` | `BUILTIN\Backup Operators` | Allow | **Full** |
| `ADMIN$` | `NT AUTHORITY\INTERACTIVE` | Allow | **Full** |
| `B$` | `BUILTIN\Administrators` | Allow | **Full** |
| `B$` | `BUILTIN\Backup Operators` | Allow | **Full** |
| `B$` | `NT AUTHORITY\INTERACTIVE` | Allow | **Full** |
| `C$` | `BUILTIN\Administrators` | Allow | **Full** |
| `C$` | `BUILTIN\Backup Operators` | Allow | **Full** |
| `C$` | `NT AUTHORITY\INTERACTIVE` | Allow | **Full** |
| `D$` | `BUILTIN\Administrators` | Allow | **Full** |
| `D$` | `BUILTIN\Backup Operators` | Allow | **Full** |
| `D$` | `NT AUTHORITY\INTERACTIVE` | Allow | **Full** |
| `Finance` | `NOVA\DL_FS_Finance_FullControl` | Allow | **Full** |
| `Finance` | `BUILTIN\Administrators` | Allow | **Full** |
| `Finance` | `NOVA\DL_FS_Finance_Modify` | Allow | **Change** |
| `HR` | `BUILTIN\Administrators` | Allow | **Full** |
| `HR` | `NOVA\DL_FS_HR_Modify` | Allow | **Change** |
| `IPC$` | `BUILTIN\Administrators` | Allow | **Full** |
| `IPC$` | `BUILTIN\Backup Operators` | Allow | **Full** |
| `IPC$` | `NT AUTHORITY\INTERACTIVE` | Allow | **Full** |
| `IT` | `BUILTIN\Administrators` | Allow | **Full** |
| `IT` | `NOVA\DL_FS_IT_Modify` | Allow | **Change** |
| `Management` | `BUILTIN\Administrators` | Allow | **Full** |
| `Management` | `NOVA\DL_FS_Management_Modify` | Allow | **Change** |
| `Sales` | `BUILTIN\Administrators` | Allow | **Full** |
| `Sales` | `NOVA\DL_FS_Sales_Modify` | Allow | **Change** |
| `shares` | `Everyone` | Allow | **Read** |

## NTFS folder permissions — 73 rules

<details>
<summary><strong>D:\NovaData\Finance</strong> — 4 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `NOVA\DL_FS_Finance_Modify` | `Modify, Synchronize` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `NOVA\DL_FS_Finance_FullControl` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>D:\NovaData\HR</strong> — 3 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `NOVA\DL_FS_HR_Modify` | `Modify, Synchronize` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>D:\NovaData\IT</strong> — 3 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `NOVA\DL_FS_IT_Modify` | `Modify, Synchronize` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>D:\NovaData\IT\CR014-BackupRestoreTest</strong> — 3 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NOVA\DL_FS_IT_Modify` | `Modify, Synchronize` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>D:\NovaData\IT\CR014-IncidentLab</strong> — 3 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NOVA\DL_FS_IT_Modify` | `Modify, Synchronize` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>D:\NovaData\IT\CR014-RestoreRecovered</strong> — 3 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NOVA\DL_FS_IT_Modify` | `Modify, Synchronize` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>D:\NovaData\Management</strong> — 3 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `NOVA\DL_FS_Management_Modify` | `Modify, Synchronize` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>D:\NovaData\Sales</strong> — 3 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `BUILTIN\Administrators` | `FullControl` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |
| `NOVA\DL_FS_Sales_Modify` | `Modify, Synchronize` | Allow | False | `ContainerInherit, ObjectInherit`, `None` |

</details>

<details>
<summary><strong>C:\DFSRoots\shares</strong> — 8 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `None`, `None` |
| `BUILTIN\Administrators` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `None`, `None` |
| `NT AUTHORITY\SYSTEM` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\Authenticated Users` | `Modify, Synchronize` | Allow | True | `None`, `None` |
| `NT AUTHORITY\Authenticated Users` | `-536805376` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `BUILTIN\Users` | `ReadAndExecute, Synchronize` | Allow | True | `None`, `None` |
| `BUILTIN\Users` | `-1610612736` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |

</details>

<details>
<summary><strong>C:\DFSRoots\shares\Finance</strong> — 8 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `None`, `None` |
| `BUILTIN\Administrators` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `None`, `None` |
| `NT AUTHORITY\SYSTEM` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\Authenticated Users` | `Modify, Synchronize` | Allow | True | `None`, `None` |
| `NT AUTHORITY\Authenticated Users` | `-536805376` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `BUILTIN\Users` | `ReadAndExecute, Synchronize` | Allow | True | `None`, `None` |
| `BUILTIN\Users` | `-1610612736` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |

</details>

<details>
<summary><strong>C:\DFSRoots\shares\HR</strong> — 8 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `None`, `None` |
| `BUILTIN\Administrators` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `None`, `None` |
| `NT AUTHORITY\SYSTEM` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\Authenticated Users` | `Modify, Synchronize` | Allow | True | `None`, `None` |
| `NT AUTHORITY\Authenticated Users` | `-536805376` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `BUILTIN\Users` | `ReadAndExecute, Synchronize` | Allow | True | `None`, `None` |
| `BUILTIN\Users` | `-1610612736` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |

</details>

<details>
<summary><strong>C:\DFSRoots\shares\IT</strong> — 8 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `None`, `None` |
| `BUILTIN\Administrators` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `None`, `None` |
| `NT AUTHORITY\SYSTEM` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\Authenticated Users` | `Modify, Synchronize` | Allow | True | `None`, `None` |
| `NT AUTHORITY\Authenticated Users` | `-536805376` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `BUILTIN\Users` | `ReadAndExecute, Synchronize` | Allow | True | `None`, `None` |
| `BUILTIN\Users` | `-1610612736` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |

</details>

<details>
<summary><strong>C:\DFSRoots\shares\Management</strong> — 8 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `None`, `None` |
| `BUILTIN\Administrators` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `None`, `None` |
| `NT AUTHORITY\SYSTEM` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\Authenticated Users` | `Modify, Synchronize` | Allow | True | `None`, `None` |
| `NT AUTHORITY\Authenticated Users` | `-536805376` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `BUILTIN\Users` | `ReadAndExecute, Synchronize` | Allow | True | `None`, `None` |
| `BUILTIN\Users` | `-1610612736` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |

</details>

<details>
<summary><strong>C:\DFSRoots\shares\Sales</strong> — 8 access entries</summary>

| Principal | Rights | Rule | Inherited | Inheritance and propagation |
| --- | --- | --- | --- | --- |
| `BUILTIN\Administrators` | `FullControl` | Allow | True | `None`, `None` |
| `BUILTIN\Administrators` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\SYSTEM` | `FullControl` | Allow | True | `None`, `None` |
| `NT AUTHORITY\SYSTEM` | `268435456` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `NT AUTHORITY\Authenticated Users` | `Modify, Synchronize` | Allow | True | `None`, `None` |
| `NT AUTHORITY\Authenticated Users` | `-536805376` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |
| `BUILTIN\Users` | `ReadAndExecute, Synchronize` | Allow | True | `None`, `None` |
| `BUILTIN\Users` | `-1610612736` | Allow | True | `ContainerInherit, ObjectInherit`, `InheritOnly` |

</details>


## Why the DFS ACL entries look different

The `C:\DFSRoots\shares` folders are namespace referral objects. They inherit Windows ACL entries for SYSTEM, Administrators, Authenticated Users and Users. Some inherited entries are shown as numeric masks with `InheritOnly` propagation because of Windows access-right bit combinations; do not interpret those numbers as unrestricted access to Finance or HR target data.

The actual department data resides under **`D:\NovaData`** and has independent group-based permissions. For a real access test, follow an employee through the appropriate group, SMB share and target NTFS path.

[Readable permission matrix](/reference/explore/files/PERMISSIONS/) · [DFS targets](/reference/explore/files/DFS_PATHS/) · [Access incident and commands](/reference/explore/incidents/file-permission-denial/) · [All shares](/reference/explore/files/SHARES/).
