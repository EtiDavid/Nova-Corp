---
title: "The file server looked down. DNS was the problem."
summary: "The employee's shared folder stopped opening by name, even though the server was still accepting connections."
date: "November 2026"
outcome: "DNS and shared-folder access restored"
status: "tested"
systems: ["nova-client", "nova-dc01", "nova-dc02", "nova-files01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/dns-client-outage.md"
type: "blind"
cr: "CR-014"
services: ["dns", "smb-ntfs"]
lines: ["identity", "files"]
segment: { from: "nova-client", to: "nova-dc01", line: "identity" }
pin: { col: 33, row: 12.2 }
featured: 1
shortTitle: "The file server looked down. It was DNS."
saw: "The IT shared folder would not open by name, so the file server looked down."
cause: "The workstation's DNS pointed at a wrong server (192.0.2.53). The file server was fine."
fix: "I set the DNS servers back to the two domain controllers and cleared the resolver cache."
proof: "The original request worked again, and the domain controllers advertised themselves."
copyStatus: "rewritten"
---

## The symptom

An employee workstation could not open the IT shared folder by server name. It would have been easy to assume the file server had failed.

## Separate the possible causes

I tested **name resolution** and **network reachability** independently.

- The ordinary file-share path check returned **False**.
- A lookup of the file server's name timed out.
- A direct TCP connection to the file server on **port 445 succeeded**.
- Asking the internal Domain Controller DNS server directly returned the expected server address.

The server was reachable; the workstation was asking the wrong DNS resolver.

## The actual cause

The workstation had a deliberately incorrect DNS server configured for this exercise.

## The repair and proof

The correct pair of internal DNS servers was restored. I cleared the client resolver cache, checked Active Directory service discovery, and repeated the original shared-folder test.

**The shared folder opened again.** This was a client-side DNS configuration incident, not a damaged file server or failed SMB service.

## What this demonstrates

A failed application path does not identify the failed component by itself. Testing the network connection independently of DNS prevented a needless server rebuild. The original engineering journal records the exact commands, expected results and actual errors.
