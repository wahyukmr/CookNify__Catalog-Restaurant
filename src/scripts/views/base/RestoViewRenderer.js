import { DomHandlerNestedSelectors } from '../../../utils/DomHandlerNestedSelectors';

export default class RestoViewRenderer {
  constructor(rootContainer) {
    this.elements = new DomHandlerNestedSelectors(
      rootContainer.shadowRoot,
      {
        detailItemContainer: '#restaurantDetailContainer',
        listRestaurantContainer: 'list-restaurant-container!',
        listItemContainer: 'list-restaurant-container >> #listItemContainer',
        prevButton: 'list-restaurant-container >> #btnLeft',
        nextButton: 'list-restaurant-container >> #btnRight',
      },
      false,
    ).elements;

    this.currentRootContainer =
      this.elements.listItemContainer || this.elements.detailItemContainer;
  }

  clearContainer(rootContainerElement = this.elements.listItemContainer) {
    rootContainerElement.innerHTML = '';
  }

  createFallbackElement(message, rootContainerElement = this.elements.listItemContainer) {
    const messageElement = this._createMessageSection(message);
    rootContainerElement.appendChild(messageElement);
  }

  createLoaderElement(rootContainerElement = this.elements.listItemContainer) {
    const loaderElement = this._createLoaderSection();
    rootContainerElement.appendChild(loaderElement);
  }

  renderItem(dataRestaurants, targetElement) {
    const restaurantItem = this._createRestaurantItem(dataRestaurants, targetElement);
    this.elements.listItemContainer.appendChild(restaurantItem);
  }

  createSentinelElement() {
    const sentinel = document.createElement('div');
    sentinel.className = 'sentinel';
    this.elements.listItemContainer.appendChild(sentinel);
    return sentinel;
  }

  _createRestaurantItem(dataRestaurant, targetElement) {
    const restoItem = document.createElement(targetElement);
    restoItem.dataset.id = dataRestaurant.id;
    restoItem.dataRestaurant = dataRestaurant;
    return restoItem;
  }

  _createMessageSection(message) {
    const messageElement = document.createElement('message-section');
    messageElement.textMessage = message;
    return messageElement;
  }

  _createLoaderSection() {
    return document.createElement('loader-section');
  }
}
