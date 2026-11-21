# Nova Corp World Explorer — Product, UX, Engineering & Evidence Source of Truth

**Document ID:** NOVACORP-WEB-SOT  
**Version:** 2.0 — company-first redesign  
**Status:** APPROVED DIRECTION / IMPLEMENTATION NOT YET STARTED  
**Owner:** David Eti  
**Reviewed:** 21 November 2026  
**Engineering baseline:** Phase 2 conditionally closed; privileged-management security work is next  
**Canonical home:** public Nova-Corp repository, `docs/site/NOVACORP-EXPLORER-SOURCE-OF-TRUTH.md`  
**Rule:** update this specification alongside any significant change to the public explorer.

> **One sentence:** Build an explorable, evidence-backed model of a fictional company, not a website about documents.

---

# A. What changed in version 2

The previous proposal was a polished portfolio **story map**. That was necessary, but insufficient.

The new vision is a **digital company explorer**: a visitor opens Nova Corp, chooses an area, opens objects inside it, follows relationships between objects, and can always dig through to the engineering proof.

The user should not need to know a Change Request number to find a Domain Controller, employee, OU, group, policy, firewall rule, file share, backup, or incident.

**CR = Change Request.** It belongs in the technical evidence layer, not in the primary navigation. Keep all original CR numbers as stable archival identifiers; do not rename old engineering evidence.

## A1. Three independent review lenses

### 1. Large-company recruiter

**What works in the current repo:** substantial technical evidence, clear honesty about a home lab, actual recovery/incident stories, a skills-to-evidence map.

**What is still weak:** the first click still reaches Markdown/text rather than a compelling view of the company; far too many CR references appear before the visitor understands the business environment; there is no strong visual orientation or instantly accessible system inventory; the most useful proof is buried in long journals.

**What I would need for an interview screen:** in 15–30 seconds, know the target role, see the architecture, understand David's personal contribution and one concrete failure/recovery result; in 60 seconds, find real evidence without GitHub archaeology.

**Corrective action:** "Explore Nova Corp" is the primary CTA. Present the company first, source records second. Put 3–4 exceptional outcomes in easy-to-scan cards and keep detailed journals one click away from each object.

### 2. Senior infrastructure engineer

**What works:** real AD/DNS/pfSense/SMB/DFS/GPO/backup details, controlled incidents, rollback, hash verification, current-state reconciliation.

**What is still weak:** systems do not have canonical, current, connected profiles. A GPO page cannot yet reliably tell me which OU it links to and which users actually received it. A user page cannot yet demonstrate every actual current group membership. The latest firewall rules are not yet in a verified, sanitized, ordered rule inventory. Screenshots in several public historical journals are absent. Some facts are historical snapshots, while other pages describe a later baseline.

**What I would need:** object inventory, accurate dependencies and relationships, known-good configuration revision, effective-vs-intended policy distinction, security boundaries, evidence timestamps, failure/recovery paths, limitations and an audit trail.

**Corrective action:** structured typed data with source attribution, review dates, relationship validation, evidence manifests, and a rigorous status model. Never invent a missing current configuration.

### 3. HR/non-technical reviewer

**What works:** the lab is openly described as fictional and not an employer production claim; the project shows initiative and perseverance.

**What is still weak:** "DC", "CR", "FSMO", "GPO", "AGDLP", "VLAN" and "Conditional Pass" are too much jargon for the landing page. A huge feature list may make a reader skip the whole thing. It is not obvious who in the fictional company needs each service or why it matters.

**What I would need:** ordinary-language business stories, clear role relevance, readable labels and friendly explanations. A "conditional" milestone must not look like a failed exam; describe the completed foundation and link the exceptions separately.

**Corrective action:** everyday labels first: "Employee identities", "Company network", "Shared files", "Rules for workstations", "Recovery", "What went wrong". Technical terms appear inside expandable detail with definitions.

### A2. Priority ranking

| Priority | Problem | Required change |
| --- | --- | --- |
| P0 | Visitors must understand CR numbers | Remove CR numbers from primary navigation |
| P0 | No visual company exploration | Build systems/people/network/policy explorer |
| P0 | Claims scattered across journals | One canonical profile per documented object |
| P0 | Current vs historical vs planned mixed together | Add visible evidence status and as-of dates |
| P0 | Privacy risk from staff/rules/config | Require reviewed public-safe data |
| P1 | Deep links buried | Make every entity, relationship and evidence source clickable |
| P1 | No staff/OU/group/GPO relationship browser | Add verified directory explorer |
| P1 | No ordered firewall-rule explorer | Add reviewed, sanitized policy browser |
| P1 | Missing public screenshot assets | Build evidence queue and repair selected proof |
| P1 | Technical and HR readers need different depth | Plain English default; optional technical layer |
| P2 | Extra animations/3D/game behavior | Only after usability, data accuracy and accessibility pass |

---

# B. Product vision and non-goals

## B1. Vision

**"Walk inside Nova Corp."**

A fictional company modeled through real systems and controlled lab tests. The visitor can explore the company like a small open-world educational experience while staying oriented with normal web navigation.

It should feel:
- like entering a well-organized digital workplace;
- like browsing a map where rooms lead to meaningful objects;
- like an interactive engineering museum;
- like a story that grows as new lab projects are completed.

It should NOT require:
- gaming knowledge;
- walking with WASD keys;
- a 3D engine;
- an account/login;
- installing software;
- understanding network protocols.

**The product is an explorable knowledge graph with a spatial presentation, not a literal video game.**

## B2. Non-goals

- No live remote access to the home lab.
- No public pfSense, Proxmox or AD API connection.
- No actual employee database or private personal information.
- No passwords, private keys, unredacted backups, or raw config exports.
- No made-up staff numbers, uptime, monitoring, SLAs or incident counts.
- No fake "real-time" lights/animations on simulated systems.
- No deployment/administration buttons that operate the lab.
- No claim that planned systems are implemented.

## B3. Primary outcomes

The site should:
1. help a non-technical visitor understand Nova Corp in under a minute;
2. help a recruiter decide whether David merits a screening conversation;
3. let an engineer independently verify specific technical claims;
4. show how systems relate to employees, groups, policies and business resources;
5. give the operator a repeatable publication process after future changes.

