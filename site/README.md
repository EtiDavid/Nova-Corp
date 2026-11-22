# Nova Corp World Explorer — development

**Status: 127-page code build now covers directory, computers, file access, network and seven Group Policies. Automated static validation passed. The public site is NOT deployed or approved for launch.**

This is the public-safe site project in the existing Nova-Corp repository. The separate private engineering repository remains the authority for unpublished source inventories, tests and launch decisions. Raw exports must never be copied here.

## Run locally

Requires Node.js 20.11+ and npm.

    cd site
    npm install
    npm run validate
    npm run check
    npm run dev
    npm run build
    npm run test:links
    npm run test:coverage
    npm run test:sources
    npm run test:evidence
    npm run test:acls
    npm run preview

Astro generates a static site into site/dist. This feature branch is for review and should not be merged or deployed until privacy, link, accessibility and actual-browser QA passes.

## Architecture

- Astro + TypeScript static pages. Company areas and all six initial system profiles have standalone URLs without JavaScript.
- CSS tokens follow the default bright, restrained palette; the design and release contract lives in the private master specification.
- A bounded React Flow island is loaded only on the IT Control Room page. Every entity and link is also offered through normal HTML for keyboard users and browsers without JavaScript.
- A Zod-validated Astro Content Collection stores incident summaries, pointing at original public source journals.
- Reviewed example entity model: src/data/entities.json and src/data/relationships.json. This initial six-entity slice is NOT a complete public export of the private 355-node / 610-relationship pre-D01 model.
- The scripts/validate-graph.mjs script rejects duplicate IDs, dangling edges, unsupported evidence links and several high-risk data patterns. This is an initial check, NOT a complete privacy audit.

## Source and status rules

Every system page includes an evidence date, plain-language explanation, source link and limitations. Introductory narratives must not mention internal collection IDs, collector exports, ZIP hashes or maintenance to-do lists. Technical evidence can retain exact journal IDs and tested commands. All published relationships must be source-supported; a configuration statement is not equivalent to a live test result.

## Public catalog implemented so far

These paths were reconstructed from the existing approved public engineering source, not from raw private exports:

- `/directory/`: all **16 actual OUs**, the built-in Users container correctly separated from OUs, and all **20 typed directory accounts** (including service, built-in and disabled identities).
- `/groups/`: the **11 company-created access groups**, direct membership from the directory source and resource permission nesting. The 51 built-in/default groups remain in the technical source, not mislabeled as custom company groups.
- `/files/`: **five departmental SMB share profiles**, five DFS referrals, independent SMB vs NTFS permission explanations, Finance's broader management authorization path, and historical access tests. `/files/permissions/technical/` exposes **all 27 SMB + 73 NTFS ACL entries** from the existing public Markdown evidence, in searchable HTML with exact principal, rights and inherited/propagation fields. Scope: **11 shares, 14 folder scopes, NOT a recursive audit**.
- `/network/`: **eight network areas** (five VLANs, WAN, LAN and a separate WireGuard tunnel), **17 ordered firewall rules**, **five approved aliases**, and explicit differences between configured traffic and real tests.
- `/policies/`: **all seven GPOs** with actual links, important stored settings, subject matter, security filter, and evidence class (configured, linked, processed, tested). Six enabled, non-enforced links and one empty/unlinked keyboard GPO. Current domain password maximum age **180 days**; DC policy LDAP signing set to **None**, not an effective-signing test. Contractor `gpresult` processing is not an actual physical USB denial proof.
- `/computers/`: all **four actual AD computer objects** with their OU links, VM/system links and limited verified policy scope. A computer object is not a VM or service.
- Existing: eight company area entrances, six system profiles, guided tour, initial graph, two incident narratives, recovery options, search and glossary.

The six initial system entity records and their twelve graph edges remain a **small reviewed slice**; linked cross-category HTML routes exist but a complete privacy-reviewed private-to-public entity graph is not yet built.

**Real screenshot assets:** the site now copies only **five images already published in this repository's GPO engineering journal** into its own static `/evidence/` at build time, verifying PNG signatures and producing a SHA-256 provenance manifest. The five screenshots carry captions explaining what they show and do **not** claim newer tests. This is not the full screenshot-proof library; all other original evidence needs separate curation/privacy QA.

**Continuous checks:** `npm run test:links`, `test:coverage`, `test:sources`, `test:evidence` and `test:acls` require source-backed routes, real public source files, existing original PNGs, and **100-of-100 exact ACL data parity**. Branch Actions may also capture desktop/mobile Chromium screenshots of the homepage, policy detail and ACL explorer to an internal CI artifact, not a production page.

**Still required under the master specification:** complete settings-level GPO audit (especially all 24 DC rights/principal assignments), recent client-side effective-policy proof, 51 built-in group profiles, remaining 16 incident routes, 30 VSS/backup object views, expanded verified object graph, the remaining real screenshot galleries, manual browser/mobile/keyboard/screen-reader review, performance/security/privacy review and approved deployment. No configured-only evidence is presented as an end-to-end test.

## Hosting and custom domain (DNS verified, site not deployed)

**Chosen target:** `https://novacorp.davideti.dev`, hosted on **GitHub Pages** using this repository. The existing personal site at `https://davideti.dev` remains unchanged. The alternative spelling `etidavid.dev` has not been confirmed as an owned/working domain.

- `site/public/CNAME` contains `novacorp.davideti.dev`. GitHub Pages has accepted the custom domain, and its DNS check is successful; this file still does **not** publish site content.
- `.github/workflows/deploy-world-explorer-pages.yml` compiles the static Astro site at **root base path `/`** and deploys to the `github-pages` environment. It runs **only by manual dispatch from `main`**, after approval; an unreviewed feature-branch push or PR cannot launch the public site.
- Developer CI for this branch continues building **without deployment**, validating entity data, type-checks, the static build and generated internal links.
- GitHub Pages custom domain `novacorp.davideti.dev` is already saved and its DNS check has passed. GitHub's TLS provisioning showed certificate activation progressing. **Enforce HTTPS was still unavailable at the last owner screenshot**; enable only when offered and confirm anonymously over HTTPS after deployment.
- DNS for `novacorp` already returns `etidavid.github.io` through both Cloudflare and Google resolvers. **Do not create a second record or alter** existing apex, `www`, MX or other records for `davideti.dev`.
- GitHub recommends verifying ownership of the domain with a DNS TXT record under account Settings → Pages before activating the custom domain, to reduce takeover risk.

If a temporary repository-path build is needed before the custom domain, use `PUBLIC_BASE_PATH=/Nova-Corp/`. **Production custom-domain builds must use `/`**, never `/Nova-Corp/`.

DNS resolving correctly is **not** evidence that the World Explorer is deployed or that its HTTPS behavior has passed final acceptance.

## Repository boundary

A public feature branch is still public. Do not commit raw AD records, pfSense configurations, unredacted backup ZIPs, credentials, management URLs or screenshots containing private details.

## Next checkpoint

Review the actual desktop/mobile browser screenshots and manually test interactive behavior, keyboard navigation and responsive layouts. Expand the Incident Lab, full GPO rights/principal matrix and other verified records; curate the remaining real screenshots with redaction, source/published SHA-256 and claim-specific captions. Complete privacy and release acceptance before merging/deploying. CR-016 remains on hold.
