---
title: "Two online Domain Controllers disagreed about a new AD object."
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
shortTitle: "Two online domain controllers disagreed about a new object"
copyStatus: "migrated"
---

## The controlled divergence

Before the fault, both Domain Controllers reported healthy replication, with `0/5` failures. The exercise then disabled inbound replication on DC02.

## What the checks proved

A new group existed on DC01 but could not be found on DC02. The replication status showed error **8457** (destination rejecting replication), including **2/5** failed attempts during the tested window.

## Recovery proof

Inbound replication was re-enabled. After natural retry, DC02 received the object with the same **GUID and SID**, and subsequent replication checks returned to `0/5` failures.

## Boundary

This is a deliberate historical replication failure and convergence check, not proof of recovery from an arbitrarily corrupted directory database.