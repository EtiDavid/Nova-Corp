/**
 * Curated visitor-safe Group Policy catalog. Reviewed A02 report on NOVA-DC01
 * (22 Nov 2026) and the seven existing public docs/explore/policies/*.md.
 * A GPO link, inheritance eligibility, gpresult processing, and a physical
 * device / application result are DIFFERENT evidence classes.
 */
export type PolicySetting = { name:string; value:string; explanation?:string };
export type PolicySection = { heading:string; settings:PolicySetting[] };
export type PolicyLink = { label:string; path:string; ouSlug?:string; enabled:true; enforced:false };
export type PolicyObservation = {
  level:"Observed policy processing"|"Historical behavior test"|"Configuration only"|"No observed application";
  text:string;sourceUrl:string;
};
export type PolicyEvidenceImage = { filename:string; alt:string; caption:string; proves:string };
export type CompanyPolicy = {
  slug:string; name:string; technicalName:string; guid:string;
  summary:string; why:string; side:"User"|"Computer"|"Both (separate settings)";
  link?:PolicyLink; sections:PolicySection[];
  status:"Linked: configured"|"Empty: no link or settings";
  observations:PolicyObservation[];
  limitations:string[];
  sourceUrl:string;
  evidenceImages?:PolicyEvidenceImage[];
  relatedSystemSlugs?:string[];
};

const doc=(file:string)=>"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/policies/"+file+".md";
const journal="https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/";
const png=(filename:string):PolicyEvidenceImage=>({
  filename,alt:"Original Group Policy test screenshot: "+filename.replace(/[-_]/g," ").replace(/\.png$/,""),
  caption:filename==="03-contractor-user-gpresult.png"
    ?"Actual gpresult output from the contractor test session, showing processed user policies."
    :filename==="01-contractor-usb-gpo-link.png"
      ?"Original Group Policy link to the Contractors OU."
      :filename==="02-usb-deny-all-removable-storage-enabled.png"
        ?"Configured Deny all removable storage setting in Group Policy."
        :filename==="04-workstation-baseline-gpo-link.png"
          ?"Workstation security policy linked to the Workstations OU."
          :"Recorded Windows Defender Firewall settings in the workstation baseline policy.",
  proves:filename==="03-contractor-user-gpresult.png"?"Historical gpresult processing"
  :filename.includes("gpo-link")?"Configured GPO link":"Configured policy setting"
});
export const policyImageUrl=(filename:string)=>
  "https://raw.githubusercontent.com/EtiDavid/Nova-Corp/main/docs/Documentation/Change-Requests/evidence/"+filename;
export const policyImageSource=(filename:string)=>
  "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/evidence/"+filename;
const link=(label:string,path:string,ouSlug?:string):PolicyLink=>
  ({label,path,ouSlug,enabled:true,enforced:false});
const set=(name:string,value:string,explanation?:string):PolicySetting=>({name,value,explanation});
const paragraph=(level:PolicyObservation["level"],text:string,sourceUrl:string):PolicyObservation=>({level,text,sourceUrl});

