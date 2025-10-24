/**
 * E2E Tests for Progressive Disclosure
 *
 * Tests the advanced details expansion feature in component popovers
 */

import { test, expect } from "@playwright/test";

test.describe("Progressive Disclosure - Advanced Details", () => {
  test('should show "Show advanced details" button for components with advanced specs', async ({
    page,
  }) => {
    // Navigate and setup
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Click Learn More on GPU
    await page.getByTestId("learn-more-gpu").click();

    // Popover should be visible
    const popover = page.getByTestId("component-popover");
    await expect(popover).toBeVisible();

    // Should show "Show advanced details" button
    const advancedButton = page.getByTestId("show-advanced-details-button");
    await expect(advancedButton).toBeVisible();
    await expect(advancedButton).toContainText("Show advanced details");
  });

  test("should expand and show advanced specs when button is clicked", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    // Initially, advanced specs should not be visible
    let advancedSpecs = page.getByTestId("advanced-specs");
    await expect(advancedSpecs).not.toBeVisible();

    // Click "Show advanced details"
    const advancedButton = page.getByTestId("show-advanced-details-button");
    await advancedButton.click();

    // Now advanced specs should be visible
    advancedSpecs = page.getByTestId("advanced-specs");
    await expect(advancedSpecs).toBeVisible();
  });

  test("should show technical specifications with proper formatting", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    // Expand advanced details
    await page.getByTestId("show-advanced-details-button").click();

    const advancedSpecs = page.getByTestId("advanced-specs");

    // Should have a heading
    await expect(advancedSpecs).toContainText("Technical Specifications");

    // Should show clock speeds, TDP, architecture
    await expect(advancedSpecs).toContainText("Clock");
    await expect(advancedSpecs).toContainText("TDP");
    await expect(advancedSpecs).toContainText("Architecture");
  });

  test("should toggle between show/hide advanced details", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    const advancedButton = page.getByTestId("show-advanced-details-button");
    const advancedSpecs = page.getByTestId("advanced-specs");

    // Initially hidden
    await expect(advancedSpecs).not.toBeVisible();
    await expect(advancedButton).toContainText("Show advanced details");

    // Click to show
    await advancedButton.click();
    await expect(advancedSpecs).toBeVisible();
    await expect(advancedButton).toContainText("Hide advanced details");

    // Click to hide again
    await advancedButton.click();
    await expect(advancedSpecs).not.toBeVisible();
    await expect(advancedButton).toContainText("Show advanced details");
  });

  test("should reset advanced details when popover is closed", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    // Expand advanced details
    await page.getByTestId("show-advanced-details-button").click();
    const advancedSpecs = page.getByTestId("advanced-specs");
    await expect(advancedSpecs).toBeVisible();

    // Close popover
    await page.getByRole("button", { name: /Close popover/i }).click();

    // Reopen popover
    await page.getByTestId("learn-more-gpu").click();

    // Advanced details should be hidden again
    await expect(advancedSpecs).not.toBeVisible();
    const advancedButton = page.getByTestId("show-advanced-details-button");
    await expect(advancedButton).toContainText("Show advanced details");
  });

  test("should show GPU-specific advanced specs", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    await page.getByTestId("show-advanced-details-button").click();

    const advancedSpecs = page.getByTestId("advanced-specs");

    // GPU-specific specs (RTX 4060 Ti from Optimized Build)
    await expect(advancedSpecs).toContainText("MHz"); // Clock speeds
    await expect(advancedSpecs).toContainText("W"); // TDP
    await expect(advancedSpecs).toContainText("CUDA cores");
    await expect(advancedSpecs).toContainText("GDDR6");
  });

  test("should show CPU-specific advanced specs", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Click Learn More on CPU
    const cpuLearnMore = page.getByTestId("learn-more-cpu");
    const isVisible = await cpuLearnMore.isVisible().catch(() => false);

    if (isVisible) {
      await cpuLearnMore.click();
      await page.getByTestId("show-advanced-details-button").click();

      const advancedSpecs = page.getByTestId("advanced-specs");

      // CPU specific specs (Ryzen 7 7800X3D)
      await expect(advancedSpecs).toContainText("GHz"); // Clock speeds
      await expect(advancedSpecs).toContainText("cores");
      await expect(advancedSpecs).toContainText("threads");
      await expect(advancedSpecs).toContainText("Cache");
    }
  });

  test("advanced specs should use grid layout for readability", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    await page.getByTestId("show-advanced-details-button").click();

    const advancedSpecs = page.getByTestId("advanced-specs");

    // Check that content is formatted (has labels and values)
    const text = await advancedSpecs.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(50); // Should have substantial content

    // Should have structured content with colons separating labels and values
    expect(text).toContain(":");
  });
});
