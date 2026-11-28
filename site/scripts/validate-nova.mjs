// Validates the Nova content model (data files and incident front matter). Fails the build on any broken reference.
// Run: node scripts/validate-nova.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as yaml } from "yaml";
import { lineSchema, zoneSchema, systemSchema, serviceSchema, changeSchema, glossarySchema, journeySchema, factsSchema, incidentExtra, lineIds } from "../src/lib/novaSchemas.mjs";
import { z } from "zod";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "src/content");
const read = (p) => JSON.parse(readFileSync(join(root, "nova", p), "utf8"));
const dir = (d) => readdirSync(join(root, "nova", d)).filter(f => f.endsWith(".json")).map(f => ({ file: `${d}/${f}`, data: read(`${d}/${f}`) }));
const errors = [];
const fail = (m) => errors.push(m);
const check = (schema, items, label) => items.map(({ file, data }) => { const r = schema.safeParse(data); if (!r.success) { r.error.issues.forEach(i => fail(`${file}: ${i.path.join(".") || "(root)"} ${i.message}`)); return null; } if (file.replace(/^.*\//, "").replace(".json", "") !== data.id) fail(`${file}: id "${data.id}" must match the file name`); return r.data; }).filter(Boolean);

const lines = read("lines.json").map(d => lineSchema.parse(d));
const zones = read("zones.json").map(d => zoneSchema.parse(d));
const facts = factsSchema.parse(read("facts.json"));
const systems = check(systemSchema, dir("systems"), "system");
const services = check(serviceSchema, dir("services"), "service");
const changes = check(changeSchema, dir("changes"), "change");
const glossary = check(glossarySchema, dir("glossary"), "glossary");
const journeys = check(journeySchema, dir("journeys"), "journey");

const unique = (list, name) => { const seen = new Set(); list.forEach(x => { if (seen.has(x.id)) fail(`duplicate ${name} id: ${x.id}`); seen.add(x.id); }); return seen; };
const sysIds = unique(systems, "system"), svcIds = unique(services, "service"), crById = new Map(changes.map(c => [c.id, c]));
unique(changes, "change"); const glossIds = unique(glossary, "glossary");
const lineSet = new Set(lines.map(l => l.id));
// The numbered roadmap is locked at 37. Supplemental changes (CR-A) sit outside it and never count toward it.
const numbered = changes.filter(c => /^CR-\d{3}$/.test(c.id));
if (numbered.length !== 37) fail(`the numbered roadmap must have exactly 37 changes, found ${numbered.length}`);
changes.forEach(c => { if (!/^CR-\d{3}$/.test(c.id) && !c.supplemental) fail(`${c.id}: a non-numbered change must be marked supplemental`); if (c.supplemental && /^CR-\d{3}$/.test(c.id)) fail(`${c.id}: a numbered change cannot be supplemental`); });
// Hosting: a virtual machine names a hypervisor; a physical device names none; the hypervisor is not a VM.
systems.forEach(s => { const h = s.hostedOn && systems.find(x => x.id === s.hostedOn);
  if (s.physical && s.hostedOn) fail(`system ${s.id}: a physical device cannot be hosted on ${s.hostedOn}`);
  if (s.hostedOn && !h) fail(`system ${s.id}: hostedOn ${s.hostedOn} is not a system`);
  if (h && h.kind !== "hypervisor") fail(`system ${s.id}: hostedOn ${s.hostedOn}, which is not a hypervisor`);
  if (!s.physical && s.kind !== "hypervisor" && !s.hostedOn) fail(`system ${s.id}: a virtual machine needs hostedOn`); });
lineIds.forEach(l => { if (!lineSet.has(l)) fail(`lines.json is missing line "${l}"`); });

// Planned work must never be referenced as built.
const builtRef = (ids, who) => ids.forEach(id => { const c = crById.get(id); if (!c) fail(`${who}: unknown change ${id}`); else if (c.status !== "done") fail(`${who}: references ${id}, which is ${c.status}. Planned work cannot be shown as built`); });
// Links: endpoints must touch the stations they connect.
const box = (s) => ({ x0: s.map.col - s.map.w / 2 - 1.2, x1: s.map.col + s.map.w / 2 + 1.2, y0: s.map.row - s.map.h / 2 - 1.2, y1: s.map.row + s.map.h / 2 + 1.2 });
const inside = (p, s) => { const b = box(s); return p[0] >= b.x0 && p[0] <= b.x1 && p[1] >= b.y0 && p[1] <= b.y1; };
const sysById = new Map(systems.map(s => [s.id, s]));
systems.forEach(s => {
  builtRef(s.builtBy, `system ${s.id}`);
  s.services.forEach(v => { if (!svcIds.has(v)) fail(`system ${s.id}: unknown service ${v}`); });
  s.links.forEach(l => {
    const to = sysById.get(l.to); if (!to) { fail(`system ${s.id}: link to unknown system ${l.to}`); return; }
    if (!lineSet.has(l.line)) fail(`system ${s.id}: unknown line ${l.line}`);
    const a = l.path[0], b = l.path[l.path.length - 1];
    if (l.line !== "platform" && !inside(a, s)) fail(`system ${s.id}: link to ${l.to} starts at [${a}], which does not touch ${s.id}`);
    if (l.line !== "platform" && !inside(b, to)) fail(`system ${s.id}: link to ${l.to} ends at [${b}], which does not touch ${l.to}`);
  });
});
services.forEach(v => {
  builtRef(v.builtBy, `service ${v.id}`);
  v.runsOn.forEach(s => { if (!sysIds.has(s)) fail(`service ${v.id}: runsOn unknown system ${s}`); });
  v.dependsOn.forEach(d => { if (!svcIds.has(d)) fail(`service ${v.id}: dependsOn unknown service ${d}`); });
  if (!lineSet.has(v.line)) fail(`service ${v.id}: unknown line ${v.line}`);
});
glossary.forEach(g => g.seeAlso.forEach(x => { if (!glossIds.has(x) && !sysIds.has(x) && !svcIds.has(x)) fail(`glossary ${g.id}: seeAlso ${x} is not a term, service or system`); }));
journeys.forEach(j => j.steps.forEach(st => { if (!sysIds.has(st.at)) fail(`journey ${j.id}: unknown station ${st.at}`); }));
const segIds = new Set(systems.flatMap(s => s.links.map(l => `${l.line}:${s.id.replace(/^nova-/, "")}-${l.to.replace(/^nova-/, "")}`)));
journeys.forEach(j => j.steps.forEach(st => { if (st.segment && !segIds.has(st.segment)) fail(`journey ${j.id}: unknown segment ${st.segment}`); }));
if (!crById.has(facts.nextChange)) fail(`facts.nextChange ${facts.nextChange} is not a change`);
else if (crById.get(facts.nextChange).status !== "next") fail(`facts.nextChange ${facts.nextChange} must have status "next"`);
if (changes.filter(c => c.status === "next").length !== 1) fail(`exactly one change must have status "next"`);

// Incidents (front matter of src/content/incidents/*.md)
const incSchema = z.object({ title: z.string(), summary: z.string(), date: z.string(), outcome: z.string(), status: z.enum(["tested"]), systems: z.array(z.string()), sourceUrl: z.string().url(), ...incidentExtra }).strict();
const incDir = join(root, "incidents"); const pins = new Map();
readdirSync(incDir).filter(f => f.endsWith(".md")).forEach(f => {
  const m = readFileSync(join(incDir, f), "utf8").match(/^---\n([\s\S]*?)\n---/); if (!m) { fail(`${f}: no front matter`); return; }
  const r = incSchema.safeParse(yaml(m[1])); if (!r.success) { r.error.issues.forEach(i => fail(`incidents/${f}: ${i.path.join(".")} ${i.message}`)); return; }
  const d = r.data, slug = f.replace(/\.md$/, "");
  if (!d.type) fail(`incidents/${f}: every incident needs a type (real, controlled, blind or tabletop)`);
  if (d.cr) builtRef([d.cr], `incident ${slug}`); else if (!d.ft) fail(`incidents/${f}: needs a cr or an ft source`);
  d.systems.forEach(s => { if (!sysIds.has(s)) fail(`incidents/${f}: unknown system ${s}`); });
  (d.services ?? []).forEach(s => { if (!svcIds.has(s)) fail(`incidents/${f}: unknown service ${s}`); });
  if (d.segment) { const k = `${d.segment.line}:${d.segment.from.replace(/^nova-/, "")}-${d.segment.to.replace(/^nova-/, "")}`; if (!segIds.has(k)) fail(`incidents/${f}: segment ${k} does not exist`); }
  if (d.featured) for (const k of ["saw", "cause", "fix", "proof", "shortTitle"]) if (!d[k]) fail(`incidents/${f}: a featured incident needs "${k}"`);
  if (d.pin) { const key = `${d.pin.col},${d.pin.row}`; if (pins.has(key)) fail(`incidents/${f}: pin position duplicates ${pins.get(key)}`); pins.set(key, slug); }
});
const featuredNs = readdirSync(incDir).filter(f => f.endsWith(".md")).map(f => (readFileSync(join(incDir, f), "utf8").match(/^featured: (\d+)/m) || [])[1]).filter(Boolean).sort();
if (new Set(featuredNs).size !== featuredNs.length) fail("featured numbers must be unique");

// Sanitized CR-A figures: each needs a file, alt text, a caption naming what it proves, and a source.
import { existsSync } from "node:fs";
const cra = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src/data/craEvidence.json"), "utf8")).entries;
const craIds = new Set();
cra.forEach(e => { if (craIds.has(e.id)) fail(`craEvidence: duplicate id ${e.id}`); craIds.add(e.id);
  if (!existsSync(join(dirname(fileURLToPath(import.meta.url)), "..", "public", e.file))) fail(`craEvidence ${e.id}: missing file ${e.file}`);
  for (const k of ["title", "caption", "alt", "source", "redaction"]) if (!e[k] || e[k].length < 10) fail(`craEvidence ${e.id}: needs ${k}`); });

if (errors.length) { console.error("Nova content validation FAILED:\n - " + errors.join("\n - ")); process.exit(1); }
console.log(`Nova content OK: ${systems.length} systems, ${services.length} services, ${changes.length} changes (${changes.filter(c => c.status === "done").length} done), ${glossary.length} glossary terms, ${journeys.length} journey, ${readdirSync(incDir).filter(f => f.endsWith(".md")).length} incidents.`);
