/**
 * Directory information published from A01 (22 Nov 2026), corroborated by
 * docs/explore/DIRECTORY_SNAPSHOT_2026-11-22.md.
 * These records are fictional/lab AD identities, NOT verified employee status.
 */
export type Ou = {
  slug:string; name:string; parent?:string; meaning:string; source:string;
};
export const directorySource="https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/DIRECTORY_SNAPSHOT_2026-11-22.md";
const S=directorySource;
export const organizationalUnits:Ou[]=[
  {slug:"domain-controllers",name:"Domain Controllers",meaning:"Built-in OU for the two writable identity servers.",source:S},
  {slug:"administrative-accounts",name:"Nova Administrative Accounts",meaning:"A dedicated administrative organization area. Specific membership is not inferred from the OU name.",source:S},
  {slug:"disabled-objects",name:"Nova Disabled Objects",meaning:"Area containing disabled lab identities from account lifecycle exercises.",source:S},
  {slug:"resources",name:"Nova Resources",meaning:"Organizational area for company resources; no unverified objects are invented.",source:S},
  {slug:"security-groups",name:"Nova Security groups",meaning:"Organizational area for the company-created security groups.",source:S},
  {slug:"service-accounts",name:"Nova Service Accounts",meaning:"Container for three created service identities, not proof that every service uses them.",source:S},
  {slug:"nova-users",name:"Nova Users",meaning:"Parent OU for six employee, contractor and departmental test-account OUs.",source:S},
  {slug:"contractors",name:"Contractors",parent:"nova-users",meaning:"Contractor test-account OU; a removable-storage policy is linked here.",source:S},
  {slug:"finance",name:"Finance",parent:"nova-users",meaning:"Directory OU containing two enabled Finance lab identities.",source:S},
  {slug:"hr",name:"HR",parent:"nova-users",meaning:"Directory OU containing two enabled HR lab identities.",source:S},
  {slug:"it",name:"IT",parent:"nova-users",meaning:"Directory OU containing three enabled IT identities.",source:S},
  {slug:"management",name:"Management",parent:"nova-users",meaning:"Directory OU containing two enabled management identities.",source:S},
  {slug:"sales",name:"Sales",parent:"nova-users",meaning:"Directory OU containing the active Sales Test identity.",source:S},
  {slug:"nova-computers",name:"Nova-Computers",meaning:"Parent OU for member servers and workstations.",source:S},
  {slug:"servers",name:"Servers",parent:"nova-computers",meaning:"Member-server organizational area; Domain Controllers use their built-in OU.",source:S},
  {slug:"workstations",name:"Workstations",parent:"nova-computers",meaning:"Organizational area including the employee test workstation.",source:S}
];
export const findOu=(slug:string)=>organizationalUnits.find(o=>o.slug===slug);
export type IdentityCategory="lab-person"|"service"|"built-in"|"test";
export type DirectoryIdentity={
  slug:string;name:string;logon:string;ou?:string;location:string;enabled:boolean;category:IdentityCategory;
  directGroups:string[];
};
export const identities:DirectoryIdentity[]=[
{slug:"administrator",name:"Administrator",logon:"Administrator",location:"Built-in Users container (CN, not an OU)",enabled:true,category:"built-in",directGroups:[]},
{slug:"guest",name:"Guest",logon:"Guest",location:"Built-in Users container (CN, not an OU)",enabled:false,category:"built-in",directGroups:[]},
{slug:"krbtgt",name:"krbtgt",logon:"krbtgt",location:"Built-in Users container (CN, not an OU)",enabled:false,category:"built-in",directGroups:[]},
{slug:"test-user",name:"test user",logon:"test.user",location:"Built-in Users container (CN, not an OU)",enabled:true,category:"test",directGroups:[]},
{slug:"john-shaw",name:"John shaw",logon:"john.shaw",ou:"contractors",location:"Nova Users / Contractors",enabled:true,category:"lab-person",directGroups:[]},
{slug:"alice-finance",name:"Alice Finance",logon:"cr011.fin",ou:"finance",location:"Nova Users / Finance",enabled:true,category:"lab-person",directGroups:["Finance_Users"]},
{slug:"finance-test",name:"Finance Test",logon:"fin.test",ou:"finance",location:"Nova Users / Finance",enabled:true,category:"test",directGroups:["Finance_Users"]},
{slug:"henry-hr",name:"Henry HumanResources",logon:"cr011.hr",ou:"hr",location:"Nova Users / HR",enabled:true,category:"lab-person",directGroups:["HR_Users"]},
{slug:"hr-test",name:"HR Test",logon:"hr.test",ou:"hr",location:"Nova Users / HR",enabled:true,category:"test",directGroups:["HR_Users"]},
{slug:"isaac-it",name:"Isaac Technology",logon:"cr011.it",ou:"it",location:"Nova Users / IT",enabled:true,category:"lab-person",directGroups:["IT_Users"]},
{slug:"david-it",name:"David Eti",logon:"david.eti",ou:"it",location:"Nova Users / IT",enabled:true,category:"lab-person",directGroups:["IT_Users"]},
{slug:"moyo",name:"Moyo Agunbiade",logon:"moyo",ou:"it",location:"Nova Users / IT",enabled:true,category:"lab-person",directGroups:["IT_Users"]},
{slug:"maria-manager",name:"Maria Manager",logon:"cr011.mgmt",ou:"management",location:"Nova Users / Management",enabled:true,category:"lab-person",directGroups:["Management_Users"]},
{slug:"management-test",name:"Management Test",logon:"mgmt.test",ou:"management",location:"Nova Users / Management",enabled:true,category:"test",directGroups:["Management_Users"]},
{slug:"gui-pilot",name:"CR011 GUI pilot",logon:"cr011.gui",ou:"disabled-objects",location:"Nova Disabled Objects",enabled:false,category:"test",directGroups:[]},
{slug:"sarah-sales",name:"Sarah Sales",logon:"cr011.sales",ou:"disabled-objects",location:"Nova Disabled Objects",enabled:false,category:"lab-person",directGroups:[]},
{slug:"svc-backup",name:"svc_backup",logon:"svc_backup",ou:"service-accounts",location:"Nova Service Accounts",enabled:true,category:"service",directGroups:[]},
{slug:"svc-fileserver",name:"svc_fileserver",logon:"svc_fileserver",ou:"service-accounts",location:"Nova Service Accounts",enabled:true,category:"service",directGroups:[]},
{slug:"svc-monitoring",name:"svc_monitoring",logon:"svc_monitoring",ou:"service-accounts",location:"Nova Service Accounts",enabled:true,category:"service",directGroups:[]},
{slug:"sales-test",name:"Sales Test",logon:"sales.test",ou:"sales",location:"Nova Users / Sales",enabled:true,category:"test",directGroups:["Sales_Users"]}
];
export const findIdentity=(slug:string)=>identities.find(i=>i.slug===slug);
export const groupSource="https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/GROUPS.md";
