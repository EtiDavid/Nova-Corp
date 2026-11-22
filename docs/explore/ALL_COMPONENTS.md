# Everything built and tested — Nova Corp inventory

[← Explore Nova Corp](../EXPLORE_NOVACORP.md)

This is the full guided index of the infrastructure work documented so far. Most visitors can use the [company map](../EXPLORE_NOVACORP.md) and ignore engineering record numbers; this page is for anyone who wants to check that every area is represented.

The lab grew through fifteen recorded engineering changes. Instead of making you read them in chronological order, this page groups their results by **systems, people, services, policies, network controls, automation, backup and incident evidence**.

## 1. Virtualization and core platform

| Component | What it means | Explore | Original evidence |
| --- | --- | --- | --- |
| Windows physical/outer host | The machine on which the nested lab runs | [Proxmox profile](systems/NOVA-PROX01.md) | [Platform build](../Documentation/Change-Requests/Journal-CR-001.md) |
| VMware Workstation | First virtualization layer | [Hypervisor](systems/NOVA-PROX01.md) | [Platform build](../Documentation/Change-Requests/Journal-CR-001.md) |
| Proxmox VE | Hosts the virtual company | [nova-prox01](systems/NOVA-PROX01.md) | [Platform journal](../Documentation/Change-Requests/Journal-CR-001.md) |
| Proxmox bridges and VM network interfaces | Seven NICs and two core bridges; tagged VLANs 20 and 40 for Windows guests | [vmbr0](virtualization/bridges/vmbr0.md) · [vmbr1](virtualization/bridges/vmbr1.md) | [Platform](../Documentation/Change-Requests/Journal-CR-001.md), [pfSense](../Documentation/Change-Requests/Journal-CR-002.md) |
| Proxmox `local`/`local-lvm` | VM and host storage | [local](virtualization/storages/local.md) · [local-lvm](virtualization/storages/local-lvm.md) | [Platform](../Documentation/Change-Requests/Journal-CR-001.md) |
| `nova-backup` storage | Holds six archives **and two live qcow2 disks** | [Actual storage](virtualization/storages/nova-backup.md) | [Backup journal](../Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) |
| Snapshots and VM backups | One retained snapshot, six archives, current monthly job for VMs 100/101 | [Archive & schedule](virtualization/BACKUPS.md) · [Snapshot](virtualization/snapshots/100.md) | [Phase 2 closure](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| Nested-virtualization failures | Platform troubleshooting and recovery | [Gateway fault](incidents/proxmox-default-gateway.md) · [GUI outage](incidents/proxmox-webgui-outage.md) | [Failure-testing report](../Documentation/failure-testing-report.md) |

## 2. Firewalls and all network areas

| Component | Purpose | Explore | Original evidence |
| --- | --- | --- | --- |
| pfSense CE (`nova-fw01`) | Routes, filters, resolves names and terminates VPN | [Firewall profile](systems/NOVA-FW01.md) | [Build journal](../Documentation/Change-Requests/Journal-CR-002.md) |
| WAN and outer router/port forward | Remote traffic enters lab | [Network](NETWORK.md), [VPN](services/WIREGUARD.md) | [WireGuard investigation](../Documentation/Change-Requests/Journal-CR-007.md) |
| Legacy LAN | Older internal network still identified in the current inventory | [Network](NETWORK.md) | [Architecture](../ARCHITECTURE.md) |
| MGMT / VLAN 10 | Management interface area | [Network](NETWORK.md) | [Final security review](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| INFRA / VLAN 20 | Domain Controllers and file server | [Servers](SYSTEMS.md) | [Architecture](../ARCHITECTURE.md) |
| APP / VLAN 30 | Network reserved for future apps | [Network](NETWORK.md) | [Architecture](../ARCHITECTURE.md) |
| CLIENT / VLAN 40 | Workstation network | [NOVA-CLIENT](systems/NOVA-CLIENT.md) | [Client baseline](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| DMZ / VLAN 50 | Network reserved for future public services | [Network](NETWORK.md) | [Architecture](../ARCHITECTURE.md) |
| VPN_REMOTE / WireGuard tunnel | Remote peer network, not an 802.1Q VLAN | [VPN_REMOTE](network/zones/VPN_REMOTE.md) | [Remote-access journal](../Documentation/Change-Requests/Journal-CR-007.md) |
| DHCP, gateways, routing and NAT | Six enabled DHCP pools, automatic outbound NAT, dynamic WAN gateway | [DHCP](network/DHCP.md) · [NAT/gateways](network/NAT_AND_GATEWAYS.md) | [pfSense journal](../Documentation/Change-Requests/Journal-CR-002.md) |
| Firewall rule order/aliases | 17 individual filter rules and 5 named aliases | [Every rule](network/RULES.md) · [All aliases](network/ALIASES.md) | [VPN/firewall tests](../Documentation/Change-Requests/Journal-CR-007.md) |
| WireGuard peer/authentication | Encrypts remote traffic and authenticates peers | [VPN](services/WIREGUARD.md) | [Handshake failure/repair](../Documentation/Change-Requests/Journal-CR-007.md) |
| DNS Resolver / domain forwarding | Connects pfSense DNS behavior with company DNS | [DNS](services/DNS.md) | [DNS setup](../Documentation/Change-Requests/Journal-CR-003.md) |
| Management-page hardening | Normal client can no longer access forbidden management path | [Firewall](services/FIREWALL.md) | [Closure evidence](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| IPv4/IPv6 regression | Ensures the repaired security path does not bypass intended design | [Tests](TESTS_AND_RECOVERY.md) | [Final validation](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |

## 3. Directory, identity and domain-service components

| Component | What it provides | Explore |
| --- | --- | --- |
| `nova.corp` domain/forest | Shared identity boundary | [Active Directory](services/ACTIVE_DIRECTORY.md) |
| NOVA-DC01 | Domain Controller and DNS | [DC01](systems/NOVA-DC01.md) |
| NOVA-DC02 | Second writable Domain Controller and DNS | [DC02](systems/NOVA-DC02.md) |
| DNS A and SRV records | Names and service discovery | [DNS](services/DNS.md) |
| Kerberos / KDC | Ticket-based authentication | [Kerberos](services/KERBEROS.md) |
| LDAP | Directory queries | [LDAP](services/LDAP.md) |
| Global Catalog | Forest-wide directory discovery | [AD DS](services/ACTIVE_DIRECTORY.md) |
| SYSVOL and NETLOGON | Domain shared policy/logon files | [SYSVOL/NETLOGON](services/SYSVOL_NETLOGON.md) |
| DFS Replication / AD replication | Directory/policy consistency across DCs | [DC02 resilience](systems/NOVA-DC02.md) |
| FSMO roles | Single-master directory operations | [DC02](systems/NOVA-DC02.md) |
| Windows time hierarchy | Correct time for AD/Kerberos | [Kerberos](services/KERBEROS.md) |
| AD Recycle Bin | Deleted directory object recovery | [Recovery](services/BACKUPS.md) |
| Parent and child OUs | Organized people/computers | [OU tree](DIRECTORY.md) |
| Standard/test/admin/service accounts | People and special-purpose identities | [People](PEOPLE_AND_DEPARTMENTS.md) |
| Department global groups | Business role membership | [Groups](GROUPS.md) |
| Domain Local permission groups | Resource-specific access | [Groups](GROUPS.md) |
| Account lockout/password controls | Domain credential-policy behavior | [Policies](POLICIES.md) |
| DC outage and divergence testing | Resilience and recovery proof | [Incidents](TESTS_AND_RECOVERY.md) |

**Engineering sources:** [AD install](../Documentation/Change-Requests/Journal-CR-003.md) · [DC02 setup](../Documentation/Change-Requests/Journal-CR-004.md) · [OU/groups/accounts](../Documentation/Change-Requests/Journal-CR-005.md) · [AD resilience](../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md).

## 4. People, groups, OUs and policy

| Item | Where to open |
| --- | --- |
| Parent OUs and department OU hierarchy | [Directory](DIRECTORY.md) |
| IT, Finance, HR, Management and Sales | [Departments](people/DEPARTMENTS.md) |
| Contractor test account | [John Shaw](people/JOHN_SHAW.md) |
| IT identities | [David](people/DAVID.md), [Moyo](people/MOYO.md) |
| Service accounts `svc_backup`, `svc_monitoring`, `svc_fileserver` | [Directory](DIRECTORY.md) |
| Global groups `IT_Users`, `Finance_Users`, `HR_Users`, `Sales_Users`, `Management_Users` | [Groups](GROUPS.md) |
| Domain Local file groups `DL_FS_IT_Modify`, `DL_FS_Finance_Modify`, `DL_FS_Finance_FullControl` | [Groups](GROUPS.md) |
| Default Domain Policy: password, lockout, Kerberos | [Domain policy](policies/DOMAIN_PASSWORD.md) |
| Default Domain Controllers Policy: rights, signing and keyboard-layout preferences | [DC policy](policies/DEFAULT_DC.md) |
| Corporate wallpaper (`Coperate` in the actual GPO name) | [Wallpaper policy](policies/WALLPAPER.md) |
| `Nova Corp - Keyboard` — unlinked/empty GPO | [Keyboard policy](policies/KEYBOARD.md) |
| Contractor removable-storage restriction (two settings) | [Contractor policy](policies/CONTRACTOR_USB.md) |
| Workstation firewall/AutoPlay/SMBv1 baseline | [Workstation policy](policies/WORKSTATION_BASELINE.md) |
| Departmental drive-mapping logon script GPO | [Drive mapping](policies/DRIVE_MAPPING.md) |
| USB exception design and user-lockdown tabletop exercise | [Original Group Policy work](../Documentation/Change-Requests/Journal-CR-006.md) |
| Seven-GPO backup and current seven-report/6-link export | [All seven verified current GPOs](POLICIES.md) |

[Original GPO journal with screenshots](../Documentation/Change-Requests/Journal-CR-006.md).

## 5. File services, shares and storage recovery

| Component | Where it connects |
| --- | --- |
| NOVA-FILES01 Windows Server | [File server](systems/NOVA-FILES01.md) |
| Windows File Server role | [SMB](services/SMB.md) |
| IT, Finance, HR, Sales and Management folders | [Departmental access](FILE_SERVICES.md) |
| Domain Local permissions / AGDLP | [Groups](GROUPS.md) |
| SMB share ACL and NTFS folder ACL | [SMB](services/SMB.md) |
| Mapped network drives | [File services](FILE_SERVICES.md) |
| Domain DFS Namespace `\\nova.corp\shares` | [DFS](services/DFS.md) |
| Shadow Copies / Previous Versions / VSS | [VSS](services/VSS.md) |
| FILES01 backup disk `B:` | [Backups](services/BACKUPS.md) |
| Windows Server Backup and file restore | [Recovery](services/BACKUPS.md) |
| Real user allow/deny tests | [Moyo](people/MOYO.md) |
| Recovery hash verification | [Incident evidence](TESTS_AND_RECOVERY.md) |

**Full file-service history:** [FILES01 deployment PDF](../Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) · [shares PDF](../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) · [DFS/Shadow Copy PDF](../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf).

## 6. PowerShell automation — all eight tools

| Script | Open |
| --- | --- |
| `New-BulkUsers.ps1` | [Administration toolkit](AUTOMATION.md) |
| `Get-InactiveUsers.ps1` | [Administration toolkit](AUTOMATION.md) |
| `Disable-OffboardedUser.ps1` | [Administration toolkit](AUTOMATION.md) |
| `Get-GroupMembership.ps1` | [Administration toolkit](AUTOMATION.md) |
| `Test-UserAccess.ps1` | [Administration toolkit](AUTOMATION.md) |
| `Get-LockedAccounts.ps1` | [Administration toolkit](AUTOMATION.md) |
| `Reset-UserPassword.ps1` | [Administration toolkit](AUTOMATION.md) |
| `Get-ADComputerReport.ps1` | [Administration toolkit](AUTOMATION.md) |

The toolkit also documents half-created-user rollback, idempotency, group-name matching, account lockout, password resets, output checks, parser validation, SHA-256 and a frozen v1.0.0 release.

[Full script-by-script journal](../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

## 7. Backup targets, snapshots, recovery and monitoring

| Protected area | Mechanism | Explore |
| --- | --- | --- |
| Proxmox VMs | VM backup repository `nova-backup` | [Backup](services/BACKUPS.md) |
| pfSense | Named snapshot, VM archive and private config-level recovery copy | [Recovery](services/BACKUPS.md) |
| FILES01 | Windows Server Backup, guest `B:` target | [Backup](services/BACKUPS.md) |
| DC01 | Windows Server Backup System State | [Backup](services/BACKUPS.md) |
| Earlier file version | Shadow Copies | [VSS](services/VSS.md) |
| Deleted AD object | AD Recycle Bin | [Active Directory](services/ACTIVE_DIRECTORY.md) |
| Backup freshness/free space | Scheduled monitoring/health checks from backup project | [Operations](OPERATIONS.md) |
| AD/DNS/GPO/DFS/SMB/service checks | Manual health and alert design | [Operations](OPERATIONS.md) |
| Snapshot capacity | Historical cleanup/retenion | [Proxmox](systems/NOVA-PROX01.md) |

## 8. Tested faults and actual repairs

[All incidents and test results →](TESTS_AND_RECOVERY.md)

The documented test history includes nested virtualization, infrastructure migration, VPN handshake, account creation, account lockout, group-access analysis, file permissions, DNS, Group Policy, backup-target outage, DC outage, replication divergence, combined DNS/authorization failure, management-access exposure and snapshot capacity.

## 9. Original engineering record numbers

<details><summary><strong>Open the full record for each project (CR-001 to CR-015)</strong></summary>

| Record | Work completed | Source |
| --- | --- | --- |
| 001 | Virtualization platform | [Read](../Documentation/Change-Requests/Journal-CR-001.md) |
| 002 | pfSense/network foundation | [Read](../Documentation/Change-Requests/Journal-CR-002.md) |
| 003 | Active Directory/DNS | [Read](../Documentation/Change-Requests/Journal-CR-003.md) |
| 004 | Second Domain Controller/HA | [Read](../Documentation/Change-Requests/Journal-CR-004.md) |
| 005 | OU, user, groups and service accounts | [Read](../Documentation/Change-Requests/Journal-CR-005.md) |
| 006 | Group Policy | [Read](../Documentation/Change-Requests/Journal-CR-006.md) |
| 007 | WireGuard VPN | [Read](../Documentation/Change-Requests/Journal-CR-007.md) |
| 008 | File server | [PDF](../Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) |
| 009 | Shares & drive mapping | [PDF](../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) |
| 010 | DFS & Shadow Copies | [PDF](../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) |
| 011 | PowerShell toolkit | [Read](../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) |
| 012 | Backup and recovery | [Read](../Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md) |
| 013 | AD resilience | [Read](../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| 014 | Incidents | [Read](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| 015 | Closure and security regression | [Read](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |

</details>

**The distinction:** all fifteen documented changes are indexed here, but some individual live settings (such as the exact current order of every pfSense rule or the latest complete AD membership list) are not represented as immutable facts because those settings can change. The deep journals and dated test results remain the historical source.

[← Back to the company](../EXPLORE_NOVACORP.md)