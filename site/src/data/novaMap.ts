// Nova Line Map data (Phase 2 prototype). Systems, lines and segments are the single source for every map on the site.
// Coordinates are map-grid pixels on a 920 x 600 canvas; Phase 3 turns this into content collections with Zod schemas.
export type LineId = "platform" | "network" | "identity" | "files" | "recovery";
export type Station = {
  id: string; slug: string; name: string; role: string; zone: string; ip?: string;
  x: number; y: number; w: number; h: number; sub: string;
  lines: LineId[]; incidents: string[]; builtBy: string[]; limit: string;
};
export type Segment = { id: string; line: LineId; from: string; to: string; d: string; meaning: string };

export const lines: Record<LineId, { name: string; question: string; token: string }> = {
  platform: { name: "Platform", question: "What runs everything?", token: "--line-platform" },
  network: { name: "Network", question: "How do the networks connect?", token: "--line-network" },
  identity: { name: "Identity", question: "Who is signing in, and where do names resolve?", token: "--line-identity" },
  files: { name: "Files", question: "How does a person reach a folder?", token: "--line-files" },
  recovery: { name: "Recovery", question: "What can be restored?", token: "--line-recovery" }
};

export const stations: Station[] = [
  { id: "nova-client", slug: "nova-client", name: "NOVA-CLIENT", role: "Employee workstation", zone: "CLIENT, VLAN 40", ip: "10.10.40.100", x: 100, y: 280, w: 130, h: 44, sub: "Workstation",
    lines: ["network", "identity", "files"], incidents: ["dns-client-outage", "firewall-management-exposure"], builtBy: ["CR-006", "CR-009"],
    limit: "Its Proxmox VM is labeled nova-client01; Windows and Active Directory know it as NOVA-CLIENT." },
  { id: "nova-fw01", slug: "nova-fw01", name: "NOVA-FW01", role: "pfSense firewall", zone: "Between all five VLANs", x: 330, y: 280, w: 130, h: 44, sub: "Firewall",
    lines: ["network"], incidents: ["firewall-management-exposure"], builtBy: ["CR-002", "CR-015"],
    limit: "Broad pass rules remain on MGMT, INFRA, APP and DMZ. Tighter control is the next planned change, CR-016." },
  { id: "nova-dc01", slug: "nova-dc01", name: "NOVA-DC01", role: "Domain controller (AD, DNS, Kerberos, LDAP)", zone: "INFRA, VLAN 20", ip: "10.10.20.10", x: 620, y: 140, w: 130, h: 44, sub: "Domain controller",
    lines: ["network", "identity", "recovery"], incidents: ["dc01-outage", "dns-client-outage"], builtBy: ["CR-003", "CR-004", "CR-013"],
    limit: "A complete System State restore has not been demonstrated." },
  { id: "nova-dc02", slug: "nova-dc02", name: "NOVA-DC02", role: "Second domain controller", zone: "INFRA, VLAN 20", ip: "10.10.20.11", x: 620, y: 280, w: 130, h: 44, sub: "Domain controller",
    lines: ["network", "identity"], incidents: ["dc01-outage", "replication-divergence"], builtBy: ["CR-004", "CR-013"],
    limit: "Taking over sign-ins during an outage is not the same as restoring a server." },
  { id: "nova-files01", slug: "nova-files01", name: "NOVA-FILES01", role: "File server (SMB, NTFS, DFS, Shadow Copies)", zone: "INFRA, VLAN 20", ip: "10.10.20.20", x: 620, y: 420, w: 130, h: 44, sub: "File server",
    lines: ["network", "files", "recovery"], incidents: ["fileserver-subnet", "backup-target-unavailable", "file-permission-denial"], builtBy: ["CR-008", "CR-009", "CR-010", "CR-012"],
    limit: "Its Windows backups sit on the same nested lab host, so this is not off-site disaster recovery." },
  { id: "nova-prox01", slug: "nova-prox01", name: "NOVA-PROX01", role: "Proxmox VE, nested in VMware Workstation on one Windows 11 host", zone: "Hosts all five virtual machines", x: 380, y: 545, w: 170, h: 44, sub: "Hosts all five virtual machines",
    lines: ["platform", "recovery"], incidents: ["proxmox-storage-pressure"], builtBy: ["CR-001", "CR-015"],
    limit: "Archives exist for some VMs, but a whole-VM restore has not been demonstrated." }
];

