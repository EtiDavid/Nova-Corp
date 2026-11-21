# Running Nova Corp

The lab is operated as a connected set of services rather than isolated VMs. Startup order, health checks, backup inspection and recovery procedures are documented so that a fault can be diagnosed systematically.

## Daily operating questions

| Question | Where to investigate |
| --- | --- |
| Is the hypervisor/storage healthy? | [Proxmox](systems/NOVA-PROX01.md) |
| Is network routing available? | [pfSense](systems/NOVA-FW01.md) |
| Can a client discover the domain? | [DNS](services/DNS.md) |
| Are both Domain Controllers healthy? | [AD resilience](services/ACTIVE_DIRECTORY.md) |
| Are files reachable? | [SMB and DFS](FILE_SERVICES.md) |
| Have backups run and can we restore? | [Backup and recovery](services/BACKUPS.md) |
| Did a workstation receive policy? | [Group Policy](POLICIES.md) |

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

[Phase 2 operations runbook](../runbooks/PHASE-2-OPERATIONS-RUNBOOK.md) · [Recovery services](services/BACKUPS.md) · [Tests and incidents](TESTS_AND_RECOVERY.md).