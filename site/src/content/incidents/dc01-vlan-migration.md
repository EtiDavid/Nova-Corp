---
title: "DC01 lost its route after moving to the infrastructure VLAN."
summary: "After migration, DC01 had a correct static address and VLAN tag but could not reach its own gateway until pfSense policy was corrected."
date: "Engineering journal"
outcome: "VLAN policy corrected; reachability restored"
status: "tested"
systems: ["nova-dc01", "nova-fw01", "nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/dc01-vlan-migration.md"
---

## What broke

DC01 had the intended address and Proxmox VLAN tag, and pfSense had the infrastructure gateway `10.10.20.1`. Yet traffic from DC01 toward the gateway failed while pfSense could still reach the server.

## How the engineer narrowed it down

The investigation checked Windows `ipconfig /all`, the Proxmox bridge and tag, and the pfSense VLAN interface. A directional ping comparison exposed the policy difference: pfSense-to-DC01 worked but DC01-to-gateway did not.

## What resolved it

A matching interface firewall rule was applied to permit the intended infrastructure traffic. Gateway reachability, the web interface, internet access and the relevant AD/DNS services were retested.

## What this proves — and what it does not

A VM can have correct IP configuration and still fail because of an interface policy. This is a historical migration problem, not a claim of an ongoing outage. The linked original journal has the exact checks and commands.