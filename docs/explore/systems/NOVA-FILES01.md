# NOVA-FILES01 — Shared File Server

**Role:** Departmental storage, DFS, Shadow Copies and Windows Server Backup · **Address:** `10.10.20.20`

## Why it exists

An IT department needs controlled shared folders. Nova Corp uses a file server rather than putting company documents on individual workstations.

Access depends on the user's identity and group membership, plus both **SMB share permissions** and **NTFS file permissions**.

## Inside this server

| Open | Purpose |
| --- | --- |
| [Explore all five departmental shares](../files/SHARES.md) | Opens real share paths, linked people and permissions. |
| [Department access matrix](../files/PERMISSIONS.md) | Which groups can access each resource, including Finance's extra permission. |
| [Five DFS link targets](../files/DFS_PATHS.md) | The company path and where each link really points. |
| [30 Shadow Copy objects](../files/VSS.md) | Earlier file versions and their limitations. |
| [Windows volumes](../files/VOLUMES.md) | D: company data, B: backup destination and available space. |

## Technical profile

| Item | Documented baseline |
| --- | --- |
| Host | `NOVA-FILES01.nova.corp` |
| OS | Windows Server 2025 Standard |
| Address | `10.10.20.20/24` |
| Network | INFRA / VLAN 20 |
| Roles | File Server, DFS Namespace, Windows Server Backup |
| Services | LanmanServer, DFS |
| Backup disk | Dedicated Windows backup volume `B:` |
| Domain namespace | `\\nova.corp\shares` |

## Access in action

[**Moyo's IT access example →**](../people/MOYO.md)

The validation showed that Moyo could open the IT path but was denied access to the Finance path. Both allowed and denied tests matter.

## Backups and incidents

The backup target was deliberately taken offline, causing a real backup failure. After repairing the target and taking a new backup, a disposable file was restored and verified with matching SHA-256.

[See the recovery proof](../services/BACKUPS.md) · [Read the incident summary](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md)

## Engineering journals

[File server deployment PDF](../../Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) · [Departmental shares PDF](../../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) · [DFS and Shadow Copies PDF](../../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf)

[← All systems](../SYSTEMS.md)