import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  getFirstRestaurantId: async ({ page }, use) => {
    await page.goto('/#/resto-list');
    await page.waitForLoadState('domcontentloaded');

    const itemContainer = page.locator(
      'resto-list-page list-restaurant-container #listItemContainer',
    );
    await expect(itemContainer).toBeVisible();

    await itemContainer.scrollIntoViewIfNeeded();

    const restoItems = itemContainer.locator('list-restaurant-items');
    const restoFirstItem = restoItems.first();
    await expect(restoFirstItem).toBeVisible();

    const detailLink = restoFirstItem.locator('.restaurant-item__actions .anchor');
    await expect(detailLink).toBeVisible();

    const href = await detailLink.getAttribute('href');
    if (!href) {
      throw new Error('href not found on the detail link');
    }

    const restaurantId = href.split('/').pop();
    if (!restaurantId) {
      throw new Error('Failed to extract restaurant ID from href');
    }

    await use(() => Promise.resolve(restaurantId));
  },
});
