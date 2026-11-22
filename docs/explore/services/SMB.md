# SMB — Shared folders over the network

**SMB (Server Message Block)** is the file-sharing protocol used by Nova Corp Windows computers to access shared folders.

**File server:** [NOVA-FILES01](../systems/NOVA-FILES01.md)  
**Client:** [NOVA-CLIENT](../systems/NOVA-CLIENT.md)

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

[Follow Moyo's access path](../people/MOYO.md) · [Five company shares](../files/SHARES.md) · [All 27 SMB permission entries](../files/TECHNICAL_ACL_DETAILS.md) · [Groups](../GROUPS.md).

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

**Documentation:** [Departmental permissions](../../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) · [Access analysis and real tests](../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).