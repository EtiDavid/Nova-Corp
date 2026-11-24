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

 await step("Homepage: clear headline, tour CTA, only two incident groups",async()=>{
  const response=await desktop.goto(host+"/",{waitUntil:"networkidle"});
  assert.equal(response?.status(),200);
  assert.match(await desktop.locator("h1").innerText(),/I built the infrastructure/i);
  const body=await desktop.locator("body").innerText();
  assert.match(body,/Nova Corp is a fictional company/i);
  assert(!body.includes("David Eti · Infrastructure"),"requested personal role block removed");
  assert(!body.includes("22 NOV 2026"),"visual date removed from home diagram");
  assert.equal(await desktop.locator(".exp-hero .button-row a").count(),2);
  assert(await desktop.getByRole("link",{name:/Take the guided tour/}).first().isVisible());
  const afterDiagram=await desktop.locator(".exp-hero + section").getAttribute("id");
  assert.equal(afterDiagram,"incident-library","incident library is the only home section beneath map");
  assert.equal(await desktop.locator(".il-group").count(),2);
  assert.match(await desktop.locator("#il-controlled").innerText(),/Controlled failure tests/);
  assert.match(await desktop.locator("#il-unplanned").innerText(),/Unexpected incidents/i);
  assert.equal(await desktop.locator(".il-group:first-child .il-item").count(),9);
  assert.equal(await desktop.locator(".il-group:last-child .il-item").count(),6);
  assert.equal(await desktop.locator(".il-group .il-item:visible").count(),8,"start with 4 visible from each group");
  await desktop.locator("#il-more-controlled summary").click();
  assert.equal(await desktop.locator(".il-group .il-item:visible").count(),13);
  await desktop.locator("#il-more-unplanned summary").click();
  assert.equal(await desktop.locator(".il-group .il-item:visible").count(),15);
  assert.equal(await desktop.locator("main > section").count(),2,"hero and incident library only");
 });
 await step("Sandbox: color logos, real IPs, subtle scroll and genuine profile navigation",async()=>{
  await desktop.goto(host+"/",{waitUntil:"networkidle"});
  const scene=desktop.locator("#hx-explorer"),port=scene.locator("#lab-scrollport");
  assert(await scene.isVisible());
  assert(await port.evaluate(el=>el.scrollHeight>el.clientHeight+300));
  assert.equal(await scene.locator(".hx-node[data-id]").count(),6);
  assert.equal(await scene.locator(".sb-guest").count(),4);
  for(const file of ["proxmox-color.svg","pfsense-color.svg","vmware-color.svg","windows-server-color.svg","server-corner.svg"]){
    const res=await desktop.request.get(host+"/brands/"+file);
    assert.equal(res.status(),200,"logo asset "+file);
  }
  assert((await scene.innerText()).includes("10.10.20.10"));
  assert((await scene.innerText()).includes("10.10.20.11"));
  assert((await scene.innerText()).includes("10.10.20.20"));
  assert((await scene.innerText()).includes("10.10.40.100"));
  await scene.locator(".atlas-prox").hover();
  assert.match(await scene.locator("#hx-title").innerText(),/NOVA-PROX01/);
  await scene.locator(".atlas-prox").click();
  await desktop.waitForURL(/\/systems\/nova-prox01\/$/);
  await desktop.goto(host+"/",{waitUntil:"networkidle"});
  await desktop.locator('[data-jump="guests"]').click();
  await desktop.waitForFunction(()=>document.getElementById("lab-scrollport").scrollTop>200);
  assert((await desktop.locator(".sb-section.is-entered").count())>=1,"scroll reveal reaches visible stages");
  await desktop.locator('.sb-guest[data-id="nova-dc01"]').click();
  await desktop.waitForURL(/\/systems\/nova-dc01\/$/);
  assert(await desktop.locator('img[src*="/pdf-evidence/dc02-sysvol-available.jpg"]').isVisible(),"original DC failover screenshot now replaces placeholder");
  assert(!((await desktop.locator(".page-head").innerText()).includes("NOV 2026")),"no promotional date banner");
  await desktop.goto(host+"/?system=nova-files01",{waitUntil:"networkidle"});
  assert.match(await desktop.locator("#hx-title").innerText(),/NOVA-FILES01/);
  const expected=await desktop.locator("#hx-record").getAttribute("href");
  assert(expected.endsWith("/systems/nova-files01/"));
  const reducedContext=await browser.newContext({reducedMotion:"reduce",viewport:{width:1440,height:900}});
  const reduced=await reducedContext.newPage();
  await reduced.goto(host+"/",{waitUntil:"networkidle"});
  assert(!await reduced.evaluate(()=>document.documentElement.classList.contains("motion-ready")));
  await reduced.locator('[data-jump="guests"]').click();
  assert((await reduced.locator("#lab-scrollport").evaluate(el=>el.scrollTop))>200);
  await reducedContext.close();
 });
 await step("Technical terms: auto-link servers and jargon to explainer pages",async()=>{
  await desktop.goto(host+"/incidents/dc01-outage/",{waitUntil:"networkidle"});
  assert((await desktop.locator('a.technical-link[href$="/systems/nova-dc01/"]').count())>=1);
  assert((await desktop.locator('a.technical-link[href$="/learn/ldap/"]').count())>=1);
  assert((await desktop.locator('a.technical-link[href$="/learn/kerberos/"]').count())>=1);
  assert((await desktop.locator('a.technical-link[href$="/learn/sysvol/"]').count())>=1);
  assert(await desktop.locator(".incident-sidebar-journal .incident-master-link").isVisible(),"actual full journal is linked");
  await desktop.goto(host+"/learn/sysvol/",{waitUntil:"networkidle"});
  assert.match(await desktop.locator(".page-head h1").innerText(),/SYSVOL/i);
  assert.match(await desktop.locator("main").innerText(),/NOVA-DC02/);
  await desktop.goto(host+"/glossary/",{waitUntil:"networkidle"});
  assert.equal(await desktop.locator(".term-index > a").count(),18);
 });
 await step("Every learn page shows complete public original docs and real CR journal links",async()=>{
  await desktop.goto(host+"/learn/active-directory/",{waitUntil:"networkidle"});
  const article=desktop.locator(".term-story .inline-source-doc");
  assert(await article.isVisible());
  const details=await article.textContent(); // Includes original source commands in collapsible <details> sections.
  for(const phrase of ["Why Nova Corp installed it","16 OUs","repadmin /replsummary","Resolve-DnsName","What was tested?"]){
    assert(details.includes(phrase),"active-directory must display source fact "+phrase);
  }
  const cr=desktop.locator('.term-source-links a[href*="CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal"]');
  assert(await cr.isVisible(),"actual CR-013 journal linked");
  assert(await desktop.locator('.term-aside a[href$="/reference/explore/services/ACTIVE_DIRECTORY/"]').isVisible());
  await desktop.goto(host+"/learn/sysvol/",{waitUntil:"networkidle"});
  assert((await desktop.locator(".term-story .inline-source-doc").innerText()).includes("NETLOGON"));
  await desktop.goto(host+"/learn/wireguard/",{waitUntil:"networkidle"});
  assert(await desktop.locator('.term-source-links a[href*="Journal-CR-007"]').isVisible());
  await desktop.goto(host+"/people/john-shaw/",{waitUntil:"networkidle"});
  assert((await desktop.locator(".contextual-source").innerText()).includes("Physical USB behavior was not verified"));
  const publishedImage=desktop.locator('.contextual-source img[src*="/docs-images/Documentation/Change-Requests/evidence/03-contractor-user-gpresult.png"]');
  assert(await publishedImage.isVisible(),"published John Shaw gpresult screenshot present in original markdown");
  await publishedImage.scrollIntoViewIfNeeded();
  assert(await publishedImage.evaluate(img=>img.complete&&img.naturalWidth>0),"original GPO image must load locally");
  await desktop.goto(host+"/people/moyo/",{waitUntil:"networkidle"});
  assert((await desktop.locator(".contextual-source").innerText()).includes("IT allowed, Finance denied"));
  await desktop.goto(host+"/groups/it-users/",{waitUntil:"networkidle"});
  assert((await desktop.locator(".contextual-source").innerText()).includes("AGDLP"));
  await desktop.goto(host+"/directory/ous/it/",{waitUntil:"networkidle"});
  assert((await desktop.locator(".contextual-source").innerText()).includes("16 Organizational Units"));
  await desktop.goto(host+"/search/",{waitUntil:"networkidle"});
  await desktop.locator("[data-search]").fill("ACTIVE_DIRECTORY.md");
  assert((await desktop.locator("[data-search-item]:visible").count())>0,"original repo Markdown documents must be searchable");
 });
 await step("Published engineering docs: original pfSense depth and cross-linked journals",async()=>{
  const response=await desktop.goto(host+"/systems/nova-fw01/",{waitUntil:"networkidle"});
  assert.equal(response?.status(),200);
  const source=desktop.locator(".inline-source-doc");
  assert(await source.isVisible());
  const copy=await source.innerText();
  for(const phrase of ["eight interfaces","five VLANs","17 filter rules","five aliases","six DHCP scopes","one active WireGuard tunnel","automatic outbound NAT"]){
    assert(copy.toLowerCase().includes(phrase.toLowerCase()),"missing actual pfSense source fact: "+phrase);
  }
  assert((await desktop.locator(".evidence-placeholder").count())>0,"visual evidence placeholder still present");
  const docLink=desktop.locator('a[href$="/reference/explore/network/RULES/"]').first();
  assert(await docLink.isVisible(),"public source crosslinks stay inside website");
  await docLink.click();
  await desktop.waitForURL(/\/reference\/explore\/network\/RULES\/$/);
  assert.match(await desktop.locator(".page-head h1").innerText(),/Every firewall rule/i);
  assert((await desktop.locator(".reference-content").innerText()).includes("17 explicit filter rules"));
  await desktop.goto(host+"/reference/explore/systems/NOVA-FW01/",{waitUntil:"networkidle"});
  assert.match(await desktop.locator(".page-head h1").innerText(),/pfSense Firewall/i);
  assert((await desktop.locator(".reference-content").innerText()).includes("DNS Resolver"));
  await desktop.goto(host+"/reference/Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal/",{waitUntil:"networkidle"});
  assert.match(await desktop.locator(".page-head h1").innerText(),/Secondary Domain Controller/i);
  assert((await desktop.locator(".reference-content").innerText()).includes("dcdiag"));
  await desktop.goto(host+"/reference/",{waitUntil:"networkidle"});
  assert.equal(await desktop.locator("[data-ref-doc]").count(),161);
  await desktop.locator("[data-ref-search]").fill("NOVA-FW01");
  assert((await desktop.locator("[data-ref-doc]:visible").count())>0);
  assert((await desktop.locator("[data-ref-doc]:visible").count())<161);
  const sizes=await desktop.evaluate(()=>({inner:innerWidth,width:document.documentElement.scrollWidth}));
  assert(sizes.width<=sizes.inner+3,"engineering library overflow "+JSON.stringify(sizes));
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
  await desktop.waitForFunction(() => !new URLSearchParams(window.location.search).has("focus"),null,{timeout:5000});
  assert(!/focus=/.test(desktop.url()));
  assert.equal(await desktop.evaluate(()=>document.activeElement?.getAttribute("data-id")),"nova-dc01");
  await desktop.locator('#tabs button[data-view="network"]').click();
  await desktop.waitForURL(/view=network/);
  await desktop.goto(host+"/company/?view=files&focus=nova-files01",{waitUntil:"networkidle"});
  assert(await desktop.locator("#sys-nova-files01").isVisible());
 });
 await step("Historical fault switch: DC01 outage and wrong client resolver display real limits",async()=>{
  await desktop.goto(host+"/company/",{waitUntil:"networkidle"});
  await desktop.locator('[data-scenario="dc01-outage"]').click();
  assert(/scenario=dc01-outage/.test(desktop.url()));
  assert.equal(await desktop.locator('.node.scenario-outage').count(),1);
  assert.equal(await desktop.locator('.node.scenario-alternate').count(),1);
  assert(/client selected DC02/i.test(await desktop.locator("#sim-text").innerText()));
  await desktop.locator('[data-scenario="client-dns-fault"]').click();
  assert(/scenario=client-dns-fault/.test(desktop.url()));
  assert.equal(await desktop.locator('.node.scenario-misconfigured').count(),1);
  assert(/192\.0\.2\.53/.test(await desktop.locator("#sim-text").innerText()));
  await desktop.locator('#tabs button[data-view="overview"]').click();
  assert(!/scenario=/.test(desktop.url()));
  assert.equal(await desktop.locator('.node.scenario-outage').count(),0);
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
  assert.equal(await desktop.locator("#case-grid .outcome").count(),16);
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
 await step("Source-faithful incident pages: 16 complete analyses, original journal CTA and CR-007 figures",async()=>{
  const wire=await desktop.goto(host+"/incidents/wireguard-handshake/",{waitUntil:"networkidle"});
  assert.equal(wire?.status(),200);
  const full=desktop.locator(".incident-source-document");
  assert(await full.isVisible(),"original incident analysis should be on the page");
  const details=await full.innerText();
  for(const phrase of ["Capture WAN UDP 51820","pfctl -vvsr","sockstat -4 -l","wg show","Recreate client keys"]){
    assert(details.includes(phrase),"wireguard original investigation missing "+phrase);
  }
  const original=desktop.locator(".incident-sidebar-journal .incident-master-link");
  assert((await original.getAttribute("href")).endsWith("/docs/Documentation/Change-Requests/Journal-CR-007.md"));
  assert((await original.innerText()).includes("full Markdown"));
  const onsite=desktop.locator('.incident-sidebar-journal a[href*="/reference/Documentation/Change-Requests/Journal-CR-007/"]');
  assert(await onsite.isVisible());
  assert.equal(await desktop.locator(".incident-journal-figures img").count(),3);
  for(const img of await desktop.locator(".incident-journal-figures img").all()){
    await img.scrollIntoViewIfNeeded();
    const loaded=await img.evaluate(el=>el.complete&&el.naturalWidth>0);
    assert(loaded,"original journal image must have nonzero naturalWidth");
    const url=await img.getAttribute("src");
    assert(url.startsWith("/journal-figures/cr007/"));
    assert.equal((await desktop.request.get(host+url)).status(),200);
  }
  assert(await desktop.locator(".incident-source-document pre").count()>=4,"preserve actual recorded commands");
  await onsite.click();
  await desktop.waitForURL(/\/reference\/Documentation\/Change-Requests\/Journal-CR-007\/$/);
  assert((await desktop.locator(".reference-content").innerText()).includes("Incident report - WireGuard handshake failure"));
  await desktop.goto(host+"/incidents/backup-target-unavailable/",{waitUntil:"networkidle"});
  const backup=await desktop.locator(".incident-source-document").innerText();
  for(const phrase of ["Get-Disk -Number 2","wbadmin start recovery","Get-FileHash","79FCAD43C927A5B19FB820E3E0BD9EE829083769AD2BE5E487C425B7820332E5"]){
    assert(backup.includes(phrase),"backup original investigation missing "+phrase);
  }
  assert((await desktop.locator(".incident-sidebar-journal .incident-master-link").getAttribute("href")).endsWith("Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"));
  assert((await desktop.locator(".incident-sidebar-journal .incident-master-link").innerText()).includes("PDF"));
  assert(await desktop.locator(".evidence-placeholder").isVisible(),"unpublished CR-014 screenshots must remain explicitly pending");
  const related=desktop.locator('.incident-associated-records a[href*="CR-012_Windows_Server_Backup"]');
  assert(await related.isVisible());
  await desktop.goto(host+"/incidents/dc01-outage/",{waitUntil:"networkidle"});
  assert(await desktop.locator(".incident-source-document").isVisible());
  assert((await desktop.locator(".incident-sidebar-journal .incident-master-link").getAttribute("href")).endsWith("Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"));
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
   const map=mobile.locator("#lab-scrollport");
   assert(await map.isVisible(),"scrollable diagram exists on mobile");
   assert(await map.evaluate(el=>el.scrollHeight>el.clientHeight+200),"mobile diagram must be internally scrollable");
   await mobile.locator('[data-jump="guests"]').click();
   await mobile.waitForFunction(()=>document.getElementById("lab-scrollport").scrollTop>200);
   await mobile.locator('.sb-guest[data-id="nova-files01"]').click();
   await mobile.waitForURL(/\/systems\/nova-files01\/$/);
   assert(await mobile.locator('img[src*="/pdf-evidence/backup-disk-offline.jpg"]').isVisible(),"mobile file server shows original recorded backup failure");
   await mobile.goto(host+"/",{waitUntil:"networkidle"});

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
  await step(width+"px: complete engineering profiles and full source documents stay within viewport",async()=>{
   await mobile.goto(host+"/systems/nova-fw01/",{waitUntil:"domcontentloaded"});
   let sizes=await mobile.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert(sizes.scroll<=sizes.inner+3,"FW01 profile overflow: "+JSON.stringify(sizes));
   await mobile.locator(".engineering-source-label").scrollIntoViewIfNeeded();
   sizes=await mobile.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert(sizes.scroll<=sizes.inner+3,"FW01 full source overflow: "+JSON.stringify(sizes));
   await mobile.goto(host+"/reference/explore/systems/NOVA-FW01/",{waitUntil:"domcontentloaded"});
   sizes=await mobile.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert(sizes.scroll<=sizes.inner+3,"Standalone engineering source overflow: "+JSON.stringify(sizes));
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
