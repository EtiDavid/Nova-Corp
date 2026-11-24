# Missing Public Evidence Images — Nova Corp Website

## Incident-to-journal visual audit — 24 November 2026

- The WireGuard handshake web page now contains the exact public investigation from `docs/explore/incidents/wireguard-handshake.md`, a direct GitHub link to the real original full `docs/Documentation/Change-Requests/Journal-CR-007.md`, and a separately readable in-site full journal route. **Six already-public CR-007 PNG teaching diagrams** were copied byte-for-byte from `docs/Documentation/Change-Requests/cr007_assets/` to `site/public/journal-figures/cr007/` at build time with a per-image SHA-256 manifest. The incident displays three appropriately captioned diagrams; they explain the packet path, diagnostic funnel and firewall rule ordering, **not live WireGuard evidence**. Check the other three through the full CR-007 journal.
- The incident `/incidents/backup-target-unavailable/` now reproduces all seven original public test steps and exact SHA-256 outcome, while linking the **actual** `docs/Documentation/Change-Requests/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf` as its full primary journal. The full journal is PDF, not Markdown. The actual CR-014 diagnostic screenshots remain un-extracted and are **not** simulated on the page.
- The same source and journal reconciliation applies to all sixteen incident pages. The website no longer mislabels shorter public explorer Markdown as the *full* engineering journal. Source mappings and original journal file existence are enforced by `site/scripts/check-incident-fidelity.mjs`, while Chromium checks that the embedded original CR-007 diagram assets really load.

**Next imaging task:** Review individual screenshots inside `Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf` and the other published PDF journals, redact any sensitive personal/security information, extract each proof image with the page and command/result context, and add it to the correct incident page with the original journal and test linkage. Do not mistake an original drawn training diagram for an observed test screenshot. Until the extraction is reviewed, the labeled placeholders are intentional.

---


**Purpose:** This is a **public media backlog** for the site. It does not imply the screenshots already exist, or that an illustrative image proves the underlying incident. Pages use an explicitly labeled placeholder until each original, redacted screenshot is reviewed and published.

## Evidence verified and already used
The website currently stages five **unchanged** public GPO screenshots from `docs/Documentation/Change-Requests/evidence/`. `site/scripts/stage-public-evidence.mjs` verifies PNG signatures and emits SHA-256 manifest entries. The site verifies byte-for-byte parity during CI. They show configurations and/or selected historical `gpresult` results, not every future behavioral claim.

## Missing and requested images

| Requested filename (proposal only) | Page / story | Desired screenshot and proof boundary | Status |
| --- | --- | --- | --- |
| `dc01-ad-dns-roles-redacted.png` | NOVA-DC01 profile | Redacted Server Manager/AD DS/DNS console showing DC01's configured roles. Not proof of failover. | MISSING |
| `dc02-replication-health-redacted.png` | NOVA-DC02 profile / replication divergence | `repadmin` output or relevant DNS/domain console with identifiers, taken from the documented test. Not a fresh health claim. | MISSING |
| `dc01-outage-client-failover-redacted.png` | DC01 outage | Workstation `nltest` DC selection or `klist` output confirming DC02 in the outage exercise, with timestamp/context redacted as needed. | MISSING |
| `dns-client-resolver-fault-redacted.png` | DNS incident | Wrong resolver `192.0.2.53`, authoritative DNS response, SMB TCP/445 test and repaired result; use only if matching real session screenshots exist. | MISSING |
| `files01-share-and-ntfs-rights-redacted.png` | NOVA-FILES01 profile | Genuine share and NTFS permissions or File Server console for configured departmental folders. | MISSING |
| `files01-restore-hashes-redacted.png` | Backup-target incident | Original and restored SHA-256 check outputs, clearly a **file-level** restore (not whole VM). | MISSING |
| `pfsense-rule-order-redacted.png` | Firewall management exposure | pfSense rule list showing ordered management deny above broader pass, with private source network details/redacted sensitive values. | MISSING |
| `proxmox-thinpool-before-after-redacted.png` | Proxmox storage pressure | Real storage utilization evidence for recorded `86.73%` → `52.88%`, with no fabricated charts. | MISSING |
| `wireguard-peer-handshake-redacted.png` | WireGuard investigation | Real before/after handshake counters with **all keys and credentials removed or rotated**. | MISSING |
| `gpo-wallpaper-disabled-link-redacted.png` | GPO link-disabled incident | Actual historical `gpresult` showing **Disabled (Link)** and post-repair **Applied** results. Existing unrelated GPO images must not be relabeled. | MISSING |
| `proxmox-webgui-service-restored-redacted.png` | Proxmox GUI failure | Real web management service status/outage and restored status. | MISSING |
| `bulk-users-rollback-redacted.png` | CR-011 PowerShell tool | Historical rollback log showing invalid password cleanup, with users and secret values redacted. | MISSING |
| `group-acl-checker-normalization-redacted.png` | CR-011 analyzer bug | Corrected identity comparison and positive/negative test output (domain-qualified vs bare group names). | MISSING |

## Release process
1. Locate screenshot in the original owner journal(s). If the journal only exists as a private PDF, convert it to reviewed Markdown **before** publishing relevant excerpts. Do not expose private PDFs or source images automatically.
2. Scrub usernames where necessary, keys, credentials, internal account secrets and network details the owner hasn't approved for public release.
3. Preserve source provenance, test scope, commands, expected/actual outputs and the evidence date in the *journal*, even if not shown in the homepage decorative design.
4. Check that the image actually belongs to the named incident. Do not attach an unrelated screenshot solely to fill visual space.
5. Publish through the reviewed evidence staging mechanism, verify SHA-256 and ALT text, update case-specific pages and remove only the corresponding placeholder.

## Logos are NOT engineering evidence
The owner-shared Google Drive `files.rar` archive provided Proxmox, **pfSense Plus**, Windows Server and generic file-server logos. These are **branding artwork** rather than screenshots from this lab. The deployed documented firewall is **pfSense CE 2.8.1**; do not display a `pfSense Plus` edition mark as though that is the installed product. Product logos may identify technology, with vendor ownership respected, but cannot fill the missing proof images above.
