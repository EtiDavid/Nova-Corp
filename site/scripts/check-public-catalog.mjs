import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

/** These are the source-verified counts for the first published catalog slice.
 * Do not infer that all private engineering objects are already published.
 */
const dist=resolve("dist");
if(!existsSync(dist)) throw new Error("Run the static build before testing routes.");
const scopes=[
 {label:"16 Active Directory organizational units",path:"directory/ous",count:16},
 {label:"20 typed directory accounts",path:"people",count:20},
 {label:"11 company-created security groups",path:"groups",count:11},
 {label:"5 departmental shared-folder profiles",path:"files/shares",count:5},
 {label:"8 configured network areas including WAN/LAN/VPN",path:"network/zones",count:8},
 {label:"17 ordered pfSense rules",path:"network/rules",count:17},
 {label:"5 pfSense aliases",path:"network/aliases",count:5},
 {label:"7 recorded GPO objects",path:"policies",count:7},
 {label:"4 domain-joined computer objects",path:"computers",count:4}
];
const errors=[];
for (const scope of scopes){
 const dir=join(dist,scope.path);
 if(!existsSync(dir)) {errors.push("Missing scope: "+scope.path);continue;}
 const entries=readdirSync(dir,{withFileTypes:true}).filter(item=>item.isDirectory());
 const missing=entries.filter(item=>!existsSync(join(dir,item.name,"index.html"))).map(item=>item.name);
 if(entries.length!==scope.count) errors.push(scope.label+": expected "+scope.count+" pages, got "+entries.length);
 if(missing.length) errors.push(scope.path+": missing index.html for "+missing.join(", "));
 console.log(scope.label+": "+entries.length+" generated routes");
}
const required=[
"index.html","explore/index.html","directory/index.html","files/index.html",
"files/dfs/index.html","files/permissions/index.html","files/permissions/technical/index.html",
"people/moyo/index.html","people/maria-manager/index.html",
"groups/it-users/index.html","groups/dl-fs-it-modify/index.html",
"groups/management-users/index.html","groups/dl-fs-finance-fullcontrol/index.html",
"files/shares/it/index.html","files/shares/finance/index.html",
"network/index.html","network/rules/index.html","network/zones/client/index.html",
"network/rules/1795199640/index.html","network/rules/1782219813/index.html",
"network/aliases/index.html","network/aliases/nova-domain-controllers/index.html",
"incidents/index.html","incidents/dns-client-outage/index.html","incidents/firewall-management-exposure/index.html","404.html",
"policies/index.html","policies/contractor-usb/index.html","policies/keyboard/index.html",
"policies/drive-mapping/index.html","policies/workstation-baseline/index.html",
"directory/ous/contractors/index.html","people/john-shaw/index.html",
"computers/index.html","computers/nova-dc01/index.html",
"computers/nova-files01/index.html","computers/nova-client/index.html"
];
for(const page of required){
 if(!existsSync(join(dist,page)))errors.push("Missing critical user-journey page: "+page);
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Public catalog route coverage PASS; employee→file, CLIENT→firewall and OU→GPO paths are routable.");
