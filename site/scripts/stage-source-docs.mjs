import {createHash} from "node:crypto";
import {existsSync,mkdirSync,readdirSync,readFileSync,rmSync,writeFileSync} from "node:fs";
import {dirname,extname,join,posix,relative,resolve,sep} from "node:path";

/**
 * Build-time mirror of the complete PUBLIC Markdown documentation below docs/.
 * Never an AI paraphrase: canonical repo docs remain the single source of truth.
 * Only link destinations and collection metadata are added to generated copies.
 * It is deliberately rebuilt before typecheck/build; no stale private docs.
 */
const root=resolve("..");
const docs=resolve(root,"docs");
const output=resolve("src/content/reference");
const publicManifest=resolve("public/references/manifest.json");
const origin="https://github.com/EtiDavid/Nova-Corp/blob/main/";
const rawOrigin="https://raw.githubusercontent.com/EtiDavid/Nova-Corp/main/";
if(!existsSync(docs))throw Error("Public docs/ source checkout missing; cannot stage reference library.");

function walk(dir){
 const found=[];
 for(const ent of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  const file=join(dir,ent.name);
  if(ent.isDirectory())found.push(...walk(file));
  else if(ent.isFile()&&ent.name.toLowerCase().endsWith(".md"))found.push(file);
 }
 return found;
}
const files=walk(docs);
const all=new Set(files.map(f=>relative(docs,f).split(sep).join("/")));
if(files.length<140)throw Error("Unexpectedly small public Markdown inventory ("+files.length+"); refuse partial mirror.");
rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});
const manifest=[];
const unresolved=new Set();

const isExternal=s=>/^(https?:|mailto:|tel:|data:|\/\/|#)/i.test(s);
function mapped(link,current){
 if(isExternal(link))return link;
 const m=link.match(/^([^?#]*)([?#].*)?$/);
 if(!m)return link;
 let requested=m[1],suffix=m[2]||"";
 if(!requested)return link;
 // Preserve the author's Markdown anchors, but route the document internally.
 let target=posix.normalize(posix.join(posix.dirname(current),requested));
 if(target.startsWith("../")||target==="..")return origin+posix.normalize("docs/"+target)+suffix;
 if(!extname(target)){
  if(all.has(target+".md"))target+=".md";
  else if(all.has(posix.join(target,"README.md")))target=posix.join(target,"README.md");
 }
 if(all.has(target))return "/reference/"+target.slice(0,-3).split("/").map(encodeURIComponent).join("/")+"/"+suffix;
 const repoTarget="docs/"+target;
 const knownAsset=existsSync(resolve(docs,target));
 if(!knownAsset)unresolved.add(current+" -> "+link);
 if(/\.(png|jpe?g|gif|svg|webp)$/i.test(target))return rawOrigin+repoTarget.split("/").map(encodeURIComponent).join("/")+suffix;
 return origin+repoTarget.split("/").map(encodeURIComponent).join("/")+suffix;
}
function rewriteLinks(text,current){
 // Do not transform code fences, inline code, or raw content links. A limited
 // Markdown link rewrite handles ordinary [label](relative.md) and images.
 const blocks=text.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g);
 return blocks.map(part=>{
  if(/^(```|~~~)/.test(part))return part;
  return part.replace(/(!?\[[^\]\n]*\])\((<?[^)\s>]+>?)(\s+["'][^)]*["'])?\)/g,(whole,label,href,opt="")=>{
   const wrapped=href.startsWith("<")&&href.endsWith(">");
   const address=wrapped?href.slice(1,-1):href;
   const result=mapped(address,current);
   return label+"("+(wrapped?"<"+result+">":result)+opt+")";
  });
 }).join("");
}
function extractFrontmatter(raw){
 const m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
 return m?{body:raw.slice(m[0].length),metadata:m[1]}:{body:raw,metadata:""};
}
function titleFrom(text,file){
 const heading=text.match(/^#\s+(.+)$/m);
 return (heading?.[1]||posix.basename(file,".md").replaceAll("_"," ")).replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").slice(0,180);
}
for(const abs of files){
 const path=relative(docs,abs).split(sep).join("/");
 const source=readFileSync(abs,"utf8");
 const id=path.slice(0,-3);
 const parts=extractFrontmatter(source);
 const title=titleFrom(parts.body,path);
 const transformed=rewriteLinks(parts.body,path);
 const metadata=parts.metadata
  ? "\n\n<details class=\"source-frontmatter\"><summary>Original document metadata</summary>\n\n```yaml\n"+parts.metadata+"\n```\n\n</details>\n"
  : "";
 const frontmatter="---\n"+[
  "title: "+JSON.stringify(title),
  "sourcePath: "+JSON.stringify("docs/"+path),
  "sourceUrl: "+JSON.stringify(origin+"docs/"+path.split("/").map(encodeURIComponent).join("/")),
  "section: "+JSON.stringify(path.split("/")[0])
 ].join("\n")+"\n---\n\n";
 const result=frontmatter+transformed+metadata;
 const location=join(output,path);mkdirSync(dirname(location),{recursive:true});writeFileSync(location,result);
 manifest.push({id,source:"docs/"+path,sha256:createHash("sha256").update(source).digest("hex"),title,bytes:Buffer.byteLength(source)});
}
mkdirSync(dirname(publicManifest),{recursive:true});
writeFileSync(publicManifest,JSON.stringify({
 purpose:"All public repo Markdown explanations rendered in Nova Corp, with canonical docs/ always authoritative.",
 provenance:"SHA-256 of unchanged original public source docs in GitHub main checkout",
 docsCount:manifest.length,documents:manifest,unresolvedSourceLinks:[...unresolved].sort()
},null,2)+"\n");
console.log("Staged "+manifest.length+" public Markdown documents with original SHA-256 fingerprints; unresolved source links: "+unresolved.size);
