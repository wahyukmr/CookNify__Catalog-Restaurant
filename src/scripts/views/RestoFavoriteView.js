import {
  RestoBatchLoader,
  RestoViewRenderer,
  RestoBaseView,
  RestoItemNavigationController,
} from './base';

export default class RestoFavoriteView extends RestoBaseView {
  constructor(restoFavoritePage) {
    const renderer = new RestoViewRenderer(restoFavoritePage);
    const itemNavigation = new RestoItemNavigationController(renderer.elements);
    const batchLoader = new RestoBatchLoader(renderer);

    super({ renderer, itemNavigation, batchLoader });
    this.initializeRestoListEvents();
  }
}
