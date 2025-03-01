export const toggleDetailFavoriteButton = async (page) => {
  const detailFavoriteButton = page.locator('#detailFavoriteBtn');

  await detailFavoriteButton.waitFor({ state: 'visible', timeout: 60000 });

  await detailFavoriteButton.click();

  return detailFavoriteButton;
};
