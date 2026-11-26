---
title: "Zoë — Remote-access laptop scenario"
sourcePath: "docs/explore/people/ZOE.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/ZOE.md"
section: "explore"
---

# Zoë — Remote-access laptop scenario

Zoë's laptop was used as the remote-device example in Nova Corp's WireGuard project.

This was a **remote connectivity test device**, not a confirmed Active Directory staff account.

## What was configured

- Device description in the VPN peer: `Zoë laptop remote`
- WireGuard peer address: `10.10.60.10/32`
- Tunnel network: `VPN_REMOTE`
- Client address during the test: `10.10.60.10/24`
- Purpose: Test encrypted remote access and restricted access to internal domain services.

The laptop ran Windows Home, so joining that physical device to `nova.corp` was not part of the completed acceptance result.

## Follow the connection

[Zoë's laptop](/reference/explore/people/ZOE/) → [WireGuard](/reference/explore/services/WIREGUARD/) → [pfSense](/reference/explore/systems/NOVA-FW01/) → [VPN_REMOTE network](/reference/explore/NETWORK/) → [Domain Controller services](/reference/explore/services/ACTIVE_DIRECTORY/).

## What went wrong

The initial handshake did not complete even though packets arrived at pfSense. The engineer traced the packet path and corrected the peer configuration, then tested permitted internal services.

**Full remote-access journal:** [WireGuard investigation](/reference/Documentation/Change-Requests/Journal-CR-007/).

[← People & Departments](/reference/explore/PEOPLE_AND_DEPARTMENTS/)