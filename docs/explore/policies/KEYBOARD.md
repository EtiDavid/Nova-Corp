# Nova Corp - Keyboard — An unused policy

**GPO:** `Nova Corp - Keyboard`  
**Current link:** None  
**Configured settings:** None reported  
**Captured:** 22 November 2026

## What is a keyboard policy for?

An organization might use Group Policy to standardize a preferred keyboard layout. A user-side setting can change which keyboard language/layout Windows preloads when someone signs in.

In this lab, a GPO was created under the name **Nova Corp - Keyboard**, but the current report shows that it was **never linked to an OU or the domain** and contains no configured user or computer settings.

The GPO's existence alone therefore provides **no evidence that any keyboard setting is applied**.

## Where keyboard settings actually appear

The November report contains two keyboard-layout registry preferences under a different GPO:

[Default Domain Controllers Policy](DEFAULT_DC.md).

Those preferences target `HKCU\Keyboard Layout\Preload`, but the policy is linked to the **Domain Controllers OU**, not the employee OUs.

This is an example of why Nova Corp examines the actual policy link and settings instead of assuming an object works because it exists.

## Connections

[Domain Controllers](../systems/NOVA-DC01.md) · [Active Directory OU tree](../DIRECTORY.md) · [Workstation](../systems/NOVA-CLIENT.md) · [All Group Policies](../POLICIES.md).

<details><summary><strong>Technical identifier</strong></summary>

GPO GUID: `ce22e625-e62c-4a7a-b65d-0c0d25f4dc37`  
Both User and Computer settings sections are enabled, but **both are empty** in the report. No link is recorded.

</details>

[← All seven GPOs](../POLICIES.md)