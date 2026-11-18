import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { regulatoryAiDevApi } from "./scripts/regulatory-ai-dev-api";

export default defineConfig({
  plugins: [react(), regulatoryAiDevApi()],
  server: { host: "127.0.0.1", port: 5173, proxy: { "/v1": "http://localhost:8000", "/healthz": "http://localhost:8000" } },
  build: { outDir: "dist", sourcemap: false },
});
