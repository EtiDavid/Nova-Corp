import { identities, groupSource } from "./directory";
export type AccessGroup = {
  slug:string;name:string;scope:"Global"|"Domain Local";kind:"Department membership"|"Resource permission";
  description:string; directMemberGroups:string[]; folder?:string; shareRight?:string; ntfsRight?:string;
};
export const accessGroups:AccessGroup[]=[
{slug:"it-users",name:"IT_Users",scope:"Global",kind:"Department membership",description:"Collects the three recorded IT identities.",directMemberGroups:[]},
{slug:"finance-users",name:"Finance_Users",scope:"Global",kind:"Department membership",description:"Collects the two enabled Finance identities.",directMemberGroups:[]},
{slug:"hr-users",name:"HR_Users",scope:"Global",kind:"Department membership",description:"Collects the two enabled HR identities.",directMemberGroups:[]},
{slug:"management-users",name:"Management_Users",scope:"Global",kind:"Department membership",description:"Collects the two recorded management identities.",directMemberGroups:[]},
{slug:"sales-users",name:"Sales_Users",scope:"Global",kind:"Department membership",description:"Collects the enabled Sales Test identity.",directMemberGroups:[]},
{slug:"dl-fs-it-modify",name:"DL_FS_IT_Modify",scope:"Domain Local",kind:"Resource permission",description:"Receives the IT group and is assigned the IT shared-folder permission.",directMemberGroups:["IT_Users"],folder:"it",shareRight:"Change",ntfsRight:"Modify"},
{slug:"dl-fs-finance-modify",name:"DL_FS_Finance_Modify",scope:"Domain Local",kind:"Resource permission",description:"Standard Finance access through its departmental group.",directMemberGroups:["Finance_Users"],folder:"finance",shareRight:"Change",ntfsRight:"Modify"},
{slug:"dl-fs-hr-modify",name:"DL_FS_HR_Modify",scope:"Domain Local",kind:"Resource permission",description:"Standard HR folder permission.",directMemberGroups:["HR_Users"],folder:"hr",shareRight:"Change",ntfsRight:"Modify"},
{slug:"dl-fs-management-modify",name:"DL_FS_Management_Modify",scope:"Domain Local",kind:"Resource permission",description:"Standard Management folder permission.",directMemberGroups:["Management_Users"],folder:"management",shareRight:"Change",ntfsRight:"Modify"},
{slug:"dl-fs-sales-modify",name:"DL_FS_Sales_Modify",scope:"Domain Local",kind:"Resource permission",description:"Standard Sales folder permission.",directMemberGroups:["Sales_Users"],folder:"sales",shareRight:"Change",ntfsRight:"Modify"},
{slug:"dl-fs-finance-fullcontrol",name:"DL_FS_Finance_FullControl",scope:"Domain Local",kind:"Resource permission",description:"Separate, broader Finance permission group used by management.",directMemberGroups:["Management_Users"],folder:"finance",shareRight:"Full",ntfsRight:"FullControl"}
];
export const findGroup=(slug:string)=>accessGroups.find(g=>g.slug===slug);
export const findGroupByName=(name:string)=>accessGroups.find(g=>g.name===name);
export const groupPeople=(name:string)=>identities.filter(i=>i.directGroups.includes(name));
export const groupForShare=(folder:string)=>accessGroups.filter(g=>g.folder===folder);
export const groupResources=(name:string)=>accessGroups.filter(g=>g.directMemberGroups.includes(name));
export const accessSources={groups:groupSource,membership:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/DIRECTORY_SNAPSHOT_2026-11-22.md",permissions:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/files/TECHNICAL_ACL_DETAILS.md"};
