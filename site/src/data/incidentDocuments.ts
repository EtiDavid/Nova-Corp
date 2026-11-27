/**
 * Canonical source reconciliation for the 16 published Nova Corp incidents.
 *
 * Paths here were checked against each docs/explore/incidents/*.md source and
 * its "read source journal" section. Never substitute a short explorer
 * summary for the actual CR/failure test journal.
 *
 * Where the only full execution journal is PDF, be explicit about that rather
 * than falsely label a synopsis as "full Markdown".
 */
export type IncidentDocument = {
  slug:string;
  source:string;
  journal:string;
  journalLabel:string;
  journalFormat:"markdown"|"pdf";
  additional?:string[];
};
const root="docs/";
const change="Documentation/Change-Requests/";
const incident="explore/incidents/";
const f14=change+"Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf";
const original:IncidentDocument[]=[
 {slug:"backup-target-unavailable",source:incident+"backup-target-disappears.md",journal:f14,journalFormat:"pdf",journalLabel:"CR-014 — full incident engineering journal and evidence (PDF)",additional:[change+"CR-012_Windows_Server_Backup_and_Recovery_Journal.md"]},
 {slug:"bulk-users-partial-rollback",source:incident+"bulk-users-partial-rollback.md",journal:change+"CR-011_PowerShell_Administration_Toolkit.md",journalFormat:"markdown",journalLabel:"CR-011 — original PowerShell administration and rollback journal"},
 {slug:"dc01-outage",source:incident+"domain-controller-outage.md",journal:f14,journalFormat:"pdf",journalLabel:"CR-014 — full incident engineering journal and evidence (PDF)",additional:[change+"CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md"]},
 {slug:"dc01-vlan-migration",source:incident+"dc01-vlan-migration.md",journal:change+"Journal-CR-003.md",journalFormat:"markdown",journalLabel:"CR-003 — original Active Directory and VLAN migration journal"},
 {slug:"dns-client-outage",source:incident+"dns-client-outage.md",journal:f14,journalFormat:"pdf",journalLabel:"CR-014 — full incident engineering journal and evidence (PDF)"},
 {slug:"file-permission-denial",source:incident+"file-permission-denial.md",journal:f14,journalFormat:"pdf",journalLabel:"CR-014 — full incident engineering journal and evidence (PDF)"},
 {slug:"firewall-management-exposure",source:incident+"pfsense-management-exposure.md",journal:change+"CR-015_Phase_2_Validation_and_Closure.md",journalFormat:"markdown",journalLabel:"CR-015 — Phase 2 validation and closure record"},
 {slug:"gpo-link-disabled",source:incident+"gpo-link-disabled.md",journal:f14,journalFormat:"pdf",journalLabel:"CR-014 — full incident engineering journal and evidence (PDF)"},
 {slug:"group-acl-name-mismatch",source:incident+"group-acl-name-mismatch.md",journal:change+"CR-011_PowerShell_Administration_Toolkit.md",journalFormat:"markdown",journalLabel:"CR-011 — original access-checker engineering journal"},
 {slug:"proxmox-default-gateway",source:incident+"proxmox-default-gateway.md",journal:"Documentation/failure-testing-report.md",journalFormat:"markdown",journalLabel:"FT-001 — original Proxmox failure-testing report"},
 {slug:"proxmox-storage-pressure",source:incident+"proxmox-snapshot-pressure.md",journal:change+"CR-015_Phase_2_Validation_and_Closure.md",journalFormat:"markdown",journalLabel:"CR-015 — original validation and closure record"},
 {slug:"proxmox-webgui-outage",source:incident+"proxmox-webgui-outage.md",journal:"Documentation/failure-testing-report.md",journalFormat:"markdown",journalLabel:"FT-003 / FT-005 — original Proxmox failure-testing report"},
 {slug:"replication-divergence",source:incident+"replication-divergence.md",journal:change+"CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md",journalFormat:"markdown",journalLabel:"CR-013 — full AD resilience and replication journal"},
 {slug:"two-faults-one-symptom",source:incident+"two-faults-one-symptom.md",journal:f14,journalFormat:"pdf",journalLabel:"CR-014 — full incident engineering journal and evidence (PDF)"},
 {slug:"vpn-validation-deferred",source:incident+"vpn-external-validation-deferred.md",journal:f14,journalFormat:"pdf",journalLabel:"CR-014 — full incident engineering journal and evidence (PDF)"},
 {slug:"wireguard-handshake",source:incident+"wireguard-handshake.md",journal:change+"Journal-CR-007.md",journalFormat:"markdown",journalLabel:"CR-007 — full WireGuard implementation, validation and handshake post-mortem"}
];
export const incidentDocuments:Record<string,IncidentDocument>=Object.fromEntries(original.map(d=>[d.slug,d]));
export const allIncidentDocuments=original;
export const originalRepo="https://github.com/EtiDavid/Nova-Corp/blob/main/docs/";
export function siteArticle(path:string,base="/"){
 return base+"reference/"+path.replace(/\.md$/i,"").split("/").map(encodeURIComponent).join("/")+"/";
}
export function originalSourceURL(path:string){
 return originalRepo+path.split("/").map(encodeURIComponent).join("/");
}
