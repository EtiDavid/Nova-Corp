/**
 * Source of truth for EVERY plain-English glossary page.
 * Paths are existing public Markdown files in docs/ and source-backed
 * original change-request journals. Do not replace these with model knowledge.
 */
export type TermEvidence={term:string;primary:string;supporting:string[];journal?:string;notes?:string;};
export const termEvidence: Record<string,TermEvidence>={
 "active-directory":{term:"Active Directory",primary:"explore/services/ACTIVE_DIRECTORY.md",supporting:["explore/IDENTITY.md","explore/DIRECTORY.md","explore/DIRECTORY_SNAPSHOT_2026-11-22.md"],journal:"Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"},
 "domain-controller":{term:"Domain Controller",primary:"explore/services/ACTIVE_DIRECTORY.md",supporting:["explore/systems/NOVA-DC01.md","explore/systems/NOVA-DC02.md"],journal:"Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"},
 "dns":{term:"DNS",primary:"explore/services/DNS.md",supporting:["explore/network/DHCP.md","explore/NETWORK.md"],journal:"Documentation/Change-Requests/Journal-CR-003.md"},
 "ldap":{term:"LDAP",primary:"explore/services/LDAP.md",supporting:["explore/services/ACTIVE_DIRECTORY.md"],journal:"Documentation/Change-Requests/Journal-CR-007.md"},
 "kerberos":{term:"Kerberos",primary:"explore/services/KERBEROS.md",supporting:["explore/services/ACTIVE_DIRECTORY.md"],journal:"Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"},
 "sysvol":{term:"SYSVOL",primary:"explore/services/SYSVOL_NETLOGON.md",supporting:["explore/systems/NOVA-DC01.md","explore/systems/NOVA-DC02.md"],journal:"Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"},
 "group-policy":{term:"Group Policy",primary:"explore/POLICIES.md",supporting:["explore/policies/WORKSTATION_BASELINE.md","explore/policies/CONTRACTOR_USB.md"],journal:"Documentation/Change-Requests/Journal-CR-006.md"},
 "smb":{term:"SMB",primary:"explore/services/SMB.md",supporting:["explore/files/SHARES.md","explore/files/PERMISSIONS.md"],journal:"Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md"},
 "ntfs":{term:"NTFS permissions",primary:"explore/files/PERMISSIONS.md",supporting:["explore/files/TECHNICAL_ACL_DETAILS.md","explore/files/SHARES.md"],journal:"Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md"},
 "dfs":{term:"DFS",primary:"explore/services/DFS.md",supporting:["explore/files/DFS_PATHS.md","explore/FILE_SERVICES.md"]},
 "vlan":{term:"VLAN",primary:"explore/NETWORK.md",supporting:["explore/network/zones/INFRA.md","explore/network/zones/CLIENT.md","explore/network/RULES.md"],journal:"Documentation/Change-Requests/Journal-CR-002.md"},
 "firewall":{term:"Firewall",primary:"explore/services/FIREWALL.md",supporting:["explore/systems/NOVA-FW01.md","explore/network/RULES.md"],journal:"Documentation/Change-Requests/Journal-CR-007.md"},
 "proxmox":{term:"Proxmox",primary:"explore/virtualization/README.md",supporting:["explore/systems/NOVA-PROX01.md","explore/virtualization/BACKUPS.md"],journal:"Documentation/Change-Requests/Journal-CR-001.md"},
 "wireguard":{term:"WireGuard",primary:"explore/services/WIREGUARD.md",supporting:["explore/incidents/wireguard-handshake.md","explore/network/zones/VPN_REMOTE.md"],journal:"Documentation/Change-Requests/Journal-CR-007.md"},
 "replication":{term:"AD replication",primary:"explore/IDENTITY.md",supporting:["explore/incidents/replication-divergence.md","explore/systems/NOVA-DC02.md"],journal:"Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"},
 "shadow-copy":{term:"Shadow Copy",primary:"explore/services/VSS.md",supporting:["explore/files/SHADOW_COPY_RECOVERY.md","explore/files/VSS.md"],journal:"Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md"},
 "system-state":{term:"System State backup",primary:"explore/services/BACKUPS.md",supporting:["explore/files/SHADOW_COPY_RECOVERY.md","explore/systems/NOVA-DC01.md"],journal:"Documentation/Change-Requests/CR-012_Windows_Server_Backup_and_Recovery_Journal.md"},
 "tcp":{term:"TCP",primary:"explore/NETWORK.md",supporting:["explore/network/RULES.md","explore/services/SMB.md"],journal:"Documentation/Change-Requests/Journal-CR-007.md"}
};
export const termEvidenceEntries=Object.entries(termEvidence);
export const publicDocsRoot="https://github.com/EtiDavid/Nova-Corp/blob/main/docs/";
export const internalArticle=(path:string,base="/")=>base+"reference/"+path.replace(/\.md$/,"").split("/").map(encodeURIComponent).join("/")+"/";
