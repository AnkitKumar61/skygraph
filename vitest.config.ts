import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: false,
      provider: "v8",
    },
    include: ["apps/*/tests/**/*.test.{ts,tsx}", "packages/*/tests/**/*.test.ts"],
    passWithNoTests: false,
    reporters: ["default"],
  },
});
