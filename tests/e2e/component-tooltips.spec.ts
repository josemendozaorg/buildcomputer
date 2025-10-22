/**
 * E2E Tests for Component Tooltips
 *
 * Tests the educational tooltip feature for PC components
 */

import { test, expect } from "@playwright/test";

test.describe("Component Tooltips", () => {
  test("should show tooltip when hovering over GPU component name", async ({
    page,
  }) => {
    // Navigate to builder page
    await page.goto("/build");

    // Select a persona to see build recommendations
    await page.locator('[data-persona-id="competitive-gamer"]').click();

    // Wait for build recommendations
    const buildCard = page.getByTestId("build-card").first();
    await expect(buildCard).toBeVisible();

    // Expand build details to see components
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Wait for component list
    const componentList = buildCard.getByTestId("component-list");
    await expect(componentList).toBeVisible();

    // Hover over GPU label
    const gpuLabel = page.getByText("GPU", { exact: true }).first();
    await gpuLabel.hover();

    // Tooltip should appear
    const tooltip = page.getByTestId("component-tooltip");
    await expect(tooltip).toBeVisible();

    // Tooltip should contain explanation about GPU
    await expect(tooltip).toContainText("Graphics card");
    await expect(tooltip).toContainText("renders");
  });

  test("tooltip should have proper ARIA attributes", async ({ page }) => {
    // Navigate and setup
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Hover to show tooltip
    const cpuLabel = page.getByText("CPU", { exact: true }).first();
    await cpuLabel.hover();

    // Check ARIA attributes
    const tooltip = page.getByTestId("component-tooltip");
    await expect(tooltip).toHaveAttribute("role", "tooltip");
    await expect(tooltip).toHaveAttribute("id", "tooltip");
  });

  test("tooltip should disappear when mouse leaves", async ({ page }) => {
    // Navigate and setup
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Hover to show tooltip
    const ramLabel = page.getByText("RAM", { exact: true }).first();
    await ramLabel.hover();

    // Tooltip visible
    const tooltip = page.getByTestId("component-tooltip");
    await expect(tooltip).toBeVisible();

    // Move mouse away
    await page.mouse.move(0, 0);

    // Tooltip should disappear
    await expect(tooltip).not.toBeVisible();
  });

  test("should show correct explanation for each component type", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Test GPU tooltip
    await page.getByText("GPU", { exact: true }).first().hover();
    let tooltip = page.getByTestId("component-tooltip");
    await expect(tooltip).toContainText("Graphics card");

    // Move away to hide tooltip
    await page.mouse.move(0, 0);

    // Test CPU tooltip
    await page.getByText("CPU", { exact: true }).first().hover();
    tooltip = page.getByTestId("component-tooltip");
    await expect(tooltip).toContainText("processor");

    // Move away
    await page.mouse.move(0, 0);

    // Test RAM tooltip
    await page.getByText("RAM", { exact: true }).first().hover();
    tooltip = page.getByTestId("component-tooltip");
    await expect(tooltip).toContainText("memory");
  });
});
