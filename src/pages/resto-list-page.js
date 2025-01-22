import styles from '../assets/styles/components/restaurant-list-page.styles.scss';
import { clearContent } from '../utils/clearContent';
import restoList from '../assets/svg/check_list.svg';
import { lazysizesForShadowDom } from '../utils';
import domService from '../services/domService';

export default class RestoListPage extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');

    this._handleSearchFormSubmit = this._onInputForm.bind(this);
    this._handleFilterBtnClick = this._onClickFilterBtn.bind(this);
    this._handleKeyboardNavigation = this._onKeyboardNavigation.bind(this);
    this._optionHandlers = [];

    this.render();
  }

  get _searchBar() {
    return this._shadowRoot.getElementById('searchBar');
  }

  get _searchForm() {
    return this._shadowRoot.getElementById('searchForm');
  }

  get _filterWrapper() {
    return this._shadowRoot.getElementById('filterWrapper');
  }

  get _filterButton() {
    return this._shadowRoot.getElementById('filterRating');
  }

  get _filterLabelSelected() {
    return this._shadowRoot.getElementById('filterLabel');
  }

  get _filterDropdown() {
    return this._shadowRoot.getElementById('filterDropdown');
  }

  get _optionLists() {
    return this._filterDropdown.querySelectorAll("[role='option']");
  }

  connectedCallback() {
    this._attachEventListeners();
    lazysizesForShadowDom(this._shadowRoot, '.restaurant-list__wrapper-img');
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <section class="restaurant-list">
        <div class="restaurant-list__container">
          <h1 class="restaurant-list__header">Find a Restaurant at Your Convenience</h1>
          <div class="restaurant-list__wrapper-img">
            <div class="skeleton"></div>
            <img data-src=${restoList} class="image lazyload" alt="Resto list icon" width="auto" height="auto"/>
          </div>
          
          <div class="restaurant-list__search-filter" role="search">
            <form id="searchForm" class="search-bar__wrapper">
              <input type="text" id="searchBar" placeholder="Enter by Name, Category or Menu" class="search-bar__input" />
              <button type="submit" class="search-bar__button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="rgb(255, 255, 255)"
                    d="M11 2a9 9 0 0 1 6.32 15.32l5.37 5.36-1.42 1.42-5.36-5.37A9 9 0 1 1 11 2Zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z"
                  ></path>
                </svg>
                <span>search</span>
              </button>
            </form>
            
            <div class="filter__wrapper" id="filterWrapper">
              <label for="filterRating" class="sr-only">Filter Restaurants</label>
              <button
                id="filterRating"
                class="filter__button"
                role="combobox"
                aria-label="Filter restaurants by rating"
                aria-haspopup="listbox"
                aria-expanded="false"
                aria-controls="filterDropdown"
              >
                <span class="filter__button-value" id="filterLabel">filter</span>
                <span class="filter__button-arrow"></span>
              </button>
              <ul class="filter__dropdown" id="filterDropdown" role="listbox">
                <li tabindex="-1" id="all-stars" role="option" data-value="all">
                  All Restaurants
                </li>
                <li tabindex="-1" id="four-stars-or-more" role="option" data-value="4">
                  4 Stars or Higher
                </li>
                <li tabindex="-1" id="three-stars-or-more" role="option" data-value="3">
                  3 Stars or Higher
                </li>
                <li tabindex="-1" id="two-stars-or-less" role="option" data-value="2">
                  2 Stars or Lower
                </li>
              </ul>
            </div>
          </div>
          
          <list-restaurant-container></list-restaurant-container>
        </div> 
      </section>
    `;
  }

  _attachEventListeners() {
    this._searchForm.addEventListener('submit', this._handleSearchFormSubmit);
    this._filterButton.addEventListener('click', this._handleFilterBtnClick);
    document.addEventListener('keydown', this._handleKeyboardNavigation);

    this._optionLists.forEach((option, index) => {
      const handler = () => this._onClickOption(index);
      this._optionHandlers[index] = handler;
      option.addEventListener('click', handler);
    });
  }

  _removeEventListeners() {
    this._searchForm.removeEventListener('submit', this._handleSearchFormSubmit);
    this._filterButton.removeEventListener('click', this._handleFilterBtnClick);
    document.removeEventListener('keydown', this._handleKeyboardNavigation);

    this._optionLists.forEach((option, index) => {
      option.removeEventListener('click', this._optionHandlers[index]);
    });
  }

  _onInputForm(event) {
    event.preventDefault();

    const query = this._searchBar.value;
    this.dispatchEvent(
      new CustomEvent('search-restaurant', {
        detail: { query },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onClickFilterBtn() {
    this.dispatchEvent(
      new CustomEvent('click-filter-btn', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onKeyboardNavigation(event) {
    const isDropdownOpen = domService.getAttribute(this._filterButton, 'aria-expanded') === 'true';

    if (!isDropdownOpen) return;

    const { key } = event;

    this.dispatchEvent(
      new CustomEvent('dropdown-keyboard-navigation', {
        detail: { key },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onClickOption(index) {
    this.dispatchEvent(
      new CustomEvent('click-option', {
        detail: { index },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
