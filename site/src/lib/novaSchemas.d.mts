import type { z } from "zod";
export const lineIds: string[];
export const lineSchema: z.ZodTypeAny; export const zoneSchema: z.ZodTypeAny; export const linkSchema: z.ZodTypeAny;
export const systemSchema: z.ZodTypeAny; export const serviceSchema: z.ZodTypeAny; export const changeSchema: z.ZodTypeAny;
export const glossarySchema: z.ZodTypeAny; export const journeySchema: z.ZodTypeAny; export const factsSchema: z.ZodTypeAny;
export const incidentExtra: Record<string, z.ZodTypeAny>;
