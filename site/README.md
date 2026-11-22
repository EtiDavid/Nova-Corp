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

## Hosting and custom domain (prepared — not activated)

**Chosen target:** `https://novacorp.davideti.dev`, hosted on **GitHub Pages** using this repository. The existing personal site at `https://davideti.dev` remains unchanged. The alternative spelling `etidavid.dev` has not been confirmed as an owned/working domain.

- `site/public/CNAME` contains `novacorp.davideti.dev`. This stages the name in Astro's build output, but does **not** provision DNS or set the GitHub Pages repository setting.
- `.github/workflows/deploy-world-explorer-pages.yml` compiles the static Astro site at **root base path `/`** and deploys to the `github-pages` environment. It runs **only by manual dispatch from `main`**, after approval; an unreviewed feature-branch push or PR cannot launch the public site.
- Developer CI for this branch continues building **without deployment**, validating entity data, type-checks, the static build and generated internal links.
- GitHub Pages setup still required once launch is approved: `Nova-Corp → Settings → Pages → Build and deployment → GitHub Actions`, then set Custom domain to `novacorp.davideti.dev` and enable **Enforce HTTPS** when a certificate is issued.
- DNS-provider change still required **at launch**: a `CNAME` record for host `novacorp` pointing to `EtiDavid.github.io` (DNS name, no `https://`), assuming this subdomain is available. Do not modify existing apex, `www`, MX, or other records for `davideti.dev`.
- GitHub recommends verifying ownership of the domain with a DNS TXT record under account Settings → Pages before activating the custom domain, to reduce takeover risk.

If a temporary repository-path build is needed before the custom domain, use `PUBLIC_BASE_PATH=/Nova-Corp/`. **Production custom-domain builds must use `/`**, never `/Nova-Corp/`.

This preparation does **not** claim `novacorp.davideti.dev` already resolves, that the personal site DNS was changed, or that the World Explorer is deployed.

## Repository boundary

A public feature branch is still public. Do not commit raw AD records, pfSense configurations, unredacted backup ZIPs, credentials, management URLs or screenshots containing private details.

## Next checkpoint

Test the first connected company experience in a real browser; curate sanitized real evidence with source and published-asset SHA-256/captions; expand the typed relationship and category browsers; complete privacy, accessibility and launch acceptance. CR-016 remains on hold.
