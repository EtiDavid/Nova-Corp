# IT shared folder — who can open it?

**Purpose:** Technology and support files.  
**Server:** [NOVA-FILES01](../../systems/NOVA-FILES01.md) · **Network:** [INFRA](../../network/zones/INFRA.md).

## Start with the folder

A member of the IT department uses the familiar path:

```text
\\nova.corp\shares\IT
```

That path enters the [company's DFS namespace](../DFS_PATHS.md), which points to the real share:

```text
\\NOVA-FILES01\IT
    → D:\NovaData\IT
```

## How access works

```mermaid
flowchart LR
  U["IT user"] --> G["IT_Users"]
  G --> DL["DL_FS_IT_Modify"]
  DL --> S["SMB: Change"]
  S --> N["NTFS: Modify"]
  N --> F["IT folder"]
```

The Global group organizes IT users. The Domain Local group is the identity written into the file permissions. Both the network share permission and NTFS permission must allow the requested action.

| Access layer | Actual setting |
|---|---|
| Department Global group | `IT_Users` |
| Resource permission group | `NOVA\DL_FS_IT_Modify` |
| SMB share access | **Allow · Change** |
| NTFS root folder access | **Allow · Modify** |
| Administrator access | **FullControl**, plus SYSTEM on NTFS |
| Permission style | NTFS entries at share root are explicit; children inherit unless overridden |



## People and departments

David Eti, Moyo Agunbiade, Isaac Technology belong to the IT OU in the documented directory. A person might have more than one authorization path through nested groups.

[Open the department directory](../../DIRECTORY.md) · [Browse security groups](../../GROUPS.md) · [See the permissions matrix](../PERMISSIONS.md).

## What has actually been tested?

[The folder-permission investigation](../../incidents/file-permission-denial.md) and [the two-fault DNS+group incident](../../incidents/two-faults-one-symptom.md) show why an accessible server isn't always an accessible file. Their commands and results are available on those pages.

This page shows the **recorded share and root-folder access settings**. A per-user access result depends on that person's current groups, logon token and the precise child-folder ACL.

**[Exact ACL details](../PERMISSIONS.md)** · [DFS links](../DFS_PATHS.md) · [Windows file-server journal](../../../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf)

[← All company file shares](../SHARES.md)