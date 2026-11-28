import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import remarkNovaTerms from "./src/lib/remarkNovaTerms.mjs";
import remarkNovaEvidence from "./src/lib/remarkNovaEvidence.mjs";

// '/' is correct for novacorp.davideti.dev (independent custom-domain Pages site).
// Use /Nova-Corp/ only for temporary repository-path builds without a custom domain.
export default defineConfig({
  output: "static",
  base: process.env.PUBLIC_BASE_PATH || "/",
  integrations: [react()],
  markdown: { remarkPlugins: [remarkNovaTerms, remarkNovaEvidence] },
  // Old URLs that moved. GitHub Pages cannot send HTTP 301, so Astro writes a static page with a meta refresh and a visible link.
  redirects: { "/company": "/map/", "/tour": "/", "/incidents/vpn-validation-deferred": "/changes/CR-A/" },
  build: { format: "directory" },
  vite: { server: { fs: { strict: true } } }
});
