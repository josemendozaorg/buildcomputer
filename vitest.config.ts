import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Vitest configuration
    globals: true,
    environment: "jsdom",
    // Include only unit test files
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Exclude E2E and BDD tests (run separately with Playwright)
    exclude: [
      "node_modules/**",
      "dist/**",
      "tests/e2e/**",
      "tests/bdd/**",
      ".features-gen/**",
    ],
    // Setup files for unit tests
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "tests/",
        "stories/",
        "**/*.d.ts",
        "**/*.config.{ts,js}",
        "**/dist/**",
      ],
    },
  },
});
