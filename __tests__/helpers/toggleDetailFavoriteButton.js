export const toggleDetailFavoriteButton = async (page) => {
  const detailFavoriteButton = page.locator('#detailFavoriteBtn');
  await detailFavoriteButton.click();
  return detailFavoriteButton;
};
