// Remark plugin: turns [[DNS]] into <span class="term" data-term="dns">DNS</span>.
// The page script (NovaLayout) decorates only the first mention per page and never in headings, links or buttons.
// An unknown term fails the build, like any other broken reference.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { visit } from "unist-util-visit";

export default function remarkNovaTerms() {
  const dir = join(process.cwd(), "src/content/nova/glossary");
  const lookup = new Map();
  for (const f of readdirSync(dir).filter(n => n.endsWith(".json"))) {
    const g = JSON.parse(readFileSync(join(dir, f), "utf8"));
    [g.term, ...g.aliases].forEach(t => lookup.set(t.toLowerCase(), g.id));
  }
  return (tree, file) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || !/\[\[[^\]]+\]\]/.test(node.value)) return;
      const parts = []; let last = 0;
      for (const m of node.value.matchAll(/\[\[([^\]]+)\]\]/g)) {
        const id = lookup.get(m[1].toLowerCase());
        if (!id) throw new Error(`${file.path}: unknown glossary term [[${m[1]}]]`);
        if (m.index > last) parts.push({ type: "text", value: node.value.slice(last, m.index) });
        parts.push({ type: "html", value: `<span class="term" data-term="${id}" tabindex="0" role="button">${m[1]}</span>` });
        last = m.index + m[0].length;
      }
      if (last < node.value.length) parts.push({ type: "text", value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}
