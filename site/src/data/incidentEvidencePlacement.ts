// Where each original-journal screenshot goes in an incident: right after the numbered step whose result it shows.
// Keys are the step numbers in the public incident source. Every id must exist in approvedPdfEvidence.json (the build fails if not).
export const evidenceAfterStep: Record<string, Record<string, string[]>> = {
  "dc01-outage": { "4": ["dc02-sysvol-available"], "7": ["dc01-recovery-gpupdate"] },
  "backup-target-unavailable": { "2": ["backup-disk-offline"], "6": ["backup-file-recovery"], "7": ["backup-sha256-match"] },
  "gpo-link-disabled": { "1": ["gpo-disabled-link"] },
  "replication-divergence": { "5": ["replication-rejected-8457"], "6": ["replication-restored"] },
  "two-faults-one-symptom": { "6": ["two-faults-group-membership"], "7": ["two-faults-cifs-ticket"], "8": ["two-faults-share-opens"] }
};
