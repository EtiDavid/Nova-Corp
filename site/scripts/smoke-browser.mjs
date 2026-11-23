import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright-core";

const host="http://127.0.0.1:4343";
const bin=process.env.CHROME_PATH || execFileSync("which",["google-chrome"]).toString().trim();
const server=spawn("npm",["run","preview","--","--host","127.0.0.1","--port","4343"],{
 cwd:process.cwd(),stdio:["ignore","pipe","pipe"],shell:false
});
let serverOutput="";
server.stdout.on("data",b=>serverOutput+=b.toString());
server.stderr.on("data",b=>serverOutput+=b.toString());
let browser;
const step=async(name,fn)=>{
  await fn();
  console.log("PASS",name);
};
try {
 let ready=false;
 for(let n=0;n<50;n++){
  try {const r=await fetch(host+"/");if(r.ok){ready=true;break;}}catch{}
  await new Promise(r=>setTimeout(r,300));
 }
 if(!ready)throw Error("Preview server unavailable:\n"+serverOutput);
 browser=await chromium.launch({executablePath:bin,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const desktop=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];
 desktop.on("pageerror",e=>errors.push(e.message));

 await step("Homepage names the builder, the job target and contact actions",async()=>{
  const response=await desktop.goto(host+"/",{waitUntil:"networkidle"});
  assert.equal(response?.status(),200);
  assert.match((await desktop.locator("h1").innerText()),/built the infrastructure/i);
  const body=await desktop.locator("body").innerText();
  assert(body.includes("David Eti")); assert(body.includes("Belgium and the Netherlands"));
  assert(body.includes("Nova Corp is fictional"));
  for(const name of ["Download CV","Email","LinkedIn"]) assert((await desktop.getByRole("link",{name:new RegExp(name)}).count())>0,name);
  const nav=await desktop.locator(".v4-nav a").allInnerTexts();
  assert.deepEqual(nav,["Explore","Investigations","Guided tour","Roadmap","About David"]);
  assert(!(body.includes("on hold")));
  assert.equal(await desktop.locator(".exp-hero .button-row a").count(),2,"two primary first-screen actions");
  assert(await desktop.locator("#hx-explorer").isVisible(),"architecture explorer visible on homepage");
  assert(await desktop.locator(".exp-hero h1").isVisible(),"main engineering statement visible");
 });
 await step("Homepage sandbox: highlight documented paths and inspect a real component",async()=>{
  await desktop.goto(host+"/",{waitUntil:"networkidle"});
  const explorer=desktop.locator("#hx-explorer");
  await explorer.getByRole("button",{name:"Identity path"}).click();
  assert.match(await explorer.locator("#hx-title").innerText(),/employees sign in/i);
  assert((await explorer.locator(".hx-path.is-active").count())>=3);
  await explorer.locator('.hx-node[data-id="nova-dc01"]').click();
  assert.match(await explorer.locator("#hx-title").innerText(),/identity and DNS/i);
  assert((await explorer.locator("#hx-case").getAttribute("href")).includes("incidents/dc01-outage/"));
  await explorer.getByRole("button",{name:"File access"}).click();
  assert.match(await explorer.locator("#hx-title").innerText(),/shared files/i);
 });
 await step("Company explorer: select, deep link, Escape and focus return",async()=>{
  await desktop.goto(host+"/company/",{waitUntil:"networkidle"});
  const node=desktop.locator('.node[data-id="nova-dc01"]');
  await node.focus(); await desktop.keyboard.press("Enter");
  await desktop.waitForURL(/focus=nova-dc01/);
  const card=desktop.locator("#sys-nova-dc01");
  assert(await card.isVisible());
  assert(/not yet proven/i.test(await card.innerText()));
  await desktop.keyboard.press("Escape");
  assert(!/focus=/.test(desktop.url()));
  assert.equal(await desktop.evaluate(()=>document.activeElement?.getAttribute("data-id")),"nova-dc01");
  await desktop.locator('#tabs button[data-view="network"]').click();
  await desktop.waitForURL(/view=network/);
  await desktop.goto(host+"/company/?view=files&focus=nova-files01",{waitUntil:"networkidle"});
  assert(await desktop.locator("#sys-nova-files01").isVisible());
 });
 await step("Workflow lab traces four recorded routes and updates architecture focus",async()=>{
  await desktop.goto(host+"/company/",{waitUntil:"networkidle"});
  const lab=desktop.locator("#workflow-lab");
  assert(await lab.isVisible());
  assert.equal(await lab.locator("[data-flow-tab]").count(),4);
  assert(await lab.locator('[data-flow="files"]').isVisible());
  await lab.locator('[data-flow="files"] [data-next]').click();
  assert((await lab.locator('[data-flow="files"] .wl-progress').innerText()).includes("Step 2 of 5"));
  await lab.locator('[data-flow="files"] .wl-step.is-active [data-show-map]').click();
  assert(/view=identity/.test(desktop.url()),"map view follows DNS path stage");
  assert(/focus=nova-dc01/.test(desktop.url()),"map focuses the correct DNS server");
  assert(await desktop.locator("#sys-nova-dc01").isVisible());
  await lab.locator('[data-flow-tab="identity"]').click();
  assert(await lab.locator('[data-flow="identity"]').isVisible());
  assert(!(await lab.locator('[data-flow="files"]').isVisible()));
  assert((await lab.locator('[data-flow="identity"] .wl-progress').innerText()).includes("Step 1 of 4"));
  await lab.locator('[data-flow-tab="security"]').click();
  assert(await lab.locator('[data-flow="security"]').isVisible());
  await lab.locator('[data-flow-tab="recovery"]').click();
  assert(await lab.locator('[data-flow="recovery"]').isVisible());
  assert.equal(await desktop.locator(".exp-evidence-gallery img").count(),3);
  for(const img of await desktop.locator(".exp-evidence-gallery img").all()){
    assert((await img.getAttribute("alt")).length>18,"source screenshot requires descriptive alt");
    assert((await img.getAttribute("src")).startsWith("/evidence/"));
  }
 });
 await step("Investigations index filters; DNS replay steps and reveals recorded results",async()=>{
  await desktop.goto(host+"/incidents/",{waitUntil:"networkidle"});
  assert.equal(await desktop.locator("#case-grid .outcome").count(),8);
  assert.equal(await desktop.locator(".chip.deferred").count(),1);
  await desktop.getByRole("button",{name:"Recovery"}).click();
  assert.equal(await desktop.locator("#case-grid .outcome:visible").count(),1);
  await desktop.goto(host+"/incidents/dns-client-outage/",{waitUntil:"networkidle"});
  assert((await desktop.locator("#step-count").innerText()).includes("Step 1 of 5"));
  assert(!(await desktop.locator("#step-1 .reveal-target").isVisible()));
  await desktop.locator('#step-1 .r-challenge [data-choice="0"]').click();
  assert(/try a narrower diagnostic step/i.test(await desktop.locator('#step-1 .r-answer').innerText()));
  await desktop.locator('#step-1 .r-challenge [data-choice="1"]').click();
  assert(/best next check/i.test(await desktop.locator('#step-1 .r-answer').innerText()));
  await desktop.locator("#r-reveal").click();
  assert((await desktop.locator("#step-1").innerText()).includes("ERROR_TIMEOUT"));
  assert(/server reachability is still unknown/i.test(await desktop.locator("#r-signal").innerText()));
  await desktop.locator("#r-next").click();
  assert((await desktop.locator("#step-count").innerText()).includes("Step 2 of 5"));
  assert(/step=2/.test(desktop.url()));
  assert(/not yet proven/i.test(await desktop.locator("#replay").innerText()));
 });
 await step("Legacy room URLs still land on the new pages",async()=>{
  await desktop.goto(host+"/areas/control-room/",{waitUntil:"domcontentloaded"});
  await desktop.waitForURL(/\/company\//);
  await desktop.goto(host+"/explore/",{waitUntil:"domcontentloaded"});
  await desktop.waitForURL(/\/company\//);
  await desktop.goto(host+"/areas/roadmap-wing/",{waitUntil:"domcontentloaded"});
  await desktop.waitForURL(/\/roadmap\//);
  const r=await desktop.goto(host+"/roadmap/",{waitUntil:"domcontentloaded"});
  assert.equal(r?.status(),200);
  assert(!((await desktop.locator("body").innerText()).includes("on hold")));
 });
 await step("CV file is served",async()=>{
  const r=await desktop.request.get(host+"/David_Eti_Systems_Infrastructure_CV.pdf");
  assert.equal(r.status(),200);
 });
 await step("Policy search filters displayed settings",async()=>{
  await desktop.goto(host+"/policies/workstation-baseline/",{waitUntil:"networkidle"});
  const rows=desktop.locator("[data-setting-row]");
  const before=await rows.count();
  assert(before>=3);
  await desktop.locator("[data-policy-filter]").fill("AutoPlay");
  assert((await desktop.locator("[data-setting-row]:visible").count())>=1);
  assert((await desktop.locator("[data-setting-row]:visible").count())<before);
 });
 await step("100 recorded ACLs are present and searchable",async()=>{
  await desktop.goto(host+"/files/permissions/technical/",{waitUntil:"networkidle"});
  assert.equal(await desktop.locator("[data-acl-row]").count(),100);
  await desktop.locator("[data-acl-search]").fill("Finance");
  assert((await desktop.locator("[data-acl-row]:visible").count())>0);
  assert((await desktop.locator("[data-acl-row]:visible").count())<100);
 });
 await step("Site search hides non-matching cards",async()=>{
  await desktop.goto(host+"/search/",{waitUntil:"networkidle"});
  const input=desktop.locator("[data-search]");
  await input.fill("zzzz-not-present");
  assert.equal(await desktop.locator("[data-search-item]:visible").count(),0);
  assert(await desktop.locator("[data-empty]").isVisible());
 });

 for(const width of [320,375,390]){
  const mobile=await browser.newPage({viewport:{width,height:844},isMobile:true,deviceScaleFactor:1,hasTouch:true});
  mobile.on("pageerror",e=>errors.push(e.message));
  await step(width+"px: menu hit target, navigation, no side scroll, explorer list and back",async()=>{
   await mobile.goto(host+"/",{waitUntil:"networkidle"});
   const mini=mobile.locator("#hx-explorer .hx-mobile-list");
   assert(await mini.isVisible(),"mobile provides accessible node list instead of tiny SVG");
   await mini.locator('[data-id="nova-files01"]').click();
   assert.match(await mobile.locator("#hx-title").innerText(),/shared files and recovery/i);
   const summary=mobile.locator(".v4-menu summary");
   assert(await summary.isVisible());
   const box=await summary.boundingBox();
   assert(box.height>=44&&box.width>=44,JSON.stringify(box));
   const hit=await mobile.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest("summary")!==null,{x:box.x+box.width/2,y:box.y+box.height/2});
   assert(hit,"menu button is covered by another element");
   await summary.click();
   await mobile.locator(".v4-menu nav a[href$='/company/']").click();
   await mobile.waitForURL(/\/company\/$/);
   await mobile.locator('#sys-list button[data-id="nova-files01"]').click();
   assert(await mobile.locator("#sys-nova-files01").isVisible());
   await mobile.locator("#back-btn").click();
   assert(!(await mobile.locator("#sys-nova-files01").isVisible()));
   const workflow=mobile.locator("#workflow-lab");
   assert(await workflow.isVisible(),"guided workflow available on mobile");
   await workflow.locator('[data-flow-tab="identity"]').click();
   assert(await workflow.locator('[data-flow="identity"]').isVisible());
   const dimensions=await mobile.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert(dimensions.scroll<=dimensions.inner+2,JSON.stringify(dimensions));
  });
  await mobile.close();
 }
 await step("Keyboard skip link is first focusable control",async()=>{
  await desktop.goto(host+"/",{waitUntil:"domcontentloaded"});
  await desktop.keyboard.press("Tab");
  assert.equal(await desktop.evaluate(()=>document.activeElement?.textContent?.trim()),"Skip to main content");
 });
 await step("404 document exists in static build",async()=>{
  const response=await desktop.goto(host+"/404.html",{waitUntil:"domcontentloaded"});
  assert.equal(response?.status(),200);
  assert.match((await desktop.locator("h1").innerText()),/room doesn't exist/i);
 });
 assert.equal(errors.length,0,"Client-side JavaScript page errors: "+errors.join("; "));
 console.log("All release smoke tests PASS. This is an automated preview check, not human accessibility or production HTTPS sign-off.");
}catch(err){
 console.error("BROWSER QA FAILED",err?.stack||err);
 process.exitCode=1;
}finally{
 if(browser)await browser.close();
 server.kill("SIGTERM");
 server.stdout.destroy();
 server.stderr.destroy();
}
// npm spawns a child preview server that may retain inherited descriptors.
// QA is already complete; never leave a GitHub runner hanging on its pipes.
process.exit(process.exitCode ?? 0);
