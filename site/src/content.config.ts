import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";
import { lineSchema, zoneSchema, systemSchema, serviceSchema, changeSchema, glossarySchema, journeySchema, factsSchema, incidentExtra } from "./lib/novaSchemas.mjs";

const incidents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/incidents" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    outcome: z.string(),
    status: z.enum(["tested", "deferred"]),
    systems: z.array(z.string()),
    sourceUrl: z.string().url(),
    ...incidentExtra
  })
});

const reference = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reference", generateId: ({entry}) => entry.replace(/\.md$/i, "") }),
  schema: z.object({
    title: z.string(),
    sourcePath: z.string(),
    sourceUrl: z.string().url(),
    section: z.string()
  })
});

const pdfJournals = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pdfJournals", generateId: ({entry}) => entry.replace(/\.md$/i,"") }),
  schema: z.object({
    title: z.string(),
    originalName: z.string(),
    sourceUrl: z.string().url(),
    pageCount: z.number().positive(),
    originalSha256: z.string().length(64),
    nativeTextCharacters: z.number().positive(),
    originalImageBlocks: z.number().nonnegative()
  })
});

const nova = (folder: string, schema: any, pattern = "*.json") => defineCollection({
  loader: glob({ pattern, base: "./src/content/nova/" + folder, generateId: ({ entry }) => entry.replace(/\.json$/i, "") }), schema
});
export const collections = {
  incidents, reference, pdfJournals,
  novaLines: defineCollection({ loader: file("src/content/nova/lines.json"), schema: lineSchema }),
  novaZones: defineCollection({ loader: file("src/content/nova/zones.json"), schema: zoneSchema }),
  novaSystems: nova("systems", systemSchema), novaServices: nova("services", serviceSchema), novaChanges: nova("changes", changeSchema),
  novaGlossary: nova("glossary", glossarySchema), novaJourneys: nova("journeys", journeySchema)
};
