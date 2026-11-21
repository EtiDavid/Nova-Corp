# Contractor removable-storage policy

**GPO:** `NOVA-sec-deny-usb-contractors`  
**Target:** `Nova Users → Contractors` OU

## Why it exists

Contractor accounts should not be able to use removable storage on company workstations.

## Configuration

In the user half of Group Policy, **All Removable Storage classes: Deny all access** was enabled.

### Link to the OU

![GPO linked to Contractors OU](../../Documentation/Change-Requests/evidence/01-contractor-usb-gpo-link.png)

### The configured restriction

![Deny all removable storage enabled](../../Documentation/Change-Requests/evidence/02-usb-deny-all-removable-storage-enabled.png)

## Test user

[John Shaw](../people/JOHN_SHAW.md) was located in the contractor OU. His `gpresult` output showed this policy in the applied list.

![Test account received policy](../../Documentation/Change-Requests/evidence/03-contractor-user-gpresult.png)

**What was not fully tested:** passing a physical USB device through the nested VMware/Proxmox/Windows chain was unreliable, so the documented result is policy configuration/application rather than a proven physical USB block.

## Connected concepts

[OU tree](../DIRECTORY.md) · [Windows client](../systems/NOVA-CLIENT.md) · [Group Policy](../POLICIES.md).

[Read original implementation and limits](../../Documentation/Change-Requests/Journal-CR-006.md).

[← All policies](../POLICIES.md)