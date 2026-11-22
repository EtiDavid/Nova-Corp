# DFS Namespace — A stable company file path

Nova Corp uses a domain-based **DFS Namespace** so employees can reach shared files through a common logical path instead of having to remember the individual file server.

## User view

`\\nova.corp\shares`

## Behind the path

```text
Employee
  → \\nova.corp\shares
  → DFS Namespace
  → NOVA-FILES01 share target
```

A namespace makes paths easier to manage; it does not by itself replicate file data.

**[Open all five actual DFS links and their target folders](../files/DFS_PATHS.md)**.

## Related systems

[File server](../systems/NOVA-FILES01.md) · [SMB](SMB.md) · [DNS](DNS.md) · [Active Directory](ACTIVE_DIRECTORY.md) · [Recovery](BACKUPS.md).

## What was tested

Namespace access, target paths and user-visible file access were part of the file-service work and subsequent incidents. Shadow Copies were configured as a separate recovery mechanism.

[Read the DFS and Shadow Copies journal (PDF)](../../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) · [Incident exercises](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md).