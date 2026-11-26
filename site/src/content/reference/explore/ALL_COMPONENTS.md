---
title: "Everything built and tested — Nova Corp inventory"
sourcePath: "docs/explore/ALL_COMPONENTS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/ALL_COMPONENTS.md"
section: "explore"
---

# Everything built and tested — Nova Corp inventory

[← Explore Nova Corp](/reference/EXPLORE_NOVACORP/)

This is the full guided index of the infrastructure work documented so far. Most visitors can use the [company map](/reference/EXPLORE_NOVACORP/) and ignore engineering record numbers; this page is for anyone who wants to check that every area is represented.

The lab grew through fifteen recorded engineering changes. Instead of making you read them in chronological order, this page groups their results by **systems, people, services, policies, network controls, automation, backup and incident evidence**.

## 1. Virtualization and core platform

| Component | What it means | Explore | Original evidence |
| --- | --- | --- | --- |
| Windows physical/outer host | The machine on which the nested lab runs | [Proxmox profile](/reference/explore/systems/NOVA-PROX01/) | [Platform build](/reference/Documentation/Change-Requests/Journal-CR-001/) |
| VMware Workstation | First virtualization layer | [Hypervisor](/reference/explore/systems/NOVA-PROX01/) | [Platform build](/reference/Documentation/Change-Requests/Journal-CR-001/) |
| Proxmox VE | Hosts the virtual company | [nova-prox01](/reference/explore/systems/NOVA-PROX01/) | [Platform journal](/reference/Documentation/Change-Requests/Journal-CR-001/) |
| Proxmox bridges and VM network interfaces | Seven NICs and two core bridges; tagged VLANs 20 and 40 for Windows guests | [vmbr0](/reference/explore/virtualization/bridges/vmbr0/) · [vmbr1](/reference/explore/virtualization/bridges/vmbr1/) | [Platform](/reference/Documentation/Change-Requests/Journal-CR-001/), [pfSense](/reference/Documentation/Change-Requests/Journal-CR-002/) |
| Proxmox `local`/`local-lvm` | VM and host storage | [local](/reference/explore/virtualization/storages/local/) · [local-lvm](/reference/explore/virtualization/storages/local-lvm/) | [Platform](/reference/Documentation/Change-Requests/Journal-CR-001/) |
| `nova-backup` storage | Holds six archives **and two live qcow2 disks** | [Actual storage](/reference/explore/virtualization/storages/nova-backup/) | [Backup journal](/reference/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal/) |
| Snapshots and VM backups | One retained snapshot, six archives, current monthly job for VMs 100/101 | [Archive & schedule](/reference/explore/virtualization/BACKUPS/) · [Snapshot](/reference/explore/virtualization/snapshots/100/) | [Phase 2 closure](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |
| Nested-virtualization failures | Platform troubleshooting and recovery | [Gateway fault](/reference/explore/incidents/proxmox-default-gateway/) · [GUI outage](/reference/explore/incidents/proxmox-webgui-outage/) | [Failure-testing report](/reference/Documentation/failure-testing-report/) |

## 2. Firewalls and all network areas

| Component | Purpose | Explore | Original evidence |
| --- | --- | --- | --- |
| pfSense CE (`nova-fw01`) | Routes, filters, resolves names and terminates VPN | [Firewall profile](/reference/explore/systems/NOVA-FW01/) | [Build journal](/reference/Documentation/Change-Requests/Journal-CR-002/) |
| WAN and outer router/port forward | Remote traffic enters lab | [Network](/reference/explore/NETWORK/), [VPN](/reference/explore/services/WIREGUARD/) | [WireGuard investigation](/reference/Documentation/Change-Requests/Journal-CR-007/) |
| Legacy LAN | Older internal network still identified in the current inventory | [Network](/reference/explore/NETWORK/) | [Architecture](/reference/ARCHITECTURE/) |
| MGMT / VLAN 10 | Management interface area | [Network](/reference/explore/NETWORK/) | [Final security review](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |
| INFRA / VLAN 20 | Domain Controllers and file server | [Servers](/reference/explore/SYSTEMS/) | [Architecture](/reference/ARCHITECTURE/) |
| APP / VLAN 30 | Network reserved for future apps | [Network](/reference/explore/NETWORK/) | [Architecture](/reference/ARCHITECTURE/) |
| CLIENT / VLAN 40 | Workstation network | [NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/) | [Client baseline](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |
| DMZ / VLAN 50 | Network reserved for future public services | [Network](/reference/explore/NETWORK/) | [Architecture](/reference/ARCHITECTURE/) |
| VPN_REMOTE / WireGuard tunnel | Remote peer network, not an 802.1Q VLAN | [VPN_REMOTE](/reference/explore/network/zones/VPN_REMOTE/) | [Remote-access journal](/reference/Documentation/Change-Requests/Journal-CR-007/) |
| DHCP, gateways, routing and NAT | Six enabled DHCP pools, automatic outbound NAT, dynamic WAN gateway | [DHCP](/reference/explore/network/DHCP/) · [NAT/gateways](/reference/explore/network/NAT_AND_GATEWAYS/) | [pfSense journal](/reference/Documentation/Change-Requests/Journal-CR-002/) |
| Firewall rule order/aliases | 17 individual filter rules and 5 named aliases | [Every rule](/reference/explore/network/RULES/) · [All aliases](/reference/explore/network/ALIASES/) | [VPN/firewall tests](/reference/Documentation/Change-Requests/Journal-CR-007/) |
| WireGuard peer/authentication | Encrypts remote traffic and authenticates peers | [VPN](/reference/explore/services/WIREGUARD/) | [Handshake failure/repair](/reference/Documentation/Change-Requests/Journal-CR-007/) |
| DNS Resolver / domain forwarding | Connects pfSense DNS behavior with company DNS | [DNS](/reference/explore/services/DNS/) | [DNS setup](/reference/Documentation/Change-Requests/Journal-CR-003/) |
| Management-page hardening | Normal client can no longer access forbidden management path | [Firewall](/reference/explore/services/FIREWALL/) | [Closure evidence](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |
| IPv4/IPv6 regression | Ensures the repaired security path does not bypass intended design | [Tests](/reference/explore/TESTS_AND_RECOVERY/) | [Final validation](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |

## 3. Directory, identity and domain-service components

| Component | What it provides | Explore |
| --- | --- | --- |
| `nova.corp` domain/forest | Shared identity boundary | [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) |
| NOVA-DC01 | Domain Controller and DNS | [DC01](/reference/explore/systems/NOVA-DC01/) |
| NOVA-DC02 | Second writable Domain Controller and DNS | [DC02](/reference/explore/systems/NOVA-DC02/) |
| DNS A and SRV records | Names and service discovery | [DNS](/reference/explore/services/DNS/) |
| Kerberos / KDC | Ticket-based authentication | [Kerberos](/reference/explore/services/KERBEROS/) |
| LDAP | Directory queries | [LDAP](/reference/explore/services/LDAP/) |
| Global Catalog | Forest-wide directory discovery | [AD DS](/reference/explore/services/ACTIVE_DIRECTORY/) |
| SYSVOL and NETLOGON | Domain shared policy/logon files | [SYSVOL/NETLOGON](/reference/explore/services/SYSVOL_NETLOGON/) |
| DFS Replication / AD replication | Directory/policy consistency across DCs | [DC02 resilience](/reference/explore/systems/NOVA-DC02/) |
| FSMO roles | Single-master directory operations | [DC02](/reference/explore/systems/NOVA-DC02/) |
| Windows time hierarchy | Correct time for AD/Kerberos | [Kerberos](/reference/explore/services/KERBEROS/) |
| AD Recycle Bin | Deleted directory object recovery | [Recovery](/reference/explore/services/BACKUPS/) |
| Parent and child OUs | Organized people/computers | [OU tree](/reference/explore/DIRECTORY/) |
| Standard/test/admin/service accounts | People and special-purpose identities | [People](/reference/explore/PEOPLE_AND_DEPARTMENTS/) |
| Department global groups | Business role membership | [Groups](/reference/explore/GROUPS/) |
| Domain Local permission groups | Resource-specific access | [Groups](/reference/explore/GROUPS/) |
| Account lockout/password controls | Domain credential-policy behavior | [Policies](/reference/explore/POLICIES/) |
| DC outage and divergence testing | Resilience and recovery proof | [Incidents](/reference/explore/TESTS_AND_RECOVERY/) |

**Engineering sources:** [AD install](/reference/Documentation/Change-Requests/Journal-CR-003/) · [DC02 setup](/reference/Documentation/Change-Requests/Journal-CR-004/) · [OU/groups/accounts](/reference/Documentation/Change-Requests/Journal-CR-005/) · [AD resilience](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/).

## 4. People, groups, OUs and policy

| Item | Where to open |
| --- | --- |
| Parent OUs and department OU hierarchy | [Directory](/reference/explore/DIRECTORY/) |
| IT, Finance, HR, Management and Sales | [Departments](/reference/explore/people/DEPARTMENTS/) |
| Contractor test account | [John Shaw](/reference/explore/people/JOHN_SHAW/) |
| IT identities | [David](/reference/explore/people/DAVID/), [Moyo](/reference/explore/people/MOYO/) |
| Service accounts `svc_backup`, `svc_monitoring`, `svc_fileserver` | [Directory](/reference/explore/DIRECTORY/) |
| Global groups `IT_Users`, `Finance_Users`, `HR_Users`, `Sales_Users`, `Management_Users` | [Groups](/reference/explore/GROUPS/) |
| Domain Local file groups `DL_FS_IT_Modify`, `DL_FS_Finance_Modify`, `DL_FS_Finance_FullControl` | [Groups](/reference/explore/GROUPS/) |
| Default Domain Policy: password, lockout, Kerberos | [Domain policy](/reference/explore/policies/DOMAIN_PASSWORD/) |
| Default Domain Controllers Policy: rights, signing and keyboard-layout preferences | [DC policy](/reference/explore/policies/DEFAULT_DC/) |
| Corporate wallpaper (`Coperate` in the actual GPO name) | [Wallpaper policy](/reference/explore/policies/WALLPAPER/) |
| `Nova Corp - Keyboard` — unlinked/empty GPO | [Keyboard policy](/reference/explore/policies/KEYBOARD/) |
| Contractor removable-storage restriction (two settings) | [Contractor policy](/reference/explore/policies/CONTRACTOR_USB/) |
| Workstation firewall/AutoPlay/SMBv1 baseline | [Workstation policy](/reference/explore/policies/WORKSTATION_BASELINE/) |
| Departmental drive-mapping logon script GPO | [Drive mapping](/reference/explore/policies/DRIVE_MAPPING/) |
| USB exception design and user-lockdown tabletop exercise | [Original Group Policy work](/reference/Documentation/Change-Requests/Journal-CR-006/) |
| Seven configured policies, six active links, and a preserved policy backup | [All seven verified current GPOs](/reference/explore/POLICIES/) |

[Original GPO journal with screenshots](/reference/Documentation/Change-Requests/Journal-CR-006/).

## 5. File services, shares and storage recovery

| Component | Where it connects |
| --- | --- |
| NOVA-FILES01 Windows Server | [File server](/reference/explore/systems/NOVA-FILES01/) |
| Windows File Server role | [SMB](/reference/explore/services/SMB/) |
| IT, Finance, HR, Sales and Management folders | [Departmental access](/reference/explore/FILE_SERVICES/) |
| Domain Local permissions / AGDLP | [Groups](/reference/explore/GROUPS/) |
| SMB share ACL and NTFS folder ACL | [SMB](/reference/explore/services/SMB/) |
| Mapped network drives | [File services](/reference/explore/FILE_SERVICES/) |
| Domain DFS Namespace `\\nova.corp\shares` | [DFS](/reference/explore/services/DFS/) |
| Shadow Copies / Previous Versions / VSS | [VSS](/reference/explore/services/VSS/) |
| FILES01 backup disk `B:` | [Backups](/reference/explore/services/BACKUPS/) |
| Windows Server Backup and file restore | [Recovery](/reference/explore/services/BACKUPS/) |
| Real user allow/deny tests | [Moyo](/reference/explore/people/MOYO/) |
| Recovery hash verification | [Incident evidence](/reference/explore/TESTS_AND_RECOVERY/) |

**Full file-service history:** [FILES01 deployment PDF](/journals/NovaCorp_CR-008_File_Server_Deployment_Journal/) · [shares PDF](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) · [DFS/Shadow Copy PDF](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/).

## 6. PowerShell automation — all eight tools

| Script | Open |
| --- | --- |
| `New-BulkUsers.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |
| `Get-InactiveUsers.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |
| `Disable-OffboardedUser.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |
| `Get-GroupMembership.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |
| `Test-UserAccess.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |
| `Get-LockedAccounts.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |
| `Reset-UserPassword.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |
| `Get-ADComputerReport.ps1` | [Administration toolkit](/reference/explore/AUTOMATION/) |

The toolkit also documents half-created-user rollback, idempotency, group-name matching, account lockout, password resets, output checks, parser validation, SHA-256 and a frozen v1.0.0 release.

[Full script-by-script journal](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).

## 7. Backup targets, snapshots, recovery and monitoring

| Protected area | Mechanism | Explore |
| --- | --- | --- |
| Proxmox VMs | VM backup repository `nova-backup` | [Backup](/reference/explore/services/BACKUPS/) |
| pfSense | Named snapshot, VM archive and private config-level recovery copy | [Recovery](/reference/explore/services/BACKUPS/) |
| FILES01 | Windows Server Backup, guest `B:` target | [Backup](/reference/explore/services/BACKUPS/) |
| DC01 | Windows Server Backup System State | [Backup](/reference/explore/services/BACKUPS/) |
| Earlier file version | Shadow Copies | [VSS](/reference/explore/services/VSS/) |
| Deleted AD object | AD Recycle Bin | [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) |
| Backup freshness/free space | Scheduled monitoring/health checks from backup project | [Operations](/reference/explore/OPERATIONS/) |
| AD/DNS/GPO/DFS/SMB/service checks | Manual health and alert design | [Operations](/reference/explore/OPERATIONS/) |
| Snapshot capacity | Historical cleanup/retenion | [Proxmox](/reference/explore/systems/NOVA-PROX01/) |

## 8. Tested faults and actual repairs

[All incidents and test results →](/reference/explore/TESTS_AND_RECOVERY/)

The documented test history includes nested virtualization, infrastructure migration, VPN handshake, account creation, account lockout, group-access analysis, file permissions, DNS, Group Policy, backup-target outage, DC outage, replication divergence, combined DNS/authorization failure, management-access exposure and snapshot capacity.

## 9. Original engineering record numbers

<details><summary><strong>Open the full record for each project (CR-001 to CR-015)</strong></summary>

| Record | Work completed | Source |
| --- | --- | --- |
| 001 | Virtualization platform | [Read](/reference/Documentation/Change-Requests/Journal-CR-001/) |
| 002 | pfSense/network foundation | [Read](/reference/Documentation/Change-Requests/Journal-CR-002/) |
| 003 | Active Directory/DNS | [Read](/reference/Documentation/Change-Requests/Journal-CR-003/) |
| 004 | Second Domain Controller/HA | [Read](/reference/Documentation/Change-Requests/Journal-CR-004/) |
| 005 | OU, user, groups and service accounts | [Read](/reference/Documentation/Change-Requests/Journal-CR-005/) |
| 006 | Group Policy | [Read](/reference/Documentation/Change-Requests/Journal-CR-006/) |
| 007 | WireGuard VPN | [Read](/reference/Documentation/Change-Requests/Journal-CR-007/) |
| 008 | File server | [PDF](/journals/NovaCorp_CR-008_File_Server_Deployment_Journal/) |
| 009 | Shares & drive mapping | [PDF](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) |
| 010 | DFS & Shadow Copies | [PDF](/journals/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED/) |
| 011 | PowerShell toolkit | [Read](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/) |
| 012 | Backup and recovery | [Read](/reference/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal/) |
| 013 | AD resilience | [Read](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) |
| 014 | Incidents | [Read](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) |
| 015 | Closure and security regression | [Read](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/) |

</details>

**The distinction:** all fifteen documented changes are indexed here, but some individual live settings (such as the exact current order of every pfSense rule or the latest complete AD membership list) are not represented as immutable facts because those settings can change. The deep journals and dated test results remain the historical source.

[← Back to the company](/reference/EXPLORE_NOVACORP/)