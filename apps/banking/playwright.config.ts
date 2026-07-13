import { defineConfig, devices } from "@playwright/test";

/**
 * Mobile E2E suite (Phase 3 / F120). Runs against the production build
 * (`next start`) for stability; the demo store is process-scoped, so tests run
 * serially and restore any state they mutate.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4610",
    ...devices["Pixel 5"], // 393×851 mobile chromium profile
  },
  projects: [{ name: "mobile-chromium", use: { ...devices["Pixel 5"] } }],
  webServer: {
    command: "npx next start -p 4610",
    url: "http://localhost:4610",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
