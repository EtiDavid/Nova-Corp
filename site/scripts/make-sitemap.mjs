// Writes dist/sitemap.xml from the built pages (skips redirect stubs and the evidence/journal archives' assets).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
const dist = resolve("dist"), site = (process.env.SITE_URL || "https://novacorp.davideti.dev").replace(/\/$/, "");
const base = (process.env.PUBLIC_BASE_PATH || "/").replace(/\/$/, "");
const skip = new Set(["_astro", "audit", "pdf-evidence", "journal-figures", "evidence", "docs-images", "brands", "pdf-journals"]);
const urls = [];
(function walk(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) { if (!skip.has(e.name)) walk(p); } else if (e.name === "index.html") { const t = readFileSync(p, "utf8"); if (/http-equiv="refresh"/i.test(t) || /name="robots" content="noindex/i.test(t) || /<title>\s*(404|Page not found)/i.test(t)) continue; urls.push(p.slice(dist.length, -"index.html".length)); } } })(dist);
urls.sort();
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${site}${base}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log("sitemap.xml:", urls.length, "pages");