export const segments: Segment[] = [
  { id: "platform:base", line: "platform", from: "nova-prox01", to: "nova-prox01", d: "M40,545 H880", meaning: "Proxmox hosts every virtual machine above it" },
  { id: "network:client-fw", line: "network", from: "nova-client", to: "nova-fw01", d: "M165,288 H265", meaning: "Workstation traffic reaches the firewall" },
  { id: "network:fw-bus", line: "network", from: "nova-fw01", to: "nova-dc02", d: "M395,288 H480", meaning: "Firewall to the INFRA servers" },
  { id: "network:bus-dc01", line: "network", from: "nova-fw01", to: "nova-dc01", d: "M480,288 V148 H555", meaning: "Firewall to DC01" },
  { id: "network:bus-dc02", line: "network", from: "nova-fw01", to: "nova-dc02", d: "M480,288 H555", meaning: "Firewall to DC02" },
  { id: "network:bus-files", line: "network", from: "nova-fw01", to: "nova-files01", d: "M480,288 V428 H555", meaning: "Firewall to FILES01" },
  { id: "identity:client-dc01", line: "identity", from: "nova-client", to: "nova-dc01", d: "M90,258 V122 H555", meaning: "DNS lookups and Kerberos tickets from the domain controllers" },
  { id: "identity:dc01-dc02", line: "identity", from: "nova-dc01", to: "nova-dc02", d: "M640,162 V258", meaning: "DC01 and DC02 replicate Active Directory" },
  { id: "files:client-files01", line: "files", from: "nova-client", to: "nova-files01", d: "M90,302 V436 H555", meaning: "The workstation opens shared folders on FILES01 (SMB), a separate path from sign-in" },
  { id: "recovery:files01-prox01", line: "recovery", from: "nova-files01", to: "nova-prox01", d: "M600,442 V530 H465", meaning: "FILES01 backups and Shadow Copies" },
  { id: "recovery:dc01-prox01", line: "recovery", from: "nova-dc01", to: "nova-prox01", d: "M685,130 H820 V560 H465", meaning: "DC01 System State backup and Proxmox archives" }
];

export const zones = [
  { id: "client", name: "VLAN 40", x: 20, y: 215, w: 200, h: 150, kind: "vlan", end: true },
  { id: "infra", name: "INFRA · VLAN 20", x: 540, y: 66, w: 330, h: 414, kind: "vlan", end: false }
] as const;

export type Marker = { slug: string; n: string; x: number; y: number; title: string; type: "real" | "controlled" | "blind"; home?: boolean };
export const markers: Marker[] = [
  { slug: "dns-client-outage", n: "1", x: 330, y: 122, title: "The file server looked down. It was DNS.", type: "blind", home: true },
  { slug: "dc01-outage", n: "2", x: 708, y: 108, title: "DC01 went offline. Sign-ins kept working through DC02.", type: "controlled", home: true },
  { slug: "backup-target-unavailable", n: "3", x: 600, y: 488, title: "The backup disk disappeared. The file came back.", type: "blind", home: true },
  { slug: "fileserver-subnet", n: "4", x: 500, y: 436, title: "Same network, two subnet masks", type: "real" },
  { slug: "firewall-management-exposure", n: "5", x: 330, y: 244, title: "An employee PC could reach firewall admin", type: "real" },
  { slug: "replication-divergence", n: "6", x: 640, y: 210, title: "Two online domain controllers disagreed about a new object", type: "controlled" },
  { slug: "proxmox-storage-pressure", n: "7", x: 300, y: 500, title: "Old snapshots filled the storage", type: "real" }
];

// The one animated journey on the home page: Moyo opens the IT folder.
export const journey = {
  title: "Moyo opens the IT folder",
  steps: [
    { at: "nova-client", segment: null, text: "Moyo opens \\\\nova.corp\\shares\\IT from NOVA-CLIENT." },
    { at: "nova-dc01", segment: "identity:client-dc01", text: "DNS finds the file server and Kerberos issues a ticket, both from the domain controllers." },
    { at: "nova-files01", segment: "files:client-files01", text: "FILES01 checks the SMB share and NTFS permissions for IT_Users. Access allowed. Finance's folder was denied in the test." }
  ]
};

export const stationById = (id: string) => stations.find(s => s.id === id)!;
export const zoneVlans = ["MGMT 10", "INFRA 20", "APP 30", "CLIENT 40", "DMZ 50"];

export const incidentTitles: Record<string, string> = {
  "dns-client-outage": "The file server looked down. It was DNS.",
  "dc01-outage": "DC01 went offline. Sign-ins kept working through DC02.",
  "backup-target-unavailable": "The backup disk disappeared. The file came back.",
  "fileserver-subnet": "Same network, two subnet masks",
  "firewall-management-exposure": "An employee PC could reach firewall admin",
  "replication-divergence": "Two online domain controllers disagreed about a new object",
  "proxmox-storage-pressure": "Old snapshots filled the storage",
  "file-permission-denial": "The folder was visible, but access was denied"
};
