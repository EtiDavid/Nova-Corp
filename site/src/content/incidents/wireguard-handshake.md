---
title: "The VPN packets arrived, but no handshake completed."
summary: "Incoming WireGuard packets reached the firewall, yet the peer didn't authenticate until its client key pair was corrected."
date: "November 2026"
outcome: "Authenticated tunnel restored in historical test"
status: "tested"
systems: ["nova-fw01", "nova-client", "nova-dc01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/wireguard-handshake.md"
type: "real"
cr: "CR-007"
services: []
lines: ["network"]
segment: null
pin: null
copyStatus: "migrated"
---

## The symptom

The remote laptop's WireGuard tunnel was activated. Bytes sent increased, but bytes received stayed at zero.

## Find the failing layer

- The firewall's WAN packet capture received repeated UDP traffic.
- Matching WAN firewall-rule counters increased.
- The WireGuard UDP listener was running.
- The peer appeared in the configuration, **but no completed handshake or tunnel transfer was recorded**.

This isolated the problem to peer authentication rather than upstream port forwarding.

## Repair and proof

The client key pair was recreated, the firewall's matching peer public key was updated, and the tunnel was tested again.

Bidirectional traffic appeared and the approved Domain Controller tests passed. Any key material previously exposed in troubleshooting screenshots was rotated.

## What this does not prove

This historical WireGuard repair is **not** the separate independent external-laptop fault exercise that was deferred later. Both records remain distinct in the public engineering archive.
