// Browser tests for the animated explainers: controls advance steps, reduced motion shows the final step, no overflow on phones.
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
const host = "http://127.0.0.1:4347";
const bin = process.env.CHROME_PATH || execFileSync("which", ["google-chrome"]).toString().trim();
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4347"], { cwd: process.cwd(), stdio: "ignore" });
const pages = [["/systems/nova-dc01/", ["xf-dc"]], ["/systems/nova-dc02/", ["xf-dc"]], ["/systems/nova-files01/", ["xf-files", "xf-share", "xf-access", "xf-service", "xf-recovery"]], ["/systems/nova-fw01/", ["xf-fw"]], ["/systems/nova-prox01/", ["xf-prox"]], ["/systems/nova-client/", ["xf-pc"]], ["/", ["xf-home"]], ["/incidents/dns-client-outage/", ["xf-dnsclient"]], ["/incidents/fileserver-subnet/", ["xf-subnet"]], ["/incidents/dc01-outage/", ["xf-dc"]], ["/incidents/firewall-management-exposure/", ["xf-fw"]], ["/incidents/proxmox-storage-pressure/", ["xf-prox"]], ["/incidents/backup-target-unavailable/", ["xf-recovery"]], ["/incidents/file-permission-denial/", ["xf-files"]], ["/incidents/wireguard-handshake/", ["xf-wg"]], ["/incidents/gpo-link-disabled/", ["xf-gpo"]], ["/incidents/replication-divergence/", ["xf-repl"]], ["/incidents/two-faults-one-symptom/", ["xf-two"]], ["/services/dns/", ["xf-dnsclient"]], ["/services/dfs/", ["xf-share"]], ["/services/kerberos/", ["xf-dc"]], ["/services/replication/", ["xf-repl"]], ["/services/smb-ntfs/", ["xf-files"]], ["/services/shadow-copies/", ["xf-recovery"]], ["/services/windows-server-backup/", ["xf-recovery"]], ["/services/group-policy/", ["xf-gpo"]], ["/services/pfsense-firewall/", ["xf-fw"]], ["/services/nested-virtualization/", ["xf-prox"]], ["/services/proxmox-backups/", ["xf-prox"]], ["/incidents/dc01-vlan-migration/", ["xf-iface"]], ["/incidents/group-acl-name-mismatch/", ["xf-namematch"]], ["/incidents/proxmox-default-gateway/", ["xf-gateway"]], ["/incidents/proxmox-webgui-outage/", ["xf-service-stop"]], ["/incidents/bulk-users-partial-rollback/", ["xf-rollback"]], ["/incidents/vpn-validation-deferred/", ["xf-notrun"]], ["/incidents/dc02-cannot-reach-dc01/", ["xf-cr4"]], ["/services/vlan-segmentation/", ["xf-vlan"]], ["/network/", ["xf-vlan"]], ["/files/dfs/", ["xf-dfs"]], ["/learn/vlan/", ["xf-vlan"]], ["/learn/dns/", ["xf-lookup"]], ["/learn/smb/", ["xf-files"]], ["/learn/group-policy/", ["xf-policy"]], ["/systems/nova-dc01/", ["xf-dc", "xf-account", "xf-policy", "xf-lookup"]], ["/files/", ["xf-share"]], ["/files/backup/", ["xf-recovery"]], ["/files/permissions/", ["xf-access"]], ["/groups/it-users/", ["xf-account"]], ["/policies/workstation-baseline/", ["xf-policy"]], ["/recovery/", ["xf-recovery"]], ["/changes/CR-007/", ["xf-two-stage"]], ["/changes/CR-013/", ["xf-dc"]], ["/network/zones/client/", ["xf-zone"]], ["/people/moyo/", ["xf-account"]], ["/computers/nova-client/", ["xf-pc"]]];
let browser;
try {
  for (let n = 0; n < 60; n++) { try { if ((await fetch(host + "/")).ok) break; } catch {} await new Promise(r => setTimeout(r, 300)); }
  browser = await chromium.launch({ executablePath: bin, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  for (const [sys, ids] of pages) for (const id of ids) {
    const errors = [];
    for (const [w, reduce] of [[1280, "no-preference"], [320, "no-preference"], [390, "no-preference"], [1280, "reduce"]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: reduce }); const p = await ctx.newPage(); p.on("pageerror", e => errors.push(e.message));
      await p.goto(`${host}${sys}`); const fig = p.locator("#" + id); await fig.waitFor();
      const total = await fig.locator(".xf-text li").count() ? (await p.evaluate(i => (d => (d.scenarios.find(x => x.id === d.start) || d.scenarios[0]).steps.length)(JSON.parse(document.querySelector("#" + i + " .xf-data").textContent)), id)) : 0;
      assert.ok(total > 1, `${sys} has steps`);
      assert.equal(await fig.locator(".xf-dot").count(), total, `${sys} has one dot per step`);
      if (reduce === "reduce") { assert.match(await fig.locator(".xf-count").textContent(), new RegExp(`Step ${total} of ${total}`), `${sys} reduced motion shows the final step`); }
      else if (w === 1280) {
        assert.equal(await fig.locator('[data-act="play"]').count(), 0, "no play button");
        await fig.scrollIntoViewIfNeeded(); let n = 1;
        for (let t = 0; t < 40 && n < 2; t++) { await p.waitForTimeout(300); n = Number((await fig.locator(".xf-count").textContent()).match(/Step (\d+)/)[1]); }
        assert.ok(n >= 2, `${sys} autoplays on its own (step ${n})`);
        await p.click(`#${id} .xf-dot >> nth=0`); assert.match(await fig.locator(".xf-count").textContent(), /Step 1 of/, `${sys} dot jumps to step 1`);
        assert.equal(await fig.locator(".xf-pause").textContent(), "Pause", "clicking a dot keeps it playing");
        await p.click(`#${id} .xf-pause`); assert.equal(await fig.locator(".xf-pause").textContent(), "Resume", "pause button pauses");
        assert.ok((await fig.locator(".xf-say").textContent()).length > 10, "caption has words");
      }
      assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${sys} no page overflow at ${w}`);
      await ctx.close();
    }
    assert.deepEqual(errors, [], `${sys} page errors`); console.log("PASS", sys);
  }
} finally { await browser?.close(); server.kill(); }
