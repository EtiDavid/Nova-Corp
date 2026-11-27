---
title: "My access checker denied a user who had access."
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
shortTitle: "My access checker denied a user who had access."
saw: "My access checker said Moyo would be denied the IT share, although she had access."
cause: "It compared the plain group name DL_FS_IT_Modify with the domain-qualified NOVA\\DL_FS_IT_Modify and treated them as different."
fix: "I made the script treat qualified and unqualified names as the same group."
proof: "The checker then matched a real session: IT allowed, Finance denied."
limits: "The checker predicts access from group and permission data. Only a real sign-in proves it, so I ran both."
copyStatus: "rewritten"
---
