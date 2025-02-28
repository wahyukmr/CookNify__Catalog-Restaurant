import { showErrorNotification } from '../../utils';

export default class RestoListController {
  constructor({ model, view }) {
    this._restoListModel = model;
    this._restoListView = view;

    this._restoListView.bindSearchInput(this._handleSearchInput.bind(this));
    this._restoListView.bindFilterSelection(this._handleFilterSelection.bind(this));
    this._restoListView.bindKeyboardNavigation(this._handleFilterSelection.bind(this));
  }

  async init() {
    try {
      this._restoListView.renderLoader();

      await this._restoListModel.getRestaurantList();
      const listRestaurants = this._restoListModel.listRestaurants;
      this._restoListView.renderRestaurantItems(listRestaurants);
    } catch (error) {
      showErrorNotification(`${error.message}`);
      this._restoListView.renderFallback('Unable to find any restaurants.');
      this._restoListView.buttonsStateUpdate();
    }
  }

  _handleSearchInput(query) {
    this._restoListView.renderLoader();

    this._restoListModel.searchRestaurants(query);
    const searchResult = this._restoListModel.searchResult;

    searchResult.length > 0
      ? this._restoListView.renderRestaurantItems(searchResult)
      : this._restoListView.renderFallback(
          'Unable to find a restaurant matching the provided input.',
          searchResult,
        );
  }

  _handleFilterSelection(filterValue, contentOfSelectedValue) {
    this._restoListView.renderLoader();

    let filterdResult;

    if (filterValue === 'all') {
      filterdResult = this._restoListModel.listRestaurants;
    } else {
      const numberOfFilteredValue = +filterValue;

      this._restoListModel.filterRestaurants(numberOfFilteredValue);
      filterdResult = this._restoListModel.filteredRestaurants;
    }
    this._restoListView.renderRestaurantItems(filterdResult);

    if (filterdResult.length === 0 && this._restoListModel.searchResult.length === 0) {
      this._restoListView.renderFallback(
        `Unable to find any restaurants with a rating of ${contentOfSelectedValue}.`,
        filterdResult,
      );
    }

    if (filterdResult.length === 0 && this._restoListModel.searchResult.length > 0) {
      this._restoListView.renderFallback(
        "Sorry, we couldn't find any restaurants that match your search. Try using different keywords or adjusting your rating filter.",
        filterdResult,
      );
    }
  }
}
