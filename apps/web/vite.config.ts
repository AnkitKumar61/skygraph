import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { parsePublicConfig } from "./src/shared/api/config.js";

export default defineConfig(({ mode, command, isPreview }) => {
  const environment = loadEnv(mode, "../..", "VITE_");
  if (command === "build") parsePublicConfig({ ...environment, PROD: mode === "production" });
  const developmentApi =
    command === "serve" && !isPreview ? parsePublicConfig(environment).apiBaseUrl : undefined;
  return {
    plugins: [react(), tailwindcss()],
    envDir: "../..",
    server: {
      proxy: developmentApi
        ? {
            "^/health/live$": {
              target: new URL(developmentApi).origin,
              changeOrigin: true,
            },
          }
        : {},
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 350,
    },
  };
});
