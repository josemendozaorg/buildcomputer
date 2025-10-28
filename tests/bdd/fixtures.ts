/**
 * BDD Fixtures for Playwright-BDD
 *
 * Provides shared fixtures and configuration for BDD tests
 */

import { test as base } from "playwright-bdd";

// Extend base test with custom fixtures if needed
export const test = base.extend({
  // Add custom fixtures here if needed in the future
  // For now, we use the default Playwright test fixtures
});

export { expect } from "@playwright/test";
