/**
 * E2E Tests for Technical Term Tooltips
 *
 * Tests the educational tooltips on technical PC building terms
 */

import { test, expect } from "@playwright/test";

test.describe("Technical Term Tooltips", () => {
  test("should show tooltip when hovering over PCIe 4.0 term", async ({
    page,
  }) => {
    // Navigate and setup
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Find and hover over PCIe 4.0 technical term
    const pcieTerm = page.getByTestId("tech-term-pcie-4.0").first();
    await expect(pcieTerm).toBeVisible();
    await pcieTerm.hover();

    // Tooltip should appear
    const tooltip = page.getByTestId("component-tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("PCI Express");
  });

  test("should show tooltip for DDR5 memory term", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Find DDR5 term (if present in build)
    const ddr5Term = page.getByTestId("tech-term-ddr5").first();

    // Only test if the term exists in this build
    const isVisible = await ddr5Term.isVisible().catch(() => false);
    if (isVisible) {
      await ddr5Term.hover();

      const tooltip = page.getByTestId("component-tooltip");
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toContainText("Double Data Rate");
    }
  });

  test("should show full explanation popover when clicking technical term", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Click on PCIe 4.0 term
    const pcieTerm = page.getByTestId("tech-term-pcie-4.0").first();
    await expect(pcieTerm).toBeVisible();
    await pcieTerm.click();

    // Popover should appear with full explanation
    const popover = page.getByTestId("component-popover");
    await expect(popover).toBeVisible();
    await expect(popover).toContainText("What is PCIe 4.0?");
    await expect(popover).toContainText("PCI Express");
  });

  test("popover should be dismissable via close button", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Click on PCIe 4.0 term
    const pcieTerm = page.getByTestId("tech-term-pcie-4.0").first();
    await pcieTerm.click();

    const popover = page.getByTestId("component-popover");
    await expect(popover).toBeVisible();

    // Close via button
    await page.getByRole("button", { name: /Close popover/i }).click();
    await expect(popover).not.toBeVisible();
  });

  test("popover should be dismissable via ESC key", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Click on PCIe 4.0 term
    const pcieTerm = page.getByTestId("tech-term-pcie-4.0").first();
    await pcieTerm.click();

    const popover = page.getByTestId("component-popover");
    await expect(popover).toBeVisible();

    // Press ESC
    await page.keyboard.press("Escape");
    await expect(popover).not.toBeVisible();
  });

  test("technical terms should be visually distinct", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Technical terms should have dotted underline styling
    const pcieTerm = page.getByTestId("tech-term-pcie-4.0").first();
    await expect(pcieTerm).toBeVisible();

    // Check that it has the cursor-help class (indicates it's interactive)
    const classes = await pcieTerm.getAttribute("class");
    expect(classes).toContain("cursor-help");
  });

  test("should handle multiple technical terms in same component", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // There should be multiple technical terms visible
    // (GPU likely has multiple specs like PCIe, memory size, etc.)
    const componentList = buildCard.getByTestId("component-list");
    await expect(componentList).toBeVisible();

    // Count technical terms (at least 1 should exist)
    const techTerms = page.locator('[data-testid^="tech-term-"]');
    const count = await techTerms.count();
    expect(count).toBeGreaterThan(0);
  });
});
