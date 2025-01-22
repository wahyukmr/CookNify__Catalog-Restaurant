export default class RestoFavoriteModel {
  constructor(indexedDBServices) {
    this._indexedDB = indexedDBServices;
  }

  async getListFavoriteRestaurants() {
    try {
      const listFavoriteRestaurants = await this._indexedDB.getAll();

      return await Promise.all(
        listFavoriteRestaurants?.map(async (restaurant) => ({
          ...restaurant,
          favorited: true,
        })),
      );
    } catch (error) {
      const errorMessage = error.status
        ? `Failed to get list favorite restaurants: ${error.status}`
        : 'Failed to get list favorite restaurants';
      throw new Error(errorMessage);
    }
  }
}
