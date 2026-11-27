import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
const source=readFileSync(resolve("../docs/explore/files/TECHNICAL_ACL_DETAILS.md"),"utf8");
const published=JSON.parse(readFileSync(resolve("src/data/fileAcls.json"),"utf8"));
const smb=[],ntfs=[],errors=[];
let kind="",scope="";
const tick=String.fromCharCode(96);
const clean=s=>s.split(tick).join("").replaceAll("**","").trim();
for(const line of source.split(/\r?\n/)){
 if(line.startsWith("## Network share permissions"))kind="smb";
 if(line.startsWith("## NTFS folder permissions"))kind="ntfs";
 if(line.startsWith("## Why the DFS"))kind="";
 const m=line.match(/^<summary><strong>([^<]+)<\/strong>/);
 if(m)scope=m[1];
 if(!kind||!line.startsWith("| ")||/^\|\s*(?:---|SMB share|Principal)/.test(line))continue;
 const cell=line.slice(1).replace(/\|\s*$/,"").split("|").map(s=>s.trim());
 if(kind==="smb"){
  if(cell.length!==4)throw Error("Malformed SMB record: "+line);
  smb.push({id:"smb-"+String(smb.length+1).padStart(3,"0"),share:clean(cell[0]),principal:clean(cell[1]),action:clean(cell[2]),access:clean(cell[3])});
 }else{
  if(cell.length!==5)throw Error("Malformed NTFS record: "+line);
  const parts=cell[4].split(tick+", "+tick);
  if(parts.length!==2)throw Error("Malformed NTFS flags: "+line);
  ntfs.push({id:"ntfs-"+String(ntfs.length+1).padStart(3,"0"),folder:scope,principal:clean(cell[0]),rights:clean(cell[1]),action:clean(cell[2]),inherited:cell[3]==="True",inheritance:clean(parts[0]),propagation:clean(parts[1])});
 }
}
if(smb.length!==27||ntfs.length!==73||new Set(ntfs.map(r=>r.folder)).size!==14)errors.push("Unexpected source counts");
if(JSON.stringify(smb)!==JSON.stringify(published.smb))errors.push("SMB data differs from reviewed public source");
if(JSON.stringify(ntfs)!==JSON.stringify(published.ntfs))errors.push("NTFS data differs from reviewed public source");
const page=resolve("dist/files/permissions/technical/index.html");
if(!existsSync(page))errors.push("Missing static ACL browser");
else{
 const html=readFileSync(page,"utf8");
 const countSmb=[...html.matchAll(/id="ace-smb-\d{3}"/g)].length;
 const countNtfs=[...html.matchAll(/id="ace-ntfs-\d{3}"/g)].length;
 if(countSmb!==27||countNtfs!==73)errors.push("HTML anchors mismatch: "+countSmb+" SMB, "+countNtfs+" NTFS");
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("ACL source parity PASS: 27 SMB, 73 NTFS entries, 14 folders, 100 HTML anchors.");
