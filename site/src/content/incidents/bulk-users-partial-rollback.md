---
title: "A bulk onboarding script left half-created AD accounts."
summary: "The first onboarding run failed password policy checks after creating five disabled accounts. The script was repaired to roll back incomplete users."
date: "Engineering journal"
outcome: "Rollback and clean five-user onboarding verified"
status: "tested"
systems: ["nova-dc01", "nova-dc02"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/bulk-users-partial-rollback.md"
---

## The unexpected result

The `New-BulkUsers` PowerShell toolkit operation reported a password failure, but five disabled directory objects remained with `pwdLastSet=0` and missing intended memberships.

## Why it mattered

A failed onboarding run should not leave ambiguous partial accounts for an administrator to discover later. The team compared the configured 12-character password policy with the script's input and listed the orphaned objects.

## The correction and proof

Rollback logic was added for mandatory-creation failures. A second intentionally invalid-password run produced successful rollback log messages for the five affected accounts. With a valid password, five users were created, enabled and verified in the correct OUs and global groups.

## Boundary

This proves the documented test cases for the onboarding script, not that arbitrary input and concurrent failures have all been covered. The full CR-011 command sequence is in the linked journal.