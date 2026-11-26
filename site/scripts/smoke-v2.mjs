// Browser tests for the v2 pages. Tests real clicks and hit targets, not just screenshots.
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright-core";

const host = "http://127.0.0.1:4344";
const bin = process.env.CHROME_PATH || execFileSync("which", ["google-chrome"]).toString().trim();
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4344"], { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"], shell: false });
let out = ""; server.stdout.on("data", b => out += b); server.stderr.on("data", b => out += b);
let browser; const errors = [];
const step = async (name, fn) => { await fn(); console.log("PASS", name); };
const page = async (opts = {}) => { const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts }); const p = await ctx.newPage(); p.on("pageerror", e => errors.push(e.message)); p.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); }); p.on("console", m => { if (m.type() === "error" && !/status of 404|status of 4/.test(m.text())) errors.push("console: " + m.text()); }); return p; };
try {
  let ready = false;
  for (let n = 0; n < 60; n++) { try { if ((await fetch(host + "/")).ok) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 300)); }
  if (!ready) throw Error("Preview server unavailable:\n" + out);
  browser = await chromium.launch({ executablePath: bin, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const d = await page({ colorScheme: "light" });

  await step("Home: headline, availability, contact, nav, computed counts, no stale wording", async () => {
    await d.goto(host + "/", { waitUntil: "networkidle" });
    assert.match(await d.locator("h1").innerText(), /I built the infrastructure\. Then I tested what happens when it fails\./);
    const body = await d.locator("body").innerText();
    assert(body.includes("Available now")); assert(body.includes("Belgium & the Netherlands")); assert(!/on hold/i.test(body));
    assert.deepEqual(await d.locator(".nv-nav a:not(.nv-btn)").allInnerTexts(), ["Incidents", "Map", "Changes", "About"]);
    assert.equal(await d.getByRole("link", { name: "Download CV" }).first().getAttribute("href"), "/David_Eti_Systems_Infrastructure_CV.pdf");
    assert.equal(await d.locator(".icard").count(), 3);
    const nums = await d.locator(".counts b").allInnerTexts();
    assert.deepEqual(nums, ["6", "5", "15", "17"]);
    assert.equal(await d.locator("main > section").count(), 4); // hero, cases, map, counts
  });
  await step("Home: the journey ends on FILES01 and Replay works", async () => {
    await d.locator("#nl-home").scrollIntoViewIfNeeded();
    await d.waitForFunction(() => document.getElementById("tick")?.getAttribute("opacity") === "1", null, { timeout: 9000 });
    assert((await d.locator("#journey-text").innerText()).includes("Access allowed"));
    await d.locator("#replay").click();
    await d.waitForFunction(() => document.getElementById("tick")?.getAttribute("opacity") === "0", null, { timeout: 3000 });
    await d.waitForFunction(() => document.getElementById("tick")?.getAttribute("opacity") === "1", null, { timeout: 9000 });
  });
  await step("Theme toggle switches and remembers", async () => {
    const before = await d.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await d.locator("#theme-toggle").click();
    assert.equal(await d.evaluate(() => document.documentElement.dataset.theme), "dark");
    assert.notEqual(await d.evaluate(() => getComputedStyle(document.body).backgroundColor), before);
    await d.reload({ waitUntil: "networkidle" });
    assert.equal(await d.evaluate(() => document.documentElement.dataset.theme), "dark");
    await d.locator("#theme-toggle").click();
  });
  await step("Map: keyboard select, URL state, Escape returns focus, line filter", async () => {
    await d.goto(host + "/map/", { waitUntil: "networkidle" });
    assert.equal(await d.locator("#nl-full .stn").count(), 6);
    const node = d.locator('#nl-full .stn[data-id="nova-dc01"]'); await node.focus(); await d.keyboard.press("Enter");
    await d.waitForURL(/focus=nova-dc01/); assert(await d.locator("#sys-nova-dc01").isVisible());
    assert(/what broke here/i.test(await d.locator("#sys-nova-dc01").innerText()));
    await d.keyboard.press("Escape"); assert(!/focus=/.test(d.url()));
    assert.equal(await d.evaluate(() => document.activeElement?.getAttribute("data-id")), "nova-dc01");
    await d.getByRole("button", { name: "Identity" }).click(); await d.waitForURL(/line=identity/);
    assert(await d.locator('#nl-full .seg.line-network.dim').count() > 0);
    await d.goto(host + "/map/?line=recovery&focus=nova-files01", { waitUntil: "networkidle" });
    assert(await d.locator("#sys-nova-files01").isVisible());
  });
  await step("Incident: new template, repair on scroll, glossary mark rules", async () => {
    await d.goto(host + "/incidents/dns-client-outage/", { waitUntil: "networkidle" });
    assert((await d.locator(".type").first().innerText()).includes("Blind test"));
    assert(await d.locator('#nl-inc .seg.broken').count() === 1);
    await d.locator("#fix").scrollIntoViewIfNeeded();
    await d.waitForFunction(() => document.querySelectorAll("#nl-inc .seg.broken").length === 0, null, { timeout: 3000 });
    assert((await d.locator("#map-caption").innerText()).includes("Repaired"));
    const ids = await d.locator(".term[data-term]").evaluateAll(els => els.map(e => e.dataset.term));
    assert.equal(new Set(ids).size, ids.length, "glossary term marked twice on one page");
    assert.equal(await d.locator("h1 .term, h2 .term, h3 .term, a .term").count(), 0);
    const first = d.locator(".term[data-term]").first(); await first.click();
    await d.locator("#term-pop").waitFor({ state: "visible", timeout: 3000 }); assert((await d.locator("#term-pop").innerText()).includes("In Nova Corp"));
    await d.keyboard.press("Escape"); assert(!(await d.locator("#term-pop").isVisible()));
  });
  await step("Changes, change page, service page, roadmap (next three only), glossary", async () => {
    await d.goto(host + "/changes/", { waitUntil: "networkidle" });
    assert.equal(await d.locator(".timeline li").count(), 15);
    await d.goto(host + "/changes/CR-004/", { waitUntil: "networkidle" });
    assert((await d.locator("body").innerText()).includes("NOVA-DC02"));
    assert.equal(await d.getByRole("link", { name: /Full journal/ }).count(), 1);
    assert.equal((await fetch(host + "/changes/CR-016/")).status, 404, "a planned change must not have a built page");
    await d.goto(host + "/services/dns/", { waitUntil: "networkidle" });
    assert((await d.locator("body").innerText()).includes("In Nova Corp"));
    await d.goto(host + "/roadmap/", { waitUntil: "networkidle" });
    assert.equal(await d.locator(".boxnote").count(), 3);
    const rt = await d.locator("main").innerText(); assert(rt.includes("CR-016")); assert(!rt.includes("CR-019"));
    await d.goto(host + "/glossary/", { waitUntil: "networkidle" });
    assert.equal(await d.locator(".gloss > div").count(), 20);
  });
  await step("Old URLs redirect to the new pages", async () => {
    await d.goto(host + "/company/", { waitUntil: "domcontentloaded" }); await d.waitForURL(/\/map\/$/);
    await d.goto(host + "/tour/", { waitUntil: "domcontentloaded" }); await d.waitForURL(url => url.pathname === "/");
    await d.goto(host + "/areas/control-room/", { waitUntil: "domcontentloaded" }); await d.waitForURL(/\/map\//);
  });
  await step("System page still renders and shows generated cross-links", async () => {
    await d.goto(host + "/systems/nova-dc01/", { waitUntil: "networkidle" });
    const t = await d.locator("#nl-gen").locator("xpath=..").innerText();
    assert(t.includes("Lines through NOVA-DC01")); assert(t.includes("Built in"));
  });
  await step("Reduced motion shows the final journey state at once", async () => {
    const r = await page({ reducedMotion: "reduce" });
    await r.goto(host + "/", { waitUntil: "networkidle" });
    assert.equal(await r.locator("#tick").getAttribute("opacity"), "1");
  });
  for (const width of [320, 375, 390]) {
    await step(`${width}px: menu hit target, no overflow on five pages, line list replaces map`, async () => {
      const m = await page({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
      for (const path of ["/", "/map/", "/incidents/dns-client-outage/", "/changes/", "/roadmap/"]) {
        await m.goto(host + path, { waitUntil: "networkidle" });
        const o = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth); assert(o <= 1, `${path} overflows by ${o}px at ${width}`);
      }
      await m.goto(host + "/map/", { waitUntil: "networkidle" });
      assert(!(await m.locator("#nl-full").isVisible())); assert(await m.locator(".mobile-lines").isVisible());
      const summary = m.locator(".nv-menu summary"); const box = await summary.boundingBox(); assert(box.height >= 44 && box.width >= 44);
      assert(await m.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest("summary") !== null, { x: box.x + box.width / 2, y: box.y + box.height / 2 }), "menu button is covered");
      await summary.click(); await m.locator('.nv-menu nav a[href="/changes/"]').click(); await m.waitForURL(/\/changes\/$/);
    });
  }
  await step("Skip link is the first focusable control", async () => {
    await d.goto(host + "/", { waitUntil: "domcontentloaded" }); await d.keyboard.press("Tab");
    assert.equal(await d.evaluate(() => document.activeElement?.textContent?.trim()), "Skip to main content");
  });
  assert.equal(errors.length, 0, "Browser errors: " + errors.join("; "));
  console.log("All v2 browser tests PASS. Automated check only; not a human accessibility, performance or usability review.");
} catch (err) { console.error("BROWSER QA FAILED", err?.stack || err); process.exitCode = 1; }
finally { if (browser) await browser.close(); server.kill("SIGTERM"); server.stdout.destroy(); server.stderr.destroy(); }
process.exit(process.exitCode ?? 0);