---

# C. The basic experience: two doors, one website

## C1. Entry screen

**Headline:** "Explore Nova Corp — a small company built as a real infrastructure lab."

**Subheading:** "Meet the systems, people and policies behind it. See what broke, how it was fixed, and the evidence."

**Truth line:** "Fictional company · Real home-lab engineering · Documented as of November 2026"

Primary actions:

- **Take the guided tour** — a simple, approximately three-minute curated path;
- **Explore the company** — open the interactive map directly.

Secondary:
- "I want the technical proof" → source/evidence index.

No CR numbering or IP addresses in the hero.

## C2. Guided Tour mode

For visitors who do not know where to begin.

Story order:

1. Meet the fictional company.
2. Why it needs a network and firewall.
3. How employees sign in.
4. How access to departmental files is controlled.
5. How computers receive policies.
6. What backup/recovery looks like.
7. What happened when things broke.
8. What exists today and what is next.

Each step has a large graphic, a short explanation, and one clickable object that opens deeper detail.

**This mode is linear, skimmable, and safe for HR.**

## C3. Explore mode

For curiosity-driven visitors.

Show a stylized digital campus/map, with six primary destinations:

- **IT Infrastructure**
- **People & Departments**
- **Company Network**
- **Workstation Rules**
- **Shared Files & Recovery**
- **Testing & Incidents**

Visitors can follow links indefinitely without being forced back to the homepage.

**This mode is non-linear, with permanent navigation breadcrumbs, search and a clear "Back to map" option.**

## C4. Tech Detail mode

Every page begins with a simple explanation.

A persistent toggle reveals:
- hostnames;
- network addresses;
- VLANs;
- protocols;
- OU distinguished names;
- policy settings;
- exact security groups;
- commands and result excerpts;
- source links.

This is a presentation preference, not a way to hide security-sensitive information. If something is not public-safe, it stays absent in both modes.

---

# D. Spatial model: the explorable company

## D1. Company map (Level 0)

The map is the first visual overview. It should not show 40 objects at once.

Use recognizable areas/cards:

| Place on map | Plain-language description | Opens |
| --- | --- | --- |
| IT Control Room | The computers that run the company | Systems inventory |
| Identity Office | Accounts, login, directory | AD/DC/OU/group browser |
| Department Offices | HR, Finance, IT, Sales, Management | Department and safe staff profiles |
| Network Gatehouse | Firewall and networks | pfSense, VLANs, rules |
| File & Records Room | Shared folders and access | File server, shares, DFS, VSS |
| Recovery Center | How data and identity are restored | Backup jobs, recovery tests |
| Incident Lab | What was intentionally broken and diagnosed | Incident explorer |
| Roadmap Wing | Not-yet-built expansion | Future features, visibly separated |

**Design note:** these are visual metaphors, not a literal physical-company campus or actual offices.

## D2. Zoom levels and information hierarchy

### Level 0 — company
"What does this place do?"

### Level 1 — area
"Which systems/departments/policies exist here?"

### Level 2 — individual object
"What is NOVA-DC01? What does this rule do? Who is this staff alias?"

### Level 3 — relationship
"What does this object depend on or affect?"

### Level 4 — proof
"What configuration screenshot, test, incident, journal or PDF proves the claim?"

A click should always lead to a meaningful answer, not another generic card.

## D3. Navigation invariants

Every entity view must have:
- title and type;
- simple explanation;
- status/as-of date;
- breadcrumb path;
- related entities;
- evidence section;
- "Read technical journal" link;
- "Back to map";
- searchable stable URL.

Back navigation must preserve the previous selected view and selected filters when possible.

---

# E. Clickable entity journeys — concrete examples

## E1. Domain Controller journey

`Home → Explore → IT Control Room → NOVA-DC01`

Profile opens:

**NOVA-DC01 — Identity server**

Simple:
> Helps Nova Corp computers find the domain and authenticate users.

Technical:
- Host: NOVA-DC01.nova.corp;
- IPv4: 10.10.20.10;
- Zone: INFRA / VLAN 20;
- Services: AD DS, DNS;
- Partner: NOVA-DC02;
- Related tests: replication, SYSVOL, DNS, client discovery, outage exercises.

Clickable subtopics:
- **Active Directory**
- **DNS**
- **Replication with DC02**
- **Policies that depend on the domain**
- **Tests & failures**
- **Screenshots**
- **Read engineering journal**

Choose **Active Directory**:

`DC01 → Active Directory → Organizational Units`

Open the **Nova Users** OU; see Finance, HR, IT, Management and Sales.

Open **IT**; see the **privacy-approved staff/test accounts** whose current OU placement is actually verified.

Click one account; see an approved staff profile with account state, OU, group memberships and effective policy **only when evidence establishes each value**.

Click a group; follow it to permitted shares, rules or policy filtering.

Click a policy; open what it intends, where it is linked, which group/OU filters it, and what the lab test actually proved.

**Technical caution:** GPO link + OU placement does not alone prove the user processed the policy. Effective policy is a separate tested relation.

## E2. File-server journey

`Home → File & Records Room → NOVA-FILES01 → Shared folders`

Click **IT Share**:

- why it exists;
- share path;
- applicable SMB share permission;
- NTFS permission;
- AD authorization groups;
- allowed and denied test users;
- DFS namespace route;
- Shadow Copy / backup recovery;
- evidence screenshots;
- PDF journal.

Click **Who can access this?** to follow the authorization graph.

Do not automatically infer permissions from group display name. The approved SMB+NTFS evidence must support them.

## E3. Firewall journey

`Home → Network Gatehouse → pfSense → Firewall Rules`

Select:
- interface/zone;
- allow/deny;
- source type;
- destination type;
- service/protocol;
- validated date.

Click a sanitized rule:

- rule's business purpose;
- rule order on the interface;
- direction in the actual platform semantics;
- sanitized source/destination;
- services/ports if safe to publish;
- matching behavior;
- corresponding positive and negative tests;
- relevant incident;
- link to source journal/PDF;
- status: implemented/current, historical, planned, or withheld.

Open **Management access incident** to see before/after diagrams and evidence.

