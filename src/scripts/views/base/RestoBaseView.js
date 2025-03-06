import { debounce } from '../../../utils';

export default class RestoBaseView {
  constructor({ renderer, itemNavigation, batchLoader }) {
    this.renderer = renderer;
    this.itemNavigation = itemNavigation;
    this.batchLoader = batchLoader;
  }

  initializeRestoListEvents() {
    this.itemNavigation.initialize(
      this.debouncedResizeHandler.bind(this),
      this.handleScrollByButton.bind(this),
      this.handleScrollEvent.bind(this),
      this.buttonsStateUpdate.bind(this),
    );
    this.batchLoader.initialize();
  }

  renderFallback(message, restaurant = [], rootContainerElement) {
    this.renderer.clearContainer();
    this.batchLoader.setRestaurants(restaurant);
    this.renderer.createFallbackElement(message, rootContainerElement);
  }

  renderLoader(rootContainerElement) {
    this.renderer.clearContainer(rootContainerElement);
    this.renderer.createLoaderElement(rootContainerElement);
  }

  renderRestaurantItems(restaurants) {
    this.renderer.clearContainer();
    this.batchLoader.setRestaurants(restaurants);

    if (restaurants.length > 0) {
      this.batchLoader.renderInitialBatch();
    }

    this.buttonsStateUpdate();
  }

  debouncedResizeHandler() {
    debounce(this._handleResizeViewport, 200);
  }

  handleScrollByButton(direction) {
    if (this.batchLoader.remainingItemsToTheLastItem === 0) {
      this.batchLoader.scrollByButton = true;
    }

    if (direction === 'right') {
      this.batchLoader.nextBatch();
    } else if (direction === 'left') {
      this.batchLoader.prevBatch();
    }

    this.renderer.elements.listItemContainer.scrollTo({
      left: this.batchLoader.scrollDistanceToLastItemInView,
      behavior: 'smooth',
    });

    if (this.batchLoader.indexItemByClickingBtn >= this.batchLoader.restaurants.length) {
      this.batchLoader.scrollByButton = false;
    }

    this.buttonsStateUpdate();
  }

  handleScrollEvent() {
    if (this._isScrollListenerAttached) return;
    this._isScrollListenerAttached = true;

    requestAnimationFrame(() => {
      this.batchLoader.numberOfItemsRendered = Math.floor(
        this.renderer.elements.listItemContainer.scrollLeft / this.batchLoader.cardWidth,
      );
      this.batchLoader.remainingItemsToTheLastItem =
        Math.floor(
          this.renderer.elements.listItemContainer.scrollLeft / this.batchLoader.cardWidth,
        ) % this.batchLoader.itemsInView;
      this.buttonsStateUpdate();
      this._isScrollListenerAttached = false;
    });
  }

  buttonsStateUpdate() {
    this.itemNavigation.updateButtonsState(
      this.batchLoader.canNavigateLeft(),
      this.batchLoader.canNavigateRight(),
    );
  }

  _handleResizeViewport() {
    this.batchLoader.updateViewportSize();
  }
}
