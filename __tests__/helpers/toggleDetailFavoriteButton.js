export const toggleDetailFavoriteButton = async (page) => {
  await page.waitForSelector('#detailFavoriteBtn', { state: 'visible' });

  const detailFavoriteButton = page.locator('#detailFavoriteBtn');

  await detailFavoriteButton.click();

  return detailFavoriteButton;
};
