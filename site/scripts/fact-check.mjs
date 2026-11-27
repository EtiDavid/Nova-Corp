// Fact-check table: every headline number on the site must appear in the source journals/docs AND on the page that states it.
// Run after a build: node scripts/fact-check.mjs  (writes nothing; exits 1 on a mismatch; prints a markdown table).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
const root = resolve(".."), dist = resolve("dist");
const read = p => existsSync(p) ? readFileSync(p, "utf8") : "";
const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
const docsText = walk(join(root, "docs")).filter(f => /\.md$/.test(f)).map(read).join("\n");
const pageText = r => read(join(dist, r, "index.html")).replace(/<script.*?<\/script>|<style.*?<\/style>/gs, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/\s+/g, " ");
const rows = [
  ["Thin pool before cleanup", "86.73", "/incidents/proxmox-storage-pressure/"], ["Thin pool after cleanup", "52.88", "/incidents/proxmox-storage-pressure/"],
  ["Space freed (GiB)", "125.72", "/incidents/proxmox-storage-pressure/"], ["Old snapshots removed", "20 ", "/incidents/proxmox-storage-pressure/"],
  ["File server address", "10.10.20.20", "/systems/nova-files01/"], ["DC01 DNS address", "10.10.20.10", "/systems/nova-dc01/"],
  ["Windows Server Backup time", "22:00", "/systems/nova-files01/"], ["DC01 System State backup time", "23:00", "/systems/nova-dc01/"],
  ["Shadow copy times", "07:00", "/systems/nova-files01/"], ["Wrong DNS server in the DNS incident", "192.0.2.53", "/incidents/dns-client-outage/"],
  ["Wrong DNS record in the two-faults incident", "192.0.2.44", "/incidents/two-faults-one-symptom/"], ["Wrong gateway", "192.168.178.254", "/incidents/proxmox-default-gateway/"],
  ["Right gateway", "192.168.178.1", "/incidents/proxmox-default-gateway/"], ["Operating system", "Windows Server 2025", "/systems/nova-files01/"],
  ["Documented OUs", "16", "/learn/active-directory/"], ["Group Policy objects", "seven", "/policies/"],
];
let bad = 0; const out = ["| Fact | Value | In source docs | On the site page |", "| --- | --- | --- | --- |"];
for (const [label, v, page] of rows) { const inDocs = docsText.includes(v.trim()); const inPage = pageText(page).includes(v.trim()) || pageText(page).toLowerCase().includes(v.trim().toLowerCase()); if (!inDocs || !inPage) bad++; out.push(`| ${label} | ${v.trim()} | ${inDocs ? "yes" : "**NO**"} | ${inPage ? "yes (" + page + ")" : "**NO** (" + page + ")"} |`); }
// counts from the content model against the home page
const facts = JSON.parse(read("src/content/nova/facts.json")); const home = pageText("/");
const count = (dir) => readdirSync(dir).filter(f => f.endsWith(".json")).length;
const nums = [["Systems on the map", count("src/content/nova/systems")], ["VLANs", facts.vlans.length], ["Incidents (deferred test not counted)", readdirSync("src/content/incidents").filter(f => f.endsWith(".md") && !/^type: "deferred"/m.test(read(join("src/content/incidents", f)))).length]];
for (const [l, n] of nums) { const ok = new RegExp("\\b" + n + "\\b").test(home); if (!ok) bad++; out.push(`| ${l} (content model) | ${n} | n/a | ${ok ? "yes (home)" : "**NO** (home)"} |`); }
console.log(out.join("\n")); console.log(bad ? `\n${bad} mismatch(es)` : "\nAll facts match."); process.exit(bad ? 1 : 0);
