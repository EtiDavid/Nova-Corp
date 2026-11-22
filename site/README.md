# Nova Corp World Explorer — site foundation

**Status: Initial implementation branch — not deployed and not approved for launch.**

This is the public-safe site project in the existing Nova-Corp repository. The separate private engineering repository remains the authority for unpublished source inventories, tests and launch decisions. Raw exports must never be copied here.

## Run locally

Requires Node.js 20.11+ and npm.

    cd site
    npm install
    npm run validate
    npm run check
    npm run dev
    npm run build
    npm run preview

Astro generates a static site into site/dist. This feature branch is for review and should not be merged or deployed until privacy, link, accessibility and actual-browser QA passes.

## Architecture

- Astro + TypeScript static pages. Company areas and all six initial system profiles have standalone URLs without JavaScript.
- CSS tokens follow the default bright, restrained palette specified in the private World Explorer master v3.0.
- A bounded React Flow island is loaded only on the IT Control Room page. Every entity and link is also offered through normal HTML for keyboard users and browsers without JavaScript.
- A Zod-validated Astro Content Collection stores incident summaries, pointing at original public source journals.
- Reviewed example entity model: src/data/entities.json and src/data/relationships.json. This initial six-entity slice is NOT a complete public export of the private 355-node / 610-relationship pre-D01 model.
- The scripts/validate-graph.mjs script rejects duplicate IDs, dangling edges, unsupported evidence links and several high-risk data patterns. This is an initial check, NOT a complete privacy audit.

## Source and status rules

Every system page includes an evidence date, plain-language explanation, source link and limitations. Introductory narratives must not mention internal collection IDs, collector exports, ZIP hashes or maintenance to-do lists. Technical evidence can retain exact journal IDs and tested commands. All published relationships must be source-supported; a configuration statement is not equivalent to a live test result.

**Still required under the master specification:** complete identity/OU, staff, GPO, firewall-rule and file-permission browsers; curated real screenshots; expanded verified graph; proof gallery; advanced search; actual mobile/keyboard QA; performance and deployment. These have NOT been marked complete.

## Hosting base paths

Local development and root-domain builds default to /. For GitHub Pages under the repository path, run:

    PUBLIC_BASE_PATH=/Nova-Corp/ npm run build

All site-internal links use the configured Astro base path. Cloudflare Pages/custom-domain deploys should normally use /.

## Repository boundary

A public feature branch is still public. Do not commit raw AD records, pfSense configurations, unredacted backup ZIPs, credentials, management URLs or screenshots containing private details.

## Next checkpoint

Test the first connected company experience in a real browser; curate sanitized real evidence with source and published-asset SHA-256/captions; expand the typed relationship and category browsers; complete privacy, accessibility and launch acceptance. CR-016 remains on hold.
