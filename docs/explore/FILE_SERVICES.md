# File & Records Room — Shared files and who may open them

Employees at Nova Corp keep documents on [NOVA-FILES01](systems/NOVA-FILES01.md), not scattered across individual computers. **Five departmental folders** use Active Directory groups, SMB share rules and NTFS file permissions to protect their contents.

## Choose a company folder

| Department | What happens here? |
| --- | --- |
| [**IT**](files/it.md) | Shared technical and support files |
| [**Finance**](files/finance.md) | Finance documents, with special management access |
| [**HR**](files/hr.md) | Human Resources documents |
| [**Management**](files/management.md) | Management's department files |
| [**Sales**](files/sales.md) | Sales department documents |

[**All shares and how they connect**](files/SHARES.md) · [Who has which permissions?](files/PERMISSIONS.md) · [Technical ACL details](files/TECHNICAL_ACL_DETAILS.md)

## Follow an employee opening a file

```mermaid
flowchart LR
    A["Moyo in IT"] --> G["IT_Users"]
    G --> L["DL_FS_IT_Modify"]
    L --> DFS["\\nova.corp\shares\IT"]
    DFS --> SMB["NOVA-FILES01 SMB share"]
    SMB --> NTFS["NTFS folder permissions"]
    NTFS --> OK["Open IT folder"]
```

The group's permissions are checked at **both** the SMB share and the folder. A working network connection isn't enough if an account lacks permission.

[Open Moyo's profile](people/MOYO.md) → [IT group](GROUPS.md#it_users) → [IT folder](files/it.md) → [actual access-denial investigation](incidents/file-permission-denial.md).

## One company address for five departments

The DFS namespace `\\nova.corp\shares` points employees to departmental folders without asking them to remember the individual server address.

[Open all five DFS targets](files/DFS_PATHS.md) · [How DFS works](services/DFS.md) · [Drive-mapping Group Policy](policies/DRIVE_MAPPING.md).

## Recovering files and earlier versions

The file server has **30 Shadow Copy points**, a dedicated Windows Backup volume, and a completed incident where a deleted file was restored with the **same SHA-256 hash**.

[Shadow Copies](files/VSS.md) · [Disk space and backup target](files/VOLUMES.md) · [Restore incident, command by command](incidents/backup-target-disappears.md).

## Go deeper

[Deployment journal](../Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) · [Share/permission journal](../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) · [DFS/VSS journal](../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf).

[← Company map](../EXPLORE_NOVACORP.md)