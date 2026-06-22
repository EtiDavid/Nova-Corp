# Nova Corp — Enterprise Infrastructure Lab

> Operate it. Break it. Fix it. Document it.

Nova Corp is a fictional company that I'm building to simulate a real company's, fully connected enterprise IT environment and not a checklist of disconnected tutorials. I'm the Infrastructure Engineer. I built it, and I'm responsible for keeping it running, fixing it when it breaks, and proving every decision with documentation.

This is a portfolio project built to demonstrate real SysAdmin and DevOps skills.

**Current status: 🟡 In Progress — Phase 2 (Active Directory: building OU structure and security groups)**

---

## Why this exists

After learning so many tools in isolation, I decided to start a fun, real-world project that brings all of them together and shows how they depend on one another.

Nova Corp is a simulated enterprise environment where every server depends on the ones before it, every change is driven by a ticket or an incident (just like in a real company), and nothing is considered complete until it is monitored, backed up, tested, and fully documented. The goal is not just to build infrastructure, but to operate it, break it, fix it, and understand how all the pieces work together as a real production environment.
## How it works

Three things run in parallel through every phase:

| | |
|---|---|
| 🎫 **Tickets** | Business requests that arrive like real helpdesk tickets — implemented like an engineer would, not as a checklist |
| 🔥 **Incidents** | Failures deliberately introduced right after each technology is built. Diagnosed with real tools, then written up |
| ✅ **Checkpoints** | Before moving to the next phase, every service must be working, monitored, backed up, and documented |

## The four rules

1. **Nothing is configured by hand twice** — if I touch a server manually, the Ansible task gets written before moving on
2. **Monitoring before production** — a service doesn't exist operationally until it's being observed
3. **Every incident gets a written report** — title, severity, timeline, impact, root cause, resolution, prevention, monitoring gap. No exceptions
4. **Answer "what if this server dies?" before moving on** — every major service needs a documented backup and recovery procedure

---

## Architecture

All VMs run inside Proxmox VE, nested inside VMware Workstation, on a single Windows 11 machine. pfSense handles all VLAN routing and firewall rules, with default-deny between every VLAN — every allow rule is explicit and documented.

*(Architecture diagram below — see `/docs/network-diagram.png`)*

| VLAN | Name | Subnet | Purpose |
|---|---|---|---|
| 10 | MANAGEMENT | 10.10.10.0/24 | Proxmox UI, pfSense admin, Ansible control node — only zone with full reach |
| 20 | SERVERS | 10.10.20.0/24 | Domain Controllers, File Server, Monitoring stack |
| 30 | LINUX-SRV | 10.10.30.0/24 | Web app servers, Database, GitLab runner |
| 40 | CLIENTS | 10.10.40.0/24 | Windows 10/11 domain workstations |
| 50 | DMZ | 10.10.50.0/24 | Nginx reverse proxy — only zone reachable from the host network |

### Server registry (CMDB)

| Hostname | OS | IP | VLAN | Role |
|---|---|---|---|---|
| nova-fw01 | pfSense | 10.10.10.1 | MGMT | Firewall, DHCP, DNS forwarder, VLAN router |
| nova-prox01 | Proxmox VE | 10.10.10.2 | MGMT | Hypervisor — all VMs live here |
| nova-ansible01 | Ubuntu 22.04 | 10.10.10.10 | MGMT | Ansible control node |
| nova-dc01 | Win Server 2025 | 10.10.20.10 | SERVERS | Primary Domain Controller, AD DS, DNS |
| nova-dc02 | Win Server 2025 | 10.10.20.11 | SERVERS | Secondary DC, FSMO backup |
| nova-files01 | Win Server 2025 | 10.10.20.20 | SERVERS | File server, DFS, Shadow Copies |
| nova-monitor01 | Ubuntu 22.04 | 10.10.20.30 | SERVERS | Prometheus, Grafana, Loki, Alertmanager, Vault |
| nova-web01 | Ubuntu 22.04 | 10.10.30.10 | LINUX-SRV | Internal web app (Node.js), GitLab Runner |
| nova-web02 | Ubuntu 22.04 | 10.10.30.11 | LINUX-SRV | Web app replica — load balanced |
| nova-db01 | Ubuntu 22.04 | 10.10.30.20 | LINUX-SRV | PostgreSQL database |
| nova-proxy01 | Ubuntu 22.04 | 10.10.50.10 | DMZ | Nginx reverse proxy — public entry point |
| nova-client01 | Windows 11 | 10.10.40.10 | CLIENTS | Domain-joined workstation |

### Why the order matters

This isn't a curriculum — it's an architecture. Each layer depends on the one before it:

