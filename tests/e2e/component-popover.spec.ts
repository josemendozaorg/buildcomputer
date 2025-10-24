/**
 * E2E Tests for Component Popover
 *
 * Tests the detailed component popover feature
 */

import { test, expect } from "@playwright/test";

test.describe("Component Popover", () => {
  test("should open popover when clicking Learn More on GPU", async ({
    page,
  }) => {
    // Navigate and setup
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();

    // Click Learn More
    const learnMoreButton = page.getByTestId("learn-more-gpu");
    await learnMoreButton.click();

    // Popover should be visible
    const popover = page.getByTestId("component-popover");
    await expect(popover).toBeVisible();
  });

  test("popover should show all required sections", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    const popover = page.getByTestId("component-popover");

    // Check all sections are present
    await expect(popover).toContainText("Description");
    await expect(popover).toContainText("When to Choose");
    await expect(popover).toContainText("Performance Tier");
  });

  test("popover should be dismissable via close button", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    const popover = page.getByTestId("component-popover");
    await expect(popover).toBeVisible();

    // Click close button
    await page.getByRole("button", { name: /Close popover/i }).click();
    await expect(popover).not.toBeVisible();
  });

  test("popover should be dismissable via ESC key", async ({ page }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    const popover = page.getByTestId("component-popover");
    await expect(popover).toBeVisible();

    // Press ESC
    await page.keyboard.press("Escape");
    await expect(popover).not.toBeVisible();
  });

  test("popover should have proper accessibility attributes", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.locator('[data-persona-id="competitive-gamer"]').click();
    const buildCard = page.getByTestId("build-card").first();
    await buildCard.getByRole("button", { name: /View Details/i }).click();
    await page.getByTestId("learn-more-gpu").click();

    const popover = page.getByTestId("component-popover");

    // Check accessibility
    await expect(popover).toHaveAttribute("role", "dialog");
    await expect(popover).toHaveAttribute("aria-modal", "true");
    await expect(popover).toHaveAttribute("aria-labelledby", "popover-title");
  });
});
