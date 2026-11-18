import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5173, proxy: { "/v1": "http://localhost:8004", "/healthz": "http://localhost:8004" } },
  build: { outDir: "dist", sourcemap: false },
});


