import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join, relative } from "node:path";

/**
 * We may embed only screenshots already present in the APPROVED PUBLIC
 * docs/Documentation/Change-Requests/evidence directory on this checkout.
 * Never import original private lab screenshots as unreviewed assets.
 */
const dist=resolve("dist");
const source=resolve("../docs/Documentation/Change-Requests/evidence");
if(!existsSync(dist)||!existsSync(source))throw Error("Run from site/ after static build in complete public checkout.");
const errors=[],seen=new Set();
let pages=0;
function visit(dir){
 for(const item of readdirSync(dir,{withFileTypes:true})){
  const file=join(dir,item.name);
  if(item.isDirectory()){visit(file);continue;}
  if(!item.name.endsWith(".html"))continue;
  pages++;
  const html=readFileSync(file,"utf8");
  const pat=/<img\b([^>]*)>/g;
  for(const [,tag] of html.matchAll(pat)){
    const src=tag.match(/\bsrc="([^"]+)"/)?.[1];
    const alt=tag.match(/\balt="([^"]*)"/)?.[1];
    if(!src)errors.push(relative(dist,file)+": image missing src");
    if(!alt)errors.push(relative(dist,file)+": image missing descriptive alt");
    const prefix="https://raw.githubusercontent.com/EtiDavid/Nova-Corp/main/docs/Documentation/Change-Requests/evidence/";
    if(src?.startsWith(prefix)){
      const name=decodeURIComponent(src.slice(prefix.length));
      if(!/^[A-Za-z0-9._-]+\.png$/.test(name)){
        errors.push("Unexpected screenshot path: "+name);
        continue;
      }
      if(!existsSync(join(source,name)))errors.push("Missing published evidence image: "+name);
      seen.add(name);
    }
  }
 }
}
visit(dist);
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Published screenshots: "+seen.size+" unique public source files located, img alt attributes present; "+pages+" HTML pages inspected.");
