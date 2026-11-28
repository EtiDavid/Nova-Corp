---
title: "The employee could sign in, but her departmental drive was missing."
summary: "On the physical laptop over the VPN, Moyo signed in but had no Z: drive. First the firewall blocked SMB by design. After a narrow rule, the drive still needed a restart."
date: "2026"
outcome: "Drive mapped after a restart; no policy root cause claimed"
status: "tested"
systems: ["nova-lap01", "nova-files01", "nova-fw01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/CR-A_Remote_Workstation_Onboarding.md"
type: "real"
cr: "CR-A"
services: ["dfs", "group-policy", "smb-ntfs"]
lines: ["files"]
segment: null
pin: { col: 30.5, row: 66 }
featured: 3
shortTitle: "The employee could sign in, but her departmental drive was missing"
saw: "Moyo signed in on the laptop over the VPN, but there was no Z: drive."
cause: "Two stages. First, pfSense blocked SMB to FILES01, which was the design. After a narrow TCP 445 rule, direct DFS access worked, but the automatic mapping was still missing until a restart."
fix: "I added one logged rule, TCP 445 from the laptop to FILES01 only. The mapping then appeared after a restart, with no manual mapping and no further policy edits."
proof: "Z: showed IT with 59.4 GB free. Moyo created, wrote, read, appended to and deleted a test file. Four other departments were denied. John, the contractor, got no drive and five denials. Logs show SMB allowed and RDP and WinRM still blocked."
limits: "How the mapping was applied after the restart was not inspected, so no policy root cause is claimed. A gpupdate /force does not prove every logon operation reruns. The test used one synthetic file."
copyStatus: "rewritten"
---

## How I worked it out

### 1. Stage one: the firewall

With the original VPN rules, direct SMB to FILES01 was denied. The firewall counter showed blocked traffic, and the INFRA rule was blocking TCP 445. Access to the domain controllers still passed. That was the design: the staff VPN did not allow file servers.

### 2. A narrow rule

I added one rule, above the INFRA block: pass TCP 445 from 10.10.60.11 to 10.10.20.20, logged. After it, FILES01 on TCP 445 was True, while 3389 and 5985 were False, and domain controller ports 53 and 88 and the locator still worked, 6 of 6.

### 3. Stage two: the drive

After a user policy refresh the user policy completed, but the laptop still had only C: and no connections listed. The name resolved and TCP worked. Browsing the DFS namespace directly showed the same five folders, so DFS itself worked. The drive was still missing.

### 4. Restart

I did not map the drive by hand or change any policy. After a restart, Z: appeared automatically, pointing to the IT share.

### 5. What Moyo and John could do

Moyo created, wrote, read, appended to and deleted a synthetic test file on Z: (8 of 8 steps), and the file was gone after cleanup. Finance, HR, Management and Sales were each denied. John, in the Contractors OU, had no mapped drive and was denied all five department folders, 7 of 7 checks including his identity.

### 6. Check the firewall again

New logs showed RDP and WinRM attempts blocked and SMB allowed. The staff VPN is not a privileged administrator VPN.
