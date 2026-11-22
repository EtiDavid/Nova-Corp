import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Defaults to '/' for local development or root-domain hosting.
// On GitHub Pages set PUBLIC_BASE_PATH=/Nova-Corp/ at build time.
export default defineConfig({
  output: "static",
  base: process.env.PUBLIC_BASE_PATH || "/",
  integrations: [react()],
  build: { format: "directory" },
  vite: { server: { fs: { strict: true } } }
});
