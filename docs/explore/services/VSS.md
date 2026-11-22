# Shadow Copies & VSS — Earlier versions of files

**VSS (Volume Shadow Copy Service)** helps Windows create consistent snapshots for backup and previous-version recovery.

Nova Corp uses Shadow Copies for file-service recovery alongside Windows Server Backup. These are different layers.

## Two recovery questions

**"I changed a document and want an older version."** Check Previous Versions / Shadow Copies where available.

**"The file is gone or the earlier version isn't available."** Use the Windows Server Backup recovery path.

**[View the 30 recorded Shadow Copy points](../files/VSS.md)**. They are recorded across two Windows volume identifiers; their existence alone is not a full-restore test.

## Where it runs

[NOVA-FILES01](../systems/NOVA-FILES01.md).

VSS may be stopped when idle because it uses an on-demand service model; a stopped/manual service alone is not evidence of a failure.

## Related tests

An earlier-version test saved a Shadow Copy of a file, changed the live version, then retrieved the earlier content from the snapshot. The earlier version's SHA-256 matched the original while the changed live file's hash did not. [See the detailed validation](../../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md).

In a separate [backup incident](../incidents/backup-target-disappears.md), Windows Server Backup lost its target disk, recovered after the disk returned, and restored a deleted file. That result must not be confused with the Shadow Copy test.

[Read DFS/Shadow Copies PDF](../../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) · [Backup and restore](BACKUPS.md).