---
title: "Workstation Rules — Group Policy"
sourcePath: "docs/explore/POLICIES.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/POLICIES.md"
section: "explore"
---

# Workstation Rules — Group Policy

Windows computers at Nova Corp don't need to be configured one at a time. **Group Policy** lets IT define settings once and deliver them to the right users or computers through Active Directory.

The company has **seven Group Policy Objects (GPOs)**. Six have active links to the domain or an OU; one is an unused, empty GPO.

## Explore the seven policies

| Policy | Where it is linked | What it controls |
| --- | --- | --- |
| **[Default Domain Policy](/reference/explore/policies/DOMAIN_PASSWORD/)** | Entire `nova.corp` domain | Password rules, account lockout, Kerberos settings |
| **[Default Domain Controllers Policy](/reference/explore/policies/DEFAULT_DC/)** | [Domain Controllers](/reference/explore/systems/NOVA-DC01/) OU | Domain Controller rights and security settings |
| **[Corporate wallpaper](/reference/explore/policies/WALLPAPER/)** | [Nova Users](/reference/explore/DIRECTORY/) | A shared company desktop wallpaper |
| **[Nova Corp - Keyboard](/reference/explore/policies/KEYBOARD/)** | **Not linked** | No settings configured in this GPO |
| **[Contractor removable-storage policy](/reference/explore/policies/CONTRACTOR_USB/)** | [Contractors](/reference/explore/people/JOHN_SHAW/) OU | Deny removable-storage access and write operations |
| **[Workstation security baseline](/reference/explore/policies/WORKSTATION_BASELINE/)** | [Workstations](/reference/explore/systems/NOVA-CLIENT/) OU | Firewall, AutoPlay and SMBv1 configuration |
| **[Department drive mapping](/reference/explore/policies/DRIVE_MAPPING/)** | [Nova Users](/reference/explore/DIRECTORY/) | Run the departmental drive-mapping script at sign-in |

All six existing links are **enabled** and **not enforced**. All seven GPO security descriptors give **Authenticated Users** permission to apply policy, subject to the GPO's actual scope and processing rules.

The names above are visitor-friendly. Each individual policy page includes its exact configured GPO name.

## How a policy reaches someone

```mermaid
flowchart LR
    OU["Active Directory OU"] --> LINK["Linked policy"]
    LINK --> FILTER["Security filtering and inheritance"]
    FILTER --> PC["User or computer processes policy"]
    PC --> TEST["gpresult / observed behavior"]
```

For example, [John Shaw](/reference/explore/people/JOHN_SHAW/) lives in the Contractors OU, which has a linked removable-storage restriction. The earlier test showed that policy in his `gpresult` output.

A GPO link proves where IT has **assigned** a setting. To prove it actually **applied**, you also check the client and the resulting behavior.

## Connected parts of Nova Corp

[Open the directory tree](/reference/explore/DIRECTORY/) → [Select a staff account](/reference/explore/PEOPLE_AND_DEPARTMENTS/) → [Find its OU](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/) → [Explore a policy](/reference/explore/POLICIES/) → [See tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).

The drive-mapping policy also connects to [SMB and file access](/reference/explore/FILE_SERVICES/). The workstation baseline connects to [NOVA-CLIENT](/reference/explore/systems/NOVA-CLIENT/), and the Domain Controllers policy connects to [DC01](/reference/explore/systems/NOVA-DC01/) and [DC02](/reference/explore/systems/NOVA-DC02/).

## What we discovered during configuration review

- The configured maximum password age is **180 days**, not the earlier 90-day figure.
- The actual wallpaper GPO is named **`Nova Corp - Coperate wallpaper`**, including the typo.
- **`Nova Corp - Keyboard`** currently has no link or settings; keyboard-layout preferences actually appear in the Default Domain Controllers Policy.
- The department drive-mapping GPO executes a script from `NETLOGON`.
- Domain Controller LDAP signing is configured as **None**; this is a separate security-hardening item to verify and address.

## See how it was implemented and tested

[Group Policy build journal](/reference/Documentation/Change-Requests/Journal-CR-006/) · [Department share mapping](/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/) · [GPO incident exercises](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/) · [Final baseline export](/reference/Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure/).

*These are the last documented policy settings. Client-side application and script execution are covered by separate tests.*

[← Explore Nova Corp](/reference/EXPLORE_NOVACORP/)