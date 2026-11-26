---
title: "SMB — Shared folders over the network"
sourcePath: "docs/explore/services/SMB.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/services/SMB.md"
section: "explore"
---

# SMB — Shared folders over the network

**SMB (Server Message Block)** is the file-sharing protocol used by Nova Corp Windows computers to access shared folders.

**File server:** [NOVA-FILES01](/reference/explore/systems/NOVA-FILES01/)  
**Client:** [NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/)

## How access works

```text
Windows account → AD group membership
                    ↓
                SMB share ACL
                    ↓
                NTFS folder ACL
                    ↓
            Allowed or denied result
```

An authenticated user is not automatically authorized to read every company folder.

## Tested example

For the IT user **Moyo**, the access analysis showed:

- Member of `IT_Users` and `DL_FS_IT_Modify`.
- IT share: **ALLOW**.
- Finance share: **DENY**.

The result was then checked from a real user session, not just predicted from an administrative script.

[Follow Moyo's access path](/reference/explore/people/MOYO/) · [Five company shares](/reference/explore/files/SHARES/) · [All 27 SMB permission entries](/reference/explore/files/TECHNICAL_ACL_DETAILS/) · [Groups](/reference/explore/GROUPS/).

## Troubleshooting

First separate DNS from network connectivity and authorization.

<details><summary><strong>Test a file-server path</strong></summary>

```powershell
Resolve-DnsName nova-files01.nova.corp
Test-NetConnection nova-files01.nova.corp -Port 445
Test-Path "\\nova.corp\shares\IT"
```

A positive path and a denied path should both be tested.

</details>

**Documentation:** [Departmental permissions](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) · [Access analysis and real tests](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).