1. **pfSense** — no network, nothing works
2. **Active Directory** — identity source for the whole environment; Linux auths via AD (SSSD), Ansible uses an AD service account, Keycloak federates AD for SSO
3. **Ansible** — every Linux server is provisioned from `nova-ansible01`, nothing configured manually twice
4. **Application** — the internal Node.js app, PostgreSQL backend, load-balanced through the DMZ
5. **CI/CD** — GitHub Actions deploys on-prem (via Ansible) and to AWS ECS Fargate (via Terraform + OIDC)
6. **Observability** — Prometheus, Grafana, Loki, Alertmanager — nothing goes live unobserved
7. **Cloud** — Terraform provisions the AWS side; the same app runs on-prem and in the cloud, hybrid

---

## Build phases

| Phase | Focus | Status |
|---|---|---|
| 1 | Foundation — Proxmox & Networking (pfSense, VLANs, DHCP, backups) | ✅ Complete |
| 2 | Identity — Active Directory & Windows Infrastructure | 🟡 In progress (OU structure & security groups) |
| 3 | Configuration Management — Ansible | ⬜ Not started |
| 4 | Application — Nova Corp internal app | ⬜ Not started |
| 5 | Observability — Prometheus, Grafana, Loki | ⬜ Not started |
| 6 | CI/CD — GitHub Actions & GitLab | ⬜ Not started |
| 7 | Security — VPN, Vault, SSO | ⬜ Not started |
| 8 | Hybrid Cloud — Terraform + AWS | ⬜ Not started |
| 9 | Advanced Incident Scenarios | ⬜ Not started |
| 10 | Portfolio — documentation & writeups | ⬜ Ongoing |

---

## What's been built so far

**Phase 1 — Foundation**
- Proxmox VE installed and running nested inside VMware Workstation, VT-x/AMD-V enabled
- pfSense deployed as the firewall/router for all 5 VLANs, default-deny between VLANs, explicit allow rules documented in plain English
- DHCP and static leases configured per VLAN
- Nightly Proxmox backups configured and verified
- VLAN isolation tested (e.g. CLIENTS cannot reach SERVERS unless explicitly allowed)
- 4 incidents diagnosed and documented (no internet after setup, VLAN leak, DHCP failure on a VLAN, locked out of Proxmox UI after a firewall change)

**Phase 2 — Identity (in progress)**
- `nova-dc01` deployed as the primary Domain Controller, `nova.local` domain created
- Currently building: OU hierarchy (IT / HR / Finance / Developers / ServiceAccounts / Workstations) and security groups (GRP-IT, GRP-HR, GRP-Finance, GRP-Developers, GRP-Managers)
- Next: bulk user provisioning script, GPOs, file server with DFS and Shadow Copies, first user-lifecycle tickets

## Incident reports

Every deliberately-broken thing gets a full report: title, severity, timeline, impact, root cause, resolution, prevention, monitoring gap. These live in [`/docs/incidents`](./docs/incidents) as they're written.

| ID | Title | Phase | Status |
|---|---|---|---|
| INC-N-001 | VM cannot reach internet after Proxmox setup | 1 | ✅ Resolved |
| INC-N-002 | VLAN traffic not isolated — client reaches server | 1 | ✅ Resolved |
| INC-N-003 | DHCP not assigning IPs on a VLAN | 1 | ✅ Resolved |
| INC-N-004 | Locked out of Proxmox UI after firewall change | 1 | ✅ Resolved |

*(More added as each phase progresses — target is 20+ by the end of the project.)*

## Tech stack

`Proxmox VE` · `pfSense` · `Windows Server 2025` · `Active Directory / GPO` · `Ubuntu 22.04` · `Ansible` · `Ansible Vault` · `Node.js` · `PostgreSQL` · `Nginx` · `Prometheus` · `Grafana` · `Loki` · `Alertmanager` · `GitHub Actions` · `GitLab CE` · `HashiCorp Vault` · `Keycloak` · `Terraform` · `AWS (ECS Fargate, RDS, ALB, Route 53)` · `WireGuard`

## Repository structure

```
nova-corp/
├── docs/
│   ├── network-diagram.png
│   ├── Documentation/          
│       ├── Change-Request/
        ├── Incident-Report/
        ├── Screenshots
│   └── runbooks
├── ansible/
│   ├── /
│   ├── /
│   ├── /
│   └── /
├── Backup/                   
└── terraform/               
```

## Follow the build

I'm documenting this in public as I go — incidents, decisions, and what actually broke (not just the polished end state). Posts on [LinkedIn](#) track each phase as it's completed.

---

*This project is built for learning and demonstration purposes as part of a transition into Cloud/Infrastructure Engineering and DevOps roles.*