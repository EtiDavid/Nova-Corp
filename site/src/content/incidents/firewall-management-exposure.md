---
title: "An employee PC could reach firewall admin."
summary: "A controlled security check found a management path exposed to the employee network. More specific blocks were placed before a broad allow."
date: "November 2026"
outcome: "Management path blocked; business access retained"
status: "tested"
systems: ["nova-client", "nova-fw01", "nova-dc01", "nova-files01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/pfsense-management-exposure.md"
type: "real"
cr: "CR-015"
services: ["pfsense-firewall"]
lines: ["network"]
segment: null
pin: { col: 33, row: 24.4 }
shortTitle: "An employee PC could reach firewall admin."
saw: "A normal employee PC could open firewall management pages it should not reach."
cause: "The CLIENT firewall rules allowed more management access than I intended."
fix: "I moved the pfSense web interface to HTTPS, put specific block rules for the firewall GUI ports and the MGMT network ahead of the general allow, and corrected an overbroad rule."
proof: "The management paths were denied from the workstation, and DNS, Active Directory, SMB and internet access still worked."
limits: "Broad pass rules remain on MGMT, INFRA, APP and DMZ, and privileged admin access is not isolated yet. That is the next planned change, CR-016."
copyStatus: "rewritten"
---
