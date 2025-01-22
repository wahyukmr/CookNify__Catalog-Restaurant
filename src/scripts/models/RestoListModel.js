/* eslint-disable no-useless-catch */
import { API_ENPOINTS } from '../../config/constants';
import { ajax } from '../../services/apiServices';

export default class RestoListModel {
  constructor(indexedDBService) {
    this._indexedDBService = indexedDBService;
    this.listRestaurants = [];
    this.filteredRestaurants = [];
    this.searchResult = [];
  }

  async getRestaurantList() {
    try {
      const fetchedData = await ajax(API_ENPOINTS.RESTO_LIST);

      if (fetchedData.error) {
        throw new Error('Failed to get a list of restaurants');
      }

      this.listRestaurants = await Promise.all(
        fetchedData?.restaurants.map(async (restaurant) => {
          const isFavorited = await this._indexedDBService.get(restaurant.id);
          return {
            ...restaurant,
            favorited: !!isFavorited,
          };
        }),
      );
      this.filteredRestaurants = [...this.listRestaurants];
    } catch (error) {
      throw error;
    }
  }

  filterRestaurants(rating) {
    const filterByRating = (restaurant) =>
      rating === 2 ? restaurant.rating <= rating : restaurant.rating >= rating;

    if (this.searchResult.length > 0) {
      this.filteredRestaurants = this.searchResult.filter(filterByRating);
    } else {
      this.filteredRestaurants = this.listRestaurants.filter(filterByRating);
    }
  }

  searchRestaurants(query) {
    const lowerQuery = query.toLowerCase();
    const matchesQuery = (text) => text?.toLowerCase().includes(lowerQuery);

    this.searchResult = this.listRestaurants.filter((restaurant) => {
      const matchRestoName = matchesQuery(restaurant.name);
      const matchRestoCategory = restaurant.categories?.some((category) =>
        matchesQuery(category.name),
      );
      const matchRestoMenu =
        restaurant.menus?.foods?.some((food) => matchesQuery(food.name)) ||
        restaurant.menus?.drinks?.some((drink) => matchesQuery(drink.name));

      return matchRestoName || matchRestoCategory || matchRestoMenu;
    });
  }
}
