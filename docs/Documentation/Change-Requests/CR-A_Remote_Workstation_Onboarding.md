# CR-A: Remote enterprise workstation onboarding

**Status:** closed, pass within the approved scope. Supplemental change, outside the locked numbered roadmap. The next numbered change is still CR-016.

This is a sanitized public summary of the private CR-A engineering journal. It leaves out the router's public address, keys, hashes, backup locations, device identifiers and raw screenshots. The original screenshots are kept privately; sanitized copies will be added only after each one has been reviewed.

## What was asked

A new laptop must get access to the company network and the shared folders, with the right security rules. The test was to behave like an employee working away from the office, without exposing management services and without opening up every server.

## What was built

- A physical Windows 11 Pro laptop, **NOVA-LAP01**. It is not a virtual machine and it does not sit on the CLIENT network. NOVA-CLIENT stays as it was.
- A separate WireGuard peer for the laptop (tunnel address 10.10.60.11/32), added beside the existing peer, which was left untouched. It is a split tunnel: only the internal destinations it needs go through the VPN.
- The laptop joined to `nova.corp` and placed in the Workstations OU.
- One narrow firewall exception: TCP 445 from the laptop (10.10.60.11) to FILES01 (10.10.20.20) only, logged, placed above the existing INFRA block rule.
- A final encrypted pfSense backup, copied off the host.

## What was tested, and what happened

| Check | Result |
| --- | --- |
| Tunnel from the home network | Handshake, gateway ping 4/4, DNS over TCP 53 through the tunnel |
| Tunnel from a phone hotspot | Failed at first, then passed after one fix (see "Two failures") |
| Domain discovery | Four SRV queries answered by both domain controllers, and the DC locator found DC01 |
| TCP reachability to both domain controllers | 14 of 14 checks passed. This tests the transport, not authentication |
| Reboot | The tunnel service came back by itself and the domain controllers were reachable, without opening the VPN app |
| Domain join | Joined, secure channel healthy, computer object in the Workstations OU |
| Kerberos and time | Moyo got a ticket-granting ticket using AES-256 and service tickets from both domain controllers; time sync with DC01 was normal |
| Group Policy | User and computer policy reports were correct |
| Moyo and the IT drive | Z: mapped to the IT share. She created, wrote, read, appended to and deleted a test file. Eight of eight steps passed |
| Moyo and other departments | Finance, HR, Management and Sales were each explicitly denied |
| John (contractor) | No drive mapped, and all five department folders were explicitly denied |
| USB flash drive | Moyo could read, create and write. John was denied the same device. Then Moyo was allowed again |
| Firewall logs | SMB to FILES01 went from blocked to allowed. RDP (3389) and WinRM (5985) stayed blocked |
| Final backup | The copy's SHA-256 hash matched the original |

## Two failures that were worked through

### 1. The VPN worked at home but failed on the hotspot

The first peer used the firewall's private address as its endpoint. That address is reachable on the home network and nowhere else. On the hotspot, DNS queries timed out and TCP 53 failed, even though the tunnel interface existed. Returning to home Wi-Fi made the same tests pass, which isolated the network path as the cause. The fix was to change only the peer's endpoint to the router's public address on UDP 51820, using the router's existing port forward. No firewall rule changed. After that, the hotspot tests passed.

An interface that exists does not prove a handshake or a path.

### 2. The employee could sign in, but her departmental drive was missing

This had two stages. First, the firewall blocked SMB to FILES01. That block was the design, and a log showed it. After the narrow TCP/445 exception, direct access to the DFS namespace worked, and the same five folder names appeared. The automatic drive mapping was still missing, even after a user policy refresh. No manual mapping and no further policy edits were made. After a restart, Z: appeared by itself.

How the mapping was applied after the restart was not inspected, so no policy root cause is claimed.

## What this does not prove

- **Management isolation is not done.** Proxmox sits on the upstream home network. A laptop on that network can reach it directly, without the VPN. That is a separate risk and is the work of CR-016. From the hotspot, the private management addresses were unreachable and were not routed into the tunnel, which holds for the current routes only.
- **The backup was not restored.** A matching hash shows the copy is intact. It does not show the backup can be decrypted or restored.
- **Sign-in timing.** The tunnel came back after a reboot. Whether it connects before a user signs in was not tested.
- **One USB flash drive** was tested. That does not cover every kind of external disk.
- **A sequencing weakness.** The first peer was applied before every recovery-gate item had been shown. That is kept in the record and is not described as a clean pre-change pass.
- The exact list of AD ports in the firewall alias was not re-enumerated, so the 14 checks do not claim every possible AD port was validated.
- The original output of the domain-join command was not captured.

## What it closed

This completes the physical USB exercise deferred from CR-006 and the external employee VPN exercise deferred from CR-007. The CR-014 external VPN test stays recorded as deferred in its own journal; CR-A is the later test that closed it.
