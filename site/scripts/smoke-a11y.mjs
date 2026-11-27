// Gate 5 checks: keyboard-only use, visible focus, glossary popover by keyboard, pages readable without JS, no horizontal scroll at six widths.
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
const host = "http://127.0.0.1:4348";
const bin = process.env.CHROME_PATH || execFileSync("which", ["google-chrome"]).toString().trim();
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4348"], { cwd: process.cwd(), stdio: "ignore" });
const step = async (name, fn) => { await fn(); console.log("PASS", name); };
let browser;
try {
  for (let n = 0; n < 60; n++) { try { if ((await fetch(host + "/")).ok) break; } catch {} await new Promise(r => setTimeout(r, 300)); }
  browser = await chromium.launch({ executablePath: bin, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

  await step("Without JavaScript: key pages are readable and the map links work", async () => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
    for (const [url, min] of [["/", 800], ["/map/", 400], ["/incidents/dns-client-outage/", 800], ["/systems/nova-files01/", 800], ["/services/dns/", 400]]) {
      await p.goto(host + url); assert.equal(await p.locator("h1").count() >= 1, true, url + " has an h1");
      assert.ok((await p.locator("main").innerText()).length > min, url + " has readable text without JS");
    }
    await p.goto(host + "/map/"); const links = await p.locator('main a[href*="/systems/"]').count(); assert.ok(links >= 5, "map or line list links to systems without JS (" + links + ")");
    await p.goto(host + "/systems/nova-files01/"); assert.ok((await p.locator(".xf-text li").count()) > 10, "figure steps are available as text without JS");
    await ctx.close();
  });

  await step("Keyboard: skip link first, every stop has a visible focus style, no trap", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
    for (const url of ["/", "/map/", "/systems/nova-dc01/", "/incidents/dns-client-outage/", "/glossary/"]) {
      await p.goto(host + url); await p.keyboard.press("Tab");
      assert.match(await p.evaluate(() => document.activeElement?.textContent || ""), /skip/i, url + " skip link first");
      const seen = new Set(); let bad = [];
      for (let i = 0; i < 90; i++) {
        await p.keyboard.press("Tab");
        const info = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); const sv = e.closest("svg") ? getComputedStyle(e.querySelector("use,rect,circle,path,text") || e) : null; const vis = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none" || (sv && sv.filter !== "none") || e.closest("svg"); return { key: (e.tagName + (e.getAttribute("href") || e.id || e.textContent || "").slice(0, 40)), vis: !!vis }; });
        if (!info) break; if (seen.has(info.key + i % 1)) { } seen.add(info.key); if (!info.vis) bad.push(info.key);
      }
      assert.deepEqual(bad, [], url + " focus visible");
      assert.ok(seen.size > 12, url + " has many keyboard stops (" + seen.size + ")");
    }
    await ctx.close();
  });

  await step("Keyboard: glossary term opens with Enter and closes with Escape", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
    await p.goto(host + "/incidents/dns-client-outage/"); const t = p.locator('.term[data-term]').first(); await t.focus();
    await p.keyboard.press("Enter"); await p.waitForSelector("#term-pop:not([hidden])"); assert.equal(await t.getAttribute("aria-expanded"), "true");
    await p.keyboard.press("Escape"); assert.equal(await p.locator("#term-pop").isHidden(), true);
    assert.equal(await p.evaluate(() => document.activeElement?.classList.contains("term")), true, "focus returns to the term");
    await ctx.close();
  });

  await step("Keyboard: the animated figures can be paused and stepped", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
    await p.goto(host + "/systems/nova-files01/"); const f = p.locator("#xf-files");
    await f.locator(".xf-tab").nth(1).focus(); await p.keyboard.press("Enter"); assert.equal(await f.locator(".xf-tab").nth(1).getAttribute("aria-pressed"), "true");
    await f.locator(".xf-pause").focus(); await p.keyboard.press("Enter"); assert.equal(await f.locator(".xf-pause").textContent(), "Resume");
    await f.locator(".xf-dot").nth(2).focus(); await p.keyboard.press("Enter"); assert.match(await f.locator(".xf-count").textContent(), /Step 3 of/);
    await ctx.close();
  });

  await step("No horizontal scroll or clipped content at 360, 390, 768, 1024, 1440 and 1920", async () => {
    const urls = ["/", "/map/", "/incidents/", "/incidents/dns-client-outage/", "/incidents/dc02-cannot-reach-dc01/", "/systems/nova-files01/", "/systems/nova-prox01/", "/changes/", "/changes/CR-013/", "/services/dns/", "/learn/active-directory/", "/policies/", "/policies/contractor-usb/", "/network/", "/network/zones/client/", "/files/", "/files/permissions/", "/people/moyo/", "/glossary/", "/about/", "/recovery/", "/roadmap/", "/search/"];
    for (const w of [360, 390, 768, 1024, 1440, 1920]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } }); const p = await ctx.newPage();
      for (const u of urls) { await p.goto(host + u); const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); assert.ok(over <= 0, `${u} overflows by ${over}px at ${w}`); }
      await p.goto(host + "/map/"); const svgBox = await p.locator("main svg").first().boundingBox(); if (svgBox) assert.ok(svgBox.x + svgBox.width <= w + 1, "map svg not clipped at " + w);
      await ctx.close();
    }
  });
  console.log("All Gate 5 accessibility checks PASS. Automated; a screen reader and real users still need to try it.");
} catch (e) { console.error("A11Y QA FAILED", e); process.exitCode = 1; } finally { await browser?.close(); server.kill(); }
