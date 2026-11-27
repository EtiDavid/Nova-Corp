// Every URL that existed before the v2 rebuild must still resolve: as a page or as a redirect page. Run after the build.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { routes } = JSON.parse(readFileSync(join(root, "scripts/legacy-routes.json"), "utf8"));
const missing = routes.filter(r => !existsSync(join(root, "dist", r === "/" ? "" : r, "index.html")));
const redirects = routes.filter(r => { const f = join(root, "dist", r === "/" ? "" : r, "index.html"); return existsSync(f) && /http-equiv="refresh"/i.test(readFileSync(f, "utf8")); });
if (missing.length) { console.error("Legacy routes that no longer resolve:\n - " + missing.join("\n - ")); process.exit(1); }
console.log(`Legacy route audit OK: all ${routes.length} old URLs still resolve (${redirects.length} are redirect pages).`);
