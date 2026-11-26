---
title: "The Proxmox web interface stopped, but the VMs kept running."
summary: "Controlled management-service faults separated browser administration loss from Proxmox guest and network availability."
date: "Fault-test journal"
outcome: "Management service recovered; guests remained online in tested scope"
status: "tested"
systems: ["nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/proxmox-webgui-outage.md"
type: "controlled"
cr: null
ft: "FT-003"
services: ["nested-virtualization"]
lines: ["platform"]
segment: null
pin: null
shortTitle: "The Proxmox web interface stopped, but the VMs kept running."
saw: "The Proxmox web interface stopped answering while SSH, the host network and the VMware console still worked."
cause: "I had stopped the pveproxy service on purpose."
fix: "I started pveproxy again."
proof: "The service showed active (running) and the browser worked again."
limits: "This was one service stopped on purpose. It does not show how I would handle a failure of the whole host."
copyStatus: "rewritten"
---
