# Who can access which shared folder?

Nova Corp uses **AGDLP**: user **A**ccounts join **G**lobal department groups, which are placed into **D**omain **L**ocal groups. Those Domain Local groups receive **P**ermissions on the shared resource.

## Department access — SMB and NTFS together

| Shared folder | Department group | Resource permission group | SMB | NTFS |
| --- | --- | --- | --- | --- |
| [Finance](finance.md) | `Finance_Users` | `DL_FS_Finance_Modify` | Change | Modify |
| [HR](hr.md) | `HR_Users` | `DL_FS_HR_Modify` | Change | Modify |
| [IT](it.md) | `IT_Users` | `DL_FS_IT_Modify` | Change | Modify |
| [Management](management.md) | `Management_Users` | `DL_FS_Management_Modify` | Change | Modify |
| [Sales](sales.md) | `Sales_Users` | `DL_FS_Sales_Modify` | Change | Modify |

**Finance has an additional authorization path:** `Management_Users` is nested into `DL_FS_Finance_FullControl`, which has Full access on the Finance SMB share and FullControl on its NTFS root. This is different from the standard Modify-only path.

## What does this mean for an employee?

A successful network connection to a server does **not** guarantee file permission. The user's current security-group membership, logon token, SMB share access and NTFS access are all relevant. A DENY entry on a child folder can override a broad parent allow.

[See Moyo's folder-denial incident](../incidents/file-permission-denial.md) · [See how DNS and group membership caused two separate failures](../incidents/two-faults-one-symptom.md).

## Inspect the technical rules

[Open the exact current SMB and NTFS rule tables](TECHNICAL_ACL_DETAILS.md), including Windows built-in administrators and the special DFS namespace folder permissions.

**[Browse security groups](../GROUPS.md)** · [Open DFS paths](DFS_PATHS.md) · [All shared folders](SHARES.md)
