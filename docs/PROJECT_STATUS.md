# Nova Corp — work index and publication status

**Reviewed:** 16 November 2026  
**Important:** This index distinguishes work in the lab from documentation currently *publicly available in this repository*. It is not a live service-health dashboard.

## Publicly available journals

| CR | Subject | Public evidence | Notes |
| --- | --- | --- | --- |
| CR-001 | Proxmox virtual platform | [Journal](Documentation/Change-Requests/Journal-CR-001.md) · [failure tests](Documentation/failure-testing-report.md) | Foundation and recovery testing |
| CR-002 | pfSense / network foundation | [Journal](Documentation/Change-Requests/Journal-CR-002.md) | Historical implementation record |
| CR-003 | Active Directory and DNS | [Journal](Documentation/Change-Requests/Journal-CR-003.md) | Historical implementation record |
| CR-004 | Domain controller / redundancy foundations | [Journal](Documentation/Change-Requests/Journal-CR-004.md) | Earlier milestone; later resilience validation is CR-013 |
| CR-005 | Organizational units and identity management | [Journal](Documentation/Change-Requests/Journal-CR-005.md) | Historical implementation record |
| CR-006 | Group Policy | [Journal](Documentation/Change-Requests/Journal-CR-006.md) | Also contains supporting evidence images |
| CR-007 | WireGuard remote access and workstation integration | [Journal](Documentation/Change-Requests/Journal-CR-007.md) | Technical implementation passed, with external workstation limitations |
| CR-008 | File server deployment | [PDF journal](Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) | PDF currently published |
| CR-009 | Department shares and drive mapping | [PDF journal](Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) | PDF currently published |
| CR-010 | DFS and Shadow Copies | [PDF journal](Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf) | PDF currently published |
| CR-011 | PowerShell administration toolkit | [Markdown journal](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md) · [PDF](Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.pdf) | Technical journal identifies completed validated release |

**Published file** means the named file has been observed in this public repository's history. It does not mean every link, screenshot, control or statement has been separately revalidated in this publication pass.

## More recent working-repository status

The private working repository's live handoff (last checked 12 November 2026) records:

| CR | Engineering status recorded there | Public status here |
| --- | --- | --- |
| CR-012 | Earlier recovery work referenced in later baselines | Journal not yet published in this repo |
| CR-013 | Technical validation complete; journal marked **draft pending final editorial review** | Full journal not yet published |
| CR-014 | Incident exercises **in progress**; share/NTFS and DNS exercises closed; Group Policy exercise active | Live records and evidence not yet sanitized/published |
| CR-015 | Not yet demonstrated complete in the reviewed handoff | No public journal yet |
| CR-016 | Required privileged-admin VPN / management-plane isolation security gate before Phase 3 | Not yet demonstrated complete in the reviewed handoff |

**No status is inferred here for CR-017 through CR-033.** Those are future roadmap items, not evidence of implemented technologies. We will add them to the public roadmap when the approved source and their actual state are reviewed for publication.

## Read this before treating a line as proof

- **Technical status** — whether the lab tests and acceptance criteria have passed.
- **Journal status** — whether the detailed engineering document has finished review.
- **Portfolio status** — whether public, sanitized evidence can be opened without access to my private repo.

These are different states. For example, CR-013 passed the recorded technical tests while its journal was still marked draft.

## Next editorial work

1. Review and sanitize the CR-012–CR-014 material, with source-to-public evidence links.
2. Replace the simplified ASCII diagram with an accurate, readable architecture image.
3. Move key PowerShell scripts into a safe, separately reviewed public code section.
4. Validate image links, crop/redact screenshots and remove accidental metadata sidecar files before expanding the portfolio.
5. Keep this index aligned with actual change-request closure and newer journal reviews.

None of these presentation tasks changes the frozen Nova Corp engineering roadmap or replaces the original journals.
