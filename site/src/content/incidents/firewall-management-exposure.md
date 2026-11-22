---
title: "An employee computer could reach firewall administration."
summary: "A controlled security check found a management path exposed to the employee network. More specific blocks were placed before a broad allow."
date: "November 2026"
outcome: "Management path blocked; business access retained"
status: "tested"
systems: ["nova-client", "nova-fw01", "nova-dc01", "nova-files01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/pfsense-management-exposure.md"
---

## The symptom

A normal workstation could reach the firewall's management interface over the network. Being in a different VLAN had not prevented this connection.

## What the engineer checked

The original management-port connection succeeded before the change. The protected console and rollback configuration were checked before editing firewall rules, so an accidental lockout could be recovered.

## The targeted change

On the employee network, rules were placed in this order:

1. **Block** connections to the firewall's web-management ports.
2. **Block** traffic to the management network.
3. Keep the broader permitted employee traffic rule below those specific restrictions.

An intermediate rule was initially too broad and was corrected during troubleshooting.

## How the result was validated

The management port checks failed as intended after the correction. Separate positive tests confirmed that company DNS, directory services, SMB file access and internet connectivity were still usable.

## What remains outside this test

This was a specific employee-to-management hardening exercise. It is **not** proof that the entire management network has been isolated under a privileged-admin VPN. That additional security gate remains deferred.
