---
title: "Old snapshots were consuming the virtualization storage."
summary: "Proxmox thin-pool use reached 86.73%. A deliberate cleanup removed obsolete checkpoints while preserving approved rollback and backup archives."
date: "November 2026"
outcome: "Storage pressure reduced; archives retained"
status: "tested"
systems: ["nova-prox01", "nova-fw01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/proxmox-snapshot-pressure.md"
---

## The symptom

The Proxmox thin-storage pool showed **86.73% used**. Twenty old VM snapshots had accumulated.

A snapshot is not an independent backup. Leaving many snapshots in place reduces free capacity and can complicate future changes.

## What was checked before cleanup

The engineer examined the thin-pool utilization and listed snapshots for the affected virtual machines. The approved pre-change firewall rollback and separate backup archives were deliberately protected.

## What changed

Twenty obsolete snapshots were removed through Proxmox's normal snapshot management command, without deleting the separate backup archives.

## Actual measured result

Utilization dropped to **52.88%** immediately after cleanup. A later check recorded **53.67%**, showing that the capacity improvement remained.

## What this demonstrates

Infrastructure maintenance is not simply deleting files until a chart looks better. The decision required verifying snapshot dependencies, retaining rollback and measuring capacity both before and after the operation.
