import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

/**
 * Playwright E2E and BDD Test Configuration
 * See https://playwright.dev/docs/test-configuration
 */

// BDD configuration
const testDir = defineBddConfig({
  paths: ["tests/bdd/features/**/*.feature"],
  require: ["tests/bdd/steps/**/*.ts", "tests/bdd/fixtures.ts"],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
