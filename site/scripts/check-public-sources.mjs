import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join, relative } from "node:path";

const dist=resolve("dist");
const repoDocs=resolve("../docs");
if(!existsSync(dist)||!existsSync(repoDocs))throw new Error("Run in site/ after build from full public repository checkout");
let html=[];
function walk(dir){
 for(const item of readdirSync(dir,{withFileTypes:true})){
  const full=join(dir,item.name);
  if(item.isDirectory())walk(full);
  else if(item.name.endsWith(".html"))html.push(full);
 }
}
walk(dist);
const failures=[],checked=new Set();
for(const file of html){
 const page=readFileSync(file,"utf8");
 for(const hit of page.matchAll(/href=["']https:\/\/github\.com\/EtiDavid\/Nova-Corp\/blob\/main\/docs\/([^"'?#]+)(?:[?#][^"']*)?["']/g)){
  const relativeDoc=decodeURIComponent(hit[1]).replace(/\/+/g,"/");
  if(relativeDoc.includes("..")){failures.push("Unsafe traversal: "+relativeDoc);continue;}
  checked.add(relativeDoc);
  const target=resolve(repoDocs,relativeDoc);
  if(!target.startsWith(repoDocs+"/")||!existsSync(target)){
   failures.push(relative(dist,file)+" → docs/"+relativeDoc+" does not exist in public Git tree checkout");
  }
 }
}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Public GitHub source-file target check PASS: "+checked.size+" unique documented source targets across "+html.length+" website pages.");