**Important:** a full current ordered rule inventory has not yet been verified/published. Build this view only from a fresh owner-reviewed redacted export and technical evidence; do not invent rules from diagrams or memory.

## E4. Employee journey

`Home → Department Offices → IT → Staff profile → Groups → Files/Policies`

A public-safe fictional employee card may show:
- display name or safe alias;
- role/department;
- sanitized logon name;
- OU;
- explicitly verified security groups;
- mapped resources/access;
- relevant GPOs (scope vs actual effect clearly distinguished);
- test/evidence;
- last verified;
- "Lab identity / fictional employee" badge.

**Never auto-import real personal data into a public staff directory.** Use approved fictional characters/aliases and synthetic examples clearly labeled. Historical user accounts in CR-005 are not evidence of current enabled-account counts.

## E5. Test / recovery journey

`Home → Incident Lab → "Backup target missing"`

Incident profile:
1. user/operator symptom;
2. business effect;
3. hypothesis and first test;
4. root cause;
5. minimum correction;
6. post-repair tests;
7. restore proof (matching SHA-256);
8. lessons;
9. affected system and backup objects;
10. screenshots;
11. technical journal/PDF.

## E6. More than one route to the same object

A GPO may be reached from:
- the Policy Center;
- an OU;
- a person (scope);
- a computer;
- a failure test.

These paths all resolve to **one canonical policy page**. Do not duplicate the GPO record for each section.

---

# F. Current Phase 2 data and honest scope

## F1. Known infrastructure nodes

The current public architecture lists:
- nova-prox01: nested Proxmox, currently upstream management at 192.168.178.26;
- nova-fw01 / pfSense.home.arpa: routing/firewall/WireGuard;
- NOVA-DC01: 10.10.20.10;
- NOVA-DC02: 10.10.20.11;
- NOVA-FILES01: 10.10.20.20;
- NOVA-CLIENT: 10.10.40.100.

These form initial system profiles.

## F2. Known network zones

| Zone | Network | Meaning |
| --- | --- | --- |
| MGMT | 10.10.10.0/24 | management segment |
| INFRA | 10.10.20.0/24 | servers |
| APP | 10.10.30.0/24 | reserved application segment |
| CLIENT | 10.10.40.0/24 | client workstations |
| DMZ | 10.10.50.0/24 | reserved public-facing segment |
| VPN_REMOTE | 10.10.60.0/24 | remote-access segment |

Show APP/DMZ as reserved, not populated with invented services.

## F3. Historical AD structure verified from CR-005

Parent OUs:
- Nova Administrative Accounts;
- Nova Computers;
- Nova Disabled Objects;
- Nova Resources;
- Nova Security Groups;
- Nova Service Accounts;
- Nova Users.

Child OUs known from historical evidence:
- Nova Computers → Servers, Workstations;
- Nova Users → Finance, HR, IT, Management, Sales.

Built-in Domain Controllers OU is separate; do not imply Domain Controllers were moved under the custom Servers OU.

**Historical evidence warning:** CR-005 described an early two-account IT placement. That cannot be used as today's complete staff directory. CR-011 and later incidents also created test objects. Current directory membership must be re-audited.

## F4. GPO status

CR-015 backed up **seven current GPOs**.

That is evidence of inventory/backup count, not permission to invent the seven policies' current settings, link targets or effective results.

Use the current GPO inventory CSV, exports and GPMC/RSOP screenshots after privacy review to populate policy profiles.

## F5. Firewall status

pfSense segments/routes and the CLIENT management hardening are documented.

The entire current firewall policy, rule order, alias resolution and VPN controls require an audited, sanitizable export or screenshots before a full public rule explorer can be populated.

## F6. Validation status vocabulary

Every object or claim must carry one of:

- **Verified current** — reviewed against a dated current baseline;
- **Verified historical** — real past result, not known current;
- **Implemented / awaiting verification** — object exists but latest acceptance proof is incomplete;
- **Planned** — future only;
- **Deferred** — explicitly blocked/transferred;
- **Redacted** — exists but withheld for privacy/security;
- **Superseded** — older state replaced by a later state.

No generic green checkbox without a clear meaning.

---

# G. Content model: object graph, not PDF catalog

## G1. Entity classes

Canonical types:

1. `Company`
2. `Department`
3. `Person` (fictional/public-safe)
4. `OrganizationalUnit`
5. `SecurityGroup`
6. `Policy` (GPO)
7. `Computer` / `VirtualMachine` / `Host`
8. `Service` (AD DS, DNS, SMB, DFS, backup, etc.)
9. `NetworkZone`
10. `FirewallRule` / `FirewallAlias`
11. `Share` / `Resource`
12. `Backup` / `RecoveryPoint`
13. `Incident` / `Test`
14. `EvidenceAsset`
15. `EngineeringRecord` (CR, journal, PDF)
16. `RoadmapItem`

## G2. Relationships

Model with explicit typed edges:

- `memberOf` (Person → SecurityGroup)
- `locatedInOU` (Person or Computer → OU)
- `belongsToDepartment` (Person → Department)
- `linkedTo` (GPO → OU/Site/Domain)
- `filteredBy` (GPO → Group)
- `observedAppliedTo` (Test → Person/Computer/GPO)
- `runsOn` (Service → Host/VM)
- `hostedBy` (VM → Hypervisor)
- `residesIn` (System → NetworkZone)
- `providesDNSFor` / `replicatesWith`
- `grantsAccessTo` (Group → Share/Resource)
- `routesTo` / `filtersTrafficTo`
- `backedUpBy` / `restoredBy`
- `affected` (Incident → System/Service/Person/Resource)
- `validatedBy` (Entity/relationship → Test)
- `provenBy` (Claim/Test → EvidenceAsset)
- `documentedIn` (Entity/Test → EngineeringRecord)

**No relationship may be inferred solely from a convenient label or a diagram arrow.** Store the authoritative source and last verification date.

## G3. Stable IDs and URLs

Use semantic slugs, not CR numbers:

