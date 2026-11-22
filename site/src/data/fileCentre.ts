/**
 * Reviewed publication slice: C01 source inspection (22 Nov 2026) and existing public
 * docs/explore/files/{SHARES,PERMISSIONS,DFS_PATHS,TECHNICAL_ACL_DETAILS}.md.
 * Explicitly NOT a recursive file ACL or user-token export.
 */
export type Share = {
  id: "it" | "finance" | "hr" | "management" | "sales";
  name: string;
  purpose: string;
  group: string;
  resourceGroup: string;
  dfs: string;
  smb: string;
  ntfs: string;
  evidence: string;
  exception?: { group: string; member: string; smb: string; ntfs: string; description: string };
};
const docs = "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/";
export const shares: Share[] = [
  {
    id:"it", name:"IT", purpose:"Technology and support files for the IT department.",
    group:"IT_Users",resourceGroup:"DL_FS_IT_Modify",
    dfs:"\\\\nova.corp\\shares\\IT",smb:"\\\\NOVA-FILES01\\IT",ntfs:"D:\\NovaData\\IT",
    evidence:docs+"it.md"
  },
  {
    id:"finance",name:"Finance",purpose:"Financial working documents with a separate management authorization path.",
    group:"Finance_Users",resourceGroup:"DL_FS_Finance_Modify",
    dfs:"\\\\nova.corp\\shares\\Finance",smb:"\\\\NOVA-FILES01\\Finance",ntfs:"D:\\NovaData\\Finance",
    evidence:docs+"finance.md",
    exception:{
      group:"DL_FS_Finance_FullControl",
      member:"Management_Users",
      smb:"Full",ntfs:"FullControl",
      description:"The Management department group is nested into an additional Finance resource group. It has broader access than the standard Finance Modify path."
    }
  },
  {
    id:"hr",name:"HR",purpose:"Human Resources working documents.",
    group:"HR_Users",resourceGroup:"DL_FS_HR_Modify",
    dfs:"\\\\nova.corp\\shares\\HR",smb:"\\\\NOVA-FILES01\\HR",ntfs:"D:\\NovaData\\HR",
    evidence:docs+"hr.md"
  },
  {
    id:"management",name:"Management",purpose:"Shared files for company management.",
    group:"Management_Users",resourceGroup:"DL_FS_Management_Modify",
    dfs:"\\\\nova.corp\\shares\\Management",smb:"\\\\NOVA-FILES01\\Management",ntfs:"D:\\NovaData\\Management",
    evidence:docs+"management.md"
  },
  {
    id:"sales",name:"Sales",purpose:"The Sales team's shared documents.",
    group:"Sales_Users",resourceGroup:"DL_FS_Sales_Modify",
    dfs:"\\\\nova.corp\\shares\\Sales",smb:"\\\\NOVA-FILES01\\Sales",ntfs:"D:\\NovaData\\Sales",
    evidence:docs+"sales.md"
  }
];
export const findShare = (id:string) => shares.find(x=>x.id===id);
export const fileEvidence = {
  matrix:docs+"PERMISSIONS.md",
  technical:docs+"TECHNICAL_ACL_DETAILS.md",
  dfs:docs+"DFS_PATHS.md",
  admin:docs+"ADMIN_SHARES.md",
  volumes:docs+"VOLUMES.md",
  incident:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/file-permission-denial.md",
  combinedIncident:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/two-faults-one-symptom.md",
  full:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf"
};
