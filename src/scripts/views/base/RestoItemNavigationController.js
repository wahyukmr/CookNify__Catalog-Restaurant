export default class RestoItemNavigationController {
  constructor(elements) {
    this.elements = elements;
  }

  initialize(debouncedResizeHandler, scrollBtnHandler, scrollEventUpdater, buttonStateUpdater) {
    window.addEventListener('resize', debouncedResizeHandler());
    this.elements.listRestaurantContainer.addEventListener('scroll-btn-click', (event) => {
      scrollBtnHandler(event.detail.direction);
    });
    this.elements.listItemContainer.addEventListener('scroll', () => scrollEventUpdater(), {
      passive: true,
    });
    this.buttonStateUpdater = buttonStateUpdater;
  }

  updateButtonsState(canNavigateLeft, canNavigateRight) {
    this.elements.prevButton.style.display = canNavigateLeft ? 'flex' : 'none';
    this.elements.nextButton.style.display = canNavigateRight ? 'flex' : 'none';
  }
}
