import{createHash}from"node:crypto";
import{existsSync,readFileSync}from"node:fs";
import{resolve}from"node:path";
const root=resolve(".."),dist=resolve("dist");
const expected={
 "backup-target-unavailable":["backup-target-disappears.md","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],
 "bulk-users-partial-rollback":["bulk-users-partial-rollback.md","CR-011_PowerShell_Administration_Toolkit.md"],
 "dc01-outage":["domain-controller-outage.md","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],
 "dc01-vlan-migration":["dc01-vlan-migration.md","Journal-CR-003.md"],
 "dns-client-outage":["dns-client-outage.md","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],
 "file-permission-denial":["file-permission-denial.md","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],
 "firewall-management-exposure":["pfsense-management-exposure.md","CR-015_Phase_2_Validation_and_Closure.md"],
 "gpo-link-disabled":["gpo-link-disabled.md","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],
 "group-acl-name-mismatch":["group-acl-name-mismatch.md","CR-011_PowerShell_Administration_Toolkit.md"],
 "proxmox-default-gateway":["proxmox-default-gateway.md","failure-testing-report.md"],
 "proxmox-storage-pressure":["proxmox-snapshot-pressure.md","CR-015_Phase_2_Validation_and_Closure.md"],
 "proxmox-webgui-outage":["proxmox-webgui-outage.md","failure-testing-report.md"],
 "replication-divergence":["replication-divergence.md","CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"],
 "two-faults-one-symptom":["two-faults-one-symptom.md","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],
 "vpn-validation-deferred":["vpn-external-validation-deferred.md","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"],
 "wireguard-handshake":["wireguard-handshake.md","Journal-CR-007.md"]
};
const failures=[];
const out=Object.entries(expected);
for(const [slug,[sourceName,journalName]]of out){
 const rootIncident=resolve(root,"docs/explore/incidents",sourceName);
 if(!existsSync(rootIncident)){failures.push("Missing source "+sourceName);continue;}
 const masterPaths=journalName==="failure-testing-report.md"
  ?["docs/Documentation/failure-testing-report.md"]
  :journalName.endsWith(".pdf")
  ?["docs/Documentation/Change-Requests/"+journalName]
  :["docs/Documentation/Change-Requests/"+journalName];
 const full=resolve(root,masterPaths[0]);
 if(!existsSync(full))failures.push("Missing actual full journal "+masterPaths[0]+" for "+slug);
 const sourceText=readFileSync(rootIncident,"utf8");
 if(!sourceText.includes(journalName))failures.push("Mapping doesn't correspond to canonical incident source link for "+slug+" -> "+journalName);
 const page=resolve(dist,"incidents",slug,"index.html");
 if(!existsSync(page)){failures.push("Missing rendered incident page "+slug);continue;}
 const html=readFileSync(page,"utf8");
 for(const part of ["The complete public investigation","incident-source-document","incident-master-journal","#full-investigation"]){
  if(!html.includes(part))failures.push("No "+part+" on "+slug);
 }
 if(!html.includes(journalName))failures.push("Full journal URL not pointed to actual original journal: "+slug);
 if(!html.includes(sourceName))failures.push("Original Markdown source URL not present: "+slug);
 if(journalName.endsWith(".md")){
  const id=masterPaths[0].replace(/^docs\//,"").replace(/\.md$/,"");
  if(!html.includes("/reference/"+id+"/"))failures.push("Missing full on-site journal link "+slug);
 }
}
const figures=JSON.parse(readFileSync(resolve(dist,"journal-figures/cr007/manifest.json"),"utf8"));
if(figures.count!==6)failures.push("Original CR-007 figure manifest missing full set");
for(const figure of figures.figures){
 const src=resolve(root,figure.source),served=resolve(dist,"journal-figures/cr007",figure.file);
 if(!existsSync(src)||!existsSync(served)||createHash("sha256").update(readFileSync(served)).digest("hex")!==figure.sha256||createHash("sha256").update(readFileSync(src)).digest("hex")!==figure.sha256)failures.push("Original journal image SHA mismatch "+figure.file);
}
const wire=readFileSync(resolve(dist,"incidents/wireguard-handshake/index.html"),"utf8");
for(const value of ["Capture WAN UDP 51820","pfctl -vvsr","sockstat -4 -l","wg show","02_packet_journey.png","05_troubleshooting_funnel.png","Journal-CR-007.md"]){
 if(!wire.includes(value))failures.push("WireGuard source content / original figure missing: "+value);
}
const backup=readFileSync(resolve(dist,"incidents/backup-target-unavailable/index.html"),"utf8");
for(const value of ["Get-Disk","wbadmin start backup","Get-FileHash","79FCAD43C927A5B19FB820E3E0BD9EE829083769AD2BE5E487C425B7820332E5","Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf"]){
 if(!backup.includes(value))failures.push("Backup source steps / PDF journal missing: "+value);
}
const subnet=readFileSync(resolve(dist,"incidents/fileserver-subnet/index.html"),"utf8");
for(const value of ["Get-NetIPAddress","Get-NetRoute","tcpdump","/32","/24","subnet-vlan40-positive","NovaCorp_CR-008_File_Server_Deployment_Journal.pdf"]){if(!subnet.includes(value))failures.push("CR-008 dedicated investigation missing: "+value);}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Incident fidelity PASS: all 16 exact public source analyses rendered in-site; all 16 real journal targets exist and link correctly; WireGuard and backup exact tests/figures preserved; dedicated CR-008 original PDF investigation verified.");