- `/systems/nova-dc01/`
- `/systems/nova-files01/`
- `/network/pfsense/`
- `/network/zones/infra/`
- `/network/rules/<approved-rule-id>/`
- `/directory/ous/nova-users/`
- `/directory/ous/it/`
- `/people/<approved-alias>/`
- `/groups/<safe-slug>/`
- `/policies/<slug>/`
- `/shares/it/`
- `/incidents/backup-target-unavailable/`
- `/evidence/<evidence-id>/`

An object keeps its URL even when later CRs update its details. Use redirects/aliases for any renamed slugs.

## G4. Minimum schema

Each public entity record must contain:

```yaml
id: sys-nova-dc01
type: computer
slug: nova-dc01
title: NOVA-DC01
simpleSummary: "Identity server that helps Nova Corp computers sign in."
technicalSummary: "AD DS and DNS; Phase 2 current-state baseline."
publicationStatus: verified-current
verifiedAsOf: 2026-11-20
sourceRecordIds:
  - source-cr015-current-state
related:
  - targetId: svc-ad-ds
    relation: runs
  - targetId: sys-nova-dc02
    relation: replicates-with
evidenceIds: []
privacyReview: approved
```

The absence of evidence IDs in this **illustrative schema example** does not mean the actual record can ship without proof. Real records need audit/evidence rules below.

## G5. Evidence schema

```yaml
id: ev-cr015-management-post
type: screenshot
sourceSystem: NOVA-CLIENT
dateObserved: 2026-11-20
claimIds:
  - claim-client-mgmt-denied
caption: "After remediation, normal client cannot reach management interface."
publicAsset: /evidence/cr015/client-mgmt-post.webp
originalPrivateFile: "private-reference-only"
sha256Sanitized: "<calculated-when-approved>"
visibility: public
sanitized: true
reviewedBy: "David Eti"
reviewedAt: "<date>"
technicalSourceUrl: "<public-journal-anchor>"
```

No image path should be published until the sanitized binary is actually present in the site/repo.

## G6. Source-of-truth hierarchy

1. Raw private engineering observations and screenshots.
2. Current-state validated baseline and exact configs.
3. Privacy-reviewed public structured entities/evidence.
4. Rendered website and narrative copy.

The website is an **offline static publication of an audited state**, not a live monitoring system.

---

# H. Interface and interaction specification

## H1. Global navigation

Top:
- Explore
- People
- Systems
- Network
- Policies
- Incidents
- Evidence
- About

Keep Recovery available as a permanent quick filter or inside Systems/Incidents on small screens.

Global search:
- hostnames;
- people (aliases);
- departments;
- groups;
- GPO names;
- shares;
- protocols;
- incident titles;
- glossaries.

Search results grouped by type and status.

## H2. Object drawer

On desktop, clicking a map item opens a right-side panel.

On mobile, open a full-height sheet/page.

Drawer tabs:
- **Overview**
- **Connections**
- **Configuration**
- **Tests & incidents**
- **Evidence**
- **Documentation**

Avoid nested drawers inside drawers; deep navigation becomes a page with breadcrumbs.

## H3. Simple / Technical view

Simple:
- clear titles, analogies and business impact;
- minimized acronyms;
- essential facts;
- related objects.

Technical:
- verified identifiers;
- protocol/network/configuration facts;
- relevant tests/commands;
- evidence provenance.

The technical setting persists during navigation but does not govern authorization.

## H4. Map behavior

- Pan and zoom only in map regions.
- Click nodes or keyboard-activate via Enter/Space.
- Hover previews are optional, never essential.
- A "Home map" button always works.
- "Fit to view", "Reset", and "Search on map" controls.
- When a node is selected, highlight first-degree relations.
- Expand relationships progressively; never render the full AD graph by default.
- Do not animate lines continuously.
- No surprise camera movement.
- No "game over", scores, XP, badges or fake achievements.

## H5. Directory explorer

Use a left tree + center content + optional right detail layout.

- Expand/collapse OUs.
- Type-filter users, computers, groups and service accounts.
- Select account → profile.
- Follow groups → resource permissions.
- Follow GPO links → scope/effective distinction.
- Breadcrumbs reflect OU path.
- Show whether an item is current, historical, test, alias or redacted.

**Important:** a group can contain other groups; support nested memberships without flattening incorrectly.

## H6. Policy browser

Each GPO card:
- description;
- object status;
- exact verified settings (public-safe);
- link locations;
- security/WMI filters if applicable;
- user/computer settings;
- exceptions;
- how application was tested;
- related incidents;
- screenshots;
- full journal.

A policy linked to an OU is not proof it applied; show both intended scope and observed effective result.

## H7. Firewall browser

Interface tabs, then ordered rules.

Display (only if approved):
- sanitized order number;
- action;
- interface/direction;
- protocol;
- source/destination class;
- service;
- purpose;
- last validated;
- proof.

Show allow/deny path examples using diagrams and positive/negative tests.

Never reveal actual private VPN keys, sensitive external endpoints, management secrets, backup paths with secrets or an unreviewed full firewall config.

## H8. Incidents browser

Filters:
- failure type;
- affected system;
- severity;
- status;
- recovery method;
- educational topic.

Every incident gets a timeline with test/expected/actual/interpretation. A user can jump to affected system or read the PDF source.

## H9. Evidence viewer

Modal/page:
- image;
- caption;
- highlighted area explained in words;
- observed date;
- current vs historical note;
- exact claim supported;
- link to full journal/PDF;
- sanitized asset integrity hash if tracked.

Never imply a screenshot proves more than it actually shows.

---

# I. Information design and content writing

## I1. Progressive disclosure

Every object page should use three layers:

**What it is → How it connects → How we know it works.**

Then an optional **Engineering details** section.

Sample:

**Domain Controller**  
"One of the servers that confirms employees and computers are who they say they are."

Technical:
"Windows Server / AD DS / DNS, with partner replication and client discovery."

Proof:
"Controlled outage, service-discovery tests, replication after restart."

## I2. Glossary without forcing it

Terms show small help affordances:

- DC — Domain Controller
- AD — Active Directory
- DNS — Domain Name System
- OU — Organizational Unit
- GPO — Group Policy Object
- VLAN — Virtual LAN
- SMB — Windows file-sharing protocol
- DFS — Distributed File System namespace
- AGDLP — authorization group pattern
- CR — Change Request (evidence archive only)

