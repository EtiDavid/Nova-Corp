---
title: "DC02 could not reach DC01, but ping worked."
summary: "After moving the domain controllers to VLAN 20, DC02 could not open SMB or RPC connections to DC01. I never proved the cause, rolled back to snapshots, and met the same kind of failure again in CR-008."
date: "Date not recorded"
outcome: "Recovered by restoring snapshots; cause not proven"
status: "tested"
systems: ["nova-dc01", "nova-dc02", "nova-prox01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/Journal-CR-004.md"
type: "real"
cr: "CR-004"
services: ["replication", "vlan-segmentation"]
lines: ["identity", "network"]
segment: { from: "nova-dc01", to: "nova-dc02", line: "identity" }
pin: { col: 67, row: 23.5 }
shortTitle: "DC02 could not reach DC01, but ping worked."
saw: "DC02 could not open SMB or RPC connections to DC01, so I could not join it to the domain or promote it. Ping worked both ways."
cause: "Not proven. Every layer I tested looked healthy. I now think it was the same subnet mismatch I found in CR-008, but I cannot prove it."
fix: "I restored both domain controllers from their pre-CR-004 snapshots and ran the deployment again."
proof: "On the clean baseline, ports 445 and 135 connected at once, the domain join and promotion worked, and replication was healthy."
copyStatus: "rewritten"
---

## How I worked it out

DC02 had just moved to [[VLAN]] 20. I was joining it to the domain and promoting it. From DC01, [[SMB]] (port 445) and RPC (port 135) reached DC02. From DC02, both failed. Ping worked in both directions the whole time. I tested one layer at a time.

### 1. Does basic IP work?

```powershell
ping 10.10.20.10
ping 10.10.20.11
```

**Expected:** both directions succeed. **Actual:** both did, in under 1 ms. ICMP worked, so basic reachability was fine. That did not rule out a TCP-level problem or asymmetric routing.

### 2. Does SMB connect?

```powershell
Test-NetConnection 10.10.20.10 -Port 445
```

**Expected:** `TcpTestSucceeded : True`. **Actual:** `False` from DC02, `True` from DC01 to DC02. The failure only went one way, and port 135 failed the same way.

### 3. Is Windows Firewall blocking it?

I checked the Active Directory, File and Printer Sharing and RPC rule groups on DC01: all enabled, the network profile was `DomainAuthenticated`, and there were no block rules. Then I turned the firewall off completely. **Same result.** Not the firewall.

### 4. Is it DNS?

```powershell
nslookup nova.corp
Resolve-DnsName nova.corp
```

I asked [[DNS]] for both names. Both resolved, and the LDAP and Kerberos SRV records were there. Not DNS.

<details>
<summary>Show the other 5 steps</summary>

### 5. What does the handshake look like?

I captured on DC02 with Wireshark. DC02 sent a SYN, DC01 answered with a SYN-ACK, but DC02 never received it. DC02 kept resending the SYN until DC01 reset the connection. A working ping had told me nothing about whether TCP would connect.

### 6. Is the Windows network stack dropping it?

```
pktmon start --etw -m real-time
```

On DC01, the SYN arrived and the SYN-ACK left. Now and then a `land attack` drop showed up. Later captures with clean SYN packets failed the same way, so that was not the cause.

### 7. Is the virtual switch dropping it?

```bash
tcpdump -i vmbr1 -nn host 10.10.20.10 or host 10.10.20.11
```

The Proxmox bridge saw the SYN, the SYN-ACK and every retransmission, and it forwarded all of them. ARP was fine. This was the most useful test: it put the problem below Windows on DC01 and the bridge, and showed the bridge was not at fault.

### 8. Is pfSense involved?

Two hosts on the same VLAN are switched at the bridge, so this traffic never reaches pfSense. I checked the VLAN 20 rules anyway, and the capture agreed.

### 9. Is DC02 itself broken?

I built a fresh Windows Server, promoted it in a separate temporary domain, and connected to it from DC02 on 445 and 135. Both worked at once. DC02 could make these connections; only DC01 and DC02 could not.

</details>

## The fix, and how I proved it

After about 24 hours I stopped investigating. Nothing I could prove pointed to a fix, so I used the snapshots I had taken before CR-004. I restored DC01 and DC02, removed the temporary test environment, and ran the deployment again from checkpoint 1.

On the clean baseline, ports 445 and 135 connected immediately, the domain join and domain controller promotion finished, and replication was healthy. All validation tests passed, and the problem did not come back.

## Found later, in CR-008

During the file server build I hit the same kind of failure: ping worked, but TCP connections to a domain controller failed. This time a capture on the Proxmox bridge showed FILES01 sending its traffic straight to the domain controller, while the domain controller sent its replies through pfSense. The cause was a mismatch: DC01 and DC02 were configured with a `/32` prefix and FILES01 with `/24`. I put all three servers on `/24` and it worked. The full case is [Same network, two subnet masks](/incidents/fileserver-subnet/).

I think the same setting was behind the CR-004 failure, but I cannot prove it. The CR-004 journal does not record the prefix lengths, and the rollback removed the evidence.

## What I would take from this

- A working ping proves very little. Test the real port, in both directions.
- Capture on the bridge, below the guests, before blaming a guest.
- A rollback can remove a symptom without explaining it. Take a baseline capture and check prefix lengths and routes before a big change.

## What this doesn't prove

I never proved the cause of the CR-004 failure. The journal's best guess is a corrupted network state on DC02, but restoring the snapshots stopped me from testing it, and the subnet idea above is a suspicion, not a result.
