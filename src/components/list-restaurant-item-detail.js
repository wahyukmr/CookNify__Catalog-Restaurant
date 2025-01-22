import styles from '../assets/styles/components/list-restaurant-item-detail.styles.scss';
import { RESTO_IMG_LARGE, RESTO_IMG_MEDIUM, RESTO_IMG_SMALL } from '../config/constants';
import { clearContent, lazysizesForShadowDom } from '../utils';

class ListRestaurantItemDetail extends HTMLElement {
  _dataRestaurant = {};

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  set dataRestaurant(data) {
    this._dataRestaurant = data;
    this.render();
  }

  get dataRestaurant() {
    return this._dataRestaurant;
  }

  get _reviewForm() {
    return this._shadowRoot.getElementById('reviewForm');
  }
  get _inputElement() {
    return this._shadowRoot.getElementById('reviewName');
  }
  get _bodyElement() {
    return this._shadowRoot.getElementById('reviewBody');
  }
  get _categoryListElement() {
    return this._shadowRoot.getElementById('categories');
  }
  get _menuElements() {
    return this._shadowRoot.querySelectorAll('.menu__items');
  }
  get _reviewElement() {
    return this._shadowRoot.getElementById('review');
  }
  get _detailFavoriteBtn() {
    return this._shadowRoot.getElementById('detailFavoriteBtn');
  }

  connectedCallback() {
    this._detailFavoriteBtn.addEventListener('click', this._onCLickFavorite.bind(this));
    this._addValidationListeners(this._inputElement);
    this._addValidationListeners(this._bodyElement);
    this._reviewForm.addEventListener('submit', this._onSubmit.bind(this));
    lazysizesForShadowDom(this._shadowRoot, '.restaurant__picture');
  }
  disconnectedCallback() {
    this._detailFavoriteBtn.removeEventListener('click', this._onCLickFavorite.bind(this));
    this._removeValidationListeners(this._inputElement);
    this._removeValidationListeners(this._bodyElement);
    this._reviewForm.removeEventListener('submit', (event) => this._onSubmit(event));
  }

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    const { name, description, pictureId, address, city, rating } = this.dataRestaurant;

    this._shadowRoot.innerHTML += `
      <div class="restaurant__container">
        <picture class="restaurant__picture">
          <div class="skeleton"></div>
          <source
            type="image/jpeg"
            data-srcset="${RESTO_IMG_SMALL}/${pictureId} 405w, 
                 ${RESTO_IMG_MEDIUM}/${pictureId} 810w, 
                 ${RESTO_IMG_LARGE}/${pictureId} 1215w"
            data-sizes="auto">
          <img
            data-src="${RESTO_IMG_LARGE}/${pictureId}" alt="${name} restaurant"
            loading="lazy"
            width="auto"
            height="auto"
            class="restaurant__image lazyload">
        </picture>
        
        <div class="restaurant__info">
          <h2 class="restaurant__info-name">${name || 'Unknown'}</h2>
          <p class="restaurant__info-location">${address || 'N/A'}, ${city || 'N/A'}</p>
          
          <div class="restaurant__info-detail">
            <button type="button" id="detailFavoriteBtn" class="favorite-btn"></button>
            <span class="rating">Rating: ⭐ ${rating || '0'}</span>
          </div>
          
          <div class="restaurant__info-categories">
            <h3 class="header">Categories</h3>
            <ul id="categories" class="categories__items"></ul>
          </div>
          
          <div class="restaurant__info-menus">
            <div class="menu">
              <h3 class="header">Food Menu</h3>
              <ul class="menu__items"></ul>
            </div>
            <div class="menu">
              <h3 class="header">Drink Menu</h3>
              <ul class="menu__items"></ul>
            </div>
          </div>
        </div>
        
        <div class="restaurant__reviews">
          <h3 class="header">Customer Reviews</h3>
          <div id="review" class="review__table-container"></div>
        </div>
        
        <div class="restaurant__descriptions">
          <h3 class="header">Descriptions</h3>
          <p class="description">${description}</p>
        </div>
        
        <div class="restaurant__review">
          <h3 class="header">Submit Your Review</h3>
          <form id="reviewForm" class="restaurant__review-form">
            <div class="fild__wrapper">
              <label for="reviewName" class="fild__label">Name:</label>
              <input name="reviewName" type="text" id="reviewName" class="fild__input" placeholder="Enter your name" autocomplete="off" aria-describedby="reviewNameValidation" required />
              
              <div id="reviewNameValidation" class="validation-message" aria-live="polite" role="alert"></div>
            </div>
            <div class="fild__wrapper">
              <label for="reviewBody" class="fild__label">Review:</label>
              <textarea name="reviewBody" id="reviewBody" class="fild__body" placeholder="Enter your review for this restaurant" aria-describedby="reviewBodyValidation" required></textarea>
              
              <div id="reviewBodyValidation" class="validation-message" aria-live="polite" role="alert"></div>
            </div>
            <button type="submit" id="submitReview" class="form-btn">Submit</button>
          </form>
        </div>
      </div>
    `;
  }

  _addValidationListeners(element) {
    element.addEventListener('input', () => this._onInput(element));
    element.addEventListener('blur', () => this._onInput(element));
    element.addEventListener('invalid', () => this._onInput(element));
  }

  _removeValidationListeners(element) {
    element.removeEventListener('input', () => this._onInput(element));
    element.removeEventListener('blur', () => this._onInput(element));
    element.removeEventListener('invalid', () => this._onInput(element));
  }

  _onCLickFavorite() {
    const customEvent = new CustomEvent('click-favorite', {
      detail: { dataResto: this._dataRestaurant },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(customEvent);
  }

  _onInput(element) {
    const validationMessageElement = this._shadowRoot.getElementById(`${element.id}Validation`);

    const customEvent = new CustomEvent('input-review', {
      detail: { element: element, validationMessageElement },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(customEvent);
  }

  _onSubmit(event) {
    event.preventDefault();

    const validationMessageInput = this._shadowRoot.getElementById('reviewNameValidation');
    const validationMessageBody = this._shadowRoot.getElementById('reviewBodyValidation');

    const customEvent = new CustomEvent('submit-review', {
      detail: {
        inputEl: this._inputElement,
        bodyEl: this._bodyElement,
        formEl: this._reviewForm,
        validationMessageInput,
        validationMessageBody,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define('list-restaurant-item-detail', ListRestaurantItemDetail);
