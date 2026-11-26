---
title: "DC01 went offline. Sign-ins kept working through DC02."
summary: "A controlled outage tested whether the second Domain Controller could keep company sign-ins and resources available."
date: "November 2026"
outcome: "Directory continuity verified"
status: "tested"
systems: ["nova-dc01", "nova-dc02", "nova-client"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/domain-controller-outage.md"
type: "controlled"
cr: "CR-013"
services: ["active-directory", "dns", "kerberos"]
lines: ["identity"]
segment: null
pin: { col: 70.8, row: 10.8 }
featured: 2
shortTitle: "DC01 went offline. Sign-ins kept working through DC02."
saw: "I took the main domain controller offline on purpose."
cause: "A controlled outage: the question was whether sign-ins depend on DC01."
fix: "No repair was needed: the workstation found DC02 and kept working."
proof: "After DC01 came back I checked its services and all five Active Directory replication partitions."
limits: "Signing in through DC02 is not a server restore. A complete System State restore of a domain controller has not been demonstrated."
copyStatus: "rewritten"
---