export const companyPolicies:CompanyPolicy[]=[
 {
  slug:"domain-password",name:"Passwords and sign-in protection",technicalName:"Default Domain Policy",
  guid:"31b2f340-016d-11d2-945f-00c04fb984f9",
  summary:"The password, lockout and Kerberos ticket rules for everyone in nova.corp.",
  why:"Every account follows the same password rules, and repeated wrong passwords lock the account.",
  side:"Computer",link:link("Entire nova.corp domain","nova.corp"),status:"Linked: configured",
  sections:[
   {heading:"Password policy",settings:[
    set("Minimum password length","12 characters"),
    set("Complexity requirements","Enabled"),
    set("Maximum password age","180 days","The current report corrects the older 90-day value."),
    set("Minimum password age","1 day"),set("Remembered passwords","24"),
    set("Reversible password storage","Disabled"),
    set("NoLMHash","1","Prevents future LM password hash storage.")
   ]},
   {heading:"Account lockout",settings:[
    set("Lockout threshold","5 failed attempts"),
    set("Duration","15 minutes"),set("Counter reset","15 minutes"),
    set("Administrator account lockout","Enabled in the saved configuration")
   ]},
   {heading:"Kerberos tickets",settings:[
    set("User ticket lifetime","10 hours"),set("User ticket renewal window","7 days"),
    set("Service ticket lifetime","600 minutes"),set("Maximum clock skew","5 minutes"),
    set("Validate client","Enabled")
   ]}
  ],
  observations:[
   paragraph("Historical behavior test","I tested lockout and password resets in earlier account administration work. That shows the flow I tested, not the effective policy for every account.",journal+"CR-011_PowerShell_Administration_Toolkit.md")
  ],
  limitations:["The link covers the whole domain, but I did not check the effective result for each user.","A policy aimed at one account could override these rules. I did not look for one."],
  sourceUrl:doc("DOMAIN_PASSWORD"),relatedSystemSlugs:["nova-dc01","nova-dc02"]
 },
 {
  slug:"domain-controllers",name:"Domain Controller protections",technicalName:"Default Domain Controllers Policy",
  guid:"6ac1786c-016f-11d2-945f-00c04fb984f9",
  summary:"Security rights and signing settings for DC01 and DC02. It also holds keyboard preferences that do not belong there.",
  why:"The domain controllers handle every sign-in, so they get stricter settings than other servers.",
  side:"Both (separate settings)",link:link("Built-in Domain Controllers OU","nova.corp/Domain Controllers","domain-controllers"),
  status:"Linked: configured",
  sections:[
   {heading:"Important server security options",settings:[
    set("SMB server signing required","Enabled / RequireSecuritySignature = 1"),
    set("Secure-channel sign or seal","Enabled / RequireSignOrSeal = 1"),
    set("LDAP server signing requirement","None / LDAPServerIntegrity = 1","This saved setting does NOT establish that LDAP signing is enforced on DC01/DC02.")
   ]},
   {heading:"Reported Windows user rights",settings:[
    set("User-right assignments","24 configured entries","The exact principal assigned to each right is in the public source; do not infer all rights apply to all users.")
   ]},
   {heading:"Keyboard preferences found here instead of the empty Keyboard GPO",settings:[
    set("HKCU\\Keyboard Layout\\Preload\\1","Update to 00000409"),
    set("HKCU\\Keyboard Layout\\Preload\\2","Delete second preload entry")
   ]}
  ],
  observations:[
   paragraph("Configuration only","The saved report lists this policy's settings and its enabled OU link. I did not run a fresh LDAP signing check on both controllers.",doc("DEFAULT_DC"))
  ],
  limitations:["The saved LDAP signing option is a finding I noted. It is not an approved change, and I did not verify it is in effect.",
   "The keyboard preferences sit in a policy linked to the controllers, so they do not change employee workstations.",
   "The source lists 24 rights assignments to different accounts. I did not reproduce the full rights matrix here."],
  sourceUrl:doc("DEFAULT_DC"),relatedSystemSlugs:["nova-dc01","nova-dc02"]
 },
 {
  slug:"corporate-wallpaper",name:"Company desktop wallpaper",technicalName:"Nova Corp - Coperate wallpaper",
  guid:"cdfb1fe4-ecbb-4076-a754-62b9e1b4412b",
  summary:"Gives company user accounts the same desktop wallpaper.",
  why:"I set the wallpaper once instead of changing every workstation by hand.",
  side:"User",link:link("Nova Users OU (parent of departments)","nova.corp/Nova Users","nova-users"),status:"Linked: configured",
  sections:[
   {heading:"User configuration",settings:[
    set("Desktop Wallpaper","Enabled"),
    set("Wallpaper source","\\\\nova.corp\\SYSVOL\\nova.corp\\wallpapers\\NovaCorp-wallpaper.png"),
    set("Display style","Fill")
   ]}
  ],
  observations:[
   paragraph("Observed policy processing","John Shaw's recorded gpresult lists this wallpaper policy as applied.",doc("WALLPAPER")),
   paragraph("Configuration only","The saved settings name a wallpaper file. I did not re-test that the file loads on every desktop.",doc("WALLPAPER"))
  ],
  limitations:["The policy is really named \"Coperate\" (sic). I kept the original spelling in the technical detail.","gpresult shows the policy was processed. It does not show the image loaded for every employee."],
  evidenceImages:[png("03-contractor-user-gpresult.png")],sourceUrl:doc("WALLPAPER"),relatedSystemSlugs:["nova-client"]
 },
 {
  slug:"keyboard",name:"Keyboard layout (unused policy)",technicalName:"Nova Corp - Keyboard",
  guid:"ce22e625-e62c-4a7a-b65d-0c0d25f4dc37",
  summary:"A policy that exists but has no settings and no link.",
  why:"A policy in Group Policy Management is not proof that anything reached a device. This one reached nothing.",
  side:"Both (separate settings)",status:"Empty: no link or settings",
  sections:[{heading:"Actual current contents",settings:[
   set("User-side settings","None reported"),set("Computer-side settings","None reported"),
   set("OU/domain links","None"),
   set("Where keyboard preferences actually appear","Default Domain Controllers Policy")
  ]}],
  observations:[paragraph("No observed application","It has no links and no settings, so it never changed any device.",doc("KEYBOARD"))],
  limitations:["Do not read keyboard-language settings from this unused policy.","The keyboard preferences inside the domain controller policy are a separate case."],
  sourceUrl:doc("KEYBOARD")
 },
 {
  slug:"contractor-usb",name:"Contractor removable-storage restrictions",technicalName:"NOVA-sec-deny-usb-contractors",
  guid:"359aeed7-40b1-432b-aae8-983c980f93d6",
  summary:"A rule meant to stop contractor accounts from using USB and other removable storage.",
  why:"A contractor should not be able to copy company files onto a removable drive.",
  side:"User",link:link("Contractors OU","nova.corp/Nova Users/Contractors","contractors"),status:"Linked: configured",
  sections:[{heading:"User restrictions",settings:[
   set("All Removable Storage classes: Deny all access","Enabled"),
   set("Removable Disks: Deny write access","Enabled")
  ]}],
  observations:[
   paragraph("Observed policy processing","John Shaw's recorded gpresult lists this contractor restriction as applied.",doc("CONTRACTOR_USB")),
   paragraph("Configuration only","I could not test a real USB drive: nested virtualization does not pass USB devices through reliably.",doc("CONTRACTOR_USB"))
  ],
  evidenceImages:[png("01-contractor-usb-gpo-link.png"),png("02-usb-deny-all-removable-storage-enabled.png"),png("03-contractor-user-gpresult.png")],
  limitations:["gpresult shows the policy was processed. It does not show a USB drive was actually refused.","It targets only the Contractors OU, not every user."],
  sourceUrl:doc("CONTRACTOR_USB"),relatedSystemSlugs:["nova-client"]
 },
 {
  slug:"workstation-baseline",name:"Workstation security baseline",technicalName:"NOVA-SEC-Workstation-Baseline",
  guid:"3b481639-a09c-413c-8dc5-3501cd977a51",
  summary:"The security settings every employee workstation gets.",
  why:"Windows Firewall stays on, AutoPlay is turned off and the old SMBv1 protocol is disabled.",
  side:"Computer",link:link("Workstations OU","nova.corp/Nova-Computers/Workstations","workstations"),status:"Linked: configured",
  sections:[
   {heading:"Windows Firewall",settings:[
    set("Domain profile","Firewall enabled; default inbound block"),
    set("Private profile","Firewall enabled; default inbound block"),
    set("Public profile","Firewall enabled; default inbound block")
   ]},
   {heading:"Client hardening",settings:[
    set("Turn off AutoPlay","Enabled — all drives"),
    set("SMB1 (HKLM\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters\\SMB1)","DWORD 0")
   ]}
  ],
  observations:[
   paragraph("Historical behavior test","I checked a workstation earlier and recorded SMBv1 disabled, SMBv2 enabled and the Windows Firewall behaving as set. That check is separate from the saved link report.",journal+"Journal-CR-006.md")
  ],
  evidenceImages:[png("04-workstation-baseline-gpo-link.png"),png("05-firewall-gpo-configuration.png")],
  limitations:["The saved report shows Turn off AutoPlay. It does not show a separate AutoRun setting.","I once corrected an enforced link. Every current link is recorded as not enforced."],
  sourceUrl:doc("WORKSTATION_BASELINE"),relatedSystemSlugs:["nova-client"]
 },
 {
  slug:"drive-mapping",name:"Department drive mapping",technicalName:"NOVA-USER-Department-Drive-Mapping",
  guid:"90940df5-26d3-42b1-83e8-d73134e8eada",
  summary:"A logon script that connects each employee to their department's drive.",
  why:"Employees open a drive letter instead of typing a server path.",
  side:"User",link:link("Nova Users OU (parent of departments)","nova.corp/Nova Users","nova-users"),status:"Linked: configured",
  sections:[{heading:"User logon script",settings:[
   set("Program","powershell.exe"),
   set("Arguments",'-NoProfile -ExecutionPolicy Bypass -File "\\\\nova.corp\\NETLOGON\\Map-DepartmentDrive.ps1"'),
   set("Script type and order","Logon, order 0")
  ]}],
  observations:[
   paragraph("Configuration only","The saved report lists the logon-script command. It does not show that the script exists, is signed, or ran at the last sign-in.",doc("DRIVE_MAPPING")),
   paragraph("Historical behavior test","The file-sharing journal records my mapped-drive work. That is separate from re-checking this policy at a new sign-in.",journal+"NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf")
  ],
  limitations:["The command uses -ExecutionPolicy Bypass. That flag says nothing about whether the script is signed.","A mapped drive never skips the share and folder permissions."],
  sourceUrl:doc("DRIVE_MAPPING"),relatedSystemSlugs:["nova-files01","nova-client"]
 }
];

export const getPolicy=(slug:string)=>companyPolicies.find(p=>p.slug===slug);
export const linkedDirectlyToOu=(slug:string)=>companyPolicies.filter(p=>p.link?.ouSlug===slug);
export const policiesPotentialForOu=(slug:string,parent?:string)=>{
  // The direct GPO link and inherited parent scope are separate descriptions.
  return companyPolicies.filter(p=>p.link?.ouSlug===slug || (parent && p.link?.ouSlug===parent));
};
export const linksForSystem=(slug:string)=>companyPolicies.filter(p=>p.relatedSystemSlugs?.includes(slug));
export const policySourceIndex="https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/POLICIES.md";