Tooltips must also work on touch and keyboard.

## I3. Writing rules

No:
- "enterprise-grade" for a home lab;
- "production-ready";
- "real staff" unless genuinely fictional context made clear;
- "zero downtime";
- "100% secure";
- "live monitoring" without actual runtime connection;
- invented numerical counts.

Prefer:
- "Configured two writable Domain Controllers and tested client continuity during a controlled outage."
- "Restored a deleted file and matched the original SHA-256."
- "Found and corrected an unintended client-to-management path."

## I4. Status explanation for HR

Front page:
"Phase 2 foundation completed."

Expandable note:
"Closure was conditional because some security, monitoring and independent handover checks remain explicitly documented as later work or accepted lab limits."

Do not make **Conditional Pass** the first item a recruiter sees without a plain-English explanation.

---

# J. Visual direction and design tokens

## J1. Visual personality

"Modern interactive engineering atlas."

- quiet, bright, readable;
- clean cards and subtle map lines;
- clear information hierarchy;
- meaningful icons;
- simple character/employee cards;
- diagrammatic illustration;
- no fake sci-fi control room.

## J2. Colors

Light default:

| Role | Token |
| --- | --- |
| Background | `#F8FAFC` |
| Card surface | `#FFFFFF` |
| Alt surface | `#F1F5F9` |
| Main text | `#0F172A` |
| Secondary text | `#475569` |
| Border | `#E2E8F0` |
| Primary Nova blue | `#2563EB` |
| Primary hover | `#1D4ED8` |
| Identity section | `#0F766E` |
| Network section | `#2563EB` |
| People section | `#7C3AED` |
| Storage section | `#0369A1` |
| Validated | `#15803D` |
| Deferred | `#B45309` |
| Failure | `#B91C1C` |

Use section colors as **subtle accents**, not full backgrounds. Status meaning must also be text/icon, never color alone.

Dark optional later: background `#0B1120`, surface `#111827`, text `#F8FAFC`, border `#263244`, blue `#60A5FA`.

## J3. Fonts

- UI/body: **Inter Variable**, regular 400, medium 500, bold 700.
- Commands/IPs/logs: **JetBrains Mono**, 400–500.
- Fallback: system sans and system monospace.
- Self-host only permitted webfont assets when licensing allows. Do not publish arbitrary font files from the build environment.

Type scale:
- Hero clamp(2.6rem, 5vw, 4.5rem)
- Page H1 clamp(2rem, 4vw, 3.25rem)
- Section H2 clamp(1.6rem, 3vw, 2.5rem)
- Card H3 1.25–1.6rem
- Body 1rem–1.125rem
- Captions 0.875rem
- Technical label 0.8125–0.875rem

Body line height 1.6; prose maximum width ~70ch.

## J4. Layout and spacing

- Max content width: ~1280px.
- Main reading width: 760px.
- 4px spacing scale: 4/8/12/16/24/32/48/64/96.
- Card radius: 14–18px.
- Borders: 1px neutral.
- Shadows: subtle only.
- Prefer open whitespace over decorative boxes.

## J5. Map illustration

2D/2.5D schematic, not 3D.

- primary areas as accessible map regions;
- a clear legend;
- occasional building/room metaphors for non-technical comprehension;
- individual servers as flat geometric nodes;
- cable/arrow relations only on selected layer;
- reserved systems muted/dashed;
- future security areas amber/dashed.

One visual grammar across the map, diagrams, cards and screenshots.

## J6. Motion

Use motion to explain state:
- map opening/focus;
- relationship reveal;
- node highlight;
- before/after transition;
- step-through outage/recovery.

No autoplay sound, spinning racks, infinite parallax, fake terminal typing or distracting motion.

Respect `prefers-reduced-motion` and provide static alternatives.

---

# K. Technology architecture

## K1. Decision

**Astro + TypeScript + Content Collections + isolated React Flow island for graph exploration + SVG illustrations + CSS tokens + static hosting.**

The earlier plan said "Astro with only vanilla JS". That is appropriate for articles, but an expandable multi-entity graph with nodes, edges, zoom, selection and connected detail panels justifies a **small React island**.

This is not a whole-site React SPA.

## K2. Why Astro

- Generates fast accessible HTML for every entity, not just the homepage.
- Strong Markdown/MDX/JSON content collections with schema validation.
- Search engines and visitors can access pages without running a canvas app.
- Only hydrate the graph where necessary.

Official docs: https://docs.astro.build/en/guides/content-collections/ and https://docs.astro.build/en/concepts/islands/

## K3. Why React Flow / xyflow

Use `@xyflow/react` for the **read-only explorable entity graph**:
- custom node types;
- edges;
- pan/zoom;
- selection;
- controlled expand/collapse;
- keyboard support;
- fit-to-view.

Official: https://reactflow.dev/learn/concepts/building-a-flow and https://reactflow.dev/learn/advanced-use/accessibility

Choose `elkjs` for precomputed structured layouts where needed, but **precompute** graph positions during build when possible.

Do not render the entire company, every OU and every group as one uncontrolled graph. Render bounded subgraphs.

Alternative decision gate:
If user-testing shows the map is harder than static cards+lists, keep the map as a supplement and make list navigation primary. An accessible directory/tree is a hard requirement.

## K4. Other libraries

- `@astrojs/react` — hydrate only map/drawer components.
- `zod` — schema validation.
- `lucide` icons or inline simple SVGs — consistent visual grammar.
- `pagefind` (evaluate) — static full-text search.
- `@playwright/test` — end-to-end tests.
- `axe-core` / `@axe-core/playwright` — accessibility testing.
- `sharp` / Astro image pipeline — responsive evidence images.
- Markdown/MDX — narrative and technical case studies.

Avoid:
- game engines;
- Three.js in v1;
- a heavy client-side database;
- real-time WebSockets;
- public GraphQL endpoints to the lab;
- heavyweight animation suites.

## K5. Static model

The site is a **versioned static snapshot**.

A new CR only changes the website after:
1. engineering validation;
2. approved public export;
3. structured-data updates;
4. privacy review;
5. build/test;
6. deployment.

Visitors must see "Documented state as of [date]" on entity pages.

## K6. Proposed repo layout

