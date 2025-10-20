import { test, expect } from "@playwright/test";

test.describe("Component Expansion", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the builder page
    await page.goto("/build");
  });

  test("should expand build card to show component details", async ({
    page,
  }) => {
    // Select a persona
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Wait for build recommendations to appear
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Find the Optimized Build card
    const optimizedCard = page.locator(
      '[data-testid="build-card"]:has-text("Optimized Build")',
    );
    await expect(optimizedCard).toBeVisible();

    // Verify View Details button is present
    const viewDetailsButton = optimizedCard.getByRole("button", {
      name: /view details/i,
    });
    await expect(viewDetailsButton).toBeVisible();

    // Click View Details
    await viewDetailsButton.click();

    // Verify component list is revealed
    const componentList = optimizedCard.locator(
      '[data-testid="component-list"]',
    );
    await expect(componentList).toBeVisible();

    // Verify all component types are shown
    await expect(componentList.locator('text="CPU"').first()).toBeVisible();
    await expect(componentList.locator('text="GPU"').first()).toBeVisible();
    await expect(componentList.locator('text="RAM"').first()).toBeVisible();
    await expect(componentList.locator('text="Storage"').first()).toBeVisible();

    // Verify button text changed to "Hide Details"
    const hideDetailsButton = optimizedCard.getByRole("button", {
      name: /hide details/i,
    });
    await expect(hideDetailsButton).toBeVisible();
  });

  test("should show component names and specs", async ({ page }) => {
    // Select a persona
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Wait for build recommendations
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Expand the Optimized Build card
    const optimizedCard = page.locator(
      '[data-testid="build-card"]:has-text("Optimized Build")',
    );
    await optimizedCard.getByRole("button", { name: /view details/i }).click();

    // Verify component list is visible
    const componentList = optimizedCard.locator(
      '[data-testid="component-list"]',
    );
    await expect(componentList).toBeVisible();

    // Verify component names (examples from the competitive gamer optimized build)
    await expect(
      componentList.locator("text=/Ryzen|Intel/").first(),
    ).toBeVisible();
    await expect(
      componentList.locator("text=/GeForce|Radeon/").first(),
    ).toBeVisible();

    // Verify component specs are displayed
    await expect(componentList.locator("text=/cores/i").first()).toBeVisible();
    await expect(componentList.locator("text=/GB/i").first()).toBeVisible();
    await expect(componentList.locator("text=/GHz/i").first()).toBeVisible();
  });

  test("should collapse component list when Hide Details is clicked", async ({
    page,
  }) => {
    // Select a persona
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Wait for build recommendations
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Expand the Optimized Build card
    const optimizedCard = page.locator(
      '[data-testid="build-card"]:has-text("Optimized Build")',
    );
    await optimizedCard.getByRole("button", { name: /view details/i }).click();

    // Verify component list is visible
    const componentList = optimizedCard.locator(
      '[data-testid="component-list"]',
    );
    await expect(componentList).toBeVisible();

    // Click Hide Details
    await optimizedCard.getByRole("button", { name: /hide details/i }).click();

    // Verify component list is hidden
    await expect(componentList).not.toBeVisible();

    // Verify button text changed back to "View Details"
    const viewDetailsButton = optimizedCard.getByRole("button", {
      name: /view details/i,
    });
    await expect(viewDetailsButton).toBeVisible();
  });

  test("should expand different build cards independently", async ({
    page,
  }) => {
    // Select a persona
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Wait for build recommendations
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Expand the Optimized Build card
    const optimizedCard = page.locator(
      '[data-testid="build-card"]:has-text("Optimized Build")',
    );
    await optimizedCard.getByRole("button", { name: /view details/i }).click();

    // Verify Optimized Build component list is visible
    const optimizedComponentList = optimizedCard.locator(
      '[data-testid="component-list"]',
    );
    await expect(optimizedComponentList).toBeVisible();

    // Expand the Performance Build card
    const performanceCard = page.locator(
      '[data-testid="build-card"]:has-text("Performance Build")',
    );
    await performanceCard
      .getByRole("button", { name: /view details/i })
      .click();

    // Verify both component lists are visible
    const performanceComponentList = performanceCard.locator(
      '[data-testid="component-list"]',
    );
    await expect(optimizedComponentList).toBeVisible();
    await expect(performanceComponentList).toBeVisible();

    // Collapse Optimized Build
    await optimizedCard.getByRole("button", { name: /hide details/i }).click();

    // Verify Optimized is hidden but Performance is still visible
    await expect(optimizedComponentList).not.toBeVisible();
    await expect(performanceComponentList).toBeVisible();
  });

  test("should display component prices", async ({ page }) => {
    // Select a persona
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Wait for build recommendations
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Expand the Optimized Build card
    const optimizedCard = page.locator(
      '[data-testid="build-card"]:has-text("Optimized Build")',
    );
    await optimizedCard.getByRole("button", { name: /view details/i }).click();

    // Verify component list is visible
    const componentList = optimizedCard.locator(
      '[data-testid="component-list"]',
    );
    await expect(componentList).toBeVisible();

    // Verify component prices are displayed (should have $ signs)
    const pricesInList = componentList.locator("text=/\\$/");
    await expect(pricesInList.first()).toBeVisible();

    // Should have at least 4 prices (one for each component: CPU, GPU, RAM, Storage)
    await expect(pricesInList).toHaveCount(4, { timeout: 2000 });
  });

  test("should show component details for creator persona", async ({
    page,
  }) => {
    // Select Creator persona
    await page.getByRole("button", { name: /creator/i }).click();

    // Wait for build recommendations
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Verify descriptions are creator-focused
    await expect(
      page.locator('[data-testid="build-description"]').first(),
    ).toContainText(/video editing|content creation|rendering/i);

    // Expand Optimized Build and check for creator components
    const optimizedCard = page.locator(
      '[data-testid="build-card"]:has-text("Optimized Build")',
    );
    await optimizedCard.getByRole("button", { name: /view details/i }).click();

    const componentList = optimizedCard.locator(
      '[data-testid="component-list"]',
    );
    await expect(componentList).toBeVisible();

    // Verify all component types are shown
    await expect(componentList.locator('text="CPU"').first()).toBeVisible();
    await expect(componentList.locator('text="GPU"').first()).toBeVisible();
    await expect(componentList.locator('text="RAM"').first()).toBeVisible();
    await expect(componentList.locator('text="Storage"').first()).toBeVisible();

    // Verify creator-optimized components (should have GPUs for rendering)
    await expect(
      componentList.locator("text=/Ryzen|Intel|NVIDIA|AMD/").first(),
    ).toBeVisible();
  });
});
