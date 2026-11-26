---
title: "An ACL checker denied a user who actually had access."
summary: "A PowerShell permission analyzer compared a bare AD group name with its domain-qualified NTFS/SMB identity and produced a false DENY."
date: "Engineering journal"
outcome: "Group-name normalization fixed; positive and negative checks passed"
status: "tested"
systems: ["nova-dc01", "nova-files01", "nova-client"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/group-acl-name-mismatch.md"
type: "real"
cr: "CR-011"
services: ["smb-ntfs"]
lines: ["files"]
segment: null
pin: null
copyStatus: "migrated"
---

## What was wrong

The `Test-UserAccess` script predicted that an authorized IT account would be denied the IT share. The real share and NTFS permissions had not changed; the script's name comparison was wrong.

## How it was isolated

AD contained the `DL_FS_IT_Modify` group for the user, whereas recorded ACL identities contained `NOVA\\DL_FS_IT_Modify`. The first script run treated those two forms as unrelated and incorrectly reported `SMBMatch=False` and `NTFSMatch=False`.

## What changed

Group-identity comparison was normalized to handle the domain-qualified form. The corrected checker predicted `ALLOW` for the IT share and was also exercised against a Finance case to verify negative separation.

## Boundary

This validates the administration checker under the recorded scenarios, not a substitute for a user's actual effective-access test.