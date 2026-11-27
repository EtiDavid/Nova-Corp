---
title: "One failed file share hid two separate faults."
summary: "A controlled incident combined a wrong AD-integrated DNS record with removed IT group membership; repairing DNS exposed a separate access-denied cause."
date: "Engineering journal"
outcome: "DNS and authorization repaired in sequence; access retested"
status: "tested"
systems: ["nova-client", "nova-dc01", "nova-dc02", "nova-files01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/two-faults-one-symptom.md"
type: "blind"
cr: "CR-014"
services: ["dns", "smb-ntfs"]
lines: ["identity", "files"]
segment: null
pin: null
shortTitle: "One failed file share hid two separate faults."
saw: "The IT share looked as if it did not exist."
cause: "Two unrelated faults: the file server's DNS record on both domain controllers pointed at 192.0.2.44, and Moyo had been removed from IT_Users while her old logon token still listed the group."
fix: "I corrected the DNS record to 10.10.20.20 and replicated it, added Moyo back to IT_Users, refreshed her session and tested again."
proof: "The IT share opened again and a CIFS ticket was issued."
limits: "Fixing the first fault only exposed the second. This shows the method on a deliberate lab exercise, not a production outage."
copyStatus: "rewritten"
---
