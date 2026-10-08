import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { parsePublicConfig } from "./src/shared/api/config.js";

export default defineConfig(({ mode, command }) => {
  const environment = loadEnv(mode, "../..", "VITE_");
  if (command === "build") parsePublicConfig({ ...environment, PROD: mode === "production" });
  return {
    plugins: [react(), tailwindcss()],
    envDir: "../..",
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 350,
    },
  };
});
