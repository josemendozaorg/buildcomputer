import { test, expect } from "@playwright/test";

/**
 * E2E Test: Build Recommendations Feature (Scenario 3)
 *
 * Tests the complete user journey of selecting a persona, adjusting budget,
 * and viewing personalized build recommendations.
 */

test.describe("Build Recommendations", () => {
  test("should display build recommendations after persona selection and budget adjustment", async ({
    page,
  }) => {
    // Navigate to the builder page
    await page.goto("/build");

    // Verify we're on the builder page
    await expect(
      page.locator('h2:has-text("Choose Your Story")'),
    ).toBeVisible();

    // Verify 8 persona cards are visible
    const personaCards = page.locator("button:has(h3)");
    await expect(personaCards).toHaveCount(8);

    // Click the "Competitive Gamer" persona
    const gamerCard = page.getByRole("button", {
      name: /competitive gamer/i,
    });
    await gamerCard.click();

    // Verify persona card is highlighted
    await expect(gamerCard).toHaveClass(/border-indigo-600/);

    // Verify budget slider appears
    const budgetSlider = page.locator('input[type="range"]');
    await expect(budgetSlider).toBeVisible();

    // Verify default budget is $1,500
    const budgetDisplay = page.locator('.text-4xl:has-text("$1,500")');
    await expect(budgetDisplay).toBeVisible();

    // Adjust budget to $2,000
    await budgetSlider.fill("2000");

    // Wait a moment for React to update
    await page.waitForTimeout(100);

    // Verify budget display updates
    const newBudgetDisplay = page.locator('.text-4xl:has-text("$2,000")');
    await expect(newBudgetDisplay).toBeVisible();

    // Verify 3 build recommendation cards appear
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Verify the three build types are present
    await expect(
      page.locator('[data-testid="build-card"]:has-text("Optimized Build")'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="build-card"]:has-text("Performance Build")'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="build-card"]:has-text("Featured Build")'),
    ).toBeVisible();

    // Verify each card has a price
    const prices = page.locator('[data-testid="build-price"]');
    await expect(prices).toHaveCount(3);

    // Verify prices contain dollar signs
    for (let i = 0; i < 3; i++) {
      const priceText = await prices.nth(i).textContent();
      expect(priceText).toContain("$");
    }

    // Verify each card has a description
    const descriptions = page.locator('[data-testid="build-description"]');
    await expect(descriptions).toHaveCount(3);

    // Verify all descriptions are visible and non-empty
    for (let i = 0; i < 3; i++) {
      await expect(descriptions.nth(i)).toBeVisible();
      const descText = await descriptions.nth(i).textContent();
      expect(descText).toBeTruthy();
      expect(descText!.length).toBeGreaterThan(0);
    }
  });

  // TODO: Implement budget-aware component selection (currently uses fixed tiers per persona)
  // This test expects dynamic pricing but componentDatabase.ts uses static builds
  // See: _totalBudget parameter in selectComponents() marked as unused
  test.skip("should update recommendations when budget changes", async ({
    page,
  }) => {
    // Navigate and select persona
    await page.goto("/build");
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Set initial budget to $1,000
    const budgetSlider = page.locator('input[type="range"]');
    await budgetSlider.fill("1000");
    await page.waitForTimeout(100);

    // Get the first build card price
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    const initialPrice = await buildCards
      .first()
      .locator('[data-testid="build-price"]')
      .textContent();

    // Change budget to $3,000
    await budgetSlider.fill("3000");
    await page.waitForTimeout(100);

    // Verify budget display updated
    await expect(page.locator('.text-4xl:has-text("$3,000")')).toBeVisible();

    // Get the new price
    const newPrice = await buildCards
      .first()
      .locator('[data-testid="build-price"]')
      .textContent();

    // Prices should be different
    expect(initialPrice).not.toBe(newPrice);
  });

  test("should show gaming-focused descriptions for gaming persona", async ({
    page,
  }) => {
    await page.goto("/build");

    // Select Competitive Gamer persona
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Wait for recommendations
    const buildCards = page.locator('[data-testid="build-card"]');
    await expect(buildCards).toHaveCount(3);

    // Get all descriptions
    const descriptions = page.locator('[data-testid="build-description"]');
    const allDescText = [];

    for (let i = 0; i < 3; i++) {
      const text = await descriptions.nth(i).textContent();
      allDescText.push(text?.toLowerCase() || "");
    }

    const combinedText = allDescText.join(" ");

    // Verify gaming-related terms are present
    const hasGamingTerms =
      combinedText.includes("gaming") ||
      combinedText.includes("fps") ||
      combinedText.includes("performance") ||
      combinedText.includes("competitive");

    expect(hasGamingTerms).toBe(true);
  });

  test("should show different descriptions for different personas", async ({
    page,
  }) => {
    await page.goto("/build");

    // Select Competitive Gamer
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Get gamer description
    const gamerDesc = await page
      .locator('[data-testid="build-description"]')
      .first()
      .textContent();

    // Navigate back and select Creator
    await page.goto("/build");
    await page.getByRole("button", { name: /creator/i }).click();

    // Get creator description
    const creatorDesc = await page
      .locator('[data-testid="build-description"]')
      .first()
      .textContent();

    // Descriptions should be different
    expect(gamerDesc).not.toBe(creatorDesc);
  });

  test('should display "Recommended Builds" heading', async ({ page }) => {
    await page.goto("/build");

    // Select a persona
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Verify the recommendations section heading
    await expect(
      page.locator('h2:has-text("Recommended Builds")'),
    ).toBeVisible();
  });

  test("should calculate prices based on budget percentage", async ({
    page,
  }) => {
    await page.goto("/build");
    await page.getByRole("button", { name: /competitive gamer/i }).click();

    // Set budget to $2,000
    await page.locator('input[type="range"]').fill("2000");
    await page.waitForTimeout(100);

    const prices = page.locator('[data-testid="build-price"]');

    // Get all price texts and extract numbers
    const priceTexts = await prices.allTextContents();
    const priceNumbers = priceTexts.map((text) => {
      const match = text.match(/\$([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, "")) : 0;
    });

    // Verify we have 3 prices
    expect(priceNumbers).toHaveLength(3);

    // Optimized should be ~90% of budget ($1,800)
    // Performance should be ~100% of budget ($2,000)
    // Featured should be ~125% of budget ($2,500)

    expect(priceNumbers[0]).toBeGreaterThan(1700); // Optimized: ~$1,800
    expect(priceNumbers[0]).toBeLessThan(1900);

    expect(priceNumbers[1]).toBeGreaterThan(1900); // Performance: ~$2,000
    expect(priceNumbers[1]).toBeLessThan(2100);

    expect(priceNumbers[2]).toBeGreaterThan(2400); // Featured: ~$2,500
    expect(priceNumbers[2]).toBeLessThan(2600);
  });
});
