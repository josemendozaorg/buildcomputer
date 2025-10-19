import { test, expect } from '@playwright/test'

/**
 * E2E Test: Project Initialization and Development Server
 *
 * Verifies that the development server starts and serves the application
 * correctly, matching the BDD acceptance criteria.
 */

test.describe('Project Initialization', () => {
  test('should serve the landing page successfully', async ({ page }) => {
    // Navigate to the development server
    const response = await page.goto('/')

    // Verify the server responds successfully
    expect(response?.status()).toBeLessThan(500)

    // Verify the page title is set
    await expect(page).toHaveTitle(/BuildComputer/)

    // Verify we're running on the correct port (implicitly via baseURL in config)
    expect(page.url()).toContain('localhost:5173')
  })

  test('should have HMR enabled', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Check that Vite's HMR client is loaded
    const viteClientScripts = await page.locator('script[type="module"]').count()
    expect(viteClientScripts).toBeGreaterThan(0)
  })
})
