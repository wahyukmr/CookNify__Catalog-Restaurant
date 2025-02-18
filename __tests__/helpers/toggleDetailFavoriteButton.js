export const toggleDetailFavoriteButton = async (page) => {
  const detailFavoriteButton = page.locator('#detailFavoriteBtn');
  await expect(detailFavoriteButton).toBeVisible();

  await test.step('Clicking the detail favorite button', async () => {
    await detailFavoriteButton.click();
  });

  return detailFavoriteButton;
};
