---
title: "A bulk onboarding script left half-created accounts."
summary: "The first onboarding run failed password policy checks after creating five disabled accounts. The script was repaired to roll back incomplete users."
date: "Engineering journal"
outcome: "Rollback and clean five-user onboarding verified"
status: "tested"
systems: ["nova-dc01", "nova-dc02"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/bulk-users-partial-rollback.md"
type: "real"
cr: "CR-011"
services: ["active-directory"]
lines: ["identity"]
segment: null
pin: null
shortTitle: "A bulk onboarding script left half-created accounts."
saw: "My bulk onboarding script reported a password error but left disabled, half-built accounts in Active Directory."
cause: "It created each account before setting a valid password, so a failed password step stopped the script without removing the account."
fix: "I added a rollback that deletes the half-made account when a later step fails, then ran the weak-password test again."
proof: "A valid import created five users in the right OU and group, and running it again skipped all five."
limits: "This covers the bulk-user script only. The other scripts have their own failure records in CR-011."
copyStatus: "rewritten"
---
