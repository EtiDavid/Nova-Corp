---
title: "Contractors — Removable-storage restriction"
sourcePath: "docs/explore/policies/CONTRACTOR_USB.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/policies/CONTRACTOR_USB.md"
section: "explore"
---

# Contractors — Removable-storage restriction

**GPO:** `NOVA-sec-deny-usb-contractors`  
**Linked to:** `nova.corp/Nova Users/Contractors`  
**Link:** Enabled, not enforced  

## Why Nova Corp created it

The company wants contractors to work on its Windows computers without copying data to removable drives.

## What the current GPO configures

Two user-side policy settings are enabled:

1. **All Removable Storage classes: Deny all access.**
2. **Removable Disks: Deny write access.**

The broad deny-all setting takes precedence over individual removable-storage class settings. Both remain visible in the configured settings.

### Where the policy is linked

![GPO linked to Contractors OU](/docs-images/Documentation/Change-Requests/evidence/01-contractor-usb-gpo-link.png)

### The configured restriction

![Deny all removable storage enabled](/docs-images/Documentation/Change-Requests/evidence/02-usb-deny-all-removable-storage-enabled.png)

## Who was used to test it?

[John Shaw](/reference/explore/people/JOHN_SHAW/) is a fictional contractor account located inside the Contractors OU. His `gpresult` showed the policy was applied to his user session.

![The contractor test account's applied policies](/docs-images/Documentation/Change-Requests/evidence/03-contractor-user-gpresult.png)

The physical USB block could not be independently proven during the original nested-virtualization test because physical device passthrough was unreliable. This result is **configured policy and observed GPO processing**, not a claim that a real USB device was blocked.

## Follow the connected parts

[John Shaw](/reference/explore/people/JOHN_SHAW/) → [Contractors OU](/reference/explore/DIRECTORY/) → [this policy](/reference/explore/policies/CONTRACTOR_USB/) → [Windows workstation](/reference/explore/systems/NOVA-CLIENT/) → [GPO tests](/reference/explore/TESTS_AND_RECOVERY/).

[Original implementation and testing journal](/reference/Documentation/Change-Requests/Journal-CR-006/).

<details><summary><strong>Technical identifier</strong></summary>

GPO GUID: `359aeed7-40b1-432b-aae8-983c980f93d6`.  
Security filter: Authenticated Users (Apply Group Policy).

</details>

[← All seven GPOs](/reference/explore/POLICIES/)