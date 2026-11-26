---
title: "Company wallpaper vanished because its GPO link was disabled."
summary: "A deliberately disabled policy link stopped wallpaper application even though Domain Controller discovery, SYSVOL and general GPO processing continued."
date: "Engineering journal"
outcome: "Policy link re-enabled; processing verified"
status: "tested"
systems: ["nova-dc01", "nova-dc02", "nova-client"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/gpo-link-disabled.md"
type: "blind"
cr: "CR-014"
services: ["group-policy"]
lines: ["identity"]
segment: null
pin: null
copyStatus: "migrated"
---

## The controlled fault

The company wallpaper Group Policy link was disabled. The test workstation could still locate DC02 and access policy files, but the wallpaper GPO no longer appeared in the applied policy list.

## The evidence

`gpresult` listed the wallpaper under **Filtered GPOs: Disabled (Link)**. Separate checks confirmed SYSVOL accessibility and successful client-side user and computer policy refresh.

## Repair and validation

The correct link was enabled again. After refreshing policies, wallpaper and departmental drive mapping appeared in the applied list. The configured wallpaper path resolved, and the expected desktop registry values were present.

## Boundary

This demonstrates historical processing in the tested session. It does not establish that every current workstation receives the image. Read the linked journal for exact outputs and remediation steps.