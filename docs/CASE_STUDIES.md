# Engineering stories — problems I actually investigated

These are the shorter versions for a recruiter or hiring manager. The linked journals carry the full commands, results and troubleshooting history.

## 1. A WireGuard tunnel is more than a green handshake

**Source:** [CR-007 — Remote Access VPN](Documentation/Change-Requests/Journal-CR-007.md)

**The problem.** I wanted to administer selected Nova Corp services from a separate external network without treating VPN access as permission to reach everything.

**What happened.** A peer public-key configuration mistake prevented the expected tunnel behaviour. I checked the endpoint path through the home router, NAT, pfSense and the remote client rather than assuming the issue was inside Active Directory.

**What I checked.** Handshake state, routing, DNS/DC discovery, firewall rules and approved versus disallowed network paths. The journal also covers the distinction between a working WireGuard tunnel and a successful Windows domain join.

**Result.** The controlled remote-access implementation passed its recorded final checks. External Windows domain joining and physical USB-policy validation remained deferred because the available remote laptop used Windows Home.

**What I learned.** I should test the *service a user needs*, and the access they must *not* receive—not only the connectivity indicator.

## 2. My bulk-user script reported failure but left accounts behind

**Source:** [CR-011 — PowerShell Administration Toolkit, bulk provisioning section](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)

**The problem.** A bulk onboarding workflow should either create a fully valid user or leave no incomplete user behind.

**What happened.** A weak password failed the domain's password policy after the AD object had already been created. The script stopped, but the objects were left disabled and without the intended group membership.

**What I changed.** I added transaction-like cleanup when a required step fails, recorded the rollback outcome, and reran the failure test.

**Result.** The journal records that incomplete accounts from the failed run were removed, valid users were later created, and rerunning the same CSV skipped existing accounts rather than duplicating them.

**What I learned.** Error handling is not the same thing as state recovery. A script is not safe just because it prints “Failed.”

## 3. A permission report was wrong because of a string comparison

**Source:** [CR-011 — Test-UserAccess section](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md)

**The problem.** A PowerShell access-analysis script said an IT user could not reach the IT share, even though their AD membership and the intended permissions were correct.

**What happened.** The script compared `DL_FS_IT_Modify` from the AD group results against `NOVA\DL_FS_IT_Modify` in the ACLs and treated the names as different.

**What I changed.** I normalized identity names for comparison and checked matching permissions at both SMB share and NTFS levels.

**Result.** The corrected administrative report predicted IT access allowed and Finance access denied for the test user. I also checked from the actual user session, because ACL inspection alone is not proof of successful authentication or file access.

**What I learned.** A diagnostic tool can itself introduce a misleading symptom. The safest approach is to confirm important claims through independent tests.

## 4. Early failure testing: a wrong network route

**Source:** [Proxmox failure-testing report](Documentation/failure-testing-report.md)

I deliberately misconfigured a network gateway and documented the baseline, recovery options and troubleshooting steps. This exercise taught me to preserve a known-good configuration and rollback path *before* changing the network that I use to administer the lab.

## Strong future stories — evidence not publicly released yet

My working journals also document two-domain-controller failover and replication divergence (CR-013), including observing natural recovery rather than claiming a repair I did not perform. CR-014 is collecting more controlled incident exercises. Those stories will get public case studies once the supporting logs and screenshots have been reviewed and safely published.

**Note:** This is a home lab. Incidents described here are either controlled exercises or problems observed in the lab. They are not stories about a real employer's production systems.
