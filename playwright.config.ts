import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./apps/web/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"], defaultBrowserType: "chromium" } },
  ],
  webServer: [
    {
      command:
        "npx --yes pnpm@11.9.0 --filter @skygraph/web preview --host 127.0.0.1 --port 4173 --strictPort",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "node --env-file=.env.example apps/api/dist/src/main.js",
      url: "http://127.0.0.1:4310/health/live",
      env: { API_HOST: "127.0.0.1", API_PORT: "4310", LOG_LEVEL: "warn" },
      reuseExistingServer: false,
    },
    {
      command:
        "npx --yes pnpm@11.9.0 --filter @skygraph/web dev --host 127.0.0.1 --port 4311 --strictPort",
      url: "http://127.0.0.1:4311",
      env: {
        VITE_API_BASE_URL: "http://127.0.0.1:4310/api/v1",
        VITE_WS_URL: "ws://127.0.0.1:4310",
      },
      reuseExistingServer: false,
    },
  ],
});
