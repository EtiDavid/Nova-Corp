---
title: "Running Nova Corp"
sourcePath: "docs/explore/OPERATIONS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/OPERATIONS.md"
section: "explore"
---

# Running Nova Corp

The lab is operated as a connected set of services rather than isolated VMs. Startup order, health checks, backup inspection and recovery procedures are documented so that a fault can be diagnosed systematically.

## Daily operating questions

| Question | Where to investigate |
| --- | --- |
| Is the hypervisor/storage healthy? | [Proxmox](/reference/explore/systems/NOVA-PROX01/) |
| Is network routing available? | [pfSense](/reference/explore/systems/NOVA-FW01/) |
| Can a client discover the domain? | [DNS](/reference/explore/services/DNS/) |
| Are both Domain Controllers healthy? | [AD resilience](/reference/explore/services/ACTIVE_DIRECTORY/) |
| Are files reachable? | [SMB and DFS](/reference/explore/FILE_SERVICES/) |
| Have backups run and can we restore? | [Backup and recovery](/reference/explore/services/BACKUPS/) |
| Did a workstation receive policy? | [Group Policy](/reference/explore/POLICIES/) |

## A practical health-check pattern

- Check the user's symptom, not just a server's status.
- Check DNS and service discovery.
- Check network and service ports.
- Check authentication and authorization.
- Review logs and compare with the last known-good state.
- Fix the smallest broken dependency.
- Run positive and negative regression tests.

## Backups and manual monitoring

Windows Server Backup uses scheduled jobs and health checks. The monitoring foundation includes manual commands and limited native checks; a centralized dashboard/alert platform is not yet a running Phase 2 service.

## Snapshot housekeeping

Twenty superseded Proxmox snapshots were removed after a storage-capacity review, leaving the intentional pre-security-change rollback point.

## Read the operator runbook

[Phase 2 operations runbook](/reference/runbooks/PHASE-2-OPERATIONS-RUNBOOK/) · [Recovery services](/reference/explore/services/BACKUPS/) · [Tests and incidents](/reference/explore/TESTS_AND_RECOVERY/).