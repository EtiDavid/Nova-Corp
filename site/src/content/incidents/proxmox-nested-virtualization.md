---
title: "Proxmox would not start inside VMware: Windows was holding the CPU's virtualization."
summary: "The Proxmox installer failed inside VMware Workstation with virtualization errors. Windows had already claimed the CPU's virtualization extensions."
date: "2026"
outcome: "Fixed by turning off Windows' own virtualization features"
status: "tested"
systems: ["nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/Journal-CR-001.md"
type: "real"
cr: "CR-001"
services: ["nested-virtualization"]
lines: ["platform"]
segment: null
pin: { col: 31, row: 51 }
shortTitle: "Proxmox would not start inside VMware: Windows was holding the CPU's virtualization."
saw: "The Proxmox installer could not boot inside VMware Workstation. VMware showed errors that hardware virtualization (AMD-V) was unavailable."
cause: "Windows Hyper-V and related features had already reserved the CPU's AMD-V instructions before VMware started. A processor can give them to only one hypervisor at a time, so VMware had nothing to pass to Proxmox."
fix: "I turned off Hyper-V, Virtualization Based Security and the other conflicting Windows virtualization features, then rebooted the physical host."
proof: "I revalidated virtualization support after the reboot. VMware could then pass the instructions through to Proxmox."
limits: "This is the reason the whole lab shares one failure domain: every machine runs on this one nested host. It is not a statement about production hypervisor design."
copyStatus: "rewritten"
---

## How I worked it out

The installer would not boot. VMware reported that AMD-V / RVI and hardware virtualization were unavailable.

### 1. Is Windows already using the virtualization?

```powershell
systeminfo
```

**Expected:** no hypervisor reported, so VMware could use the CPU extensions. **Actual:** the output showed a hypervisor detected and virtualization services active, so Windows itself was acting as a hypervisor.

**What it means:** another hypervisor was already consuming the CPU's virtualization extensions.

### 2. Remove the competitor

I disabled Hyper-V, Virtualization Based Security and the other conflicting Windows virtualization features, then rebooted the host.

### 3. Check again

After the reboot I revalidated that virtualization support was available. VMware could then pass the instructions through to Proxmox with nested virtualization.
