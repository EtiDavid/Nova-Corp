---
title: "Default Domain Controllers Policy — Rules for identity servers"
sourcePath: "docs/explore/policies/DEFAULT_DC.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/policies/DEFAULT_DC.md"
section: "explore"
---

# Default Domain Controllers Policy — Rules for identity servers

When Nova Corp's Domain Controllers run Windows, they also need their own security and operating rules. This built-in Group Policy applies to the special **Domain Controllers** OU.

**GPO:** `Default Domain Controllers Policy`  
**Linked to:** `nova.corp/Domain Controllers`  
**Link:** Enabled; not enforced  
**Policy security filter:** Authenticated Users (Apply Group Policy)  

## Which systems are connected?

[NOVA-DC01](/reference/explore/systems/NOVA-DC01/) and [NOVA-DC02](/reference/explore/systems/NOVA-DC02/) are in the built-in Domain Controllers OU.

## What the settings do

The current GPO report lists **24 user-rights assignments** and the following important security options:

| Setting | Configured value | Why it matters |
| --- | --- | --- |
| SMB server signing, if client agrees | Enabled | Supports signing of SMB communications |
| SMB server signing, always required | **Enabled** | Requires signing on SMB-server connections covered by this setting |
| Secure-channel signing/sealing | **Enabled** | Protects domain secure-channel communications |
| LDAP server signing requirements | **None** | LDAP signing is **not required by this GPO setting** |

The LDAP signing value is important: it is something an engineer should verify against the **effective settings on DC01 and DC02** before claiming LDAP signing enforcement. It is a security-hardening opportunity, not a justification for changing policy without tests.

<details><summary><strong>See all 24 user rights configured in this GPO</strong></summary>

These are the Windows privilege/rights names from the policy settings:

- Replace a process-level token — `SeAssignPrimaryTokenPrivilege`
- Generate security audits — `SeAuditPrivilege`
- Back up files and directories — `SeBackupPrivilege`
- Log on as a batch job — `SeBatchLogonRight`
- Bypass traverse checking — `SeChangeNotifyPrivilege`
- Create a pagefile — `SeCreatePagefilePrivilege`
- Debug programs — `SeDebugPrivilege`
- Enable computer/user accounts to be trusted for delegation — `SeEnableDelegationPrivilege`
- Increase scheduling priority — `SeIncreaseBasePriorityPrivilege`
- Adjust memory quotas — `SeIncreaseQuotaPrivilege`
- Allow log on locally — `SeInteractiveLogonRight`
- Load/unload device drivers — `SeLoadDriverPrivilege`
- Add workstations to domain — `SeMachineAccountPrivilege`
- Access this computer from the network — `SeNetworkLogonRight`
- Profile a single process — `SeProfileSingleProcessPrivilege`
- Force shutdown from a remote system — `SeRemoteShutdownPrivilege`
- Restore files and directories — `SeRestorePrivilege`
- Manage auditing and security log — `SeSecurityPrivilege`
- Shut down the system — `SeShutdownPrivilege`
- Modify firmware environment values — `SeSystemEnvironmentPrivilege`
- Profile system performance — `SeSystemProfilePrivilege`
- Change the system time — `SeSystemTimePrivilege`
- Take ownership of files/objects — `SeTakeOwnershipPrivilege`
- Remove computer from docking station — `SeUndockPrivilege`

Different rights are assigned to different Windows/AD operator or service principals, not to all employees. For example, backup/restore rights include Administrators and Backup Operators. The raw report distinguishes each right's assigned principals.

</details>

## The unexpected keyboard settings

The report also contains two **user-side registry preferences** inside this Domain Controllers policy:

| Registry location | Action | Value |
| --- | --- | --- |
| `HKCU\Keyboard Layout\Preload\1` | Update | `00000409` (US English layout identifier) |
| `HKCU\Keyboard Layout\Preload\2` | Delete | Second preload entry |

These user preferences are attached to a GPO linked to Domain Controller **computer** objects. That is not evidence of keyboard preference enforcement for ordinary employees.

The separate [Nova Corp - Keyboard](/reference/explore/policies/KEYBOARD/) GPO is empty and unlinked.

## How to inspect whether the settings actually run

[Kerberos and LDAP](/reference/explore/services/KERBEROS/) · [SYSVOL and policy processing](/reference/explore/services/SYSVOL_NETLOGON/) · [Active Directory](/reference/explore/services/ACTIVE_DIRECTORY/) · [Domain resilience tests](/reference/explore/TESTS_AND_RECOVERY/).

The original [second Domain Controller journal](/reference/Documentation/Change-Requests/Journal-CR-004/) documents the server implementation; the November GPO report records the configuration listed above.

<details><summary><strong>Technical identifier</strong></summary>

GPO GUID: `6ac1786c-016f-11d2-945f-00c04fb984f9`  
Both Computer and User configuration sections are enabled. An enabled section can still contain settings that do not apply to a particular machine/user.

</details>

[← All seven GPOs](/reference/explore/POLICIES/)