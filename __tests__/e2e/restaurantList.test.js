import { expect } from '@playwright/test';
import { test } from '../fixtures/restaurantFixture';
import { navigateFromHeroToRestoList } from '../helpers';

test.describe('Restaurant List Page', async () => {
  test('Should display list of restaurants', async ({ page, restaurantList }) => {
    const { firstRestaurant } = restaurantList;

    await navigateFromHeroToRestoList(page);

    const itemContainer = page.locator(
      'resto-list-page list-restaurant-container #listItemContainer',
    );
    await expect(itemContainer).toBeVisible();

    await itemContainer.scrollIntoViewIfNeeded();

    const restoItems = itemContainer.locator('list-restaurant-items');
    await expect.poll(async () => restoItems.count()).toBeGreaterThan(0);

    const firstItemRestaurant = page.locator(
      `list-restaurant-items[data-id="${firstRestaurant.id}"]`,
    );
    await expect(firstItemRestaurant).toBeVisible();
  });

  test('Each restaurant item should have correct elements', async ({ page, restaurantList }) => {
    const { firstRestaurant } = restaurantList;

    await navigateFromHeroToRestoList(page);

    const itemContainer = page.locator(
      'resto-list-page list-restaurant-container #listItemContainer',
    );
    await expect(itemContainer).toBeVisible();

    await itemContainer.scrollIntoViewIfNeeded();

    const firstItemRestaurant = page.locator(
      `list-restaurant-items[data-id="${firstRestaurant.id}"]`,
    );
    await expect(firstItemRestaurant).toBeVisible();

    await expect(firstItemRestaurant.locator('.restaurant-item__picture')).toBeVisible();
    await expect(firstItemRestaurant.locator('.restaurant-item__favorite')).toBeVisible();
    await expect(firstItemRestaurant.locator('.restaurant-item__content')).not.toBeEmpty();
  });

  test('Should navigate to restaurant detail page when action button clicked', async ({
    page,
    restaurantList,
  }) => {
    const { firstRestaurant } = restaurantList;

    await navigateFromHeroToRestoList(page);

    const itemContainer = page.locator(
      'resto-list-page list-restaurant-container #listItemContainer',
    );
    await expect(itemContainer).toBeVisible();

    await itemContainer.scrollIntoViewIfNeeded();

    const firstCardDetailsButton = page.locator(
      `list-restaurant-items[data-id="${firstRestaurant.id}"] .restaurant-item__actions .anchor`,
    );
    await expect(firstCardDetailsButton).toBeVisible();
    await firstCardDetailsButton.click();

    await page.waitForURL(`#/resto-list/detail/${firstRestaurant.id}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page).toHaveURL(`#/resto-list/detail/${firstRestaurant.id}`);
  });
});
