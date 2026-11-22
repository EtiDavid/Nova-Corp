# Welcome to Nova Corp

**A fictional company built as a real, hands-on IT infrastructure lab.**

Imagine that you've joined Nova Corp. Employees need to sign in, teams need shared files, servers need to communicate, security rules need to work, and lost data needs to be recoverable.

You can explore those parts of the company here. Every highlighted system, service, policy or test leads to its related parts and, when you want it, the original engineering documentation.

## Choose where to go

| Area | What you'll find |
| --- | --- |
| 🖥️ **[IT Control Room — Servers and computers](explore/SYSTEMS.md)** | The firewall, hypervisor, two Domain Controllers, file server and workstation. |
| 🔑 **[Identity Office — Active Directory](explore/services/ACTIVE_DIRECTORY.md)** | Login, DNS, Kerberos, LDAP, directory objects, replication and recovery. |
| 🧑‍💼 **[People and Departments](explore/PEOPLE_AND_DEPARTMENTS.md)** | The company’s organizational units, staff/test identities and groups. |
| 🌐 **[Network Gatehouse — pfSense](explore/NETWORK.md)** | Network zones, routing, VPN, firewall paths and tested restrictions. |
| 📁 **[File & Records Room](explore/FILE_SERVICES.md)** | Department folders, SMB/NTFS access, DFS and file recovery. |
| 🛡️ **[Workstation Rules — Group Policy](explore/POLICIES.md)** | Domain password controls, wallpaper, USB restrictions, workstation security and validation. |
| ⚙️ **[Administration Toolkit](explore/AUTOMATION.md)** | Eight PowerShell scripts that automate user and computer administration. |
| ♻️ **[Backup & Recovery Center](explore/services/BACKUPS.md)** | What is backed up, where recovery copies go, and what restoring a file proved. |
| 🧪 **[Incident Lab — Tests & Failures](explore/TESTS_AND_RECOVERY.md)** | DNS, GPO, permissions, backup, DC and firewall mistakes with repairs. |
| 📋 **[Operations Room](explore/OPERATIONS.md)** | How the environment is checked, recovered and maintained. |

**[Browse the current company directory — every user, OU, company group and registered computer](explore/DIRECTORY_SNAPSHOT_2026-11-22.md)**

## Take one connected journey

A person wants to open an IT file. What needs to work?

```mermaid
flowchart LR
    M["Moyo · IT"] --> AD["Active Directory"]
    AD --> DNS["DNS / Kerberos"]
    AD --> G["IT_Users group"]
    G --> DL["DL_FS_IT_Modify"]
    DL --> FS["NOVA-FILES01"]
    FS --> SMB["SMB + NTFS"]
    SMB --> OK["IT share: allowed"]
```

**Follow it:** [Moyo](explore/people/MOYO.md) → [Active Directory](explore/services/ACTIVE_DIRECTORY.md) → [IT_Users](explore/GROUPS.md#it_users) → [SMB and NTFS](explore/services/SMB.md) → [IT share](explore/FILE_SERVICES.md#it) → [Verified access test](explore/TESTS_AND_RECOVERY.md).

A second path explores an outage:

[DC01](explore/systems/NOVA-DC01.md) → [DC02](explore/systems/NOVA-DC02.md) → [DNS](explore/services/DNS.md) → [Kerberos](explore/services/KERBEROS.md) → [Failover test](explore/TESTS_AND_RECOVERY.md).

## See how it all fits together

[Current architecture and network zones](ARCHITECTURE.md) · [All areas and work completed](explore/ALL_COMPONENTS.md) · [Engineering evidence archive](Documentation/Change-Requests/README.md).

<details><summary><strong>Why there are also documents called CR-001, CR-002 and so on</strong></summary>

A **Change Request (CR)** is how the original work was documented. Each change has a business purpose, implementation, tests, failures and recovery notes.

You don't need to use those numbers to explore Nova Corp. They're linked as the detailed engineering evidence behind the company.

</details>

*The pages describe the tested lab, not a live connection to the machines. Actual configuration can change as the lab grows.*