---
title: "Sales shared folder — who can open it?"
sourcePath: "docs/explore/files/sales.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/sales.md"
section: "explore"
---

# Sales shared folder — who can open it?

**Purpose:** Sales department documents.  
**Server:** [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/) · **Network:** [INFRA](/reference/explore/network/zones/INFRA/).

## Start with the folder

A member of the Sales department uses the familiar path:

```text
\\nova.corp\shares\Sales
```

That path enters the [company's DFS namespace](/reference/explore/files/DFS_PATHS/), which points to the real share:

```text
\\NOVA-FILES01\Sales
    → D:\NovaData\Sales
```

## How access works

```mermaid
flowchart LR
  U["Sales user"] --> G["Sales_Users"]
  G --> DL["DL_FS_Sales_Modify"]
  DL --> S["SMB: Change"]
  S --> N["NTFS: Modify"]
  N --> F["Sales folder"]
```

The Global group organizes Sales users. The Domain Local group is the identity written into the file permissions. Both the network share permission and NTFS permission must allow the requested action.

| Access layer | Actual setting |
|---|---|
| Department Global group | `Sales_Users` |
| Resource permission group | `NOVA\DL_FS_Sales_Modify` |
| SMB share access | **Allow · Change** |
| NTFS root folder access | **Allow · Modify** |
| Administrator access | **FullControl**, plus SYSTEM on NTFS |
| Permission style | NTFS entries at share root are explicit; children inherit unless overridden |



## People and departments

Sales Test belong to the Sales OU in the documented directory. A person might have more than one authorization path through nested groups.

[Open the department directory](/reference/explore/DIRECTORY/) · [Browse security groups](/reference/explore/GROUPS/) · [See the permissions matrix](/reference/explore/files/PERMISSIONS/).

## What has actually been tested?

[The folder-permission investigation](/reference/explore/incidents/file-permission-denial/) and [the two-fault DNS+group incident](/reference/explore/incidents/two-faults-one-symptom/) show why an accessible server isn't always an accessible file. Their commands and results are available on those pages.

This page shows the **recorded share and root-folder access settings**. A per-user access result depends on that person's current groups, logon token and the precise child-folder ACL.

**[Exact ACL details](/reference/explore/files/PERMISSIONS/)** · [DFS links](/reference/explore/files/DFS_PATHS/) · [Windows file-server journal](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/)

[← All company file shares](/reference/explore/files/SHARES/)