import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(readFileSync(join(root, "src/data", name), "utf8"));
const entities = read("entities.json");
const edges = read("relationships.json");
const errors = [];
const ids = new Set();
const slugs = new Set();
const statuses = new Set(["observed-running","observed-stopped","configured","historically-tested","planned","deferred"]);
const types = new Set(["hosts","routes-through","uses-service","accesses","replicates-with","depends-on","routes-to"]);

for (const item of entities) {
  if (ids.has(item.id)) errors.push("Duplicate ID: "+item.id);
  if (slugs.has(item.slug)) errors.push("Duplicate slug: "+item.slug);
  ids.add(item.id); slugs.add(item.slug);
  if (!statuses.has(item.status)) errors.push("Invalid status: "+item.id);
  if (!item.name || !item.summary || !item.asOf || !item.area) errors.push("Missing public profile fields: "+item.id);
  if (!item.limitations?.length) errors.push("Missing limitations: "+item.id);
  if (!item.sourceUrl?.startsWith("https://github.com/EtiDavid/Nova-Corp/blob/main/docs/")) errors.push("Source must be public and approved: "+item.id);
  const json = JSON.stringify(item);
  if (json.includes("nova-corp-enterprise-lab") || /password\s*[:=]|client_secret|api[_-]?key\s*[:=]/i.test(json)) errors.push("Private data pattern in "+item.id);
  for (const id of item.related || []) {
    if (!entities.some(e => e.id === id)) errors.push("Unknown related entity: "+item.id+" -> "+id);
  }
}
const edgeKeys = new Set();
for (const edge of edges) {
  if (!ids.has(edge.from) || !ids.has(edge.to)) errors.push("Dangling edge: "+edge.from+" -> "+edge.to);
  if (!types.has(edge.type)) errors.push("Unknown relation: "+edge.type);
  const key = edge.from+"|"+edge.to+"|"+edge.type;
  if (edgeKeys.has(key)) errors.push("Duplicate relation: "+key);
  edgeKeys.add(key);
}
for (const f of readdirSync(join(root,"src/content/incidents")).filter(f=>f.endsWith(".md"))) {
  const md=readFileSync(join(root,"src/content/incidents",f),"utf8");
  if (md.includes("nova-corp-enterprise-lab")) errors.push("Private repository referenced: "+f);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Public-safe graph verified: "+entities.length+" entities, "+edges.length+" relationships; all IDs, references and approved source domains valid.");
