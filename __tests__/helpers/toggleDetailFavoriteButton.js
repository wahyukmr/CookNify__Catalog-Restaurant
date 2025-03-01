export const toggleDetailFavoriteButton = async (page) => {
  const detailFavoriteButton = page.locator('#detailFavoriteBtn');
  await page.waitForSelector(detailFavoriteButton, { state: 'visible' });

  await detailFavoriteButton.click();

  return detailFavoriteButton;
};
