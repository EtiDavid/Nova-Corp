---
title: "HR shared folder — who can open it?"
sourcePath: "docs/explore/files/hr.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/hr.md"
section: "explore"
---

# HR shared folder — who can open it?

**Purpose:** Human Resources documents.  
**Server:** [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/) · **Network:** [INFRA](/reference/explore/network/zones/INFRA/).

## Start with the folder

A member of the HR department uses the familiar path:

```text
\\nova.corp\shares\HR
```

That path enters the [company's DFS namespace](/reference/explore/files/DFS_PATHS/), which points to the real share:

```text
\\NOVA-FILES01\HR
    → D:\NovaData\HR
```

## How access works

```mermaid
flowchart LR
  U["HR user"] --> G["HR_Users"]
  G --> DL["DL_FS_HR_Modify"]
  DL --> S["SMB: Change"]
  S --> N["NTFS: Modify"]
  N --> F["HR folder"]
```

The Global group organizes HR users. The Domain Local group is the identity written into the file permissions. Both the network share permission and NTFS permission must allow the requested action.

| Access layer | Actual setting |
|---|---|
| Department Global group | `HR_Users` |
| Resource permission group | `NOVA\DL_FS_HR_Modify` |
| SMB share access | **Allow · Change** |
| NTFS root folder access | **Allow · Modify** |
| Administrator access | **FullControl**, plus SYSTEM on NTFS |
| Permission style | NTFS entries at share root are explicit; children inherit unless overridden |



## People and departments

Henry HumanResources, HR Test belong to the HR OU in the documented directory. A person might have more than one authorization path through nested groups.

[Open the department directory](/reference/explore/DIRECTORY/) · [Browse security groups](/reference/explore/GROUPS/) · [See the permissions matrix](/reference/explore/files/PERMISSIONS/).

## What has actually been tested?

[The folder-permission investigation](/reference/explore/incidents/file-permission-denial/) and [the two-fault DNS+group incident](/reference/explore/incidents/two-faults-one-symptom/) show why an accessible server isn't always an accessible file. Their commands and results are available on those pages.

This page shows the **recorded share and root-folder access settings**. A per-user access result depends on that person's current groups, logon token and the precise child-folder ACL.

**[Exact ACL details](/reference/explore/files/PERMISSIONS/)** · [DFS links](/reference/explore/files/DFS_PATHS/) · [Windows file-server journal](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/)

[← All company file shares](/reference/explore/files/SHARES/)