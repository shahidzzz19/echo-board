import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the main dashboard", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("EchoBoard")
    await expect(page.locator("h2")).toContainText("Your Personalized Feed")
  })

  test("should allow searching for content", async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search content..."]')
    await searchInput.fill("technology")

    // Wait for debounced search
    await page.waitForTimeout(500)

    await expect(page.locator("h2")).toContainText("Search Results")
  })

  test("should navigate between sections", async ({ page }) => {
    // Click on Trending section
    await page.click("text=Trending")
    await expect(page.locator("h2")).toContainText("Trending Now")

    // Click on Favorites section
    await page.click("text=Favorites")
    await expect(page.locator("h2")).toContainText("Your Favorites")

    // Click back to Feed
    await page.click("text=Feed")
    await expect(page.locator("h2")).toContainText("Your Personalized Feed")
  })

  test("should open preferences modal", async ({ page }) => {
    await page.click('[data-testid="preferences-button"]')
    await expect(page.locator("text=User Preferences")).toBeVisible()
  })

  test("should toggle dark mode", async ({ page }) => {
    const darkModeButton = page.locator("text=Dark Mode")
    await darkModeButton.click()

    // Check if dark mode is applied
    await expect(page.locator("html")).toHaveClass(/dark/)
  })

  test("should add item to favorites", async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10000 })

    // Click the first heart button
    const firstHeartButton = page.locator('[data-testid="favorite-button"]').first()
    await firstHeartButton.click()

    // Check if favorites count increased
    const favoritesButton = page.locator("text=Favorites")
    await expect(favoritesButton).toContainText("1")
  })
})
