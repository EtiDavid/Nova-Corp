# Workstation security baseline — Rules for company computers

**GPO:** `NOVA-SEC-Workstation-Baseline`  
**Linked to:** `nova.corp/Nova-Computers/Workstations`  
**Link:** Enabled, not enforced  
**Captured:** 22 November 2026

## Why it exists

Nova Corp needs ordinary workstations to have consistent basic security settings without having to configure each device manually.

The domain-joined [NOVA-CLIENT](../systems/NOVA-CLIENT.md) is registered in the Workstations OU.

## Exact settings in the November report

| Setting | Current configured value |
| --- | --- |
| Windows Defender Firewall | Enabled for Domain, Private and Public profiles |
| Windows Defender Firewall default inbound policy | Block incoming connections unless allowed |
| Turn off AutoPlay | Enabled; **all drives** |
| SMBv1 server setting | `HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters\SMB1` = `0` (DWORD) |

**AutoPlay** and **AutoRun** are related but separate Windows mechanisms. The current report explicitly shows *Turn off AutoPlay*; it does not show a separate configured *Turn off AutoRun* administrative-template entry.

## Screenshots

![Workstation baseline linked to the Workstations OU](../../Documentation/Change-Requests/evidence/04-workstation-baseline-gpo-link.png)

![Windows Defender Firewall settings](../../Documentation/Change-Requests/evidence/05-firewall-gpo-configuration.png)

## What was tested?

The original work checked GPO processing, SMBv1 disabled while SMBv2 remained enabled, and Windows Firewall behavior. A previously enforced link was corrected so the GPO did not override policy hierarchy more broadly than intended.

## Explore the connected systems

[Computer object and OU](../DIRECTORY_SNAPSHOT_2026-11-22.md) → [NOVA-CLIENT](../systems/NOVA-CLIENT.md) → [SMB file sharing](../services/SMB.md) → [Policy and incident tests](../TESTS_AND_RECOVERY.md).

[Original workstation-policy journal](../../Documentation/Change-Requests/Journal-CR-006.md).

<details><summary><strong>Technical identifier</strong></summary>

GPO GUID: `3b481639-a09c-413c-8dc5-3501cd977a51`.  
Security filter: Authenticated Users (Apply Group Policy).

</details>

[← All seven GPOs](../POLICIES.md)