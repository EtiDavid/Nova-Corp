---
title: "The same network, two different subnet masks."
summary: "NOVA-FILES01 used /24 while the domain controllers used /32. Investigation identified the inconsistent return path."
date: "2026"
outcome: "Consistent subnet configuration restored"
status: "tested"
systems: ["nova-files01", "nova-dc01", "nova-dc02"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf"
type: "real"
cr: "CR-008"
services: ["vlan-segmentation"]
lines: ["files", "network"]
segment: null
pin: { col: 50, row: 43.6 }
shortTitle: "Same network, two subnet masks"
copyStatus: "migrated"
---
The dedicated investigation reproduces the CR-008 sequence, actual recorded outcomes, and original journal evidence.
