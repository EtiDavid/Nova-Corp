# NOVA-LAP01

A real Windows 11 Pro laptop. It is not a virtual machine, it does not run on Proxmox, and it sits outside the lab.

It connects to the company network over a staff WireGuard VPN (10.10.60.11/32), from home Wi-Fi or a phone hotspot. It is joined to `nova.corp` and sits in the Workstations OU. What a person can open depends on who signs in: Moyo gets the IT drive, and the contractor John gets no drive.

**Limits:** management-plane isolation is not done (CR-016). The staff VPN is not a privileged administrator VPN. Whether the tunnel connects before sign-in was not tested.

See [CR-A](../../Documentation/Change-Requests/CR-A_Remote_Workstation_Onboarding.md).
