import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright-core";

const host="http://127.0.0.1:4343"; // archive pages only; the v2 pages are tested in smoke-v2.mjs
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
  await desktop.goto(host+"/learn/acl/",{waitUntil:"networkidle"});
  assert.match(await desktop.locator(".page-head h1").innerText(),/Access Control List/);
  assert.match(await desktop.locator("main").innerText(),/individual access control entries/);
  await desktop.goto(host+"/learn/smb/",{waitUntil:"networkidle"});
  assert.match(await desktop.locator("main").innerText(),/TCP port 445/);
 });
 await step("Every learn page shows complete public original docs and real CR journal links",async()=>{
  await desktop.goto(host+"/learn/active-directory/",{waitUntil:"networkidle"});
  const article=desktop.locator(".glossary-pilot");
  assert(await article.isVisible());
  const details=await article.textContent(); // Includes original source commands in collapsible <details> sections.
  for(const phrase of ["Why does Nova Corp need it?","16 documented OUs","repadmin /replsummary","Resolve-DnsName","Technical checks"]){
    assert(details.includes(phrase),"active-directory must display source fact "+phrase);
  }
  const cr=desktop.locator('.glossary-pilot a[href*="CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.pdf"]');
  assert(await cr.isVisible(),"actual CR-013 journal linked");
  assert(await desktop.locator('.glossary-pilot a[href$="/reference/explore/services/ACTIVE_DIRECTORY/"]').isVisible());
  await desktop.goto(host+"/learn/sysvol/",{waitUntil:"networkidle"});
  assert((await desktop.locator(".glossary-pilot").innerText()).includes("NETLOGON"));
  await desktop.goto(host+"/learn/netlogon/",{waitUntil:"networkidle"});
  assert.match(await desktop.locator(".glossary-pilot").innerText(),/Map-DepartmentDrive/);
  await desktop.goto(host+"/learn/wireguard/",{waitUntil:"networkidle"});
  assert(await desktop.locator('.glossary-pilot a[href*="Journal-CR-007"]').isVisible());
  await desktop.goto(host+"/people/john-shaw/",{waitUntil:"networkidle"});
  assert((await desktop.locator("main").innerText()).includes("Physical USB behavior was not verified"));
  const publishedImage=desktop.locator('img[src*="/evidence/03-contractor-user-gpresult.png"]');
  assert(await publishedImage.isVisible(),"published John Shaw gpresult screenshot present in original markdown");
  await publishedImage.scrollIntoViewIfNeeded();
  assert(await publishedImage.evaluate(img=>img.complete&&img.naturalWidth>0),"original GPO image must load locally");
  await desktop.goto(host+"/people/moyo/",{waitUntil:"networkidle"});
  assert((await desktop.locator("main").innerText()).includes("IT allowed, Finance denied"));
  assert(await desktop.locator(".account-details a[href$=\"/groups/dl-fs-it-modify/\"]").isVisible());
  await desktop.goto(host+"/groups/it-users/",{waitUntil:"networkidle"});
  assert((await desktop.locator("main").innerText()).includes("DL_FS_IT_Modify"));
  await desktop.goto(host+"/directory/ous/it/",{waitUntil:"networkidle"});
  assert((await desktop.locator("main").innerText()).includes("What is stored in this OU?"));
  await desktop.goto(host+"/search/",{waitUntil:"networkidle"});
  await desktop.locator("[data-search]").fill("ACTIVE_DIRECTORY.md");
  assert((await desktop.locator("[data-search-item]:visible").count())>0,"original repo Markdown documents must be searchable");
 });
 await step("Published engineering docs: original pfSense depth and cross-linked journals",async()=>{
  const response=await desktop.goto(host+"/systems/nova-fw01/",{waitUntil:"networkidle"});
  assert.equal(response?.status(),200);
  const source=desktop.locator(".infra-profile");
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
  // Number of original public Markdown documents changes with each journal.
  const refsResponse=await desktop.request.get(host+"/references/manifest.json");
  assert.equal(refsResponse.status(),200,"original source manifest is served");
  const originalDocumentCount=(await refsResponse.json()).docsCount;
  assert(originalDocumentCount>=161,"reference inventory unexpectedly shrank");
  assert.equal(await desktop.locator("[data-ref-doc]").count(),originalDocumentCount);
  await desktop.locator("[data-ref-search]").fill("NOVA-FW01");
  assert((await desktop.locator("[data-ref-doc]:visible").count())>0);
  assert((await desktop.locator("[data-ref-doc]:visible").count())<originalDocumentCount);
  const sizes=await desktop.evaluate(()=>({inner:innerWidth,width:document.documentElement.scrollWidth}));
  assert(sizes.width<=sizes.inner+3,"engineering library overflow "+JSON.stringify(sizes));
 });
 await step("All 14 original PDF journals: full pages, native text, exact visual file and source links",async()=>{
  await desktop.goto(host+"/journals/",{waitUntil:"domcontentloaded"});
  assert.equal(await desktop.locator(".pdf-journal-card").count(),14);
  assert.match(await desktop.locator(".page-head .lead").innerText(),/543 original pages/);
  await desktop.goto(host+"/journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence/",{waitUntil:"domcontentloaded"});
  assert.equal(await desktop.locator("details.native-pdf-page").count(),46);
  const exact=desktop.locator(".pdf-document-viewer");
  const path=await exact.getAttribute("data");
  assert(path?.includes("/pdf-journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"));
  const sourcePdf=await desktop.request.get(host+"/pdf-journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf");
  assert.equal(sourcePdf.status(),200);
  assert.equal((await sourcePdf.body()).subarray(0,4).toString(),"%PDF");
  await desktop.locator('details.native-pdf-page[id="page-25"] summary').click();
  const transcribed=await desktop.locator('details.native-pdf-page[id="page-25"] pre').innerText();
  assert(transcribed.length>150,"native PDF source text should be readable at each original page");
  await desktop.goto(host+"/journals/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping/",{waitUntil:"domcontentloaded"});
  assert.equal(await desktop.locator("details.native-pdf-page").count(),20,"the original page 18 contains Markdown backticks and MUST not disappear");
  assert(await desktop.locator('details.native-pdf-page[id="page-18"]').count()===1);
  await desktop.goto(host+"/incidents/backup-target-unavailable/",{waitUntil:"domcontentloaded"});
  assert(await desktop.locator('a[href*="/journals/Nova_Corp_CR-014_Engineering_Journal_and_Evidence/"]').count()>0,"backup journal is readable onsite");
  await desktop.goto(host+"/changes/CR-008/",{waitUntil:"domcontentloaded"});
  assert(await desktop.locator('a[href*="/journals/NovaCorp_CR-008_File_Server_Deployment_Journal/"]').count()>0,"CR-008 links complete original PDF");
 });
 await step("FILES01 pilot: actual navigation and responsive source evidence",async()=>{
  for(const width of [390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:900}});
   const start=host+"/systems/nova-files01/";
   await page.goto(start,{waitUntil:"domcontentloaded"});
   assert(await page.getByRole("heading",{name:"What is NOVA-FILES01?"}).isVisible());
   assert(await page.getByRole("heading",{name:"Technical Profile"}).isVisible());
   for(const route of ["files/","files/permissions/","files/dfs/","files/shadow-copies/","files/volumes/","files/backup/","incidents/fileserver-subnet/","incidents/file-permission-denial/"]){
    await page.goto(start,{waitUntil:"domcontentloaded"});
    await page.locator('.files01-pilot a[href="/'+route+'"]').first().click();
    await page.waitForURL(host+"/"+route);
    const dimensions=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
    assert(dimensions.document<=dimensions.viewport+3,route+" overflow at "+width+": "+JSON.stringify(dimensions));
    assert(await page.locator(".page-head h1").first().isVisible(),route+" missing title");
   }
   await page.close();
  }
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
  const hashScreenshot=desktop.locator('img[src*="/pdf-evidence/backup-sha256-match.jpg"]');
  assert.equal(await hashScreenshot.count(),1,"Original CR-014 screenshot belongs on the backup incident");
  await hashScreenshot.scrollIntoViewIfNeeded();
  await hashScreenshot.evaluate(async el=>{if(!el.complete||el.naturalWidth===0)await el.decode();});
  assert(await hashScreenshot.evaluate(el=>el.naturalWidth>0),"Original PDF screenshot must actually decode");
  const related=desktop.locator('.incident-associated-records a[href*="CR-012_Windows_Server_Backup"]');
  assert(await related.isVisible());
  await desktop.goto(host+"/incidents/dc01-outage/",{waitUntil:"networkidle"});
  assert(await desktop.locator(".incident-source-document").isVisible());
  assert((await desktop.locator(".incident-sidebar-journal .incident-master-link").getAttribute("href")).endsWith("Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"));
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
  await step(width+"px: FILES01 shows the original backup failure proof, no side scroll",async()=>{
   await mobile.goto(host+"/systems/nova-files01/",{waitUntil:"networkidle"});
   const backupProof=mobile.locator('img[src*="/pdf-evidence/backup-disk-offline.jpg"]');
   const backupDetails=backupProof.locator("xpath=ancestor::details[1]");
   if(await backupDetails.count()&&!(await backupDetails.getAttribute("open")!==null))await backupDetails.locator("summary").click();
   await backupProof.waitFor({state:"attached"});
   await backupProof.scrollIntoViewIfNeeded();
   await backupProof.waitFor({state:"visible"});
   await mobile.waitForFunction(()=>{const image=document.querySelector('img[src*="/pdf-evidence/backup-disk-offline.jpg"]');return image instanceof HTMLImageElement&&image.complete&&image.naturalWidth>0;});
   assert(await backupProof.isVisible(),"mobile file server shows original recorded backup failure");
   const dimensions=await mobile.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert(dimensions.scroll<=dimensions.inner+2,JSON.stringify(dimensions));
  });
  await step(width+"px: complete engineering profiles and full source documents stay within viewport",async()=>{
   await mobile.goto(host+"/systems/nova-fw01/",{waitUntil:"domcontentloaded"});
   let sizes=await mobile.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert(sizes.scroll<=sizes.inner+3,"FW01 profile overflow: "+JSON.stringify(sizes));
   await mobile.locator(".infra-profile summary").first().scrollIntoViewIfNeeded();
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
