export type Area = {
  id: string;
  number: string;
  name: string;
  shortName: string;
  description: string;
  question: string;
  accent: "blue" | "teal" | "purple" | "sky" | "amber";
  systemIds: string[];
  facts: string[];
  sourceUrl: string;
};
const docs = "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/";
export const areas: Area[] = [
  {
    id: "control-room", number: "01", name: "IT Control Room", shortName: "Systems",
    question: "What keeps the company running?",
    description: "Explore the virtual servers behind sign-ins, shared files and the company firewall.",
    accent: "blue", systemIds: ["nova-prox01", "nova-fw01", "nova-dc01", "nova-dc02", "nova-files01", "nova-client"],
    facts: ["Six documented virtual machines; five running and one stopped at the last check.", "Two Domain Controllers provide directory services.", "The platform runs inside VMware Workstation on a single physical host."],
    sourceUrl: docs + "virtualization/README.md"
  },
  {
    id: "identity-office", number: "02", name: "Identity Office", shortName: "Identity",
    question: "How do employees sign in?",
    description: "Meet the directory services, accounts and rules that control access.",
    accent: "teal", systemIds: ["nova-dc01", "nova-dc02", "nova-client"],
    facts: ["Two writable Domain Controllers provide directory and DNS services.", "A controlled DC01 outage tested continuity through DC02.", "A policy link is not the same as proof that a policy applied."],
    sourceUrl: docs + "DIRECTORY.md"
  },
  {
    id: "department-offices", number: "03", name: "Department Offices", shortName: "People",
    question: "Who needs access to company resources?",
    description: "See how fictional departments connect to identities, groups and files.",
    accent: "purple", systemIds: ["nova-dc01", "nova-files01"],
    facts: ["The lab models IT, Finance, HR, Management and Sales.", "Access follows directory groups and file permissions.", "Only source-approved fictional identities belong on public pages."],
    sourceUrl: docs + "PEOPLE_AND_DEPARTMENTS.md"
  },
  {
    id: "network-gatehouse", number: "04", name: "Network Gatehouse", shortName: "Network",
    question: "How are company systems separated?",
    description: "Follow traffic through pfSense and the network areas around it.",
    accent: "blue", systemIds: ["nova-fw01", "nova-client", "nova-dc01", "nova-files01"],
    facts: ["Five configured VLANs; WireGuard is a separate remote-access tunnel.", "The last reviewed pfSense configuration contains 17 firewall rules.", "Dedicated privileged management-plane isolation is still deferred."],
    sourceUrl: docs + "NETWORK.md"
  },
  {
    id: "file-records", number: "05", name: "File & Records Room", shortName: "Files",
    question: "Who can open each department folder?",
    description: "Explore shared folders, identity-based access and the company file server.",
    accent: "sky", systemIds: ["nova-files01", "nova-dc01", "nova-client"],
    facts: ["Five departmental shares are linked through a DFS namespace.", "Share-level and folder-level permissions are separate checks.", "An earlier-version recovery and a deleted-file restore were tested independently."],
    sourceUrl: docs + "FILE_SERVICES.md"
  },
  {
    id: "recovery-centre", number: "06", name: "Recovery Centre", shortName: "Recovery",
    question: "What happens when something breaks?",
    description: "Understand the backup layers and the recovery exercises that really happened.",
    accent: "teal", systemIds: ["nova-files01", "nova-dc01", "nova-prox01"],
    facts: ["A deleted file was recovered and its fingerprint matched.", "A different test recovered an earlier file version from Shadow Copy.", "Whole-VM and complete Domain Controller restores are not claimed as tested."],
    sourceUrl: docs + "services/BACKUPS.md"
  },
  {
    id: "incident-lab", number: "07", name: "Incident Lab", shortName: "Incidents",
    question: "How did we diagnose real failures?",
    description: "Start with the symptom. Follow the tests, repair and evidence.",
    accent: "amber", systemIds: ["nova-dc01", "nova-dc02", "nova-files01", "nova-fw01"],
    facts: ["Controlled failures were investigated and recorded.", "Results distinguish expected output from what actually happened.", "Outstanding security and external VPN checks remain clearly deferred."],
    sourceUrl: docs + "TESTS_AND_RECOVERY.md"
  },
  {
    id: "roadmap-wing", number: "08", name: "Roadmap Wing", shortName: "Next",
    question: "What has not been built yet?",
    description: "See the documented boundaries and future engineering work.",
    accent: "amber", systemIds: ["nova-fw01", "nova-prox01"],
    facts: ["Phase 2 has a documented conditional closure.", "Privileged admin VPN and management-plane isolation are not complete.", "That security change is on hold until the website is live and approved."],
    sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/PROJECT_STATUS.md"
  }
];
export const getArea = (id: string) => areas.find((area) => area.id === id);
