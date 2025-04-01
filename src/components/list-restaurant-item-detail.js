import styles from '../assets/styles/components/list-restaurant-item-detail.styles.scss';
import { RESTO_IMG_LARGE, RESTO_IMG_MEDIUM, RESTO_IMG_SMALL } from '../config/constants';
import { lazysizesForShadowDom } from '../utils';

class ListRestaurantItemDetail extends HTMLElement {
  _dataRestaurant = {};

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    const styleEl = document.createElement('style');

    // Simpan referensi fungsi listener yang sudah dibinding
    this._onClickFavoriteBound = this._onClickFavorite.bind(this);
    this._onSubmitBound = this._onSubmit.bind(this);
    this._onInputBound = this._onInput.bind(this);

    // Buat elemen style sekali saja
    styleEl.textContent = styles;
    this._shadowRoot.appendChild(styleEl);

    // Buat struktur awal komponen menggunakan template
    this._shadowRoot.innerHTML += `
      <div class="restaurant__container">
        <picture class="restaurant__picture">
          <div class="skeleton"></div>
          <source
            type="image/jpeg"
            data-srcset=""
            data-sizes="auto">
          <img
            data-src=""
            alt="Restaurant image"
            loading="lazy"
            width="auto"
            height="auto"
            class="restaurant__image lazyload">
        </picture>
        
        <div class="restaurant__info">
          <h2 class="restaurant__info-name"></h2>
          <p class="restaurant__info-location"></p>
          <div class="restaurant__info-detail">
            <button type="button" id="detailFavoriteBtn" class="favorite-btn"></button>
            <span class="rating"></span>
          </div>
          <div class="restaurant__info-categories">
            <h3 class="header">Categories</h3>
            <ul id="categories" class="categories__items"></ul>
          </div>
          <div class="restaurant__info-menus">
            <div class="menu">
              <h3 class="header">Food Menu</h3>
              <ul class="menu__items" id="foodMenu"></ul>
            </div>
            <div class="menu">
              <h3 class="header">Drink Menu</h3>
              <ul class="menu__items" id="drinkMenu"></ul>
            </div>
          </div>
        </div>
        
        <div class="restaurant__reviews">
          <h3 class="header">Customer Reviews</h3>
          <div id="review" class="review__table-container"></div>
        </div>
        
        <div class="restaurant__descriptions">
          <h3 class="header">Descriptions</h3>
          <p class="description"></p>
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

  set dataRestaurant(data) {
    this._dataRestaurant = data;
    this._updateContent();
  }

  get dataRestaurant() {
    return this._dataRestaurant;
  }

  connectedCallback() {
    // Event listener hanya ditambahkan sekali
    this._shadowRoot
      .getElementById('detailFavoriteBtn')
      .addEventListener('click', this._onClickFavoriteBound);
    this._shadowRoot.getElementById('reviewForm').addEventListener('submit', this._onSubmitBound);

    // Tambahkan event listener validasi ke input dan textarea
    ['reviewName', 'reviewBody'].forEach((id) => {
      const element = this._shadowRoot.getElementById(id);
      element.addEventListener('input', this._onInputBound);
      element.addEventListener('blur', this._onInputBound);
      element.addEventListener('invalid', this._onInputBound);
    });

    // Inisialisasi lazysizes untuk Shadow DOM
    lazysizesForShadowDom(this._shadowRoot, '.restaurant__picture');

    // Lakukan update pertama jika data sudah ada
    this._updateContent();
  }

  disconnectedCallback() {
    // Hapus listener menggunakan referensi yang sama
    this._shadowRoot
      .getElementById('detailFavoriteBtn')
      .removeEventListener('click', this._onClickFavoriteBound);
    this._shadowRoot
      .getElementById('reviewForm')
      .removeEventListener('submit', this._onSubmitBound);

    ['reviewName', 'reviewBody'].forEach((id) => {
      const element = this._shadowRoot.getElementById(id);
      element.removeEventListener('input', this._onInputBound);
      element.removeEventListener('blur', this._onInputBound);
      element.removeEventListener('invalid', this._onInputBound);
    });
  }

  _updateContent() {
    const {
      name,
      description,
      pictureId,
      address,
      city,
      rating,
      categories = [],
      menus = {},
      customerReviews = [],
    } = this.dataRestaurant;

    // Update gambar
    const pictureEl = this._shadowRoot.querySelector('.restaurant__picture');
    const sourceEl = pictureEl.querySelector('source');
    const imgEl = pictureEl.querySelector('img');
    sourceEl.dataset.srcset = `
      ${RESTO_IMG_SMALL}/${pictureId} 405w,
      ${RESTO_IMG_MEDIUM}/${pictureId} 810w,
      ${RESTO_IMG_LARGE}/${pictureId} 1215w
    `;
    imgEl.dataset.src = `${RESTO_IMG_LARGE}/${pictureId}`;
    imgEl.alt = `${name} restaurant`;

    // Update info dasar
    this._shadowRoot.querySelector('.restaurant__info-name').textContent = name || 'Unknown';
    this._shadowRoot.querySelector('.restaurant__info-location').textContent =
      `${address || 'N/A'}, ${city || 'N/A'}`;
    this._shadowRoot.querySelector('.rating').textContent = `Rating: ⭐ ${rating || '0'}`;

    // Update categories
    const categoryListEl = this._shadowRoot.getElementById('categories');
    categoryListEl.innerHTML = categories.length
      ? categories.map((category) => `<li>${category.name}</li>`).join('')
      : '<li>No categories available.</li>';

    // Update menus (food & drink)
    const foodMenuEl = this._shadowRoot.getElementById('foodMenu');
    const drinkMenuEl = this._shadowRoot.getElementById('drinkMenu');
    foodMenuEl.innerHTML =
      menus.food && menus.food.length
        ? menus.food.map((item) => `<li>${item.name}</li>`).join('')
        : '<li>No food menu available.</li>';
    drinkMenuEl.innerHTML =
      menus.drink && menus.drink.length
        ? menus.drink.map((item) => `<li>${item.name}</li>`).join('')
        : '<li>No drink menu available.</li>';

    // Update reviews
    const reviewEl = this._shadowRoot.getElementById('review');
    reviewEl.innerHTML = customerReviews.length
      ? customerReviews.map((review) => `<p>${review.name}: ${review.review}</p>`).join('')
      : '<p>No reviews yet.</p>';

    // Update description
    this._shadowRoot.querySelector('.restaurant__descriptions .description').textContent =
      description || 'No description available for this restaurant.';
  }

  _onClickFavorite() {
    const customEvent = new CustomEvent('click-favorite', {
      detail: { dataResto: this._dataRestaurant },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(customEvent);
  }

  _onInput(event) {
    const element = event.target;
    const validationMessageElement = this._shadowRoot.getElementById(`${element.id}Validation`);
    const customEvent = new CustomEvent('input-review', {
      detail: { element, validationMessageElement },
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
        inputEl: this._shadowRoot.getElementById('reviewName'),
        bodyEl: this._shadowRoot.getElementById('reviewBody'),
        formEl: this._shadowRoot.getElementById('reviewForm'),
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