```text
site/
  astro.config.mjs
  package.json
  tsconfig.json
  public/
    favicon.svg
    images/og/
    evidence/sanitized/
  src/
    content.config.ts
    content/
      systems/
      people/
      departments/
      directory/
      groups/
      policies/
      firewall-rules/
      shares/
      incidents/
      evidence/
      source-records/
      roadmap/
    data/
      entities/
      relationships.json
      architecture.json
      map-areas.json
      navigation.json
    components/
      layout/
      cards/
      evidence/
      directory/
      graph/
        ExplorerGraph.tsx
        NodeProfileDrawer.tsx
        GraphToolbar.tsx
    layouts/
      BaseLayout.astro
      EntityLayout.astro
      CaseStudyLayout.astro
    pages/
      index.astro
      explore.astro
      systems/[slug].astro
      people/[slug].astro
      directory/ous/[slug].astro
      groups/[slug].astro
      policies/[slug].astro
      network/[...slug].astro
      shares/[slug].astro
      incidents/[slug].astro
      evidence/[slug].astro
      sources.astro
    styles/
      tokens.css
      global.css
  scripts/
    validate-graph.ts
    validate-evidence.ts
    build-search.ts
  tests/
    smoke.spec.ts
    explorer.spec.ts
    accessibility.spec.ts
```

## K7. Build-time validation

Validate:
- every entity ID unique;
- every slug unique within type;
- every relation target exists;
- relation types valid for both entity classes;
- source evidence links resolve;
- no "verified" object lacks acceptable source reference;
- no "public" screenshot lacks sanitized binary, caption and review flag;
- planned objects cannot be labeled verified;
- no public entity has `visibility: private`;
- OU/Group/GPO relation semantics checked;
- no source links to private GitHub;
- no duplicate source-of-truth records;
- no broken internal routes.

Build should fail on hard violations.

---

# L. Evidence & asset plan

## L1. Design assets to create

**G01 — Company map**: buildings/areas linking to sections.

**G02 — Current system architecture**: VMware → Proxmox → pfSense → actual systems.

**G03 — Network zone diagram**: MGMT, INFRA, CLIENT, APP, DMZ, VPN.

**G04 — Identity flow**: client → DNS → two DCs → authorized resource.

**G05 — Expandable directory structure**: OUs/people/groups, using verified data.

**G06 — GPO mechanics diagram**: OU link, security filtering, processing and effective outcome.

**G07 — Employee-to-share access graph**: identity → group → share ACL/NTFS.

**G08 — Firewall decision flow**: entering interface → rule order → allow/deny → return state.

**G09 — DFS and file recovery flow**.

**G10 — AD failover sequence**: normal / DC01 offline / convergence.

**G11 — Backup failure-to-restore timeline**: with hash match.

**G12 — Incident investigation funnel**.

**G13 — Management-path before/after**.

**G14 — Snapshot storage before/after**.

**G15 — Company growth timeline**: Phase 1/2 completed; next phase visibly future.

These are SVG/data-driven graphics, not made-up screenshots. Keep each readable without animations.

## L2. Screenshot acquisition matrix

**David provides/approves source screenshots; we select a compact public subset.**

### Identity / AD

- DC health / replication summary;
- DC01 outage with DC02 client continuity;
- post-recovery zero failures;
- OU tree screenshot;
- a privacy-reviewed example security-group membership;
- user/policy effective result when available.

Known historical candidates:
- `CP12-client-postlogin-DC02-and-IT-access.png`
- `CP13-final-replsummary-zero-failures.png`
- `CP08-restored-user-identity-pass.png`

### Group Policy

- current GPO list showing all seven as of CR-015;
- selected GPO settings;
- link location / security filter;
- applied policy result (gpresult/RSOP);
- a failed/recovered policy test.

**New screenshots may be necessary** to document current link/filter/effective state.

### People / OUs / groups

- sanitized ADUC OU tree;
- approved fictional or alias account details;
- relevant member-of view;
- group-to-resource access proof;
- no personal email, credential, SID, or unapproved identifiers.

**A new current inventory may be required.** Do not treat CR-005's early two-account list as today's staff list.

### File server

- share inventory;
- share+NTFS permission examples;
- authorized user pass / unauthorized user deny;
- DFS namespace;
- Shadow Copies / Previous Versions.

### Network / pfSense

- sanitized interface/VLAN overview;
- **current ordered rule inventory** by interface;
- aliases/purpose where safe;
- before/after management-access tests;
- intended business regression result;
- VPN state only if publishing is safe.

**No pfSense config.xml or private keys.** Full raw firewall configuration is not a public asset.

### Automation

- eight-script package;
- parser PASS;
- hashes match;
- failed/cleaned partial user state;
- one useful safe script output.

### Recovery

- backup target;
- backup failure;
- successful rerun;
- restore to alternate path;
- SHA-256 equality;
- snapshot inventory;
- pre/post storage capacity.

### Incidents

For each featured case:
- symptom screenshot;
- key diagnostic test;
- root-cause proof;
- corrected outcome;
- source journal/PDF link.

## L3. Known evidence gaps

Public Markdown historically referenced missing assets for CR-011, CR-012 and CR-013.

Broken embeds were removed; that **did not restore the missing evidence**.

Do not mark an evidence card ready until an actual sanitized binary is available and linked.

## L4. Screenshot workflow

1. Collect exact original.
2. Confirm which claim it proves.
3. Check for secrets/identifiers/personal information.
4. Make **separate sanitized copy**; never overwrite the original.
5. Strip metadata.
6. Crop for comprehension.
7. Convert to appropriate responsive formats.
8. Record caption, evidence ID, source, observed date and public hash.
9. Review with owner.
10. Publish.
11. Run broken-image and accessibility checks.

## L5. Staff/public-security rule

No current staff export can be made public automatically.

Profiles must use:
- approved fictional identity;
- approved sanitized logon alias;
- explicitly reviewed OU and group associations;
- sourced permissions.

If permission/profile data is not approved, label it **withheld**, not absent.

---

# M. Accessibility and mobile

Target **WCAG 2.2 AA**.

