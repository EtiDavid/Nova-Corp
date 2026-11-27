---
title: "DC01 lost its route after moving to the infrastructure VLAN."
summary: "After migration, DC01 had a correct static address and VLAN tag but could not reach its own gateway until pfSense policy was corrected."
date: "Engineering journal"
outcome: "VLAN policy corrected; reachability restored"
status: "tested"
systems: ["nova-dc01", "nova-fw01", "nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/dc01-vlan-migration.md"
type: "real"
cr: "CR-003"
services: ["vlan-segmentation"]
lines: ["network"]
segment: null
pin: null
shortTitle: "DC01 lost its route after moving to the infrastructure VLAN."
saw: "After DC01 moved to VLAN 20 it could not reach its gateway, although pfSense could reach DC01."
cause: "The new INFRA interface on pfSense had no allow rules yet, so DC01's traffic hit the default block."
fix: "I added and applied the first INFRA pass rule."
proof: "The gateway, the pfSense web interface, internet, Active Directory and DNS all worked again."
limits: "The first INFRA rules were broad on purpose to finish the build, and INFRA still has broad pass rules."
copyStatus: "rewritten"
---
