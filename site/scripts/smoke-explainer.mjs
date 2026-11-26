// Browser tests for the animated explainers: controls advance steps, reduced motion shows the final step, no overflow on phones.
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
const host = "http://127.0.0.1:4347";
const bin = process.env.CHROME_PATH || execFileSync("which", ["google-chrome"]).toString().trim();
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4347"], { cwd: process.cwd(), stdio: "ignore" });
const pages = [["nova-dc01", "xf-dc"], ["nova-dc02", "xf-dc"], ["nova-files01", "xf-files"], ["nova-fw01", "xf-fw"], ["nova-prox01", "xf-prox"], ["nova-client", "xf-pc"]];
let browser;
try {
  for (let n = 0; n < 60; n++) { try { if ((await fetch(host + "/")).ok) break; } catch {} await new Promise(r => setTimeout(r, 300)); }
  browser = await chromium.launch({ executablePath: bin, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  for (const [sys, id] of pages) {
    const errors = [];
    for (const [w, reduce] of [[1280, "no-preference"], [320, "no-preference"], [390, "no-preference"], [1280, "reduce"]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: reduce }); const p = await ctx.newPage(); p.on("pageerror", e => errors.push(e.message));
      await p.goto(`${host}/systems/${sys}/`); const fig = p.locator("#" + id); await fig.waitFor();
      const total = await fig.locator(".xf-text li").count() ? (await p.evaluate(i => JSON.parse(document.querySelector("#" + i + " .xf-data").textContent).scenarios[0].steps.length, id)) : 0;
      assert.ok(total > 1, `${sys} has steps`);
      if (reduce === "reduce") { assert.match(await fig.locator(".xf-count").textContent(), new RegExp(`Step ${total} of ${total}`), `${sys} reduced motion shows the final step`); }
      else {
        await p.click(`#${id} [data-act="restart"]`); assert.match(await fig.locator(".xf-count").textContent(), /Step 1 of/);
        await p.click(`#${id} [data-act="next"]`); assert.match(await fig.locator(".xf-count").textContent(), /Step 2 of/, `${sys} next advances`);
        await p.click(`#${id} [data-act="prev"]`); assert.match(await fig.locator(".xf-count").textContent(), /Step 1 of/, `${sys} previous goes back`);
        assert.ok((await fig.locator(".xf-say").textContent()).length > 10, "caption has words");
      }
      assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${sys} no page overflow at ${w}`);
      await ctx.close();
    }
    assert.deepEqual(errors, [], `${sys} page errors`); console.log("PASS", sys);
  }
} finally { await browser?.close(); server.kill(); }
