import { test, expect } from '@playwright/test';

test.describe('Favorite and Unfavorite Restaurant Flow', () => {
  test('Navigate from Hero Section to Resto List Page', async ({ page }) => {
    await page.goto('/');
    const heroCtaBtn = page.locator('#heroCtaBtn');
    await expect(heroCtaBtn).toHaveText('Explore Now');
    await heroCtaBtn.click();
    await expect(page).toHaveURL('#/resto-list');
  });
});
