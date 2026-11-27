---
title: "Two online domain controllers disagreed about a new object."
summary: "Inbound replication was deliberately disabled on DC02; a group created on DC01 remained absent on DC02 until replication was restored."
date: "Engineering journal"
outcome: "Object converged with matching GUID and SID; replication errors returned to zero"
status: "tested"
systems: ["nova-dc01", "nova-dc02"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/replication-divergence.md"
type: "controlled"
cr: "CR-013"
services: ["replication"]
lines: ["identity"]
segment: { from: "nova-dc01", to: "nova-dc02", line: "identity" }
pin: { col: 64, row: 21 }
shortTitle: "Two online domain controllers disagreed about a new object."
saw: "A group I created on DC01 was missing on DC02, even though DC02 was online."
cause: "I had switched off inbound replication on DC02 on purpose, so DC02 refused new changes from DC01."
fix: "I restored inbound replication and let Active Directory catch up."
proof: "The group arrived on DC02 with the same GUID and SID, and replication showed 0 of 5 failures."
limits: "A domain controller that answers can still hold stale directory data. This was a deliberate lab fault, not an unplanned outage."
copyStatus: "rewritten"
---
