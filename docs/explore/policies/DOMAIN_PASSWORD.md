# Default Domain Policy — Passwords, lockouts and Kerberos

**GPO:** `Default Domain Policy`  
**Linked to:** the entire `nova.corp` domain  
**Link:** Enabled, not enforced  
**Captured:** 22 November 2026

## Why it exists

A company needs consistent password requirements and a predictable response to repeated failed sign-ins. This domain policy also contains Kerberos ticket-lifetime rules used by Active Directory.

## Configured password and lockout settings

| Setting | Current reported value |
| --- | --- |
| Minimum password length | **12 characters** |
| Complexity requirements | **Enabled** |
| Maximum password age | **180 days** |
| Minimum password age | 1 day |
| Password history | 24 previous passwords |
| Store passwords with reversible encryption | Disabled |
| Account lockout threshold | **5 failed attempts** |
| Lockout duration | 15 minutes |
| Reset failed-attempt counter | 15 minutes |
| Administrator account lockout | Enabled in the exported policy |

The **180-day** value comes directly from the November 2026 GPO report. This describes the configured domain policy; a separate fine-grained password policy, where present, may affect individual users differently.

## Kerberos configuration

Kerberos is how Windows domain clients obtain authentication tickets. [Learn about Kerberos and the KDC](../services/KERBEROS.md).

| Setting | Configured value |
| --- | --- |
| Maximum user ticket lifetime | 10 hours |
| Maximum renewal lifetime | 7 days |
| Maximum service-ticket lifetime | 600 minutes |
| Maximum clock skew | 5 minutes |
| Validate client | Enabled |

<details><summary><strong>Other domain security settings</strong></summary>

The same GPO includes:
- `NoLMHash = 1` — do not store LAN Manager hashes for future password changes;
- anonymous account-name lookup disabled;
- domain logon-hours force-logoff setting disabled;
- EFS recovery-agent and certificate trust settings.

</details>

## Follow the connections

[Domain](../services/ACTIVE_DIRECTORY.md) → [Domain Controllers](../systems/NOVA-DC01.md) → [Kerberos](../services/KERBEROS.md) → [User accounts](../PEOPLE_AND_DEPARTMENTS.md) → [Account administration](../AUTOMATION.md).

## What was tested

Nova Corp's PowerShell toolkit included controlled lockout detection and password reset exercises. Those tests show the operational consequences of account policy, not simply the settings in a report.

[Account-management tests](../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) · [Original GPO implementation](../../Documentation/Change-Requests/Journal-CR-006.md).

<details><summary><strong>Technical identifier</strong></summary>

GPO GUID: `31b2f340-016d-11d2-945f-00c04fb984f9`  
Security filtering: Authenticated Users (Apply Group Policy); no WMI filter reference appears in the report.

</details>

[← All seven GPOs](../POLICIES.md)