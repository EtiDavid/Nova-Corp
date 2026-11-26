// Runs axe-core (WCAG 2.2 A/AA rules) in real Chromium on a sample of every page template, light theme, desktop and 390px.
// Usage: node scripts/axe-pages.mjs [--all] [--rules=color-contrast]   (needs a built dist/)
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const dist = resolve("dist"), host = "http://127.0.0.1:4390";
const args = process.argv.slice(2), all = args.includes("--all");
const onlyRules = (args.find(a => a.startsWith("--rules=")) || "").replace("--rules=", "").split(",").filter(Boolean);
const bin = process.env.CHROME_PATH || execFileSync("which", ["google-chrome"]).toString().trim();
const routes = [];
(function walk(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) { if (!["_astro", "audit", "pdf-evidence", "journal-figures", "references", "evidence", "pdf-journals"].includes(e.name)) walk(p); } else if (e.name === "index.html") { const t = readFileSync(p, "utf8"); if (!/http-equiv="refresh"/i.test(t)) routes.push("/" + p.slice(dist.length + 1, -10)); } } })(dist);
const sections = new Map(); routes.sort().forEach(r => { const k = r.split("/")[1] || "home"; (sections.get(k) ?? sections.set(k, []).get(k)).push(r); });
const sample = all ? routes : [...sections.values()].flatMap(list => list.length > 3 ? [list[0], list[Math.floor(list.length / 2)], list.at(-1)] : list);
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4390"], { stdio: "ignore" });
const results = new Map(); let pages = 0;
try {
  for (let n = 0; n < 60; n++) { try { if ((await fetch(host + "/")).ok) break; } catch {} await new Promise(r => setTimeout(r, 300)); }
  const browser = await chromium.launch({ executablePath: bin, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  for (const [label, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: "light", reducedMotion: "reduce" });
    for (const r of sample) {
      const page = await ctx.newPage();
      try {
        await page.goto(host + r, { waitUntil: "domcontentloaded", timeout: 20000 }); await page.waitForTimeout(150);
        await page.evaluate(axeSource);
        const out = await page.evaluate(async (rules) => await window.axe.run(document, { runOnly: { type: rules.length ? "rule" : "tag", values: rules.length ? rules : ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] }, resultTypes: ["violations"] }), onlyRules);
        pages++;
        for (const v of out.violations) for (const node of v.nodes) {
          const key = `${v.id}|${node.target.join(" ").slice(0, 70)}`; const rec = results.get(key) ?? { rule: v.id, impact: v.impact, target: node.target.join(" ").slice(0, 90), pages: [], note: (node.any[0]?.message || node.failureSummary || "").replace(/\n/g, " ").slice(0, 150) };
          if (rec.pages.length < 3) rec.pages.push(label + r); results.set(key, rec);
        }
      } catch (e) { console.error("axe error on", r, String(e.message).slice(0, 80)); } finally { await page.close(); }
    }
    await ctx.close();
  }
  await browser.close();
} finally { server.kill("SIGTERM"); }
const byRule = new Map(); [...results.values()].forEach(r => byRule.set(r.rule, (byRule.get(r.rule) ?? 0) + 1));
console.log(`axe checked ${pages} page views (${sample.length} routes x 2 sizes).`);
[...results.values()].sort((a, b) => a.rule.localeCompare(b.rule)).slice(0, 60).forEach(r => console.log(`- [${r.impact}] ${r.rule}: ${r.target} (${r.pages[0]}) ${r.note}`));
console.log(results.size ? `\n${results.size} distinct violations: ${[...byRule].map(([k, v]) => `${k} x${v}`).join(", ")}` : "No axe violations in the sampled pages.");
process.exit(results.size ? 1 : 0);
