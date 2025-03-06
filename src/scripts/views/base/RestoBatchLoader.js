import { showErrorNotification } from '../../../utils';

export default class RestoBatchLoader {
  constructor(renderer) {
    this._renderer = renderer;
    this.restaurants = [];
  }

  initialize() {
    this.cardWidth = 300;

    this.updateViewportSize();

    this.numberOfItemsRendered = 0;
    this.remainingItemsToTheLastItem = 0;
    this.indexItemByClickingBtn = 0;
    this.scrollByButton = false;
    this.scrollDistanceToLastItemInView = 0;

    this._observer = this._createIntersectionObserver();
  }

  updateViewportSize() {
    requestAnimationFrame(() => {
      const container = this._renderer.elements.listRestaurantContainer;
      if (container) {
        this._viewportWidth = container.offsetWidth || container.getBoundingClientRect().width;

        if (this._viewportWidth === 0) {
          showErrorNotification('Container width has not been obtained.');
        }

        this.itemsInView = Math.round(this._viewportWidth / this.cardWidth);
        this.itemsRenderedInView = Math.ceil(this._viewportWidth / this.cardWidth);
        this.indexItemByScrolled = this.itemsInView;
      }
    });
  }

  setRestaurants(restaurants) {
    this.restaurants = restaurants;
  }

  renderInitialBatch() {
    const initialBatch = this.restaurants.slice(0, this.itemsInView);
    this._renderBatch(initialBatch);
    if (this.itemsInView < this.restaurants.length) {
      this._appendSentinel();
    }
  }

  _renderBatch(batch) {
    batch.forEach((restaurant) => {
      this._renderer.renderItem(restaurant, 'list-restaurant-items');
    });
  }

  nextBatch() {
    this.indexItemByClickingBtn = Math.min(
      this.indexItemByClickingBtn + this.itemsInView,
      this.restaurants.length - (this.restaurants.length % this.itemsInView),
    );
    this.scrollDistanceToLastItemInView =
      this._renderer.elements.listItemContainer.scrollLeft +
      this.cardWidth * (this.itemsInView - this.remainingItemsToTheLastItem);
    this.scrollByButton = this.remainingItemsToTheLastItem !== 0 ? false : true;
    this.remainingItemsToTheLastItem = 0;
  }

  prevBatch() {
    const lastBatchIndex = Math.min(
      this.restaurants.length - this.indexItemByClickingBtn,
      this.itemsInView,
    );
    this.indexItemByClickingBtn = Math.max(this.indexItemByClickingBtn - this.itemsInView, 0);
    this.scrollDistanceToLastItemInView =
      this._renderer.elements.listItemContainer.scrollLeft - this.cardWidth * lastBatchIndex;
    this.remainingItemsToTheLastItem = 0;
    this.scrollByButton = false;
  }

  canNavigateLeft() {
    return (
      (this.indexItemByClickingBtn > 0 && this.numberOfItemsRendered > 0) ||
      this.numberOfItemsRendered > 0
    );
  }

  canNavigateRight() {
    return (
      (this.indexItemByClickingBtn + this.itemsInView < this.restaurants.length &&
        this.numberOfItemsRendered + this.itemsInView < this.restaurants.length) ||
      this.numberOfItemsRendered + this.itemsInView < this.restaurants.length
    );
  }

  _createIntersectionObserver() {
    const root = this._renderer.elements.listItemContainer;
    if (!root) {
      showErrorNotification('Root container for IntersectionObserver is not found.');
    }
    return new IntersectionObserver(this._onIntersect.bind(this), {
      root,
      threshold: 0.05,
    });
  }

  _onIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this._observer.unobserve(entry.target);
        entry.target.remove();
        this._handleIntersection();
      }
    });
  }

  _handleIntersection() {
    if (this.scrollByButton) {
      const nextBatch = this.restaurants.slice(
        this.indexItemByClickingBtn,
        this.indexItemByClickingBtn + this.itemsInView,
      );
      this._renderBatch(nextBatch);

      this._renderer.elements.listItemContainer.scrollTo({
        left: this.scrollDistanceToLastItemInView,
        behavior: 'instant',
      });

      if (
        this.indexItemByClickingBtn + this.itemsInView <= this.restaurants.length &&
        this.indexItemByScrolled < this.restaurants.length
      ) {
        this._appendSentinel();
      }

      this.indexItemByScrolled = Math.min(
        this.indexItemByScrolled + this.itemsInView,
        this.restaurants.length,
      );

      this.scrollByButton = false;
    } else {
      const nextBatch = this.restaurants.slice(
        this.indexItemByScrolled,
        this.indexItemByScrolled + this.itemsInView,
      );
      this._renderBatch(nextBatch);
      if (this.indexItemByScrolled + this.itemsInView <= this.restaurants.length) {
        this._appendSentinel();
      }

      this.indexItemByClickingBtn = Math.min(
        this.indexItemByScrolled - this.itemsInView,
        this.restaurants.length - (this.restaurants.length % this.itemsInView),
      );
      this.indexItemByScrolled = Math.min(
        this.indexItemByScrolled + this.itemsInView,
        this.restaurants.length,
      );
    }
  }

  _appendSentinel() {
    const sentinel = this._renderer.createSentinelElement();

    requestAnimationFrame(() => {
      this._observer.observe(sentinel);
    });
  }
}
