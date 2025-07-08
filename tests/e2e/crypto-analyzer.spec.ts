import { test, expect } from '@playwright/test';

test.describe('Crypto Analyzer App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check that the main heading is visible (there are two headings, be specific)
    await expect(page.getByRole('heading', { name: '📈 Crypto Analyzer' })).toBeVisible();

    // Check that the search input is present
    await expect(page.getByRole('textbox', { name: /search cryptocurrencies/i })).toBeVisible();

    // Check that the table is present (might be loading initially)
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should display cryptocurrency list', async ({ page }) => {
    await page.goto('/');

    // Wait for the coin list to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Check that we have at least one cryptocurrency row
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Check that the first row has expected columns
    const firstRow = rows.first();
    await expect(firstRow.locator('td').nth(0)).toBeVisible(); // Rank
    await expect(firstRow.locator('td').nth(1)).toBeVisible(); // Name
    await expect(firstRow.locator('td').nth(2)).toBeVisible(); // Price
    await expect(firstRow.locator('td').nth(3)).toBeVisible(); // Volume
    await expect(firstRow.locator('td').nth(4)).toBeVisible(); // Actions
  });

  test('should allow searching for cryptocurrencies', async ({ page }) => {
    await page.goto('/');

    // Wait for the coin list to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Get the search input
    const searchInput = page.getByRole('textbox', { name: /search cryptocurrencies/i });

    // Search for Bitcoin
    await searchInput.fill('bitcoin');

    // Wait for the filtered results
    await page.waitForTimeout(500);

    // Check that the results contain Bitcoin
    await expect(page.getByText('Bitcoin')).toBeVisible();

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Check that more cryptocurrencies are shown again
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1);
  });

  test('should navigate to coin history page', async ({ page }) => {
    await page.goto('/');

    // Wait for the coin list to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Click on the first "View History" link
    const firstHistoryLink = page.getByRole('link', { name: /view historical data/i }).first();
    await firstHistoryLink.click();

    // Should navigate to a coin history page
    await expect(page).toHaveURL(/\/coins\/[^/]+\/history/);

    // Check that we're on the history page
    await expect(page.getByRole('heading', { name: /historical data/i })).toBeVisible();

    // Check that the form is present
    await expect(page.getByText(/select a date range and interval/i)).toBeVisible();
  });

  test('should display dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Check that theme toggle is visible
    await expect(page.getByRole('button', { name: /toggle theme/i })).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');

    // Get the current theme (check html class)
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');

    // Click the theme toggle
    await page.getByRole('button', { name: /toggle theme/i }).click();

    // Wait for theme change
    await page.waitForTimeout(500);

    // Check that the theme has changed
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('should handle navigation with keyboard', async ({ page }) => {
    await page.goto('/');

    // Wait for the coin list to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Focus the search input directly
    await page.getByRole('textbox', { name: /search cryptocurrencies/i }).focus();

    // The search input should be focused
    await expect(page.getByRole('textbox', { name: /search cryptocurrencies/i })).toBeFocused();

    // Type something
    await page.keyboard.type('bitcoin');

    // Wait for filtering
    await page.waitForTimeout(500);

    // Should show filtered results
    await expect(page.getByText('Bitcoin')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/');

    // Wait for initial load
    await page.waitForLoadState('domcontentloaded');

    // Block API requests (not all requests, just external API)
    await page.route('**/api.coingecko.com/**', (route) => route.abort());

    // Reload to trigger error
    await page.reload();

    // Should show fallback data (our mock data)
    await expect(page.getByText('Bitcoin')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check for main landmarks
    await expect(page.getByRole('main')).toBeVisible();

    // Check for proper form labels
    await expect(page.getByRole('textbox', { name: /search cryptocurrencies/i })).toBeVisible();

    // Check for table accessibility
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /name/i })).toBeVisible();

    // Check for button accessibility
    await expect(page.getByRole('button', { name: /toggle theme/i })).toBeVisible();
  });

  test('should be navigable with keyboard only', async ({ page }) => {
    await page.goto('/');

    // Wait for content to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Focus the search input directly
    await page.getByRole('textbox', { name: /search cryptocurrencies/i }).focus();

    // Should be able to reach the search input
    await expect(page.getByRole('textbox', { name: /search cryptocurrencies/i })).toBeFocused();

    // Continue tabbing to links
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to reach actionable elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
