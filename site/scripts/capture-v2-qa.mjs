// Captures real-browser screenshots of the v2 pages (light, dark, desktop, mobile) for visual review. Starts its own preview server.
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";
const host = "http://127.0.0.1:4346", out = "qa-snapshots";
const bin = process.env.CHROME_PATH || execFileSync("which", ["google-chrome"]).toString().trim();
mkdirSync(out, { recursive: true });
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4346"], { stdio: "ignore" });
try {
  for (let n = 0; n < 60; n++) { try { if ((await fetch(host + "/")).ok) break; } catch {} await new Promise(r => setTimeout(r, 300)); }
  const browser = await chromium.launch({ executablePath: bin, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const shots = [["home", "/"], ["map", "/map/?focus=nova-files01"], ["incident-dns", "/incidents/dns-client-outage/"], ["changes", "/changes/"], ["roadmap", "/roadmap/"]];
  for (const [theme, scheme] of [["light", "light"], ["dark", "dark"]]) for (const [view, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    for (const [name, path] of shots) { await p.goto(host + path, { waitUntil: "networkidle" }); await p.screenshot({ path: `${out}/v2-${name}-${theme}-${view}.png`, fullPage: true }); }
    await ctx.close();
  }
  await browser.close();
  console.log("Captured v2 screenshots (light and dark, desktop and mobile). Visual acceptance remains manual.");
} finally { server.kill("SIGTERM"); }
process.exit(0);
