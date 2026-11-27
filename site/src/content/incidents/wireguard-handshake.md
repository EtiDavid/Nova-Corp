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
shortTitle: "The VPN packets arrived, but no handshake completed."
saw: "The laptop showed the VPN as active, but no data came back."
cause: "The peer's public key on pfSense did not match the laptop's. I did not record the exact character that was wrong."
fix: "I made a new key pair for the laptop and put the new public key into pfSense."
proof: "The tunnel passed traffic in both directions and the approved domain controller tests passed."
limits: "The independent test from an outside laptop and network is still deferred to CR-016."
copyStatus: "rewritten"
---
