---
title: "Proxmox stayed reachable locally but lost internet access."
summary: "An intentionally wrong default route broke upstream connectivity while local subnet access and the management interface stayed usable."
date: "Fault-test journal"
outcome: "Correct gateway restored; connectivity rechecked"
status: "tested"
systems: ["nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/proxmox-default-gateway.md"
type: "controlled"
cr: null
ft: "FT-001"
services: ["nested-virtualization"]
lines: ["platform"]
segment: null
pin: null
shortTitle: "Proxmox stayed reachable locally but lost internet access."
saw: "Proxmox answered on the local network but could not reach the internet."
cause: "The default gateway on vmbr0 was set to 192.168.178.254 instead of 192.168.178.1."
fix: "I set the gateway back to 192.168.178.1 and reapplied the network configuration."
proof: "Connectivity and package updates worked again."
limits: "I misconfigured the gateway on purpose to practice recovery. It was not an unplanned outage."
copyStatus: "rewritten"
---
