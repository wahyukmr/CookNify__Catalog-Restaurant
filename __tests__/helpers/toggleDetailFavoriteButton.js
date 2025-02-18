export const toggleDetailFavoriteButton = async (page) => {
  const detailFavoriteButton = page.locator('#detailFavoriteBtn');
  await expect(detailFavoriteButton).toBeVisible();

  await detailFavoriteButton.click();

  return detailFavoriteButton;
};
