import { expect } from '@playwright/test';

const navigateFromHeroToRestoList = async (page) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  const shadowHost = page.locator('home-page');
  const heroSection = shadowHost.locator('hero-section');

  const heroCtaBtn = heroSection.locator('#heroCtaBtn');
  await expect(heroCtaBtn).toBeVisible();

  await expect(heroCtaBtn).toHaveText('Explore Now');
  await expect(heroCtaBtn).toHaveAttribute('href', '#/resto-list');

  await heroCtaBtn.click();

  await expect(page).toHaveURL('#/resto-list');
};

const navigateToRestaurantDetail = async (page, getFirstRestaurantId) => {
  const restaurantId = await getFirstRestaurantId();
  await page.goto(`/#/resto-list/detail/${restaurantId}`);
  await page.waitForLoadState('domcontentloaded');
};

export { navigateFromHeroToRestoList, navigateToRestaurantDetail };
