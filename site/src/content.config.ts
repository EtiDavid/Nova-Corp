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

export const collections = { incidents };
