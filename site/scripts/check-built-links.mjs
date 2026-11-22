import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve, relative, join, dirname } from "node:path";

const dir=resolve("dist");
if (!existsSync(dir)) throw new Error("Run the Astro build before checking links");
const pages=[];
function walk(path) {
  for(const item of readdirSync(path,{withFileTypes:true})) {
    const full=join(path,item.name);
    if(item.isDirectory())walk(full);
    else if(item.name.endsWith(".html"))pages.push(full);
  }
}
walk(dir);
const errors=[];
for(const page of pages){
  const text=readFileSync(page,"utf8");
  for(const m of text.matchAll(/\bhref=["']([^"']+)["']/g)){
    const href=m[1];
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(href)) continue;
    const source="/"+relative(dir,page).replaceAll("\\","/");
    const resolved=new URL(href,"https://novacorp.example/"+source);
    let target=resolved.pathname;
    // For site subpath builds, remove PUBLIC_BASE_PATH first.
    const base=(process.env.PUBLIC_BASE_PATH||"/").replace(/\/+$/,"")+"/";
    if (base!=="/" && target.startsWith(base))target="/"+target.slice(base.length);
    if(target.endsWith("/"))target+="index.html";
    const dest=join(dir,target.replace(/^\//,""));
    if (!existsSync(dest))errors.push(source+" => "+href+" (missing "+target+")");
  }
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Built HTML local-link check passed: "+pages.length+" HTML pages.");
