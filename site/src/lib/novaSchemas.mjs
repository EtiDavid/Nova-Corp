// Zod schemas for the Nova content model. Used by the Astro build (src/lib/nova.ts) and by scripts/validate-nova.mjs,
// so a bad record fails both the build and CI. See CONTENT-MODEL.md in the private docs repo.
import { z } from "zod";

const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase letters, digits and hyphens only");
const cr = z.string().regex(/^CR-\d{3}$/, "like CR-004");
const point = z.tuple([z.number(), z.number()]);
const copy = z.enum(["migrated", "rewritten"]).default("migrated"); // migrated = old wording kept until the Phase 4 rewrite

export const lineIds = ["platform", "network", "identity", "files", "recovery"];

export const lineSchema = z.object({
  id: z.enum(lineIds), name: z.string().min(2), question: z.string().min(5), token: z.string().startsWith("--line-"), order: z.number().int(), blurb: z.string()
}).strict();

export const zoneSchema = z.object({
  id: id, name: z.string(), vlan: z.number().int().optional(), kind: z.enum(["vlan", "tunnel", "upstream", "legacy"]),
  box: z.object({ col: z.number(), row: z.number(), w: z.number(), h: z.number() }).optional(), labelEnd: z.boolean().default(false)
}).strict();

export const linkSchema = z.object({
  line: z.enum(lineIds), to: id, meaning: z.string().min(5), path: z.array(point).min(2)
}).strict();

export const systemSchema = z.object({
  id: id, name: z.string(), role: z.string(), sub: z.string(), kind: z.enum(["hypervisor", "firewall", "server", "workstation", "appliance"]),
  zone: z.string(), ip: z.string().optional(), os: z.string().optional(), status: z.enum(["live", "retired"]),
  services: z.array(id).default([]), builtBy: z.array(cr).min(1),
  map: z.object({ col: z.number(), row: z.number(), w: z.number().default(13), h: z.number().default(4.4) }),
  links: z.array(linkSchema).default([]), limit: z.string().min(10), copyStatus: copy
}).strict();

export const serviceSchema = z.object({
  id: id, name: z.string(), line: z.enum(lineIds), runsOn: z.array(id).min(1), dependsOn: z.array(id).default([]),
  summary: z.string().min(10), inNova: z.string().min(10), builtBy: z.array(cr).min(1), copyStatus: copy
}).strict();

export const changeSchema = z.object({
  id: cr, title: z.string(), goal: z.string(), status: z.enum(["done", "next", "planned"]),
  journal: z.string().url().optional(), pdf: z.string().url().optional(), time: z.string().optional(),
  built: z.array(z.string()).optional(), validated: z.string().optional()
}).strict().refine(c => c.status !== "done" || !!c.journal, { message: "a done change needs a journal link" })
  .refine(c => c.status !== "done" || (c.built && c.built.length > 0), { message: "a done change needs a \"built\" list" });

export const glossarySchema = z.object({
  id: id, term: z.string(), aliases: z.array(z.string()).default([]), short: z.string().min(10), inNova: z.string().min(10),
  seeAlso: z.array(id).default([]), copyStatus: copy
}).strict();

export const journeySchema = z.object({
  id: id, title: z.string(), featured: z.boolean().default(false),
  steps: z.array(z.object({ at: id, segment: z.string().nullable(), text: z.string().min(5) })).min(2)
}).strict();

export const factsSchema = z.object({
  hypervisor: z.string(), vlans: z.array(z.object({ name: z.string(), id: z.number().int(), state: z.string() })).min(1),
  wireguardNote: z.string(), lastEvidenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  signOff: z.object({ date: z.string(), result: z.string(), conditions: z.array(z.string()) }),
  nextChange: cr, nextChangeStatus: z.string()
}).strict();

// New fields added to the existing incidents collection. Optional for migrated records; required for featured ones.
export const incidentExtra = {
  type: z.enum(["real", "controlled", "blind", "tabletop", "deferred"]).optional(),
  cr: cr.nullable().optional(), ft: z.string().optional(),
  services: z.array(id).optional(), lines: z.array(z.enum(lineIds)).optional(),
  segment: z.object({ from: id, to: id, line: z.enum(lineIds) }).nullable().optional(),
  pin: z.object({ col: z.number(), row: z.number() }).nullable().optional(),
  featured: z.number().int().positive().optional(), shortTitle: z.string().optional(),
  limits: z.string().optional(), saw: z.string().optional(), cause: z.string().optional(), fix: z.string().optional(), proof: z.string().optional(),
  copyStatus: copy.optional()
};
