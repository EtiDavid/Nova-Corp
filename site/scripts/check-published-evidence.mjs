import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join, relative } from "node:path";
/**
 * Assets in the built site must be unchanged copies of images already in
 * public docs/Documentation/Change-Requests/evidence. A private screenshot
 * cannot pass by simply being placed in site/public.
 */
const dist=resolve("dist"),source=resolve("../docs/Documentation/Change-Requests/evidence");
if(!existsSync(dist)||!existsSync(source))throw Error("Run after static build within full public checkout");
const manifestFile=join(dist,"evidence/manifest.json");
if(!existsSync(manifestFile))throw Error("Provenance manifest missing from built site");
const manifest=JSON.parse(readFileSync(manifestFile,"utf8"));
const errors=[],found=new Set();
let pages=0;
function walk(dir){
 for(const item of readdirSync(dir,{withFileTypes:true})){
  const p=join(dir,item.name);
  if(item.isDirectory()){walk(p);continue;}
  if(!item.name.endsWith(".html"))continue;
  pages++;
  const html=readFileSync(p,"utf8");
  for(const hit of html.matchAll(/<img\b([^>]*)>/g)){
   const tag=hit[1];
   const src=tag.match(/\bsrc="([^"]+)"/)?.[1];
   const alt=tag.match(/\balt="([^"]*)"/)?.[1];
   if(!src)errors.push(relative(dist,p)+": image missing src");
   if(!alt)errors.push(relative(dist,p)+": image missing descriptive alt");
   // The source-faithful Markdown mirror can cite other already-public GitHub
   // images via raw.githubusercontent.com. These are NOT local, owner-reviewed
   // evidence assets, so do not call them missing locally or claim SHA parity.
   // Only /evidence/... hosted by this website is part of the five-image
   // independently hash-verified subset.
   const localSrc=src&&src.startsWith("/")&&!src.startsWith("//");
   const match=localSrc?src.match(/^\/evidence\/([A-Za-z0-9._-]+\.png)(?:[?#].*)?$/):null;
   if(!match)continue;
   const name=match[1];
   const original=join(source,name),published=join(dist,"evidence",name);
   if(!existsSync(original)||!existsSync(published)){
    errors.push("Unapproved or missing original/build copy: "+name);
    continue;
   }
   const srcBytes=readFileSync(original),pubBytes=readFileSync(published);
   const digest=createHash("sha256").update(srcBytes).digest("hex");
   const item=manifest.images.find(img=>img.name===name);
   if(!item||item.sha256!==digest||!srcBytes.equals(pubBytes))errors.push("Screenshot provenance mismatch: "+name);
   found.add(name);
  }
 }
}
walk(dist);
if(found.size!==5)errors.push("Expected 5 linked original public screenshots, found "+found.size);
if(manifest.images.length!==5)errors.push("Expected 5 audited manifest entries");
const imageManifestPath=join(dist,"docs-images/manifest.json");
if(!existsSync(imageManifestPath))errors.push("Missing original GitHub docs-image mirror manifest");
else {
 const originals=JSON.parse(readFileSync(imageManifestPath,"utf8"));
 if(originals.imagesCount!==14)errors.push("Expected the 14 existing public source images; got "+originals.imagesCount);
 for(const item of originals.images){
  const sourceImage=resolve("../"+item.source),siteImage=join(dist,item.href.replace(/^\//,""));
  if(!existsSync(sourceImage)||!existsSync(siteImage)){errors.push("Original image missing: "+item.source);continue;}
  const src=readFileSync(sourceImage),copy=readFileSync(siteImage);
  const sha=createHash("sha256").update(src).digest("hex");
  if(!src.equals(copy)||sha!==item.sha256)errors.push("Original public journal image differs from GitHub: "+item.source);
 }
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Screenshot proof PASS: 5 curated evidence PNGs + 14 original public docs images, exact source SHA-256 parity, alt text; "+pages+" HTML pages checked.");
