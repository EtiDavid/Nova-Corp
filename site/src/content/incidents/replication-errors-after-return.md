---
title: "Replication showed 2 of 5 failing right after DC01 came back. Wait, don't panic."
summary: "Right after DC01 returned, the replication summary showed failures with errors 1722 and 1908. Three of five partitions were already succeeding, and everything converged by itself."
date: "2026"
outcome: "No repair needed; the errors were start-up symptoms"
status: "tested"
systems: ["nova-dc01","nova-dc02"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"
type: "real"
cr: "CR-013"
services: ["replication","active-directory"]
lines: ["identity"]
segment: null
pin: { col: 73.5, row: 29.5 }
shortTitle: "Replication showed 2 of 5 failing right after DC01 came back."
saw: "Immediately after DC01 returned, repadmin /replsummary showed 2 of 5 failing (40 percent) with errors 1722 (RPC server unavailable) and 1908 (could not find the domain controller)."
cause: "Not a configuration fault. The dependencies were healthy, and Active Directory converged by itself."
fix: "No fix was applied. I did not force a sync."
proof: "I checked DC and KDC discovery, the A and SRV records, the KDC, Netlogon and time services, Kerberos on TCP 88, the RPC endpoint mapper on TCP 135, LDAP on TCP 389 and repeated showrepl runs."
limits: "This appeared unplanned during a controlled outage test, so it is classed as Unexpected; that classification is still to be confirmed. An old 1722 line stayed visible after current attempts succeeded, so timestamps matter."
copyStatus: "rewritten"
---

## How I worked it out

DC01 had just come back after the outage test, and the replication summary was not clean.

### 1. Why I did not panic

**Observed:** 2 of 5 failing, with errors 1722 and 1908. **But:** three of the five were already succeeding. A total routing, DNS or RPC failure would not look like that.

{{evidence:repl-summary-1722-1908}}


### 2. Test what the errors point at

Error 1908 means the domain controller could not be found, so I tested discovery, the DNS records, the KDC, Netlogon and time services, the time source, Kerberos on TCP 88, the RPC endpoint mapper on TCP 135 and LDAP on TCP 389, and watched showrepl repeatedly.

**Actual:** everything was healthy, and the directory converged without a forced sync.

### 3. Read the timestamps

On DC02, an older consecutive-failure line for 1722 stayed visible even though the current attempts were successful. A fresh summary settled it. An old error line is not a current failure.

{{evidence:repl-stale-1722-line}}

