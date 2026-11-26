import{createHash}from"node:crypto";
import{readFileSync,existsSync}from"node:fs";
import{join,resolve}from"node:path";
const repo=resolve(".."),dist=resolve("dist");
const m=JSON.parse(readFileSync(join(dist,"pdf-journals/manifest.json"),"utf8"));
const errors=[];
const sha=data=>createHash("sha256").update(data).digest("hex");
if(m.count!==14||m.journals.length!==14)errors.push("Original journal inventory not exactly 14");
if(m.totalOriginalPages!==543)errors.push("Original journal page total changed; source review required: "+m.totalOriginalPages);
if(m.totalOriginalImageBlocks!==272)errors.push("Original PDF image-block count changed: "+m.totalOriginalImageBlocks);
if(m.totalNativeCharacters!==819635)errors.push("Source-native text total changed: "+m.totalNativeCharacters);
for(const doc of m.journals){
 const original=resolve(repo,doc.sourcePath);
 const published=join(dist,doc.sitePdf.replace(/^\//,""));
 const page=join(dist,"journals",doc.slug,"index.html");
 if(!existsSync(original)||!existsSync(published)||!existsSync(page)){
  errors.push("Original/source/reader missing for "+doc.name);continue;
 }
 const raw=readFileSync(original),copy=readFileSync(published);
 if(!raw.equals(copy)||sha(raw)!==doc.sha256)errors.push("Original PDF binary or SHA mismatch: "+doc.name);
 const html=readFileSync(page,"utf8");
 if(!html.includes(doc.sha256)||!html.includes(doc.name)||!html.includes(doc.sourceUrl)){
  errors.push("Original PDF source provenance missing in reader: "+doc.name);
 }
 const pageCount=(html.match(/class="native-pdf-page"/g)||[]).length;
 if(pageCount!==doc.pages||doc.nativePages.length!==doc.pages)errors.push("Original text page count mismatch for "+doc.name+": "+pageCount+"/"+doc.pages);
 for(const p of doc.nativePages){
  if(!html.includes('id="page-'+p.page+'"'))errors.push("Original journal page not linked: "+doc.name+"#page="+p.page);
 }
 if(doc.nativeTextCharacters<1000)errors.push("Suspiciously little native text for "+doc.name);
 if(!html.includes("pdf-document-viewer")||!html.includes("pdf-native-source-text"))errors.push("Reader lacks full PDF viewer or native source transcription: "+doc.name);
}
const library=join(dist,"journals","index.html");
if(!existsSync(library))errors.push("No main original PDF journal library index");
else{
 const html=readFileSync(library,"utf8");
 for(const doc of m.journals)if(!html.includes("/journals/"+doc.slug+"/"))errors.push("Original journal absent from library index "+doc.name);
}
for(const [route,filename] of [
 ["incidents/backup-target-unavailable","Nova_Corp_CR-014_Engineering_Journal_and_Evidence"],
 ["incidents/dc01-outage","Nova_Corp_CR-014_Engineering_Journal_and_Evidence"],
 ["changes/CR-008","NovaCorp_CR-008_File_Server_Deployment_Journal"],
 ["sources","Nova_Corp_CR-014_Engineering_Journal_and_Evidence"]
]){
 const full=join(dist,route,"index.html");
 const html=existsSync(full)?readFileSync(full,"utf8"):"";
 if(!html.includes("/journals/"+filename+"/"))errors.push("Relevant site page doesn't link complete original PDF reader: "+route);
}
if(errors.length){console.error("Full original PDF parity FAILED\n"+errors.join("\n"));process.exit(1)}
console.log("Full original PDF parity PASS: "+m.count+" original journals, "+m.totalOriginalPages+" pages, "+m.totalNativeCharacters+" source-native chars, "+m.totalOriginalImageBlocks+" embedded image blocks; all 14 source PDF SHA and complete on-site reading copies exact.");