- Every graph object must also be reachable from a semantic list/tree.
- Keyboard navigation and visible focus are mandatory.
- Selected nodes can be opened with Enter/Space.
- Focus returns to triggering object when closing details.
- Click/hover parity; touch targets ~44px.
- No color-only meaning.
- All diagrams have short alt text and adjacent detailed descriptions.
- Screen readers can traverse the organizational hierarchy using tree/list semantics.
- Motion disabled under reduced-motion.
- Map interaction never blocks normal page scrolling.
- No dependency on a mouse, trackpad, pinch gesture or hover.

On mobile:
- no giant free-roaming map as the only navigation;
- show area cards/list first;
- optional map tab;
- full-screen profile panel;
- persistent breadcrumbs/back;
- simple/technical toggle in an accessible menu.

Official reference: https://www.w3.org/TR/WCAG22/

---

# N. Performance, SEO and deployment

## N1. Targets

- Core pages available as static HTML without JS.
- Lighthouse performance goal: **95+ on representative pages**.
- Accessibility goal: **WCAG 2.2 AA verified**; Lighthouse score is only a signal, not proof.
- LCP target: under 2.5s where measured.
- CLS target: under 0.1.
- Avoid heavy JS on the home page.

Interactive map can be more demanding, but it should be lazy-loaded and bounded.

## N2. Images

- source PNG retained privately;
- optimized WebP/AVIF as appropriate;
- 640/960/1440 width derivatives;
- screenshots lazy-loaded below fold;
- always include width/height;
- avoid resampling terminal screenshots to unreadable text.

## N3. SEO

Every object has a unique page title, description, canonical URL, accessible copy and schema-valid metadata.

Example:
"NOVA-DC01 | Nova Corp Infrastructure Lab"

Share cards show a real lab architecture image rather than fake company office photos.

## N4. Hosting

Recommended:
**Cloudflare Pages**, static Astro build, custom domain **novacorp.etidavid.dev** if the user controls it.

Fallback:
GitHub Pages.

Official: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

## N5. Analytics

No tracking initially or minimal privacy-respecting aggregate analytics. No session recording, no user profiling, no ads.

---

# O. Publication pipeline / future CR updates

## O1. After every new engineering Change Request

Internal CR remains engineering workflow terminology. Public visitors see **"Latest update"** or **"New capability"**.

Pipeline:

1. Finish implementation/validation in private engineering record.
2. Update current-state asset register.
3. List created/changed/deleted entities.
4. List new/changed relationships.
5. Identify what changed in user-facing capability.
6. Determine what is public, redacted, historical or planned.
7. Approve screenshots (new sanitized binaries).
8. Update structured entity files.
9. Update graph edges and map if architecture changed.
10. Update system, people, policy, share and incident pages touched by the change.
11. Update source journal/PDF deep links.
12. Run schema/link/relationship/privacy checks.
13. Build preview.
14. Run recruiter and engineer acceptance checks.
15. Publish and stamp `verifiedAsOf`.
16. Note changes in the public "What's New" timeline.

A CR that changes a firewall rule but not the machine inventory should update the **firewall rule entity and its tests**, not force a full manual redraw of every diagram.

## O2. Avoid fake automatic synchronization

No live AD/pfSense ingestion from the public website.

If a private export script is later used, it should:
- export read-only into a protected staging directory;
- redact sensitive fields;
- diff against prior approved snapshot;
- require explicit owner approval;
- never auto-push raw data to GitHub.

## O3. Versioning and drift handling

Each entity:
- last verified;
- source;
- publication status;
- change history reference.

When a fact changes, mark historical versions superseded instead of silently erasing evidence of past behavior.

---

# P. Detailed delivery plan

## Phase 0 — source audit (no code)

**Goal:** decide what the website can truthfully show.

Tasks:
1. Identify all existing systems, services and network zones.
2. Extract current OU/people/group inventory to a private staging table.
3. Extract all seven GPOs and current link/filter status privately.
4. Extract sanitized ordered pfSense rule inventory privately.
5. Reconcile SMB/NTFS share ACLs and DFS targets.
6. Index incidents/tests/backup evidence.
7. Create evidence queue and privacy review sheet.
8. Mark missing fields as unknown, not guessed.

Deliverable:
approved entity catalog and relationship manifest.

Exit:
no high-level architecture contradiction; public-safe data boundaries agreed.

## Phase 1 — low-fidelity UX proof

1. Wireframe recruiter homepage.
2. Wireframe company area map.
3. Wireframe DC01 profile and drilldown to AD OU.
4. Wireframe staff/group/GPO profile chain.
5. Wireframe pfSense firewall-rule profile.
6. Wireframe incident/evidence page.
7. Test with at least one nontechnical person and one technical reader.
8. Correct navigation confusion before coding.

Exit:
both reviewers can find DC01, IT OU, file permissions, firewall rules and a restore test without CR numbers.

## Phase 2 — static data-driven foundation

1. Create Astro + TS repo/site directory.
2. Add design tokens/fonts.
3. Define entity schemas/content collections.
4. Add stable routes for each entity.
5. Import approved initial entities.
6. Add provenance, status and related links.
7. Add global search and breadcrumbs.
8. Add sitewide glossary.
9. Run broken-link and entity validation.

Exit:
complete no-JS navigation to all v1 entity pages.

## Phase 3 — interactive explorer

1. Design G01 map in SVG.
2. Build architecture graph component.
3. Add bounded subgraph expansion.
4. Add system details drawer.
5. Add OU tree/browser.
6. Add people/group relations.
7. Add GPO link/filter view.
8. Add firewall-rule browser from approved data.
9. Add share/authorization graph.
10. Add keyboard/list alternatives.
11. Test mobile performance.

Exit:
example journeys from Section E can be completed without missing navigation.

## Phase 4 — evidence and incidents

1. Publish curated sanitized screenshot pack.
2. Build EvidenceAsset viewer.
3. Create incident pages and timelines.
4. Link each object to its related tests.
5. Add before/after comparison components.
6. Add PDF/journal deep links.
7. Validate provenance and dates.

Exit:
every featured claim has accessible proof.

## Phase 5 — guided tour and storytelling

