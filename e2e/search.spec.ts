import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform debounced search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search content..."]');

    // Type quickly
    await searchInput.type('tech', { delay: 50 });

    // Should not search immediately
    await page.waitForTimeout(200);
    await expect(page.locator('h2')).not.toContainText('Search Results');

    // Wait for debounce
    await page.waitForTimeout(400);
    await expect(page.locator('h2')).toContainText('Search Results');
  });

  test('should clear search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search content..."]');

    await searchInput.fill('technology');
    await page.waitForTimeout(500);
    await expect(page.locator('h2')).toContainText('Search Results');

    await searchInput.clear();
    await page.waitForTimeout(500);
    await expect(page.locator('h2')).toContainText('Your Personalized Feed');
  });

  test('should show no results message for invalid search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search content..."]');

    await searchInput.fill('xyzabc123nonexistent');
    await page.waitForTimeout(500);

    await expect(page.locator('text=No results found')).toBeVisible();
  });
});
