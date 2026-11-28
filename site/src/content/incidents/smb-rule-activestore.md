---
title: "Port 445 worked, but no firewall rule seemed to allow it."
summary: "Remote tests to TCP 445 on the new file server succeeded, yet the visible File and Printer Sharing group showed no rule for it. The effective policy had the answer."
date: "2026"
outcome: "Effective rule found; broad scope noted for later tightening"
status: "tested"
systems: ["nova-files01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf"
type: "real"
cr: "CR-008"
services: ["smb-ntfs"]
lines: ["files"]
segment: null
pin: { col: 73, row: 44.5 }
shortTitle: "Port 445 worked, but no firewall rule seemed to allow it."
saw: "Remote tests to TCP 445 on FILES01 succeeded, but the visible File and Printer Sharing group showed only the ICMP echo rule enabled."
cause: "I was reading one display group, not the effective policy. The firewall was allowing 445 through a local rule named File Server Remote Management (SMB-In)."
fix: "I queried the effective policy store directly and found the rule. Nothing needed repairing."
proof: "The effective rule showed TCP 445 inbound allowed, with the remote port and address scope set to Any."
limits: "The Windows firewall rule is broad at this layer. The lab relies on pfSense and VLAN policy for segmentation. Tightening the host rule is noted as future work, not done."
copyStatus: "rewritten"
---

## How I worked it out

SMB tests to the file server's port 445 were succeeding. I wanted to know why.

### 1. Is something listening?

```powershell
Get-NetTCPConnection -LocalPort 445 -State Listen | Format-Table LocalAddress,LocalPort,State,OwningProcess
Get-Process -Id 4
```

**Actual:** the listener existed on TCP 445, owned by process 4 (System). That separates "the network can reach the host" from "the SMB server has a listening socket".

### 2. Which rule allows it?

```powershell
Get-NetFirewallRule -DisplayGroup "File and Printer Sharing" | Where-Object Enabled -eq 'true'
```

**Expected:** an SMB rule. **Actual:** only the ICMPv4 echo request rule appeared enabled. I did not assume the firewall was off. I asked for the effective policy instead:

```powershell
Get-NetFirewallRule -PolicyStore ActiveStore -Enabled True -Direction Inbound -Action Allow
```

**Actual:** the effective rule was File Server Remote Management (SMB-In), profile Any, inbound allow, source Local, for TCP local port 445 with any remote port and any address.

**What it means:** one display group is not the whole firewall. The effective merged policy is the one that counts.
