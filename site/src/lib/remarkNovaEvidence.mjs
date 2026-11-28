// Remark plugin: a paragraph that is only {{evidence:some-id}} becomes a captioned figure, placed right where the result is described.
// Looks the id up in the original-journal screenshots (approvedPdfEvidence.json) or the sanitized CR-A figures (craEvidence.json).
// An unknown id fails the build, like any other broken reference.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { visit } from "unist-util-visit";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export default function remarkNovaEvidence() {
  const base = process.env.PUBLIC_BASE_PATH || "/";
  const load = (f) => JSON.parse(readFileSync(join(process.cwd(), "src/data", f), "utf8")).entries;
  const lookup = new Map();
  for (const e of load("approvedPdfEvidence.json")) lookup.set(e.id, { src: `${base}pdf-evidence/${e.id}.${e.ext === "jpeg" ? "jpg" : "png"}`, title: e.title, caption: e.caption, alt: e.alt, source: `${e.pdf}, page ${e.page}`, w: e.w, h: e.h });
  for (const e of load("craEvidence.json")) lookup.set(e.id, { src: base + e.file, title: e.title, caption: e.caption, alt: e.alt, source: e.source, w: e.w, h: e.h });
  return (tree, file) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || node.children.length !== 1 || node.children[0].type !== "text") return;
      const m = node.children[0].value.trim().match(/^\{\{evidence:([a-z0-9-]+)\}\}$/);
      if (!m) return;
      const ev = lookup.get(m[1]);
      if (!ev) throw new Error(`${file.path}: unknown evidence id {{evidence:${m[1]}}}`);
      const dims = ev.w && ev.h ? ` width="${ev.w}" height="${ev.h}"` : "";
      parent.children[index] = { type: "html", value:
        `<figure class="evfig" id="ev-${m[1]}"><a href="${ev.src}" target="_blank" rel="noopener" aria-label="Open the full-size screenshot: ${esc(ev.title)}"><img src="${ev.src}" alt="${esc(ev.alt)}"${dims} loading="lazy" decoding="async"></a>` +
        `<figcaption><strong>${esc(ev.title)}</strong> ${esc(ev.caption)} <span class="evsrc">Source: ${esc(ev.source)}. <a href="${ev.src}" target="_blank" rel="noopener">Open full size</a></span></figcaption></figure>` };
    });
  };
}
