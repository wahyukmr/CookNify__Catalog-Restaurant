export const toggleDetailFavoriteButton = async (page) => {
  const listRestaurantItemDetail = page.locator('list-restaurant-item-detail');
  await listRestaurantItemDetail.waitFor();

  const detailFavoriteButton = page.locator('#detailFavoriteBtn');

  await detailFavoriteButton.scrollIntoViewIfNeeded();

  await detailFavoriteButton.click();

  return detailFavoriteButton;
};
