# When things went wrong at Nova Corp

Installing a system is only part of the work. I deliberately introduced faults and kept the evidence of what failed, how I isolated the cause and what happened after repair.

## 1. Domain Controller failure — did people stay connected?

**Problem:** DC01 was deliberately unavailable.

**Investigation:** Confirm DC02 service discovery, SYSVOL/NETLOGON, authentication, file access and replication state.

**Result:** The workstation continued using DC02. When DC01 returned, I checked for natural directory convergence.

[Explore DC02](explore/systems/NOVA-DC02.md) · [Read the resilience journal](Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md).

## 2. Backup target lost — could a deleted file still return?

**Problem:** The FILES01 backup disk became unavailable during a controlled test.

**Investigation:** Follow Windows Server Backup failures to the target disk; repair its availability and take a fresh backup.

**Result:** A deleted disposable file was restored to an alternate directory, and the recovered SHA-256 matched the original.

[Explore recovery](explore/services/BACKUPS.md) · [Read the incident](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md).

## 3. Automation created an incomplete user

**Problem:** A temporary password failed the domain policy after user-account creation had already started.

**Investigation:** Re-run the controlled failure and inspect AD object state.

**Result:** The bulk creation script gained cleanup/rollback behavior so an invalid account was not left behind.

[Explore the PowerShell toolkit](explore/AUTOMATION.md) · [Read the script journal](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

## 4. Two different faults looked like one file-server problem

**Problem:** A user could not reach a departmental share.

**Investigation:** Name resolution and permissions were tested independently.

**Result:** The incorrect DNS path and separate authorization issue were each corrected and the user-visible path re-tested.

[Explore DNS](explore/services/DNS.md) · [Explore file access](explore/FILE_SERVICES.md) · [Read the incident](Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md).

## 5. Final validation found an exposed management path

**Problem:** A normal client could reach the firewall management path more broadly than intended.

**Repair:** Correct firewall rule scope and use HTTPS, then test forbidden management traffic and required DNS/AD/SMB/Internet communication.

**Result:** Tested management access was blocked without breaking the necessary business paths.

[Explore the firewall](explore/systems/NOVA-FW01.md) · [Read closure work](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).

## 6. Snapshots consumed too much capacity

**Problem:** Historical snapshots left the Proxmox thin pool at 86.73%.

**Repair:** Review retention, protect the pre-security-change rollback point and retire twenty superseded snapshots.

**Result:** Thin-pool usage fell to 52.88%, recovering approximately 125.72 GiB.

[Explore Proxmox](explore/systems/NOVA-PROX01.md) · [Read storage cleanup](Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).

## More investigations

[Browse every incident category](explore/TESTS_AND_RECOVERY.md) · [View complete component inventory](explore/ALL_COMPONENTS.md).

*All investigations were controlled work inside the home lab, not incidents in an employer's production network.*