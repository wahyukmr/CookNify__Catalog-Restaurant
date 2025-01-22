import { SHORT_LABELS } from '../../config/constants';
import domService from '../../services/domService';
import { DomHandlerNestedSelectors } from '../../utils/DomHandlerNestedSelectors';
import {
  RestoBatchLoader,
  RestoViewRenderer,
  RestoBaseView,
  RestoItemNavigationController,
} from './base';

class DropdownManager {
  constructor(elements, shortLabels) {
    this.activeIndex = null;
    this._elements = elements;
    this._shortLabels = shortLabels;
    this._handleFocuseOut = this._handleDropdownFocusOut.bind(this);
  }

  toggleDropdown() {
    const { filterButton, filterWrapper } = this._elements;

    const isExpanded = domService.getAttribute(filterButton, 'aria-expanded') === 'true';
    domService.setAttribute(filterButton, 'aria-expanded', !isExpanded);
    domService.toggleClass(filterWrapper, 'active', !isExpanded);

    if (!isExpanded) {
      setTimeout(() => {
        filterWrapper.addEventListener('focusout', this._handleFocuseOut);
      });
      filterButton.focus();
    } else {
      filterWrapper.removeEventListener('focusout', this._handleFocuseOut);
      this.activeIndex = null;
    }
  }

  handleSelection() {
    const { searchBar, optionLists, filterLabel, filterButton, filterWrapper } = this._elements;
    const selectedOption = optionLists[this.activeIndex];
    const selectedValue = selectedOption.dataset.value;
    const content = selectedOption.textContent.trim();

    if (selectedValue === 'all') searchBar.value = '';

    filterLabel.textContent = this._shortLabels[selectedValue];
    domService.setAttribute(filterButton, 'aria-expanded', 'false');
    domService.removeClass(filterWrapper, 'active');

    return { selectedValue, content };
  }

  highlightActiveOption() {
    const { optionLists, filterDropdown } = this._elements;

    optionLists.forEach((option, index) => {
      domService.setAttribute(option, 'tabindex', index === this.activeIndex ? '0' : '-1');
    });
    optionLists[this.activeIndex]?.focus();
    domService.setAttribute(
      filterDropdown,
      'aria-activedescendant',
      optionLists[this.activeIndex]?.id,
    );
  }

  resetLabel() {
    this._elements.filterLabel.textContent = 'filter';
  }

  _handleDropdownFocusOut(event) {
    const { filterWrapper, filterButton } = this._elements;

    const isInside =
      filterWrapper.contains(event.relatedTarget) || filterButton.contains(event.relatedTarget);

    if (!isInside) {
      domService.setAttribute(filterButton, 'aria-expanded', 'false');
      domService.removeClass(filterWrapper, 'active');
      this.activeIndex = null;
    }
  }
}

export default class RestoListView extends RestoBaseView {
  constructor(restoListPage) {
    const renderer = new RestoViewRenderer(restoListPage);
    const itemNavigation = new RestoItemNavigationController(renderer.elements);
    const batchLoader = new RestoBatchLoader(renderer);

    batchLoader.initialize();

    super({ renderer, itemNavigation, batchLoader });
    this.initializeEvents();

    this._restoListPage = restoListPage;
    this._elements = new DomHandlerNestedSelectors(
      restoListPage.shadowRoot,
      {
        searchBar: '#searchBar',
        filterWrapper: '#filterWrapper',
        filterButton: '#filterRating',
        filterLabel: '#filterLabel',
        filterDropdown: '#filterDropdown',
        optionLists: (root) =>
          root.getElementById('filterDropdown').querySelectorAll("[role='option']"),
      },
      true,
    ).elements;
    this._dropdownManager = new DropdownManager(this._elements, SHORT_LABELS);

    this._initializeEvent();
  }

  bindSearchInput(handler) {
    this._restoListPage.addEventListener('search-restaurant', (event) => {
      this._resetIndex();
      this._dropdownManager.resetLabel();
      handler(event.detail.query);
    });
  }

  bindFilterSelection(handler) {
    this._restoListPage.addEventListener('click-option', (event) => {
      this._resetIndex();
      this._dropdownManager.activeIndex = event.detail.index;
      const { selectedValue, content } = this._dropdownManager.handleSelection();
      handler(selectedValue, content);
    });
  }

  bindKeyboardNavigation(handler) {
    this._restoListPage.addEventListener('dropdown-keyboard-navigation', (event) => {
      const { key } = event.detail;
      const { optionLists, filterWrapper } = this._elements;

      if (key === 'ArrowDown' || key === 'ArrowUp') {
        this._dropdownManager.activeIndex =
          (this._dropdownManager.activeIndex ?? -1) + (key === 'ArrowDown' ? 1 : -1);
        this._dropdownManager.activeIndex =
          (this._dropdownManager.activeIndex + optionLists.length) % optionLists.length;
        this._dropdownManager.highlightActiveOption();
      } else if (key === 'Enter') {
        if (this._dropdownManager.activeIndex === null) {
          filterWrapper.removeEventListener('focusout', this._handleFocuseOut);
          return;
        }
        const { selectedValue, content } = this._dropdownManager.handleSelection();
        this._resetIndex();
        handler(selectedValue, content);
      } else if (key === 'Escape') {
        this._dropdownManager.toggleDropdown();
      }
    });
  }

  _initializeEvent() {
    this._restoListPage.addEventListener('click-filter-btn', () =>
      this._dropdownManager.toggleDropdown(),
    );
  }

  _resetIndex() {
    this.indexOfClickingBtn = 0;
    this.indexOfScrollingView = this.itemsInView;
  }
}
