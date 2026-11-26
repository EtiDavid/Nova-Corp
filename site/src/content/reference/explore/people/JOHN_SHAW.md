---
title: "John Shaw — Contractor policy test account"
sourcePath: "docs/explore/people/JOHN_SHAW.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/JOHN_SHAW.md"
section: "explore"
---

# John Shaw — Contractor policy test account

John Shaw is a fictional contractor account used to validate Group Policy targeting.

| Field | Recorded test information |
| --- | --- |
| Display name | John Shaw |
| Tested logon | `NOVA\john.shaw` |
| Account enabled (last checked) | Yes |
| OU | `Nova Users → Contractors` |
| Applied policy | `NOVA-sec-deny-usb-contractors` |
| Also applied | `Nova Corp - Corporate wallpaper` |

## Which policies target the contractor OU?

The Contractors OU has its own [removable-storage restriction](/reference/explore/policies/CONTRACTOR_USB/), and it sits beneath **Nova Users**, which also has the [corporate wallpaper](/reference/explore/policies/WALLPAPER/) and [department drive mapping](/reference/explore/policies/DRIVE_MAPPING/) links.

## What was the policy supposed to do?

Contractors should not be able to use removable storage even if a generic exception exists for approved staff.

The latest documented directory shows the account remains enabled in the Contractors OU. The original lab exercise linked the contractor policy to that OU and confirmed processing through `gpresult`. Physical USB behavior was not verified end-to-end because passing a physical USB device through the nested virtualization stack was unreliable.

## See the actual screenshot

![John Shaw gpresult showing contractor USB policy and wallpaper policy](/docs-images/Documentation/Change-Requests/evidence/03-contractor-user-gpresult.png)

[Policy details](/reference/explore/POLICIES/#contractor-usb-restriction) · [Group Policy journal](/reference/Documentation/Change-Requests/Journal-CR-006/).

[← People & Departments](/reference/explore/PEOPLE_AND_DEPARTMENTS/)