// Lightweight secret scan for the website source. CI also runs gitleaks; this catches the obvious cases locally.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skipDirs = new Set(["node_modules", "dist", ".astro", ".git"]);
const textExt = new Set([".md", ".mdx", ".astro", ".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".html", ".yml", ".yaml", ".txt", ".svg", ".ps1"]);
const rules = [
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["password assignment", /\b(?:password|passwd|pwd|secret|api[_-]?key|client_secret)\s*[:=]\s*["'][^"'\s$<{]{6,}["']/i],
  ["WireGuard private key line", /^\s*PrivateKey\s*=\s*[A-Za-z0-9+/]{43}=/m],
  ["DSRM or admin password phrase", /(?:DSRM|SafeModeAdministratorPassword)[^\n]{0,40}[:=]\s*\S{6,}/i]
];
const hits = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const p = join(dir, name), st = statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!textExt.has(extname(name)) || st.size > 3_000_000 || name === "scan-secrets.mjs") continue;
    const text = readFileSync(p, "utf8");
    for (const [label, rx] of rules) { const m = text.match(rx); if (m) hits.push(`${relative(root, p)}: ${label}: ${m[0].slice(0, 60).replace(/\n/g, " ")}`); }
  }
})(root);
if (hits.length) { console.error("Possible secrets found:\n - " + hits.join("\n - ")); process.exit(1); }
console.log("Secret scan OK: no private keys, tokens or password assignments found in the website source.");
