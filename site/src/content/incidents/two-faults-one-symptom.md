---
title: "One failed file share concealed two independent faults."
summary: "A controlled incident combined a wrong AD-integrated DNS record with removed IT group membership; repairing DNS exposed a separate access-denied cause."
date: "Engineering journal"
outcome: "DNS and authorization repaired in sequence; access retested"
status: "tested"
systems: ["nova-client", "nova-dc01", "nova-dc02", "nova-files01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/two-faults-one-symptom.md"
---

## The combined fault

The file server's AD-integrated DNS record had been set to `192.0.2.44` on both Domain Controllers, while the actual file server still answered at `10.10.20.20`. Separately, an IT user had been removed from live IT-group membership.

## Diagnose one layer at a time

The hostname lookup returned the wrong address; direct SMB on `10.10.20.20:445` succeeded. Correcting the DNS record restored name and TCP reachability but did not restore file access: the request now returned **Access is denied**.

## Why the second fault was subtle

The user's cached local token could still list an old group while live Active Directory membership had changed. Repair required validating the authorization state independently of DNS and network health.

## Boundary

A working port test does not prove folder authorization. The original journal includes the sequential commands, evidence and final retests.