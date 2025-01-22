import { showErrorNotification } from '../../utils';

export default class RestoFavoriteController {
  constructor({ model, view }) {
    this._restoFavoriteModel = model;
    this._restoFavoriteView = view;
  }

  async init() {
    try {
      this._restoFavoriteView.renderLoader();

      const listFavoriteRestaurants = await this._restoFavoriteModel.getListFavoriteRestaurants();

      if (listFavoriteRestaurants.length > 0) {
        this._restoFavoriteView.renderRestaurantItems(listFavoriteRestaurants);
      } else {
        this._restoFavoriteView.renderFallback('No saved list of favorite restaurants');
      }
    } catch (error) {
      showErrorNotification(`${error.message}`);
      this._restoFavoriteView.renderFallback('Failed to get list favorite restaurants');
    }
  }
}