1. Add concise nontechnical narrative for each major area.
2. Build guided-tour route.
3. Add interactive story chapters.
4. Include "what went wrong" moments.
5. Avoid jargon in initial screens.
6. Add status/what's-next explanation.
7. Test 10/60-second comprehension.

Exit:
an HR reader can explain the lab without prior technical knowledge.

## Phase 6 — technical and security QA

1. Compare site data to public validated records.
2. Reconcile system IPs/roles.
3. Verify GPO semantics (linked ≠ effective).
4. Verify firewall rule direction/order and currentness.
5. Verify staff data is approved fictional/sanitized.
6. Validate every link/image/evidence ID.
7. Test keyboard/screen reader access.
8. Run Playwright.
9. Run accessibility automation + manual audit.
10. Run Lighthouse/performance.
11. Review entire public repository for secrets.
12. Approve launch.

Exit:
no invented current state or broken public evidence path.

## Phase 7 — launch and maintenance

1. Deploy preview.
2. Configure domain/HTTPS.
3. Validate mobile and social preview.
4. Update README primary link to live explorer.
5. Add to CV/LinkedIn only after all core links work.
6. Define post-CR update checklist and owners.
7. After every future CR, follow Section O.

---

# Q. Acceptance tests

## Q1. HR test — 60 seconds

Without explanation, a first-time visitor can answer:
1. Is Nova Corp real or fictional?
2. What did David personally build?
3. Why does a company need a Domain Controller?
4. What happens if a user loses a file?
5. Where can I see proof?

## Q2. Recruiter test — 90 seconds

They can:
1. identify target job families;
2. name at least three relevant practical skills;
3. find two failure/recovery outcomes;
4. recognize the home-lab boundary;
5. open a relevant source without knowing CR codes.

## Q3. Senior engineer test — 5 minutes

They can:
1. find NOVA-DC01 and its dependencies;
2. inspect the OU structure;
3. reach a public-safe person/group relationship;
4. inspect an audited GPO link/filter and evidence;
5. navigate to a selected pfSense rule with its test;
6. find a file share and its authorization path;
7. locate DC outage and backup restore evidence;
8. identify unfinished privileged access controls;
9. distinguish current from historical tests.

## Q4. Engineering data test

- graph validates;
- no dangling edges;
- no duplicate IDs;
- no phantom staff count;
- no unpublished source keys;
- every verified object has evidence;
- current/past states are distinct;
- all screen shots sanitized;
- no private URLs;
- no broken links.

## Q5. Accessibility test

- every entity accessible without map/JS;
- keyboard-only path complete;
- screen-reader names meaningful;
- reduced-motion works;
- mobile panels allow exit/back.

---

# R. V1 launch scope and deferral

## V1 must include

- Clear homepage.
- Guided company tour.
- Company map + area cards.
- Systems profiles for six known core assets.
- Identity/DC/OU browser using audited data.
- Safe sample employee/group relationship where approved.
- GPO browser for audited current policies (or explicit withheld state for incomplete records).
- pfSense zone/rule browser based only on sanitized current inventory.
- File server/share/DFS/recovery views.
- Incident/test explorer.
- Curated evidence screenshots and PDF deep links.
- Search, breadcrumbs, status, glossary, mobile and accessibility.

## Do not block V1 on

- 3D world;
- avatar movement;
- simulated live network traffic;
- complete public export of every internal group/rule if privacy approval says no;
- staff photos;
- real-time analytics;
- fanciful office illustrations;
- complex animations.

## Conditional data rule

If complete firewall/GPO/staff inventory is not publicly safe or is not yet verified:
- provide a truthful partial browser;
- label withheld/missing records;
- link the technical evidence that is safe;
- never invent completeness.

---

# S. Immediate request list for David

To unlock the object explorer, provide **sanitized or privately staged** source evidence in this order.

1. **Current OU tree** — ADUC screenshot and preferably a read-only OU inventory export.
2. **Current fictional staff/test identities** — approved display names, login aliases, OU, group memberships, account state; no secrets.
3. **Security groups** — safe names, membership links, purpose, resource access.
4. **Current seven GPOs** — display names, link locations, filtering, relevant settings, observed result; screenshots/export.
5. **pfSense current interfaces and ordered rule list** — owner-approved sanitized screenshots/export.
6. **File server** — share list, safe SMB+NTFS ACL summaries, DFS targets, recovery evidence.
7. **Highlighted incidents** — symptom, root cause, fix and proof screenshots.
8. **Backup/recovery** — backup failure/success/restore hash comparison screenshots.
9. **Core system inventory** — refresh actual host roles/IPs before publishing any "current" page.

Existing CR-015 screenshots and earlier journals remain valuable, but they cannot substitute for a new audit of facts that may have changed.

---

# T. Decision log

| Decision | Why | Status |
| --- | --- | --- |
| Company explorer replaces CR-first story map | Nontechnical visitors should discover systems, not archival IDs | Accepted |
| CRs remain as evidence links | Preserve technical history without making it user navigation | Accepted |
| Static documented snapshot, not live lab dashboard | Security and maintainability | Accepted |
| Astro pages + bounded interactive React Flow island | Rich relationships without whole-site SPA | Accepted pending prototype evaluation |
| Synthetic/approved staff profiles only | Privacy and accurate simulation | Mandatory |
| GPO scope ≠ observed effective policy | Technical correctness | Mandatory |
| Full firewall rule list requires current audited sanitized export | Security and correctness | Mandatory |
| Map has accessible tree/list fallback | WCAG/mobile usability | Mandatory |
| One structured entity graph feeds all views | No duplicated conflicting facts | Mandatory |
| No game engine/3D in v1 | Recruiter clarity and performance | Accepted |

---

# U. Maintenance policy

This file is the **single public product/UX/engineering source of truth** for the Nova Corp explorer.

The prior private document (`portfolio/NOVACORP-INTERACTIVE-WEBSITE-SOURCE-OF-TRUTH.md`) is superseded by this version and should point here rather than contain conflicting independent requirements.

For every future change:
1. record a decision if the UX/data model changes;
2. update affected sections;
3. keep source evidence links;
4. update `Reviewed` date and version;
5. run content and privacy checks.

**The goal is not to make a fictional company look huge. It is to let people explore, understand and verify the quality of the engineering.**
