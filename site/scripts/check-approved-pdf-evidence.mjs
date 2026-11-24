import{createHash}from"node:crypto";
import{existsSync,readFileSync,readdirSync}from"node:fs";
import{resolve,join}from"node:path";
const root=resolve(".."),dist=resolve("dist"),records=JSON.parse(readFileSync("src/data/approvedPdfEvidence.json","utf8")).entries;
const path=join(dist,"pdf-evidence/manifest.json");
if(!existsSync(path))throw Error("Missing approved original PDF screenshot provenance manifest");
const m=JSON.parse(readFileSync(path,"utf8"));
const errs=[],known=new Map(records.map(x=>[x.id,x]));
if(m.count!==12||records.length!==12||m.images.length!==12)errs.push("Wrong curated screenshot count");
const sha=x=>createHash("sha256").update(x).digest("hex");
for(const img of m.images){
 const approved=known.get(img.id);if(!approved){errs.push("Unreviewed image published "+img.id);continue;}
 const local=join(dist,img.image.replace(/^\//,""));
 if(!existsSync(local)){errs.push("Missing screenshot "+img.id);continue;}
 if(sha(readFileSync(local))!==img.originalImageSha256||img.originalImageSha256!==approved.sourceImageSha256)errs.push("Image not byte-identical to original PDF block: "+img.id);
 if(img.pdfSha256!==approved.pdfSha256||img.pdfPage!==approved.page||img.pdfBlock!==approved.block)errs.push("Image detached from correct original journal/page/block "+img.id);
 const htmlPage=join(dist,approved.subject,"index.html");
 if(!existsSync(htmlPage)){errs.push("No original target page "+approved.subject);continue;}
 const html=readFileSync(htmlPage,"utf8");
 if(!html.includes(img.image)||!html.includes(approved.title)||!html.includes(approved.pdf))errs.push("Original screenshot/caption/source not visible on "+approved.subject);
}
const originalManifest=JSON.parse(readFileSync(join(dist,"docs-images/manifest.json"),"utf8"));
if(originalManifest.imagesCount!==14)errs.push("Canonical public docs images not complete");
const important={
 "incidents/backup-target-unavailable":["backup-disk-offline","backup-file-recovery","backup-sha256-match"],
 "incidents/dc01-outage":["dc02-sysvol-available","dc01-recovery-gpupdate"],
 "incidents/dns-client-outage":["dns-timeout"],
 "incidents/gpo-link-disabled":["gpo-disabled-link"],
 "incidents/replication-divergence":["replication-rejected-8457","replication-restored"],
 "learn/active-directory":["dc02-sysvol-available","dc01-recovery-gpupdate"],
 "learn/shadow-copy":["vss-previous-versions"],
 "systems/nova-dc01":["dc02-sysvol-available"],
 "systems/nova-files01":["backup-sha256-match"]
};
for(const [route,ids]of Object.entries(important)){
 const html=readFileSync(join(dist,route,"index.html"),"utf8");
 for(const id of ids)if(!html.includes("/pdf-evidence/"+id+"."))errs.push("Original journal screenshot missing from "+route+" -> "+id);
}
if(errs.length){console.error(errs.join("\n"));process.exit(1);}
console.log("Original PDF screenshot evidence PASS: 12 exact byte-verified images, 3 original PDF hashes, pages and source-subject captions, local subject embeddings.");
