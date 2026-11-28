/** Every displayed story has a source-backed site page and linked original public journal.
 * Classification is by how it occurred, not by whether the result was PASS.
 * 'Unplanned' includes discovered validation/implementation defects — not production outages.
 */
export type StoryKind="controlled"|"unplanned"|"deferred";
export type Story={slug:string;kind:StoryKind;topic:string;short:string};
export const labStories:Story[]=[
 {slug:"dc01-outage",kind:"controlled",topic:"Identity failover",short:"DC01 was deliberately shut down. Client discovery, Kerberos, SYSVOL and file access continued through DC02."},
 {slug:"dns-client-outage",kind:"controlled",topic:"DNS fault injection",short:"An intentionally wrong client resolver broke a share by name; connecting to the file server by IP still worked."},
 {slug:"file-permission-denial",kind:"controlled",topic:"NTFS permission failure",short:"An injected DENY on a child folder blocked a legitimate user despite correct IT group membership."},
 {slug:"backup-target-unavailable",kind:"controlled",topic:"Recovery exercise",short:"The backup disk was deliberately taken offline; after repair, a deleted test file was restored with matching SHA-256."},
 {slug:"gpo-link-disabled",kind:"controlled",topic:"Group Policy fault",short:"A disabled GPO link stopped wallpaper processing while other client policies remained healthy."},
 {slug:"replication-divergence",kind:"controlled",topic:"Directory replication",short:"DC02's inbound replication was deliberately disabled, creating stale data until replication recovered."},
 {slug:"two-faults-one-symptom",kind:"controlled",topic:"Layered diagnosis",short:"A deliberately wrong DNS record hid a second failure: a user's live IT group membership had been removed."},
 {slug:"proxmox-default-gateway",kind:"controlled",topic:"Routing fault injection",short:"An incorrect Proxmox default gateway stopped internet access while same-subnet management still worked."},
 {slug:"proxmox-webgui-outage",kind:"controlled",topic:"Management service fault",short:"The Proxmox web interface went down while the virtual machines stayed running; management service recovery was tested."},
 {slug:"dc01-vlan-migration",kind:"unplanned",topic:"Network migration issue",short:"After DC01's VLAN migration, the gateway could reach the DC but the DC could not reach its gateway."},
 {slug:"bulk-users-partial-rollback",kind:"unplanned",topic:"PowerShell onboarding defect",short:"An invalid onboarding password left five disabled partial AD accounts until the script gained reliable rollback."},
 {slug:"group-acl-name-mismatch",kind:"unplanned",topic:"Authorization script defect",short:"The access checker confused a bare group name with its domain-qualified ACL identity and incorrectly reported DENY."},
 {slug:"firewall-management-exposure",kind:"unplanned",topic:"Security finding",short:"A validation check exposed an employee-to-firewall management path; rule ordering was corrected and retested."},
 {slug:"proxmox-storage-pressure",kind:"unplanned",topic:"Storage capacity risk",short:"Twenty obsolete snapshots pushed Proxmox thin-pool use to 86.73%; cleanup reduced it to 52.88%."},
 {slug:"wireguard-handshake",kind:"unplanned",topic:"VPN configuration fault",short:"Packets reached the WAN listener but the peer did not authenticate until client and firewall keys were corrected."},
 {slug:"fileserver-subnet",kind:"unplanned",topic:"Subnet prefix mismatch",short:"Two domain controllers used /32 prefixes while the new file server used /24. Correcting the domain controller prefixes restored the intended same-subnet path."},
];
