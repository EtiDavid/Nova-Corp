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
 await step("Homepage title, visitor text, two journeys and source transparency", async()=>{
  const response=await desktop.goto(host+"/",{waitUntil:"networkidle"});
  assert.equal(response?.status(),200);
  assert.match((await desktop.locator("h1").innerText()),/Explore Nova Corp/i);
  assert.equal(await desktop.locator(".journey").count(),3);
  assert(await desktop.getByRole("link",{name:/Explore the company/i}).count()>0);
  assert((await desktop.locator("body").innerText()).includes("David Eti"));
  assert((await desktop.locator("body").innerText()).includes("Fictional company"));
 });
 await step("Home → engineer journey",async()=>{
  await desktop.locator(".journey").first().click();
  await desktop.waitForURL(/\/people\/moyo\/$/);
  assert((await desktop.locator("body").innerText()).includes("IT_Users"));
  await desktop.getByRole("link",{name:"IT_Users",exact:true}).first().click();
  await desktop.waitForURL(/\/groups\/it-users\/$/);
  assert((await desktop.locator("body").innerText()).includes("DL_FS_IT_Modify"));
 });
 await step("Incident Lab has working investigation links and truthful deferred status",async()=>{
  await desktop.goto(host+"/incidents/",{waitUntil:"domcontentloaded"});
  assert.equal(await desktop.locator(".incident-card").count(),8);
  assert.equal(await desktop.locator(".incident-chip.pending").count(),1);
  await desktop.locator('a[href$="/incidents/dns-client-outage/"]').first().click();
  await desktop.waitForURL(/dns-client-outage\/$/);
  assert((await desktop.locator("article").innerText()).includes("port 445"));
 });
 await step("Desktop graph island renders original six documented nodes",async()=>{
  await desktop.goto(host+"/areas/control-room/",{waitUntil:"networkidle"});
  await desktop.locator(".react-flow__node").first().waitFor({timeout:20000});
  assert.equal(await desktop.locator(".react-flow__node").count(),6);
  assert(await desktop.getByRole("link",{name:/open system profile|nova/i}).count()>=0);
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
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1,hasTouch:true});
 mobile.on("pageerror",e=>errors.push(e.message));
 await step("390px mobile menu opens and navigates without side scrolling",async()=>{
  await mobile.goto(host+"/",{waitUntil:"networkidle"});
  assert(await mobile.locator(".mobile-nav summary").isVisible());
  await mobile.locator(".mobile-nav summary").click();
  const dir=mobile.locator(".mobile-nav nav a[href$='/directory/']");
  assert(await dir.isVisible());
  await dir.click();
  await mobile.waitForURL(/\/directory\/$/);
  const dimensions=await mobile.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert(dimensions.scroll<=dimensions.inner+2,JSON.stringify(dimensions));
 });
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
