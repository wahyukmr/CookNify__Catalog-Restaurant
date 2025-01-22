export default class RestoBaseView {
  constructor({ renderer, itemNavigation, batchLoader }) {
    this.renderer = renderer;
    this.itemNavigation = itemNavigation;
    this.batchLoader = batchLoader;
  }

  initializeEvents() {
    this.itemNavigation.initialize(
      this.updateViewport.bind(this),
      this.handleScrollByButton.bind(this),
      this.handleScrollEvent.bind(this),
      this.updateButtonsState.bind(this),
    );
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

    this.updateButtonsState();
  }

  updateViewport() {
    this.batchLoader.updateViewportSize();
  }

  handleScrollByButton(direction) {
    if (this.batchLoader.newIndex === 0) {
      this.batchLoader.scrollByButton = true;
    }

    if (direction === 'right') {
      this.batchLoader.nextBatch();
    } else if (direction === 'left') {
      this.batchLoader.prevBatch();
    }

    this.renderer.elements.listItemContainer.scrollTo({
      left: this.batchLoader.currentScrollDistanceLeft,
      behavior: 'smooth',
    });
    if (this.batchLoader.indexOfScrollingView >= this.batchLoader.restaurants.length) {
      this.batchLoader.scrollByButton = false;
    }

    this.updateButtonsState();
  }

  handleScrollEvent() {
    if (this._isScrollListenerAttached) return;
    this._isScrollListenerAttached = true;

    requestAnimationFrame(() => {
      this.batchLoader.currentIndexItem = Math.floor(
        this.renderer.elements.listItemContainer.scrollLeft / this.batchLoader.cardWidth,
      );
      this.batchLoader.newIndex =
        Math.floor(
          this.renderer.elements.listItemContainer.scrollLeft / this.batchLoader.cardWidth,
        ) % this.batchLoader.itemsInView;
      this.updateButtonsState();
      this._isScrollListenerAttached = false;
    });
  }

  updateButtonsState() {
    this.itemNavigation.updateButtonsState(
      this.batchLoader.canNavigateLeft(),
      this.batchLoader.canNavigateRight(),
    );
  }
}

// export default class RestoBaseView {
//   constructor(rootContainer) {
//     this._rootElements = this._initializeDomElements(rootContainer);
//     this._currentRootContainer =
//       this._rootElements.listItemContainer || this._rootElements.detailItemContainer;
//     this._restaurants = [];
//     this._cardWidth = 300;
//     this._updateViewportSize();
//     this.indexOfClickingBtn = 0;
//     this.indexOfScrollingView = this.itemsInView;

//     this._currentScrollDistanceLeft = 0;
//     this._scrollByButton = false;
//     this._newIndex = 0;
//     this._currentIndexItem = 0;
//     if (this._rootElements.listRestaurantContainer) {
//       this._attachEventListeners();
//       this._observer = this._createIntersectionObserver();
//     }
//   }

//   _initializeDomElements(rootContainer) {
//     return new DomHandlerNestedSelectors(
//       rootContainer.shadowRoot,
//       {
//         detailItemContainer: '#restaurantDetailContainer',
//         listRestaurantContainer: 'list-restaurant-container!',
//         listItemContainer: 'list-restaurant-container >> #listItemContainer',
//         prevButton: 'list-restaurant-container >> #btnLeft',
//         nextButton: 'list-restaurant-container >> #btnRight',
//       },
//       false,
//     ).elements;
//   }

//   _attachEventListeners() {
//     this._handleScrollBtnClick();
//     this._handleScrollEvent();
//     window.addEventListener('resize', this._updateViewportSize.bind(this));
//   }

//   _handleScrollEvent() {
//     const { listItemContainer } = this._rootElements;
//     if (this._isScrollListenerAttached) return;
//     this._isScrollListenerAttached = true;

//     const handleScroll = () => {
//       this._currentIndexItem = Math.floor(listItemContainer.scrollLeft / this._cardWidth);
//       this._newIndex =
//         Math.floor(listItemContainer.scrollLeft / this._cardWidth) % this.itemsInView;
//       this.updateButtonsState();
//     };

//     listItemContainer.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
//   }

//   _updateViewportSize() {
//     this._viewportWidth = this._rootElements.listRestaurantContainer?.offsetWidth || 0;
//     this.itemsInView = Math.round(this._viewportWidth / this._cardWidth);
//   }

//   renderFallback(message, restaurants = 0) {
//     this._clearContainer();
//     this._restaurants = restaurants;
//     const messageElement = this._createMessageSection(message);
//     this._currentRootContainer.appendChild(messageElement);
//   }

//   renderLoader() {
//     this._clearContainer();
//     const loaderElement = this._createLoaderSection();
//     this._currentRootContainer.appendChild(loaderElement);
//   }

//   renderRestaurantItems(restaurants) {
//     this._clearContainer();
//     this._restaurants = restaurants;
//     if (restaurants.length > 0) {
//       this._renderInitialBatch();
//     }
//     this.updateButtonsState();
//   }

//   _renderInitialBatch() {
//     this.indexOfClickingBtn = 0;
//     const initialBatch = this._restaurants.slice(0, this.itemsInView);
//     this._renderBatch(initialBatch);
//     if (this.itemsInView < this._restaurants.length) {
//       this._appendSentinel();
//     }
//   }

