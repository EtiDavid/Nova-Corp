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

Earlier-version recovery and file restores were validated in file-service/backup work. The later recovery incident deliberately lost access to the backup target and proved restoration after repair.

[Read DFS/Shadow Copies PDF](../../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) · [Backup and restore](BACKUPS.md).