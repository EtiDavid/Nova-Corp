import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const incidents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/incidents" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    outcome: z.string(),
    status: z.enum(["tested", "deferred"]),
    systems: z.array(z.string()),
    sourceUrl: z.string().url()
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

export const collections = { incidents, reference };
