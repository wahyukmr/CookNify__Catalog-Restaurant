import { showErrorNotification } from '../../../utils';

export default class RestoBatchLoader {
  constructor(renderer) {
    this._renderer = renderer;

    this.restaurants = [];
  }

  initialize() {
    this.updateViewportSize();
    this.indexOfClickingBtn = 0;
    this.cardWidth = 300;
    this.newIndex = 0;
    this.scrollByButton = false;
    this.currentScrollDistanceLeft = 0;
    this.currentIndexItem = 0;

    this._observer = this._createIntersectionObserver();
  }

  updateViewportSize() {
    this._viewportWidth = this._renderer.elements.listRestaurantContainer?.offsetWidth || 0;
    this.itemsInView = Math.round(this._viewportWidth / this.cardWidth);
    this.indexOfScrollingView = this.itemsInView;
  }

  setRestaurants(restaurants) {
    this.restaurants = restaurants;
  }

  renderInitialBatch() {
    this.indexOfClickingBtn = 0;
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
    this.indexOfClickingBtn = Math.min(
      this.indexOfClickingBtn + this.itemsInView,
      this.restaurants.length - (this.restaurants.length % this.itemsInView),
    );
    this.currentScrollDistanceLeft =
      this._renderer.elements.listItemContainer.scrollLeft +
      this.cardWidth * (this.itemsInView - this.newIndex);
    this.newIndex = 0;
  }

  prevBatch() {
    const lastBatchIndex = Math.min(
      this.restaurants.length - this.indexOfClickingBtn,
      this.itemsInView,
    );
    this.indexOfClickingBtn = Math.max(this.indexOfClickingBtn - this.itemsInView, 0);
    this.currentScrollDistanceLeft =
      this._renderer.elements.listItemContainer.scrollLeft - this.cardWidth * lastBatchIndex;
    this.newIndex = 0;
    this.scrollByButton = false;
  }

  canNavigateLeft() {
    return (this.indexOfClickingBtn > 0 && this.currentIndexItem > 0) || this.currentIndexItem > 0;
  }

  canNavigateRight() {
    return (
      (this.indexOfClickingBtn + this.itemsInView < this.restaurants.length &&
        this.currentIndexItem + this.itemsInView < this.restaurants.length) ||
      this.currentIndexItem + this.itemsInView < this.restaurants.length
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
      this.scrollByButton = false;
      const nextBatch = this.restaurants.slice(
        this.indexOfClickingBtn,
        this.indexOfClickingBtn + this.itemsInView,
      );
      this._renderBatch(nextBatch);
      this._renderer.elements.listItemContainer.scrollTo({
        left: this.currentScrollDistanceLeft,
        behavior: 'smooth',
      });
      if (
        this.indexOfClickingBtn + this.itemsInView <= this.restaurants.length &&
        this.indexOfScrollingView < this.restaurants.length
      ) {
        this._appendSentinel();
      }
      this.indexOfScrollingView = Math.min(
        this.indexOfScrollingView + this.itemsInView,
        this.restaurants.length,
      );
    } else {
      const nextBatch = this.restaurants.slice(
        this.indexOfScrollingView,
        this.indexOfScrollingView + this.itemsInView,
      );
      this._renderBatch(nextBatch);
      if (this.indexOfScrollingView + this.itemsInView <= this.restaurants.length) {
        this._appendSentinel();
      }
      this.indexOfClickingBtn = Math.min(
        this.indexOfScrollingView - this.itemsInView,
        this.restaurants.length - (this.restaurants.length % this.itemsInView),
      );
      this.indexOfScrollingView = Math.min(
        this.indexOfScrollingView + this.itemsInView,
        this.restaurants.length,
      );
    }
  }

  _appendSentinel() {
    const sentinel = this._renderer.createSentinelElement();
    this._observer.observe(sentinel);
  }
}
