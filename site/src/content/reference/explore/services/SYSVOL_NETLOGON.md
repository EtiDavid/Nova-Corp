---
title: "SYSVOL & NETLOGON — Shared domain material"
sourcePath: "docs/explore/services/SYSVOL_NETLOGON.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/services/SYSVOL_NETLOGON.md"
section: "explore"
---

# SYSVOL & NETLOGON — Shared domain material

Domain Controllers publish **SYSVOL** and **NETLOGON** shares to support policy and logon-related domain operations.

## Why they matter

A computer may successfully find a Domain Controller and still fail to process policy if it cannot access the necessary SYSVOL files.

Nova Corp tested both shares on both Domain Controllers and later investigated a Group Policy processing failure involving access to SYSVOL/GPT.INI.

## Connections

[DC01](/reference/explore/systems/NOVA-DC01/) · [DC02](/reference/explore/systems/NOVA-DC02/) · [Group Policy](/reference/explore/POLICIES/) · [SMB](/reference/explore/services/SMB/) · [AD replication](/reference/explore/services/ACTIVE_DIRECTORY/).

## Why NETLOGON also matters to drive mapping

The [department drive-mapping policy](/reference/explore/policies/DRIVE_MAPPING/) is configured to run a PowerShell script from `\\nova.corp\NETLOGON\Map-DepartmentDrive.ps1` during user sign-in.

A GPO referring to a script does not guarantee that the script file still exists or that every mapped drive succeeded. The file itself and the user's session are the next evidence layers.

## What was tested

- SYSVOL and NETLOGON available on both DCs.
- Directory/DFSR health reviewed.
- GPO processing tested on the client.
- Failure and recovery evidence preserved.

<details><summary><strong>Checks</strong></summary>

```powershell
Test-Path "\\NOVA-DC01\SYSVOL"
Test-Path "\\NOVA-DC02\SYSVOL"
Test-Path "\\NOVA-DC01\NETLOGON"
Test-Path "\\NOVA-DC02\NETLOGON"
```

```cmd
dcdiag /test:SysVolCheck /test:NetLogons
```

</details>

**Test journals:** [AD resilience](/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/) · [GPO incident](/reference/Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises/).