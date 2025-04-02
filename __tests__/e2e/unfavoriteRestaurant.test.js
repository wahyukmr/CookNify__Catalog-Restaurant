import { expect } from '@playwright/test';
import { test } from '../fixtures/restaurantFixture';

test.describe('Unfavorite Restaurant Flow', () => {
  test('Should display the favorite restaurant item in the favorite page', async ({
    page,
    isMobile,
    unfavoriteRestaurant,
  }) => {
    const { firstRestaurant } = unfavoriteRestaurant;

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

    const containerElement = page.locator(
      'favorite-page list-restaurant-container #listItemContainer',
    );
    await expect(containerElement).toBeVisible();

    await containerElement.scrollIntoViewIfNeeded();

    await expect(
      containerElement.locator(`list-restaurant-items[data-id="${firstRestaurant.id}"]`),
    ).toBeVisible();
    await expect(
      containerElement.locator(`list-restaurant-items[data-id="${firstRestaurant.id}"] .sr-only`),
    ).toHaveText('This restaurant is favorited');
  });

  test('Should display the status favorited of the restaurant icon', async ({
    page,
    unfavoriteRestaurant,
  }) => {
    const { firstRestaurant } = unfavoriteRestaurant;

    const firstItemRestaurant = page.locator(
      `list-restaurant-items[data-id="${firstRestaurant.id}"]`,
    );
    await expect(firstItemRestaurant).toBeVisible();

    await firstItemRestaurant.scrollIntoViewIfNeeded();

    const restoStatusIcon = firstItemRestaurant.locator('#restoStatusIcon');
    await expect(restoStatusIcon).toBeVisible();

    await page.pause();
    await expect(restoStatusIcon.locator('.sr-only')).toHaveText('This restaurant is favorited');
  });

  test('Should display actions after the favorite button is clicked', async ({
    page,
    unfavoriteRestaurant,
  }) => {
    const { firstRestaurant } = unfavoriteRestaurant;

    const firstCardDetailsButton = page.locator(
      `list-restaurant-items[data-id="${firstRestaurant.id}"] .restaurant-item__actions .anchor`,
    );

    await firstCardDetailsButton.scrollIntoViewIfNeeded();

    await expect(firstCardDetailsButton).toBeVisible();
    await Promise.all([
      page.waitForURL(`#/resto-list/detail/${firstRestaurant.id}`),
      firstCardDetailsButton.click(),
    ]);

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(`#/resto-list/detail/${firstRestaurant.id}`);

    const detailFavoriteButton = page.locator(
      'list-restaurant-item-detail .restaurant__container .restaurant__info .restaurant__info-detail #detailFavoriteBtn',
    );
    await detailFavoriteButton.waitFor({
      state: 'visible',
      timeout: 70000,
    });

    await expect(detailFavoriteButton).toBeEnabled();

    await detailFavoriteButton.click();

    await expect(detailFavoriteButton).toBeDisabled();

    await page.waitForSelector('.notyf__message', { state: 'visible' });

    const notification = page.locator('.notyf__message');
    await expect(notification).toHaveCount(1);
    await expect(notification).toHaveText(
      'The restaurant has been removed from the favorites list',
    );

    await page.waitForSelector('.notyf__message', { state: 'hidden' });
    await expect(detailFavoriteButton).toHaveText('Favorite');
    await expect(detailFavoriteButton).toBeEnabled();
  });

  test('Should display the favorite restaurant item to the favorite list', async ({
    page,
    isMobile,
    unfavoriteRestaurant,
  }) => {
    const { firstRestaurant } = unfavoriteRestaurant;

    const firstCardDetailsButton = page.locator(
      `list-restaurant-items[data-id="${firstRestaurant.id}"] .restaurant-item__actions .anchor`,
    );

    await firstCardDetailsButton.scrollIntoViewIfNeeded();

    await expect(firstCardDetailsButton).toBeVisible();
    await Promise.all([
      page.waitForURL(`#/resto-list/detail/${firstRestaurant.id}`),
      firstCardDetailsButton.click(),
    ]);

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(`#/resto-list/detail/${firstRestaurant.id}`);

    const detailFavoriteButton = page.locator(
      'list-restaurant-item-detail .restaurant__container .restaurant__info .restaurant__info-detail #detailFavoriteBtn',
    );
    await detailFavoriteButton.waitFor({
      state: 'visible',
      timeout: 70000,
    });

    await detailFavoriteButton.click();

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

    const containerElement = page.locator(
      'favorite-page list-restaurant-container #listItemContainer',
    );
    await expect(containerElement).toBeVisible();

    await containerElement.scrollIntoViewIfNeeded();

    const message = page.locator('message-section .message__content');
    await expect(message).toBeVisible();
    await expect(message).toContainText('No saved list of favorite restaurants');
  });
});
