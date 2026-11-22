import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// '/' is correct for novacorp.davideti.dev (independent custom-domain Pages site).
// Use /Nova-Corp/ only for temporary repository-path builds without a custom domain.
export default defineConfig({
  output: "static",
  base: process.env.PUBLIC_BASE_PATH || "/",
  integrations: [react()],
  build: { format: "directory" },
  vite: { server: { fs: { strict: true } } }
});
