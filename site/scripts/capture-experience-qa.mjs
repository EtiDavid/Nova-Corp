import {chromium} from "playwright-core";
import {mkdirSync} from "node:fs";
import {resolve} from "node:path";
const host="http://127.0.0.1:4321";
const chrome=process.env.CHROME_PATH;
if(!chrome)throw Error("CHROME_PATH is required for real browser screenshots");
const out=resolve("qa-snapshots");mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage"]});
try {
  const desktop=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await desktop.goto(host+"/company/",{waitUntil:"networkidle"});
  const lab=desktop.locator("#workflow-lab");
  await lab.screenshot({path:out+"/workflow-files-desktop.png"});
  await lab.locator('[data-flow-tab="identity"]').click();
  await lab.locator('[data-flow="identity"] [data-next]').click();
  await lab.screenshot({path:out+"/workflow-ad-failover-desktop.png"});
  await lab.locator('[data-flow="identity"] .wl-step.is-active [data-show-map]').click();
  await desktop.locator("#company-map .explorer").screenshot({path:out+"/workflow-map-focused-desktop.png"});

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  await mobile.goto(host+"/company/?workflow=security",{waitUntil:"networkidle"});
  await mobile.locator("#workflow-lab").screenshot({path:out+"/workflow-security-mobile.png"});

  await desktop.goto(host+"/incidents/dns-client-outage/",{waitUntil:"networkidle"});
  await desktop.locator('#step-1 .r-challenge [data-choice="1"]').click();
  await desktop.locator("#r-reveal").click();
  await desktop.locator("#replay").screenshot({path:out+"/dns-diagnostic-desktop.png"});
  await mobile.goto(host+"/incidents/dns-client-outage/",{waitUntil:"networkidle"});
  await mobile.locator('#step-1 .r-challenge [data-choice="1"]').click();
  await mobile.locator("#replay").screenshot({path:out+"/dns-diagnostic-mobile.png"});
  console.log("Captured six real Chromium interaction and mobile QA screenshots.");
} finally {
  await browser.close();
}
