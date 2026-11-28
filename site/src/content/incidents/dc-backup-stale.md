---
title: "The backup schedule ran, but the domain controller backup was 48.82 hours old."
summary: "The health monitor reported the latest successful domain controller backup as 48.82 hours old. The schedule existed, but the machine had been powered off."
date: "2026"
outcome: "Fresh System State backup taken; freshness is now monitored"
status: "tested"
systems: ["nova-dc01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md"
type: "real"
cr: "CR-012"
services: ["windows-server-backup"]
lines: ["recovery"]
segment: null
pin: { col: 73, row: 14.5 }
shortTitle: "The backup schedule ran, but the domain controller backup was 48.82 hours old."
saw: "The domain controller monitor reported that the latest successful backup was 48.82 hours old."
cause: "The domain controller had been powered off, so it could not run the backup job that is scheduled inside the machine."
fix: "I took a fresh System State backup and checked the writers and the recovery versions."
proof: "I verified the backup writers and the recovery versions after the fresh System State backup. The journal records the 48.82 hours as a real freshness violation, observed while the domain controller was off."
limits: "A System State backup was taken and checked. A full domain controller restore has not been demonstrated."
copyStatus: "rewritten"
---

## How I worked it out

The backup job was scheduled, so I expected a recent backup. The monitor said otherwise.

**Observed:** the latest successful domain controller backup was 48.82 hours old.

{{evidence:dc-backup-health-failed}}


**Cause:** the domain controller had been powered off. The scheduled job runs inside the machine, so a machine that is off cannot run it.

**Fix:** a fresh System State backup, then a check of the writers and recovery versions.

**Lesson:** a schedule is not evidence that a backup happened. Freshness has to be monitored.
