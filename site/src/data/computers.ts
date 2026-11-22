import { directorySource } from "./directory";
export type ComputerObject={
 slug:string;name:string;ouSlug:string;systemSlug:string;
 purpose:string;roles:string[];
 linkedPolicySlug?:string;
};
export const computerObjects:ComputerObject[]=[
 {slug:"nova-dc01",name:"NOVA-DC01",ouSlug:"domain-controllers",systemSlug:"nova-dc01",
  purpose:"First writable Domain Controller for the fictional company.",roles:["Directory sign-in services","DNS and Kerberos","SYSVOL / Group Policy"] ,linkedPolicySlug:"domain-controllers"},
 {slug:"nova-dc02",name:"NOVA-DC02",ouSlug:"domain-controllers",systemSlug:"nova-dc02",
  purpose:"Additional writable Domain Controller supporting directory continuity and replication.",roles:["Directory replica","DNS and Kerberos","SYSVOL / failover testing"],linkedPolicySlug:"domain-controllers"},
 {slug:"nova-files01",name:"NOVA-FILES01",ouSlug:"servers",systemSlug:"nova-files01",
  purpose:"Member-server computer account for departmental file sharing, DFS and backups.",roles:["SMB and folder ACLs","Domain DFS namespace","Shadow Copies and Windows backup"]},
 {slug:"nova-client",name:"NOVA-CLIENT",ouSlug:"workstations",systemSlug:"nova-client",
  purpose:"Domain-joined employee test workstation used for identity and policy validation.",roles:["User sign-in","Client Group Policy processing","SMB/DFS access and network tests"],linkedPolicySlug:"workstation-baseline"}
];
export const getComputer=(slug:string)=>computerObjects.find(c=>c.slug===slug);
export const computersForOu=(slug:string)=>computerObjects.filter(c=>c.ouSlug===slug);
export const computerSource=directorySource;
