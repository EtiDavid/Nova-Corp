# WireGuard packets arrived, but the VPN stayed silent

**Resolved · PASS (CR-007)** · **Evidence record:** `INC-CR007-001`

## What happened?

The remote laptop sent UDP packets, pfSense received them, but WireGuard did not authenticate the peer.

## Why we investigated

VPN failure can happen after port forwarding and WAN firewall success but before decrypted traffic enters the tunnel.

## Root cause

Original client peer public key was incorrect, stale or not loaded as intended. Exact character-level defect was not recorded.

## Step-by-step investigation

### Step 1. Check the client symptom

```text
Windows WireGuard GUI status/traffic counters
```

**Expected / hypothesis:** Handshake should produce bytes received.

**Actual result from the journal:** Interface Active; sent bytes increased, received remained 0.

### Step 2. Check packet arrival

```text
Capture WAN UDP 51820
```

**Expected / hypothesis:** Packets appear if upstream port forward works.

**Actual result from the journal:** Repeated inbound 148-byte packets arrived.

### Step 3. Is WAN firewall accepting UDP?

```text
pfctl -vvsr
```

**Expected / hypothesis:** Matching pass rule counter should increase.

**Actual result from the journal:** Hundreds of matching packets and states.

### Step 4. Is the UDP listener actually running?

```text
sockstat -4 -l | grep 51820
```

**Expected / hypothesis:** A UDP listener at :51820.

**Actual result from the journal:** udp4 *:51820.

### Step 5. Is peer authentication completing?

```text
wg show
```

**Expected / hypothesis:** Latest handshake and transfer should be present.

**Actual result from the journal:** Peer existed, but endpoint/handshake/transfer missing; VPN_REMOTE counters 0 B.

### Step 6. Test corrected peer

```text
Recreate client keys; update pfSense peer public key; wg show
```

**Expected / hypothesis:** Bidirectional counters, gateway ping and AD traffic.

**Actual result from the journal:** Bidirectional tunnel traffic restored; approved DC tests passed.

## Repair and outcome

Recreate client key pair, update pfSense peer public key, then verify a handshake and authorized traffic. Key material that appeared in screenshots was rotated.

## Explore the real implementation

[Read the source WireGuard implementation and incident post-mortem](../../Documentation/Change-Requests/Journal-CR-007.md). That original engineering journal contains the fuller command history, screenshots, failures and explanations.

[WireGuard](../services/WIREGUARD.md) · [VPN_REMOTE](../network/zones/VPN_REMOTE.md) · [WAN rule](../network/rules/1785021391.md)

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)
