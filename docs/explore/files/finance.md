# Finance shared folder — who can open it?

**Purpose:** Finance documents.  
**Server:** [NOVA-FILES01](../systems/NOVA-FILES01.md) · **Network:** [INFRA](../network/zones/INFRA.md).

## Start with the folder

A member of the Finance department uses the familiar path:

```text
\\nova.corp\shares\Finance
```

That path enters the [company's DFS namespace](DFS_PATHS.md), which points to the real share:

```text
\\NOVA-FILES01\Finance
    → D:\NovaData\Finance
```

## How access works

```mermaid
flowchart LR
  U["Finance user"] --> G["Finance_Users"]
  G --> DL["DL_FS_Finance_Modify"]
  DL --> S["SMB: Change"]
  S --> N["NTFS: Modify"]
  N --> F["Finance folder"]
```

The Global group organizes Finance users. The Domain Local group is the identity written into the file permissions. Both the network share permission and NTFS permission must allow the requested action.

| Access layer | Actual setting |
|---|---|
| Department Global group | `Finance_Users` |
| Resource permission group | `NOVA\DL_FS_Finance_Modify` |
| SMB share access | **Allow · Change** |
| NTFS root folder access | **Allow · Modify** |
| Administrator access | **FullControl**, plus SYSTEM on NTFS |
| Permission style | NTFS entries at share root are explicit; children inherit unless overridden |
| Additional authorized access | `NOVA\DL_FS_Finance_FullControl`: **Full/FullControl** |



**Additional Finance permission:** `NOVA\DL_FS_Finance_FullControl` has **Full** at the SMB share level and **FullControl** at the NTFS root. Nova Corp's management group is nested into this Finance FullControl permission group, giving authorized managers broader Finance access. This is deliberate; Finance is not configured exactly like the other four departments.

## People and departments

Alice Finance, Finance Test belong to the Finance OU in the documented directory. A person might have more than one authorization path through nested groups.

[Open the department directory](../DIRECTORY.md) · [Browse security groups](../GROUPS.md) · [See the permissions matrix](PERMISSIONS.md).

## What has actually been tested?

[The folder-permission investigation](../incidents/file-permission-denial.md) and [the two-fault DNS+group incident](../incidents/two-faults-one-symptom.md) show why an accessible server isn't always an accessible file. Their commands and results are available on those pages.

This page shows the **recorded share and root-folder access settings**. A per-user access result depends on that person's current groups, logon token and the precise child-folder ACL.

**[Exact ACL details](PERMISSIONS.md)** · [DFS links](DFS_PATHS.md) · [Windows file-server journal](../../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf)

[← All company file shares](SHARES.md)