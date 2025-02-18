import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  getFirstRestaurantId: async ({ page }, use) => {
    await page.goto('/#/resto-list');
    await page.waitForLoadState('networkidle');

    const firstRestaurant = page.locator(
      'resto-list-page list-restaurant-container #listItemContainer list-restaurant-items:first-child',
    );

    await expect(firstRestaurant).toBeVisible();

    const detailLink = firstRestaurant.locator('.restaurant-item__actions .anchor');
    await expect(detailLink).toBeVisible();

    const href = await detailLink.getAttribute('href');
    if (!href) throw new Error('Error: Tidak dapat menemukan atribut href dari detail link');

    const restaurantId = href.split('/').pop();
    if (!restaurantId) throw new Error('Error: Gagal mengekstrak ID restoran dari href');

    await use(restaurantId);
  },
});
