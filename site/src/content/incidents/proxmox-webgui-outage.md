---
title: "The Proxmox web GUI stopped, but the virtual machines kept running."
summary: "Controlled management-service faults separated browser administration loss from Proxmox guest and network availability."
date: "Fault-test journal"
outcome: "Management service recovered; guests remained online in tested scope"
status: "tested"
systems: ["nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/proxmox-webgui-outage.md"
---

## The injected problem

During FT-003 / FT-005, the Proxmox web management service was stopped. The browser interface became unavailable.

## Isolation

Service status showed the management process inactive while SSH remained available. Network checks and separately observed guest behavior distinguished web administration failure from full host/VM failure.

## Recovery

The management service was restarted, its active status verified and the browser interface rechecked.

## Boundary

The test demonstrates recovery of a stopped web management service. It is not a whole-host restart, disaster-recovery rehearsal or proof that every guest scenario was unaffected.