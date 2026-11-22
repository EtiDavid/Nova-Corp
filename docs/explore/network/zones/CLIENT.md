# CLIENT — Nova Corp network area

**Interface:** `opt4` · **Device:** `vtnet1.40 (VLAN 40)` · **Address / gateway:** `10.10.40.1/24` · **Verified configuration:** 22 November 2026.

## Why this network exists

Windows employee workstations and user-facing tests.

## What is connected here?

[NOVA-CLIENT](../../systems/NOVA-CLIENT.md) — 10.10.40.100.

## Firewall rules on this interface

1. [Rule 1795199640](../rules/1795199640.md)
2. [Rule 1795195682](../rules/1795195682.md)
3. [Rule 1782219813](../rules/1782219813.md)

Two security blocks appear first (pfSense web ports and MGMT network). A broad allow rule follows. CR-015 tested management denial and normal DNS/AD/SMB/Internet access.

## DHCP / address assignment

10.10.40.100–10.10.40.199

## Follow a related path

[See the rules in order](../RULES.md) · [pfSense](../../systems/NOVA-FW01.md) · [Network overview](../../NETWORK.md) · [Tests and incidents](../../TESTS_AND_RECOVERY.md).

The exported settings describe the firewall configuration; they are not a substitute for observing actual packets and client behavior.

[← Network Gatehouse](../../NETWORK.md)