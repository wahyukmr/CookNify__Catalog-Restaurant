import { createIndexedDBService } from './createIndexedDBService';
import { navigateFromHeroToRestoList } from './pageNavigation';
import { setupDomFavoriteAndUnfavoriteResto } from './setupDomFavoriteAndUnfavoriteResto';
import { setupMockFavoriteAndUnfavoriteResto } from './setupMockFavoriteAndUnfavoriteResto';
import { itActsAsFavoriteRestaurantModel } from './testFactories';
import { toggleDetailFavoriteButton } from './toggleDetailFavoriteButton';

export {
  toggleDetailFavoriteButton,
  navigateFromHeroToRestoList,
  createIndexedDBService,
  itActsAsFavoriteRestaurantModel,
  setupDomFavoriteAndUnfavoriteResto,
  setupMockFavoriteAndUnfavoriteResto,
};
