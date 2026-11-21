# File & Records Room — Shared files and who may open them

Nova Corp stores departmental folders on **[NOVA-FILES01](systems/NOVA-FILES01.md)**. Employee access is based on domain identity and the combination of SMB and NTFS permissions.

## Department folders

| Folder | Who it is for | What we know from testing |
| --- | --- | --- |
| <a id="it"></a>**IT** | IT staff | Moyo was **allowed**; `DL_FS_IT_Modify` matched SMB and NTFS |
| <a id="finance"></a>**Finance** | Finance staff | Moyo was **denied**; Finance Domain Local permission groups were reviewed |
| **HR** | Human Resources | Departmental group and file-sharing work documented |
| **Sales** | Sales | Departmental group and drive-access work documented |
| **Management** | Management | Departmental access model and permissions documented |

## Follow the IT access chain

```mermaid
flowchart LR
    MO["Moyo · IT"] --> GG["IT_Users"]
    GG --> DL["DL_FS_IT_Modify"]
    DL --> ACL["SMB share + NTFS"]
    ACL --> F["IT folder"]
```

[Open Moyo's profile](people/MOYO.md) → [security groups](GROUPS.md) → [how SMB works](services/SMB.md) → [file server](systems/NOVA-FILES01.md).

An **OU** organizes users; it does not itself grant a folder permission. The actual resource access depends on the user's groups and the access rules at the share and filesystem.

## The file path

Employees can use the DFS Namespace path:

`\\nova.corp\shares`

[Learn about DFS](services/DFS.md).

## What happens if a file disappears?

The recovery design includes [Shadow Copies / Previous Versions](services/VSS.md) and [Windows Server Backup](services/BACKUPS.md). The incident exercises proved a deleted file could be restored after a backup-target failure was repaired.

## Tests

**Allowed:** Moyo opened IT successfully.

**Denied:** the same IT identity did not receive Finance access.

**Resilience:** the file-share problem was distinguished from DNS and user authorization during later investigations.

[Tests and recovery](TESTS_AND_RECOVERY.md)

## Original engineering records

[File server deployment PDF](../Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) · [Shares & drive mapping PDF](../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) · [DFS & Shadow Copies PDF](../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) · [Access script and real-user tests](../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

[← Company map](../EXPLORE_NOVACORP.md)