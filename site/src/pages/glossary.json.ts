import { loadNova } from "../lib/nova";
export async function GET() {
  const nova = await loadNova();
  const out = Object.fromEntries(nova.glossary.map((g: any) => [g.id, { term: g.term, short: g.short, inNova: g.inNova }]));
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
}
