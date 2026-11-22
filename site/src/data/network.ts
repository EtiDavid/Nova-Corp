/** Public-safe B01 source-derived model. 22 Nov 2026 inventory, verified against
 * docs/explore/NETWORK.md, network/RULES.md and 17 individual rule pages.
 * These are saved configuration records, not live firewall logs or blanket test PASS.
 */
export type Zone={
 slug:string;name:string;kind:"VLAN"|"Legacy network"|"WAN"|"WireGuard tunnel";
 address:string;gateway:string;purpose:string;devices:string[];
};
export const zones:Zone[]=[
 {slug:"wan",name:"WAN",kind:"WAN",address:"Assigned by upstream DHCP",gateway:"Upstream network",purpose:"Connects the lab firewall to the upstream router.",devices:["nova-fw01"]},
 {slug:"lan",name:"LAN",kind:"Legacy network",address:"10.99.99.0/24",gateway:"10.99.99.1",purpose:"The original internal LAN. Its broad saved allow rules are not a least-privilege design.",devices:["nova-fw01"]},
 {slug:"mgmt",name:"MGMT",kind:"VLAN",address:"10.10.10.0/24",gateway:"10.10.10.1",purpose:"Firewall management network segment; privileged management isolation is still a future security gate.",devices:["nova-fw01"]},
 {slug:"infra",name:"INFRA",kind:"VLAN",address:"10.10.20.0/24",gateway:"10.10.20.1",purpose:"Infrastructure network containing identity servers and the company file server.",devices:["nova-fw01","nova-dc01","nova-dc02","nova-files01"]},
 {slug:"app",name:"APP",kind:"VLAN",address:"10.10.30.0/24",gateway:"10.10.30.1",purpose:"Prepared application segment; a deployed application workload is not established by this network alone.",devices:["nova-fw01"]},
 {slug:"client",name:"CLIENT",kind:"VLAN",address:"10.10.40.0/24",gateway:"10.10.40.1",purpose:"Employee workstation network, with explicit blocks for management paths.",devices:["nova-fw01","nova-client"]},
 {slug:"dmz",name:"DMZ",kind:"VLAN",address:"10.10.50.0/24",gateway:"10.10.50.1",purpose:"Prepared public-service segment with no Phase 2 deployed public service verified.",devices:["nova-fw01"]},
 {slug:"vpn_remote",name:"VPN_REMOTE",kind:"WireGuard tunnel",address:"10.10.60.0/24",gateway:"10.10.60.1",purpose:"Encrypted remote-access tunnel for an external test laptop. It is not an 802.1Q VLAN.",devices:["nova-fw01"]}
];
export type Rule={
 id:string;zone:string;order:number;action:"PASS"|"BLOCK";family:"IPv4"|"IPv6";
 protocol:string;source:string;destination:string;ports:string;description:string;aliases:string[];
};
const R=(id:string,zone:string,order:number,action:"PASS"|"BLOCK",family:"IPv4"|"IPv6",protocol:string,source:string,destination:string,ports:string,description:string,aliases:string[]=[]):Rule=>({id,zone,order,action,family,protocol,source,destination,ports,description,aliases});
export const rules:Rule[]=[
 R("1785021391","wan",1,"PASS","IPv4","UDP","Any source","pfSense WAN address","51820","Allows WireGuard listener traffic to reach the firewall. Peer authentication remains necessary."),
 R("0100000101","lan",1,"PASS","IPv4","Any","LAN subnet","Any destination","Any","Broad legacy IPv4 allow; not strict network isolation."),
 R("0100000102","lan",2,"PASS","IPv6","Any","LAN subnet","Any destination","Any","Saved IPv6 allow remains; runtime IPv6 reachability is not established by this entry alone."),
 R("1782219128","mgmt",1,"PASS","IPv4","Any","Any source","MGMT gateway interface","Any","Broad allow to the management interface; not a hardened management policy."),
 R("1782218985","mgmt",2,"PASS","IPv4","Any","MGMT subnet","Any destination","Any","Broad management-network allow. CLIENT has independent upstream block rules."),
 R("1782219676","infra",1,"PASS","IPv4","Any","INFRA subnet","Any destination","Any","Allows broad IPv4 from server subnet; not a per-application allowlist."),
 R("1782219739","app",1,"PASS","IPv4","Any","APP subnet","Any destination","Any","Permissive rule on prepared application network, not proof of running application server."),
 R("1795199640","client",1,"BLOCK","IPv4","TCP","CLIENT subnet","pfSense firewall itself","NOVA_PFSENSE_GUI_PORT (80, 443)","Blocks ordinary clients from pfSense management web ports before broad allow.",["NOVA_PFSENSE_GUI_PORT"]),
 R("1795195682","client",2,"BLOCK","IPv4","Any","CLIENT subnet","MGMT subnet","Any","Blocks workstation access to management network ahead of broad client allow."),
 R("1782219813","client",3,"PASS","IPv4","Any","CLIENT subnet","Any destination","Any","Broad remaining CLIENT permit after two management protections."),
 R("1782219839","dmz",1,"PASS","IPv4","Any","DMZ subnet","Any destination","Any","Broad permit on prepared DMZ; no production DMZ workload is claimed."),
 R("1785000680","vpn_remote",1,"PASS","IPv4","ICMP","VPN_REMOTE subnet","VPN gateway","Any","Allows remote peer to ping the tunnel gateway after WireGuard connection."),
 R("1785002175","vpn_remote",2,"PASS","IPv4","TCP","VPN_REMOTE subnet","NOVA_DOMAIN_CONTROLLERS","NOVA_AD_TCP_PORTS","Allows selected TCP domain services for remote peer.",["NOVA_DOMAIN_CONTROLLERS","NOVA_AD_TCP_PORTS"]),
 R("1785019484","vpn_remote",3,"PASS","IPv4","UDP","VPN_REMOTE subnet","NOVA_DOMAIN_CONTROLLERS","NOVA_AD_UDP_PORTS","Allows selected UDP domain services for remote peer.",["NOVA_DOMAIN_CONTROLLERS","NOVA_AD_UDP_PORTS"]),
 R("1785019750","vpn_remote",4,"PASS","IPv4","ICMP","VPN_REMOTE subnet","NOVA_DOMAIN_CONTROLLERS","Any","Allows diagnostic ping to both Domain Controllers.",["NOVA_DOMAIN_CONTROLLERS"]),
 R("1785020072","vpn_remote",5,"BLOCK","IPv4","Any","VPN_REMOTE subnet","INFRA subnet","Any","After specific DC allows, blocks other remote access to infrastructure destinations."),
 R("1785020180","vpn_remote",6,"BLOCK","IPv4","Any","VPN_REMOTE subnet","NOVA_PROTECTED_NETWORKS","Any","Blocks remote peer access to the protected network list.",["NOVA_PROTECTED_NETWORKS"])
];
export type FirewallAlias={slug:string;name:string;kind:"Host"|"Port"|"Network";description:string;members:string[]};
export const aliases:FirewallAlias[]=[
 {slug:"nova-domain-controllers",name:"NOVA_DOMAIN_CONTROLLERS",kind:"Host",description:"Two directory/DNS server hosts targeted by the VPN service rules.",members:["DC01", "DC02"]},
 {slug:"nova-ad-tcp-ports",name:"NOVA_AD_TCP_PORTS",kind:"Port",description:"TCP services approved for access to the directory servers from the VPN.",members:["53","88","135","389","445","464","3268","49152–65535"]},
 {slug:"nova-ad-udp-ports",name:"NOVA_AD_UDP_PORTS",kind:"Port",description:"UDP services approved for VPN directory work.",members:["53","88","123","389","464"]},
 {slug:"nova-protected-networks",name:"NOVA_PROTECTED_NETWORKS",kind:"Network",description:"Six network ranges protected from unrestricted remote VPN access.",members:["Management","Application","Employee workstation","DMZ","Legacy LAN","Upstream host network"]},
 {slug:"nova-pfsense-gui-port",name:"NOVA_PFSENSE_GUI_PORT",kind:"Port",description:"Web-management ports blocked from ordinary company clients.",members:["80","443"]}
];
export const findZone=(slug:string)=>zones.find(x=>x.slug===slug);
export const findRule=(id:string)=>rules.find(x=>x.id===id);
export const findAlias=(slug:string)=>aliases.find(x=>x.slug===slug);
export const rulesForZone=(slug:string)=>rules.filter(x=>x.zone===slug).sort((a,b)=>a.order-b.order);
export const aliasForName=(name:string)=>aliases.find(x=>x.name===name);
export const rulesForAlias=(name:string)=>rules.filter(x=>x.aliases.includes(name));
export const networkEvidence={
 overview:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/NETWORK.md",
 rules:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/RULES.md",
 aliases:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/ALIASES.md",
 zone:(slug:string)=>"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/zones/"+slug.toUpperCase()+".md",
 rule:(id:string)=>"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/rules/"+id+".md",
 alias:(name:string)=>"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/network/aliases/"+name+".md",
 incident:"https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/pfsense-management-exposure.md"
};
