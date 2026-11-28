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
featured: 2
shortTitle: "Same network, two subnet masks"
saw: "The new file server could sometimes reach the domain controllers, but TCP 53 to a domain controller could fail. Some ping and name tests worked."
cause: "The two domain controllers were set to /32 and the file server to /24. The controllers sent their replies to the router instead of straight back, so the traffic took two different roads."
fix: "I restored all three servers on VLAN 20 to the intended /24."
proof: "After the domain join and restart, the secure channel test returned True, and both domain controllers resolved FILES01 and reached TCP 445."
limits: "The exact corrective command is not printed in the journal, so none is shown. A working TCP 445 test is not proof the file server is healthy, only that this path works."
copyStatus: "migrated"
---
The dedicated investigation reproduces the CR-008 sequence, actual recorded outcomes, and original journal evidence.
