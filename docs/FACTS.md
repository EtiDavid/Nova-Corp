# Nova Corp facts (single source of truth)

The website and the README must match this table. Change it here first.

| Fact | Value |
| --- | --- |
| Scope | Windows infrastructure foundation complete (CR-001 to CR-015). Linux, Microsoft 365 and monitoring are planned. |
| WireGuard | Encrypted tunnel, not a VLAN |
| VLANs | Five: MGMT 10, INFRA 20, APP 30, CLIENT 40, DMZ 50 |
| Hypervisor | Proxmox VE nested on VMware Workstation, on a single Windows 11 host |
| Next change | CR-016, privileged admin VPN and management-plane isolation (not started) |
| Phase naming | "Phase 2" = the completed Windows foundation (CR-001 to CR-015), matching `PHASE-2-OPERATIONS-RUNBOOK.md` |
| Last evidence date | 22 Nov 2026 (directory snapshot) |
| Sign-off | 21 Nov 2026, conditional pass. Conditions: external WireGuard validation and privileged-admin isolation deferred to CR-016; no centralized monitoring; single physical host failure domain; second-operator runbook test waived |
