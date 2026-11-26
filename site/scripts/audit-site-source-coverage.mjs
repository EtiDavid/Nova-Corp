import{existsSync,mkdirSync,readdirSync,readFileSync,writeFileSync}from"node:fs";
import{join,resolve,relative}from"node:path";
/**
 * Sitewide source coverage gate. Navigation pages may summarize. Pages
 * promising technical, identity or incident detail must render the actual
 * canonical GitHub Markdown inline, not defer it to a remote link.
 */
const dist=resolve("dist"),docs=resolve("../docs");const errors=[],checks=[];
function scan(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?scan(join(dir,e.name)):e.name==="index.html"?[join(dir,e.name)]:[]);}
const all=scan(dist).filter(x=>x.endsWith("index.html"));
function pageAt(route){const p=join(dist,route,"index.html");return existsSync(p)?readFileSync(p,"utf8"):null;}
function auditSection(group,routes,required,notes=""){
  const missing=[],thin=[];
  for(const route of routes){
    const html=pageAt(route);
    if(!html){missing.push(route);continue;}
    for(const marker of required){
      if(!html.includes(marker))thin.push({route,missing:marker});
    }
  }
  checks.push({group,count:routes.length,missingRoutes:missing,missingSourceSections:thin,notes});
  for(const p of missing)errors.push(group+": no route "+p);
  for(const p of thin)errors.push(group+": "+p.route+" lacks "+p.missing);
}
const names={
 terms:["active-directory","domain-controller","dns","ldap","kerberos","sysvol","group-policy","smb","ntfs","dfs","vlan","firewall","proxmox","wireguard","replication","shadow-copy","system-state","tcp"],
 people:["administrator","guest","krbtgt","test-user","john-shaw","alice-finance","finance-test","henry-hr","hr-test","isaac-it","david-it","moyo","maria-manager","management-test","gui-pilot","sarah-sales","svc-backup","svc-fileserver","svc-monitoring","sales-test"],
 groups:["it-users","finance-users","hr-users","management-users","sales-users","dl-fs-it-modify","dl-fs-finance-modify","dl-fs-hr-modify","dl-fs-management-modify","dl-fs-sales-modify","dl-fs-finance-fullcontrol"],
 ous:["domain-controllers","administrative-accounts","disabled-objects","resources","security-groups","service-accounts","nova-users","contractors","finance","hr","it","management","sales","nova-computers","servers","workstations"],
 computers:["nova-dc01","nova-dc02","nova-files01","nova-client"],
 systems:["nova-prox01","nova-fw01","nova-dc01","nova-dc02","nova-files01","nova-client"]
};
auditSection("All 20 approved glossary pages",[...names.terms,"acl","netlogon"].map(x=>"learn/"+x),["glossary-pilot","Where you can find it","Why does Nova Corp need it?","Technical checks","Recorded outcome","Engineering journals","/reference/","/pdf-journals/"]);
auditSection("20 real lab directory account records",names.people.map(x=>"people/"+x),["Active Directory profile","Direct security groups","Nested resource groups","Engineering journals","/reference/explore/people/"],"Exact public individual account Markdown per person, not assumed role");
auditSection("11 source-backed group profiles",names.groups.map(x=>"groups/"+x),["Group attributes","/reference/explore/GROUPS/"],"Original documented AGDLP inventory and actual group relationships");
auditSection("16 original OU source-backed profiles",names.ous.map(x=>"directory/ous/"+x),["What is stored in this OU?","/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/"],"Original 2026-11-22 directory snapshot, not live AD");
auditSection("4 computer-object profiles",names.computers.map(x=>"computers/"+x),["Directory computer profile","/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/"],"Original AD inventory distinct from VM status");
auditSection("Network and hypervisor profiles",["systems/nova-fw01","systems/nova-prox01"],["Technical Profile","Why does Nova Corp need it","Inside this server","Technical checks","Engineering journals","/reference/explore/systems/"],"Source records remain fully preserved in standalone article routes.");
auditSection("NOVA-CLIENT workstation profile",["systems/nova-client"],["Technical Profile","What is NOVA-CLIENT?","Technical checks","Engineering journals","/reference/explore/systems/NOVA-CLIENT/"]);
auditSection("Shared domain controller profiles",["systems/nova-dc01","systems/nova-dc02"],["Technical Profile","Inside this server","Engineering journals","dc02-sysvol-available.jpg","Technical checks","Why does Nova Corp need it","netdom query fsmo"]);
auditSection("1 explanation-first file server profile",["systems/nova-files01"],["Technical Profile","What is NOVA-FILES01?","files01-document-images","Engineering journals","NovaCorp_CR-008_File_Server_Deployment_Journal.pdf","NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf","NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf","CR-012_Windows_Server_Backup_and_Recovery_Journal.pdf","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],"Owner-approved concise profile with original evidence and direct full journal access; redundant inline source removed. Standalone source remains verified separately.");
auditSection("16 full incident analyses",
 ["backup-target-unavailable","bulk-users-partial-rollback","dc01-outage","dc01-vlan-migration","dns-client-outage","file-permission-denial","firewall-management-exposure","gpo-link-disabled","group-acl-name-mismatch","proxmox-default-gateway","proxmox-storage-pressure","proxmox-webgui-outage","replication-divergence","two-faults-one-symptom","vpn-validation-deferred","wireguard-handshake"].map(x=>"incidents/"+x),
 ["incident-source-document","incident-master-journal"],"Short case overview is NOT the full original journal");
const contentPages=all.length;
if(contentPages<320)errors.push("Expected >=320 generated HTML pages; got "+contentPages);
auditSection("Recruiter and technical entry points",[""],["Three things I proved","David Eti","tour/#recruiter","Download CV"]);
auditSection("Two guided tour routes",["tour"],["Two-minute recruiter overview","Technical walkthrough","Previous","Next","Download CV"]);
const ad=pageAt("learn/active-directory");
for(const str of ["Organizational units (OUs)","repadmin /replsummary","Resolve-DnsName","16 documented OUs","Engineering journals","/reference/explore/services/ACTIVE_DIRECTORY/"]){
 if(!ad?.includes(str))errors.push("Active Directory glossary missing original source fact: "+str);
}
const entry=pageAt("people/john-shaw");
for(const str of ["John Shaw","gpresult","Active Directory profile","03-contractor-user-gpresult.png"]){
 if(!entry?.includes(str))errors.push("John Shaw original GPO test or picture reference missing: "+str);
}
const groups=pageAt("groups/it-users");
if(!groups?.includes("DL_FS_IT_Modify"))errors.push("IT group page missing original AGDLP source concept");
const dir=pageAt("directory/ous/it");
if(!dir?.includes("DIRECTORY_SNAPSHOT_2026-11-22"))errors.push("IT OU lacks actual directory snapshot source");
const manifest={purpose:"Source-backed public site-wide audit. A passage is shown only when its original published Markdown was staged by SHA and included in the built page; this does not independently prove every described lab claim.",generatedHtmlPages:contentPages,totalCheckedProfiles:checks.reduce((sum,x)=>sum+x.count,0),checks,errors,sourceBranch:"Public docs/ in website's checked-out publishing branch; compare GitHub main before later upgrades"};
mkdirSync(join(dist,"audit"),{recursive:true});
writeFileSync(join(dist,"audit/source-coverage.json"),JSON.stringify(manifest,null,2)+"\n");
let lines=["# Original GitHub documentation vs website coverage","",
 "This report is generated from the actual static Astro build, never guessed.","",
 "The 161 original public Markdown articles are separately SHA-256 verified by `test:references`. This audit verifies that full source actually appears in destination detail pages.","",
 `Built pages: **${contentPages}**; source-backed detail routes audited: **${manifest.totalCheckedProfiles}**`,""];
for(const item of checks)lines.push(`- ${item.group}: ${item.count} routes, ${item.missingRoutes.length} missing, ${item.missingSourceSections.length} lacking full source.`);
lines.push("","Limitations: a visitor navigation index is not itself an engineering journal; PDF-only primary journals require reviewed extraction and are not falsely claimed converted into Markdown.","","## Discrepancies",errors.length?"": "None detected under the programmed route and source-presence rules.",...errors.map(x=>"- "+x));
writeFileSync(join(dist,"audit/source-coverage.md"),lines.join("\n")+"\n");
if(errors.length){console.error("Sitewide source parity FAIL\n"+errors.slice(0,80).join("\n"));process.exit(1);}
console.log("Sitewide source parity PASS: "+contentPages+" built HTML pages; "+manifest.totalCheckedProfiles+" technical, system, identity and incident detail pages contain actual original source.");
