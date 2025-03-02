import { createIndexedDBService } from './createIndexedDBService';
import { navigateFromHeroToRestoList } from './pageNavigation';
import { setupDomFavoriteAndUnfavoriteResto } from './setupDomFavoriteAndUnfavoriteResto';
import { setupMockFavoriteAndUnfavoriteResto } from './setupMockFavoriteAndUnfavoriteResto';
import { itActsAsFavoriteRestaurantModel } from './testFactories';

export {
  createIndexedDBService,
  itActsAsFavoriteRestaurantModel,
  navigateFromHeroToRestoList,
  setupDomFavoriteAndUnfavoriteResto,
  setupMockFavoriteAndUnfavoriteResto,
};
