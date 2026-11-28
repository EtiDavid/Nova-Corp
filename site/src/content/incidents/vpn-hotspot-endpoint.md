---
title: "The VPN worked at home, but failed on the mobile hotspot."
summary: "The laptop's VPN worked on the home network but timed out on a phone hotspot. The first peer used the firewall's private address as its endpoint."
date: "2026"
outcome: "Fixed by changing the peer's endpoint; hotspot tests passed"
status: "tested"
systems: ["nova-lap01", "nova-fw01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/CR-A_Remote_Workstation_Onboarding.md"
type: "real"
cr: "CR-A"
services: ["dns"]
lines: ["network"]
segment: { from: nova-fw01, to: nova-lap01, line: network }
pin: { col: 12.5, row: 62 }
shortTitle: "The VPN worked at home, but failed on the mobile hotspot"
saw: "On a phone hotspot, DNS lookups to the domain controllers timed out and TCP 53 failed, even though the tunnel interface existed."
cause: "The first peer pointed at the firewall's private address, which is reachable only on the home network. Nothing from outside could reach it."
fix: "I changed only the peer's endpoint to the router's public address on UDP 51820, using the router's existing port forward. No firewall rule changed."
proof: "On the hotspot, TCP 53 succeeded through the tunnel, four SRV queries returned both domain controllers, and the domain controller locator found DC01."
limits: "The router's public address is not published. Dynamic DNS was not set up or tested, so a changed public address would break the endpoint. A tunnel interface existing does not prove a handshake."
copyStatus: "rewritten"
---

## How I worked it out

The laptop's VPN was fine at home. I moved it to a phone hotspot.

### 1. Fail on the hotspot

```powershell
Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.nova.corp" -Type SRV -Server 10.10.20.10 -DnsOnly
Test-NetConnection 10.10.20.10 -Port 53
```

**Expected:** answers. **Actual:** the SRV queries to both domain controllers timed out, and TCP 53 returned False with the staff VPN as the selected interface.

### 2. Compare with home

Back on the home Wi-Fi, TCP 53 and the SRV results worked again. **What it means:** the network path was the difference. The private endpoint (the firewall's address on the home network) could not be reached from outside, so there was no working handshake, even though the tunnel adapter existed.

### 3. Check the router

The router already forwarded UDP 51820 to the firewall, with no exposed host. Its separate IPsec VPN entry is not this tunnel and was not changed. I changed only the peer's endpoint to the router's public address on port 51820. No firewall rule was changed.

### 4. Test again on the hotspot

TCP 53 was True through the staff VPN from 10.10.60.11. Four explicit SRV queries (LDAP and Kerberos, against both domain controllers) returned DC01 and DC02, and the locator found DC01. Both domain controllers also passed the seven-port TCP matrix, 14 of 14. That tests the transport, not sign-in.

{{evidence:hotspot-tcp53-via-tunnel}}

{{evidence:hotspot-dc-locator}}

{{evidence:hotspot-14-of-14-tcp}}

