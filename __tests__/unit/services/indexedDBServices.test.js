import { createIndexedDBService, itActsAsFavoriteRestaurantModel } from '../../helpers';

describe('Favorite Restaurant IndexedDB Contract Test Implementation', () => {
  let indexedDBService;

  beforeEach(() => {
    indexedDBService = createIndexedDBService();
  });

  afterEach(async () => {
    const restaurants = await indexedDBService.getAll();
    await Promise.all(restaurants.map((restaurant) => indexedDBService.delete(restaurant.id)));
  });

  itActsAsFavoriteRestaurantModel(() => indexedDBService);
});
