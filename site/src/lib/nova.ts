// Loads the Nova content model and derives everything the site draws from it: the map, counts, cross-links.
// Nothing here is hand-edited per page. Every count is computed. Planned work never appears as built.
import { getCollection } from "astro:content";
import facts from "../content/nova/facts.json";
import { factsSchema } from "./novaSchemas.mjs";

export const GRID = 10; // one grid unit is 10 px on the 920 x 610 map canvas
export type LineId = "platform" | "network" | "identity" | "files" | "recovery";

const strip = (id: string) => id.replace(/^nova-/, "");
export const segmentId = (line: string, from: string, to: string) => `${line}:${strip(from)}-${strip(to)}`;
const px = (n: number) => Math.round(n * GRID * 100) / 100;

export const typeLabel: Record<string, string> = { real: "Unexpected", controlled: "Controlled test", blind: "Blind test", tabletop: "Tabletop" };

// Where a change's full journal can be read on this site: the PDF viewer, or the rendered Markdown. Falls back to GitHub.
export async function journalHref(journalUrl: string, base: string) {
  const file = decodeURIComponent(journalUrl.split("/").pop() ?? "");
  const stem = file.replace(/\.(pdf|md)$/i, "");
  const pdfs = new Set((await getCollection("pdfJournals")).map((e: any) => e.id));
  if (pdfs.has(stem)) return { href: base + "journals/" + stem + "/", external: false };
  const refs = new Set((await getCollection("reference")).map((e: any) => e.id));
  const ref = "Documentation/Change-Requests/" + stem;
  if (refs.has(ref)) return { href: base + "reference/" + ref + "/", external: false };
  return { href: journalUrl, external: true };
}

export async function loadNova() {
  factsSchema.parse(facts);
  const lines = (await getCollection("novaLines")).map((e: any) => e.data).sort((a: any, b: any) => a.order - b.order);
  const zonesAll = (await getCollection("novaZones")).map((e: any) => e.data);
  const systems = (await getCollection("novaSystems")).map((e: any) => e.data).filter((s: any) => s.status === "live");
  const services = (await getCollection("novaServices")).map((e: any) => e.data);
  const changes = (await getCollection("novaChanges")).map((e: any) => e.data).sort((a: any, b: any) => a.id.localeCompare(b.id));
  const glossary = (await getCollection("novaGlossary")).map((e: any) => e.data);
  const journeys = (await getCollection("novaJourneys")).map((e: any) => e.data);
  const incidentEntries = await getCollection("incidents");

  const lineMap: Record<string, any> = Object.fromEntries(lines.map((l: any) => [l.id, l]));
  const stations = systems.map((s: any) => ({
    ...s, x: px(s.map.col), y: px(s.map.row), w: px(s.map.w), h: px(s.map.h),
    lines: [...new Set<string>([...s.links.map((l: any) => l.line), ...services.filter((v: any) => s.services.includes(v.id)).map((v: any) => v.line)])] as LineId[],
    incidents: incidentEntries.filter((e: any) => e.data.systems.includes(s.id)).map((e: any) => e.id)
  }));
  const segments = systems.flatMap((s: any) => s.links.map((l: any) => ({
    id: segmentId(l.line, s.id, l.to), line: l.line as LineId, from: s.id, to: l.to, meaning: l.meaning,
    d: l.path.map((p: number[], i: number) => `${i ? "L" : "M"}${px(p[0])},${px(p[1])}`).join(" ")
  })));
  const zones = zonesAll.filter((z: any) => z.box).map((z: any) => ({ ...z, x: px(z.box.col), y: px(z.box.row), w: px(z.box.w), h: px(z.box.h), end: z.labelEnd }));

  const incidents = incidentEntries.map((e: any) => ({ slug: e.id, ...e.data }));
  const counted = incidents;
  const titleOf = (slug: string) => { const i = incidents.find((x: any) => x.slug === slug); return i ? (i.shortTitle ?? i.title) : slug.replace(/-/g, " "); };
  // Pins: featured incidents first (by order), then the rest by slug. Numbers are computed, never typed.
  const pinned = incidents.filter((i: any) => i.pin).sort((a: any, b: any) => (a.featured ?? 99) - (b.featured ?? 99) || a.slug.localeCompare(b.slug));
  const markers = pinned.map((i: any, n: number) => ({ slug: i.slug, n: String(n + 1), x: px(i.pin.col), y: px(i.pin.row), title: titleOf(i.slug), type: i.type, home: !!i.featured }));
  const featured = incidents.filter((i: any) => i.featured).sort((a: any, b: any) => a.featured - b.featured);

  const supplemental = changes.filter((c: any) => c.supplemental && c.status === "done");
  const done = changes.filter((c: any) => c.status === "done" && !c.supplemental);
  const upcoming = changes.filter((c: any) => c.status !== "done");
  const builtIn = (crId: string) => ({
    adds: systems.filter((s: any) => s.builtBy[0] === crId), changes: systems.filter((s: any) => s.builtBy.includes(crId) && s.builtBy[0] !== crId),
    systems: systems.filter((s: any) => s.builtBy.includes(crId)), services: services.filter((v: any) => v.builtBy.includes(crId)),
    incidents: incidents.filter((i: any) => i.cr === crId)
  });
  // Stations on each line, in the order the line meets them. Used for the phone list.
  const lineStops: Record<string, string[]> = Object.fromEntries(lines.map((l: any) => [l.id, [] as string[]]));
  segments.forEach((sg: any) => [sg.from, sg.to].forEach(id => { if (!lineStops[sg.line].includes(id)) lineStops[sg.line].push(id); }));
  // The few incidents most related to one: shared services count double, shared systems once; same change breaks ties.
  const relatedIncidents = (slug: string, n = 4) => {
    const me: any = incidents.find((i: any) => i.slug === slug); if (!me) return [];
    return incidents.filter((i: any) => i.slug !== slug).map((i: any) => ({
      slug: i.slug, title: i.shortTitle ?? i.title,
      score: 2 * (i.services ?? []).filter((x: string) => (me.services ?? []).includes(x)).length + i.systems.filter((x: string) => me.systems.includes(x)).length + (i.cr && i.cr === me.cr ? 1 : 0)
    })).filter((x: any) => x.score > 0).sort((a: any, b: any) => b.score - a.score || a.slug.localeCompare(b.slug)).slice(0, n);
  };
  const vms = systems.filter((s: any) => s.hostedOn);
  const counts = { systems: systems.length, vms: vms.length, physical: systems.filter((s: any) => s.physical).length, supplemental: supplemental.length, vlans: (facts as any).vlans.length, changesDone: done.length, incidents: counted.length };
  return { facts: facts as any, lines, lineMap, zones, stations, segments, systems, services, changes, done, supplemental, upcoming, glossary, journeys, journey: journeys.find((j: any) => j.featured) ?? journeys[0],
    incidents, featured, markers, titleOf, builtIn, counts, lineStops, relatedIncidents, stationById: (id: string) => stations.find((s: any) => s.id === id) };
}
