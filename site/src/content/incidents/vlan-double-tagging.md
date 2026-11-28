---
title: "Every VLAN went silent: the frames were tagged twice."
summary: "Virtual machines on VLAN interfaces could not reach their pfSense gateways, although every setting looked right. The tag was being added twice."
date: "2026"
outcome: "Fixed by removing the tag from the virtual machines"
status: "tested"
systems: ["nova-fw01","nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/Journal-CR-002.md"
type: "real"
cr: "CR-002"
services: ["vlan-segmentation"]
lines: ["network"]
segment: null
pin: { col: 30, row: 24 }
shortTitle: "Every VLAN went silent: the frames were tagged twice."
saw: "Virtual machines on the VLAN interfaces could not communicate with pfSense. The gateway addresses did not answer."
cause: "The virtual machine network adapters were still VLAN tagged, while pfSense was already doing the tagging on the trunk. The traffic was effectively double tagged and was not processed."
fix: "I removed the VLAN tag from the affected virtual machine adapters and let pfSense do all the tagging."
proof: "Clients got connectivity straight away."
limits: "The journal does not print a packet capture of the double tag. The explanation fits every symptom and the fix, but the tag itself was not captured."
copyStatus: "rewritten"
---

## How I worked it out

After setting up the VLANs, virtual machines on them could not reach their gateways.

### 1. Rule out the usual suspects

I considered incorrect VLAN tagging, a missing gateway, a wrong subnet, DHCP failure and a firewall block. I checked the VLAN interfaces, the gateway addresses, the DHCP configuration and the Proxmox bridge configuration.

**Actual:** each of them looked correctly configured.

### 2. Look at who was doing the tagging

The virtual machine adapters were set to a VLAN tag, and pfSense was already tagging on the trunk interface. **What it means:** the frames were tagged twice, so the other side did not process them.

### 3. One layer does the tagging

I removed the tag from the virtual machine network adapters so that only pfSense tags. **Actual:** clients got connectivity immediately.
