---
title: "Who can access which shared folder?"
sourcePath: "docs/explore/files/PERMISSIONS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/PERMISSIONS.md"
section: "explore"
---

# Who can access which shared folder?

Nova Corp uses **AGDLP**: user **A**ccounts join **G**lobal department groups, which are placed into **D**omain **L**ocal groups. Those Domain Local groups receive **P**ermissions on the shared resource.

## Department access — SMB and NTFS together

| Shared folder | Department group | Resource permission group | SMB | NTFS |
| --- | --- | --- | --- | --- |
| [Finance](/reference/explore/files/finance/) | `Finance_Users` | `DL_FS_Finance_Modify` | Change | Modify |
| [HR](/reference/explore/files/hr/) | `HR_Users` | `DL_FS_HR_Modify` | Change | Modify |
| [IT](/reference/explore/files/it/) | `IT_Users` | `DL_FS_IT_Modify` | Change | Modify |
| [Management](/reference/explore/files/management/) | `Management_Users` | `DL_FS_Management_Modify` | Change | Modify |
| [Sales](/reference/explore/files/sales/) | `Sales_Users` | `DL_FS_Sales_Modify` | Change | Modify |

**Finance has an additional authorization path:** `Management_Users` is nested into `DL_FS_Finance_FullControl`, which has Full access on the Finance SMB share and FullControl on its NTFS root. This is different from the standard Modify-only path.

## What does this mean for an employee?

A successful network connection to a server does **not** guarantee file permission. The user's current security-group membership, logon token, SMB share access and NTFS access are all relevant. A DENY entry on a child folder can override a broad parent allow.

[See Moyo's folder-denial incident](/reference/explore/incidents/file-permission-denial/) · [See how DNS and group membership caused two separate failures](/reference/explore/incidents/two-faults-one-symptom/).

## Inspect the technical rules

[Open the exact current SMB and NTFS rule tables](/reference/explore/files/TECHNICAL_ACL_DETAILS/), including Windows built-in administrators and the special DFS namespace folder permissions.

**[Browse security groups](/reference/explore/GROUPS/)** · [Open DFS paths](/reference/explore/files/DFS_PATHS/) · [All shared folders](/reference/explore/files/SHARES/)
