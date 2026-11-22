# Corporate wallpaper — A common desktop for staff

A company wallpaper is a simple way to demonstrate central user settings. Instead of editing each Windows desktop manually, the same image can be delivered through Group Policy.

**Exact GPO name:** `Nova Corp - Coperate wallpaper`  
**Linked to:** `nova.corp/Nova Users`  
**Link:** Enabled, not enforced  
**Captured:** 22 November 2026

The spelling **Coperate** is the actual GPO name in the directory.

## What is configured?

- **Policy:** Desktop Wallpaper — Enabled.
- **Image:** `\\nova.corp\SYSVOL\nova.corp\wallpapers\NovaCorp-wallpaper.png`.
- **Style:** Fill.
- **Settings side:** User configuration.

## Why link it to Nova Users?

Nova Users contains the department OUs, including IT, Finance, HR, Sales, Management and Contractors. A user policy linked to the parent OU can apply to people in child OUs through inheritance, subject to security filtering, other policies and processing.

[Open the verified user directory](../DIRECTORY_SNAPSHOT_2026-11-22.md).

## What was tested?

The contractor test identity [John Shaw](../people/JOHN_SHAW.md) had the wallpaper GPO in his applied-user policy list alongside the removable-storage restriction.

![John Shaw's gpresult showing the wallpaper and contractor GPOs](../../Documentation/Change-Requests/evidence/03-contractor-user-gpresult.png)

That image supports **policy processing**. The GPO report also gives the configured wallpaper path, but it does not by itself prove the image file was accessible during every login.

## Connected systems

[Active Directory](../services/ACTIVE_DIRECTORY.md) → [OU tree](../DIRECTORY.md) → [Windows client](../systems/NOVA-CLIENT.md) → [Group Policy tests](../TESTS_AND_RECOVERY.md).

[Read the original Group Policy journal](../../Documentation/Change-Requests/Journal-CR-006.md).

<details><summary><strong>Technical identifier</strong></summary>

GPO GUID: `cdfb1fe4-ecbb-4076-a754-62b9e1b4412b`.  
Security filter: Authenticated Users (Apply Group Policy).

</details>

[← All seven GPOs](../POLICIES.md)