import{copyFileSync,existsSync,mkdirSync,readFileSync,rmSync,writeFileSync}from"node:fs";
import{join,resolve}from"node:path";
import{createHash}from"node:crypto";
/** These are existing PUBLIC explanatory diagrams in Journal-CR-007.
 * Copy byte-for-byte from checked-out canonical repository, not fabricated
 * screenshot evidence and not network-dependent GitHub hotlinks.
 */
const repo=resolve("..");
const source=join(repo,"docs/Documentation/Change-Requests/cr007_assets");
const dest=resolve("public/journal-figures/cr007");
const figures=["01_network_layers.png","02_packet_journey.png","03_two_stage_firewall.png","04_rule_order.png","05_troubleshooting_funnel.png","06_cidr_host_network.png"];
if(!existsSync(source))throw Error("Original CR-007 figure source directory is absent");
rmSync(dest,{recursive:true,force:true});mkdirSync(dest,{recursive:true});
const manifest=[];
for(const name of figures){
 const from=join(source,name),to=join(dest,name);
 if(!existsSync(from))throw Error("Missing original public CR-007 source figure "+name);
 const bytes=readFileSync(from);
 if(bytes.readUInt32BE(0)!==0x89504e47)throw Error("Source figure is not a real PNG "+name);
 copyFileSync(from,to);
 const sha=createHash("sha256").update(bytes).digest("hex");
 if(createHash("sha256").update(readFileSync(to)).digest("hex")!==sha)throw Error("Journal figure copy mismatched "+name);
 manifest.push({file:name,source:"docs/Documentation/Change-Requests/cr007_assets/"+name,sha256:sha,bytes:bytes.length,kind:"historical explanatory diagram; not screenshot of pfSense UI"});
}
writeFileSync(join(dest,"manifest.json"),JSON.stringify({purpose:"Byte-identical, already public CR-007 journal explanatory figures",count:figures.length,figures:manifest},null,2)+"\n");
console.log("Staged "+figures.length+" original published CR-007 diagrams with matching SHA-256.");
