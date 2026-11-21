# Firewall rules — Who can communicate?

A firewall rule decides whether traffic entering an interface can reach a particular service or network. In Nova Corp, pfSense performs routing and filtering between the company’s network zones.

## Important idea

**A connection is allowed because the applicable policy permits it, not simply because a route exists.**

pfSense is stateful: after permitting a connection, the firewall tracks the conversation so appropriate return traffic is allowed.

## Understanding a rule

| Field | Meaning |
| --- | --- |
| Interface | Where the traffic entered the firewall |
| Source | Who initiated the traffic |
| Destination | Which network or host it is targeting |
| Protocol/port | Which service is involved |
| Action | Pass/block/reject |
| Order | Which matching rule takes precedence |

## Rules and tests shown in the lab

| Policy area | What was demonstrated |
| --- | --- |
| Remote VPN | WireGuard peer authentication is separate from firewall authorization. |
| Remote directory access | Restricted service traffic was tested toward Domain Controllers. |
| CLIENT management | An unintended management path was reproduced, corrected and retested. |
| Normal workstation traffic | Required DNS/AD/SMB/Internet traffic still worked after the management fix. |

For the **current full rule order**, the technical journal remains the source until the rules are exported into a browsable public table. This page deliberately avoids presenting a made-up or out-of-date rule count.

## Interactive relationships in the documentation

[pfSense device](../systems/NOVA-FW01.md) → [Network zones](../NETWORK.md) → [Remote VPN](WIREGUARD.md) → [Management hardening incident](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).

**Original work:** [Firewall and VLAN build](../../Documentation/Change-Requests/Journal-CR-002.md) · [WireGuard packet path](../../Documentation/Change-Requests/Journal-CR-007.md).