//   _renderBatch(batch) {
//     batch.forEach((restaurant) => {
//       const restoItem = this._createRestaurantItem(restaurant, 'list-restaurant-items');
//       this._rootElements.listItemContainer.appendChild(restoItem);
//     });
//   }

//   _createIntersectionObserver() {
//     const root = this._rootElements.listItemContainer;
//     if (!root) {
//       showErrorNotification('Root container for IntersectionObserver is not found.');
//     }
//     return new IntersectionObserver(this._onIntersect.bind(this), {
//       root,
//       threshold: 0.05,
//     });
//   }

//   _onIntersect(entries) {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         this._observer.unobserve(entry.target);
//         entry.target.remove();
//         this._handleIntersection();
//       }
//     });
//   }

//   _handleIntersection() {
//     if (this._scrollByButton) {
//       this._scrollByButton = false;
//       const nextBatch = this._restaurants.slice(
//         this.indexOfClickingBtn,
//         this.indexOfClickingBtn + this.itemsInView,
//       );
//       this._renderBatch(nextBatch);
//       this._rootElements.listItemContainer.scrollTo({
//         left: this._currentScrollDistanceLeft,
//         behavior: 'smooth',
//       });
//       if (
//         this.indexOfClickingBtn + this.itemsInView <= this._restaurants.length &&
//         this.indexOfScrollingView < this._restaurants.length
//       ) {
//         this._appendSentinel();
//       }
//       this.indexOfScrollingView = Math.min(
//         this.indexOfScrollingView + this.itemsInView,
//         this._restaurants.length,
//       );
//     } else {
//       const nextBatch = this._restaurants.slice(
//         this.indexOfScrollingView,
//         this.indexOfScrollingView + this.itemsInView,
//       );
//       this._renderBatch(nextBatch);
//       if (this.indexOfScrollingView + this.itemsInView <= this._restaurants.length) {
//         this._appendSentinel();
//       }
//       this.indexOfScrollingView = Math.min(
//         this.indexOfScrollingView + this.itemsInView,
//         this._restaurants.length,
//       );
//     }
//     this.updateButtonsState();
//   }

//   _handleScrollBtnClick() {
//     const { listRestaurantContainer, listItemContainer } = this._rootElements;
//     listRestaurantContainer.addEventListener('scroll-btn-click', (event) => {
//       if (this._newIndex === 0) {
//         this._scrollByButton = true;
//       }
//       const { direction } = event.detail;
//       if (direction === 'right') {
//         this.indexOfClickingBtn = Math.min(
//           this.indexOfClickingBtn + this.itemsInView,
//           this._restaurants.length - (this._restaurants.length % this.itemsInView),
//         );
//         this._currentScrollDistanceLeft =
//           listItemContainer.scrollLeft + this._cardWidth * (this.itemsInView - this._newIndex);
//         this._newIndex = 0;
//       } else if (direction === 'left') {
//         const lastBatchIndex = Math.min(
//           this._restaurants.length - this.indexOfClickingBtn,
//           this.itemsInView,
//         );
//         this.indexOfClickingBtn = Math.max(this.indexOfClickingBtn - this.itemsInView, 0);
//         this._currentScrollDistanceLeft =
//           listItemContainer.scrollLeft - this._cardWidth * lastBatchIndex;
//         this._newIndex = 0;
//         this._scrollByButton = false;
//       }
//       listItemContainer.scrollTo({ left: this._currentScrollDistanceLeft, behavior: 'smooth' });
//       if (this.indexOfScrollingView >= this._restaurants.length) {
//         this._scrollByButton = false;
//       }
//       this.updateButtonsState();
//     });
//   }

//   _appendSentinel() {
//     const sentinel = document.createElement('div');
//     sentinel.className = 'sentinel';
//     this._rootElements.listItemContainer.appendChild(sentinel);
//     if (this._observer) {
//       this._observer.observe(sentinel);
//     }
//   }

//   updateButtonsState() {
//     const { prevButton, nextButton } = this._rootElements;
//     prevButton.style.display =
//       (this.indexOfClickingBtn > 0 && this._currentIndexItem > 0) || this._currentIndexItem > 0
//         ? 'block'
//         : 'none';
//     nextButton.style.display =
//       (this.indexOfClickingBtn + this.itemsInView < this._restaurants.length &&
//         this._currentIndexItem + this.itemsInView < this._restaurants.length) ||
//       this._currentIndexItem + this.itemsInView < this._restaurants.length
//         ? 'block'
//         : 'none';
//   }

//   _createRestaurantItem(dataRestaurant, targetElement) {
//     const restoItem = document.createElement(targetElement);
//     restoItem.dataRestaurant = dataRestaurant;
//     return restoItem;
//   }

//   _createMessageSection(message) {
//     const messageElement = document.createElement('message-section');
//     messageElement.textMessage = message;
//     return messageElement;
//   }

//   _createLoaderSection() {
//     return document.createElement('loader-section');
//   }

//   _clearContainer() {
//     this._currentRootContainer.innerHTML = '';
//   }
// }
