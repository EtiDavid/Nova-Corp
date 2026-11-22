import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

/**
 * Only five screenshots already published in this same PUBLIC repository.
 * No private image input, credentials or live management-system connection.
 */
const files=[
 "01-contractor-usb-gpo-link.png",
 "02-usb-deny-all-removable-storage-enabled.png",
 "03-contractor-user-gpresult.png",
 "04-workstation-baseline-gpo-link.png",
 "05-firewall-gpo-configuration.png"
];
const from=resolve("../docs/Documentation/Change-Requests/evidence");
const to=resolve("public/evidence");
const pngSignature=Buffer.from([137,80,78,71,13,10,26,10]);
if(!existsSync(from))throw Error("Public documentation evidence directory not found");
mkdirSync(to,{recursive:true});
const items=[];
for(const file of files){
 if(basename(file)!==file)throw Error("Invalid screenshot filename");
 const source=join(from,file),target=join(to,file);
 if(!existsSync(source))throw Error("Reviewed public screenshot missing: "+file);
 const bytes=readFileSync(source);
 if(bytes.length>8_000_000)throw Error("Screenshot exceeds size allowance: "+file);
 if(!bytes.subarray(0,8).equals(pngSignature))throw Error("Not a valid PNG file signature: "+file);
 copyFileSync(source,target);
 items.push({
   name:file,
   source:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/evidence/"+file,
   sha256:createHash("sha256").update(bytes).digest("hex"),
   bytes:statSync(source).size,
   category:"Already public GPO engineering evidence"
 });
}
writeFileSync(join(to,"manifest.json"),JSON.stringify({
  provenance:"Identical copies of preexisting reviewed public evidence; not new lab screenshots.",
  images:items
},null,2)+"\n");
console.log("Staged "+items.length+" unchanged original public screenshots; SHA-256 provenance manifest generated.");
