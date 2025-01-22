export default class RestoItemNavigationController {
  constructor(elements) {
    this.elements = elements;
  }

  initialize(updateViewportHandler, scrollBtnHandler, scrollEventUpdater, buttonStateUpdater) {
    window.addEventListener('resize', updateViewportHandler());
    this.elements.listRestaurantContainer.addEventListener('scroll-btn-click', (event) => {
      scrollBtnHandler(event.detail.direction);
    });
    this.elements.listItemContainer.addEventListener('scroll', () => scrollEventUpdater());
    this.buttonStateUpdater = buttonStateUpdater;
  }

  updateButtonsState(canNavigateLeft, canNavigateRight) {
    this.elements.prevButton.style.display = canNavigateLeft ? 'block' : 'none';
    this.elements.nextButton.style.display = canNavigateRight ? 'block' : 'none';
  }
}
