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
copyStatus: "migrated"
---

## The controlled failure

During FT-001, the Proxmox default gateway was deliberately changed from `192.168.178.1` to `192.168.178.254`.

## What the tests showed

Local gateway and same-subnet tests did not behave like external routing. Proxmox's management web interface could remain accessible locally while external ping and package updates failed.

## Restoration

The correct `192.168.178.1` default gateway was restored and route/connectivity checks repeated.

## What this teaches

A local web interface working does not prove that a host has a valid upstream default route. Full commands and expected/actual observations appear in FT-001's published journal.