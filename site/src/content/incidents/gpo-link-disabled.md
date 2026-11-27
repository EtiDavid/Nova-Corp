---
title: "The company wallpaper vanished because its GPO link was disabled."
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
shortTitle: "Company wallpaper vanished because its GPO link was disabled."
saw: "The company wallpaper disappeared for one user while other policies still applied."
cause: "The wallpaper policy's link on the Nova Users OU was disabled. The policy itself and SYSVOL were fine."
fix: "I re-enabled the existing link without rebuilding the policy and refreshed the user policy."
proof: "The wallpaper policy applied again after the refresh."
limits: "This was one broken link on one OU, not a domain-wide policy fault. The policy is named \"Nova Corp - Coperate wallpaper\", typo included."
copyStatus: "rewritten"
---
