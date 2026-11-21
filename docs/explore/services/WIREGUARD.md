# WireGuard — Remote access to Nova Corp

## What it does

WireGuard creates an encrypted network tunnel between a remote client and Nova Corp's pfSense firewall.

The tunnel does not automatically give the user permission to reach everything.

## How a connection reaches the lab

```text
Remote laptop
   → home/Internet path
   → outer router port forwarding
   → pfSense WAN rule
   → WireGuard peer authentication
   → VPN_REMOTE firewall policy
   → approved internal destination
```

## What Nova Corp tested

During the initial attempt, UDP packets reached pfSense but the VPN did not respond. Packet capture and rule counters helped isolate the problem to the WireGuard peer configuration, rather than routing or port forwarding. Recreating the client key pair and correcting the peer entry resolved the failure.

After the repair, approved internal DNS, Kerberos, LDAP and SMB paths were checked along with denied management paths under the tested scope.

## What comes next

A separate privileged-admin VPN and stronger management-plane isolation are the next security milestone; they are not part of the already completed remote-access setup.

[Network and firewall](../NETWORK.md) · [pfSense](../systems/NOVA-FW01.md) · [Full VPN engineering journal](../../Documentation/Change-Requests/Journal-CR-007.md).