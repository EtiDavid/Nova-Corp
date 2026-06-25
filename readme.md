# Nova Corp — Enterprise Infrastructure Lab

> **Operate it. Break it. Fix it. Document it.**

Nova Corp is a fictional company that I'm building to simulate a real enterprise IT environment.

Instead of learning technologies in isolation, I wanted to build a project where everything depends on the layer before it—just like in a real company.

I'm acting as the Infrastructure Engineer. I build the environment, operate it, troubleshoot failures, document every change, and gradually expand it into a complete enterprise infrastructure.

This project is part of my journey into Infrastructure Engineering, System Administration and DevOps.

---

# Why I Built This

After spending months learning Linux, Docker, networking, AWS, Terraform, GitHub Actions and Windows Server separately, I realized I understood the tools, but not how they all fit together.

Nova Corp solves that problem.

Every server, network, firewall rule and service exists because another service depends on it.

Nothing is built just because it's on a learning checklist.

Everything has a purpose.

---

# How the Project Works

Every phase follows three parallel workflows.

| Workflow                | Description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| 🎫 **Change Requests**  | Every major implementation is planned, documented and validated before moving on.                       |
| 🚨 **Incident Reports** | Real problems are investigated using evidence, documented with root cause analysis and lessons learned. |
| ✅ **Checkpoints**       | Before starting the next phase, backups, testing and documentation must be completed.                   |

This keeps the project focused on operating infrastructure, not just deploying it.

---

# Engineering Rules

These are the rules I follow throughout the project.

1. Nothing is considered complete until it has been tested.
2. Every major change starts with a backup or snapshot.
3. Every incident is documented with its root cause and resolution.
4. I focus on understanding **why** something works, not just **how** to configure it.

---

# Current Architecture

```text
                     Internet
                         │
                  Home Router
                         │
                VMware Workstation
                         │
                 Proxmox Hypervisor
                         │
                     pfSense
                         │
        ┌────────────┬────────────┐
        │            │            │
     VLAN 10      VLAN 20      VLAN 30
   Management    Servers     Applications
                     │
                nova-dc01
         Active Directory & DNS
```

The environment will continue to grow as additional services are added.

---

# Current Infrastructure

| Hostname    | Role                               | Status |
| ----------- | ---------------------------------- | ------ |
| nova-prox01 | Proxmox Hypervisor                 | ✅      |
| nova-fw01   | pfSense Firewall                   | ✅      |
| nova-dc01   | Active Directory Domain Controller | ✅      |

More infrastructure will be added as future Change Requests are completed.

---

# Build Progress

| Phase                              | Status         |
| ---------------------------------- | -------------- |
| Foundation (Proxmox & Networking)  | ✅ Complete     |
| Active Directory & Identity        | 🟡 In Progress |
| Configuration Management (Ansible) | ⬜ Planned      |
| Applications                       | ⬜ Planned      |
| Monitoring                         | ⬜ Planned      |
| CI/CD                              | ⬜ Planned      |
| Security                           | ⬜ Planned      |
| Hybrid Cloud                       | ⬜ Planned      |

---

# Completed Change Requests

| Change Request                                    | Status         |
| ------------------------------------------------- | -------------- |
| CR-001 — Deploy Proxmox Hypervisor                | ✅              |
| CR-002 — Deploy pfSense Network Foundation        | ✅              |
| CR-003 — Deploy Active Directory & Enterprise DNS | ✅              |
| CR-004 — Secondary Domain Controller              | 🚧 In Progress |

---

# Documentation

This project is documented like a real enterprise environment.

The repository contains:

* Change Requests
* Incident Reports
* Operations Handbook
* Architecture Documentation
* Runbooks
* Screenshots
* Network Diagrams

Every major decision is documented so I can explain not only **what** I built, but also **why** I built it.

---

# Troubleshooting Approach

Whenever something breaks, I follow the same process.

```text
Observe

↓

Collect Evidence

↓

Form a Hypothesis

↓

Investigate

↓

Identify the Root Cause

↓

Implement the Fix

↓

Validate

↓

Document
```

This approach has helped me avoid guessing and build better troubleshooting habits.

---

# Technologies

Current technologies:

* Proxmox VE
* VMware Workstation
* pfSense
* Windows Server 2025
* Active Directory
* DNS
* VLANs
* Linux

Planned technologies:

* Ansible
* Docker
* Kubernetes
* Prometheus
* Grafana
* GitHub Actions
* Jenkins
* Terraform
* AWS

---

# Repository Structure

```text
nova-corp/
│
├── docs/
│   ├── change-requests/
│   ├── incident-reports/
│   ├── architecture/
│   ├── runbooks/
│   ├── screenshots/
│   └── diagrams/
│
├── ansible/
├── terraform/
├── scripts/
└── backups/
```

---

# What I'm Learning

This project is helping me build practical experience in:

* Infrastructure Engineering
* Windows Server Administration
* Linux Administration
* Enterprise Networking
* Active Directory
* DNS
* System Design
* DevOps
* Documentation
* Incident Response

---

# About Me

Hi, I'm **David Eti**.

I'm passionate about Infrastructure Engineering, Cloud and DevOps, and I learn best by building real projects.

Nova Corp is my long-term home lab where I can design, operate and troubleshoot an enterprise environment while documenting everything I learn along the way.

My goal is not simply to know the tools, but to understand how real production systems are designed, maintained and improved.

---

# Project Status

🚧 **Nova Corp is an active project and will continue to grow as new technologies and services are added.**

Every completed phase, incident and engineering decision will be documented throughout the project.
