import { test as baseTest, expect } from '@playwright/test';
import { navigateFromHeroToRestoList, toggleDetailFavoriteButton } from '../helpers';

import { test } from '../fixtures/favoriteRestaurantFixture';
import { navigateToRestaurantDetail } from '../helpers/pageNavigation';

baseTest.describe('Favorite Restaurant Flow', () => {
  baseTest.describe('without fixtures', () => {
    baseTest(
      'Should navigate from Hero Section to Resto List Page when clicking Hero Section CTA',
      async ({ page }) => {
        await navigateFromHeroToRestoList(page);
      },
    );
  });

  test.describe('with fixtures', () => {
    test.beforeEach(async ({ page, getFirstRestaurantId }) => {
      await navigateToRestaurantDetail(page, getFirstRestaurantId);

      await toggleDetailFavoriteButton(page);

      await page.waitForSelector('.notyf__message', { state: 'visible' });
      await page.waitForSelector('.notyf__message', { state: 'hidden' });
    });

    test('Should display restaurant list and navigate to restaurant detail when clicking a restaurant card', async ({
      page,
    }) => {
      await page.goto('/#/resto-list');
      await page.waitForLoadState('networkidle');

      const itemContainer = page.locator(
        'resto-list-page list-restaurant-container #listItemContainer',
      );
      await expect(itemContainer).toBeVisible();

      await itemContainer.scrollIntoViewIfNeeded();

      const restoItems = itemContainer.locator('list-restaurant-items');
      await expect(restoItems).toBeVisible();

      const restoFirstItem = restoItems.first();
      await expect(restoFirstItem).toBeVisible();

      const restoLastItem = restoItems.last();
      await restoLastItem.scrollIntoViewIfNeeded();
      expect(restoItems.last()).not.toBe(restoLastItem);

      const restoStatusIcon = restoFirstItem.locator('#restoStatusIcon');
      await expect(restoStatusIcon).toBeVisible();
      await expect(restoStatusIcon.locator('.sr-only')).toHaveText('This restaurant is favorited');

      const firstCardDetailsButton = restoFirstItem.locator('.restaurant-item__actions .anchor');
      await expect(firstCardDetailsButton).toBeVisible();
      await firstCardDetailsButton.click();

      const restaurantDetailRegex = new RegExp('#/resto-list/detail/\\w+');
      await expect(page).toHaveURL(restaurantDetailRegex);
    });

    test('Should add a restaurant to favorites and show success notification', async ({
      page,
      getFirstRestaurantId,
    }) => {
      await navigateToRestaurantDetail(page, getFirstRestaurantId);

      const detailFavoriteButton = await toggleDetailFavoriteButton(page);

      await expect(detailFavoriteButton).toBeDisabled();

      await page.waitForSelector('.notyf__message', { state: 'visible' });

      const notification = page.locator('.notyf__message').last();
      await expect(notification).toHaveCount(1);
      await expect(notification).toHaveText(
        'The restaurant has been removed from the favorites list',
      );

      await page.waitForSelector('.notyf__message', {
        state: 'hidden',
      });
      await expect(detailFavoriteButton).toHaveText('Favorite');
      await expect(detailFavoriteButton).toBeEnabled();
    });

    test('Should display favorited restaurant in the favorite list', async ({
      page,
      isMobile,
      getFirstRestaurantId,
    }) => {
      await navigateToRestaurantDetail(page, getFirstRestaurantId);

      await toggleDetailFavoriteButton(page);

      await page.waitForSelector('.notyf__message', { state: 'visible' });
      await page.waitForSelector('.notyf__message', { state: 'hidden' });

      if (isMobile) {
        const buttonOpenNavMenu = page.locator('header-component navigation-menu #btnOpen');
        if (await buttonOpenNavMenu.isVisible()) {
          await buttonOpenNavMenu.click();
        }
      }

      const favoriteNavButton = page.locator('a[href="#/favorite"]');
      await expect(favoriteNavButton).toBeVisible();
      await favoriteNavButton.click();

      await expect(page).toHaveURL(/#\/favorite/);
      await page.waitForLoadState('domcontentloaded');

      const itemContainer = page.locator(
        'favorite-page list-restaurant-container #listItemContainer',
      );
      await expect(itemContainer).toBeVisible();

      await itemContainer.scrollIntoViewIfNeeded();

      const message = page.locator('message-section .message__content');
      await expect(message).toBeVisible();
      await expect(message).toContainText('No saved list of favorite restaurants');
    });
  });
});
