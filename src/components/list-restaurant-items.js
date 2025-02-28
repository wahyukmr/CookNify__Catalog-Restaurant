import styles from '../assets/styles/components/list-restaurant-items.styles.scss';
import { RESTO_IMG_LARGE, RESTO_IMG_MEDIUM, RESTO_IMG_SMALL } from '../config/constants';
import { clearContent, lazysizesForShadowDom } from '../utils';

class ListRestaurantItems extends HTMLElement {
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

  connectedCallback() {
    lazysizesForShadowDom(this._shadowRoot, '.restaurant-item__picture');
  }

  render() {
    clearContent(this);

    const { id, name, description, pictureId, city, rating, favorited } = this.dataRestaurant;

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="restaurant-item">
        <picture class="restaurant-item__picture">
          <div class="skeleton"></div>
          <source
            type="image/jpeg"
            data-srcset="${RESTO_IMG_SMALL}/${pictureId} 405w, 
                 ${RESTO_IMG_MEDIUM}/${pictureId} 810w, 
                 ${RESTO_IMG_LARGE}/${pictureId} 1215w"
            data-sizes="auto">
          <img
            data-src="${RESTO_IMG_MEDIUM}/${pictureId}" alt="${name} restaurant"
            loading="lazy"
            width="auto"
            height="auto"
            class="restaurant-item__image lazyload">
        </picture>
        
        <div id="restoStatusIcon" class="restaurant-item__favorite">
          ${this._renderFavoriteIcon(favorited)}
        </div>
                
        <div class="restaurant-item__content">
          <span class="restaurant-item__header">${name || 'Unknown'}</span>
          <p class="restaurant-item__description">${description || 'No description available for this restaurant.'}</p>
          <div class="restaurant-item__info">
            <div class="restaurant-item__info-rating">
              <svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m305-704 112-145q12-16 28.5-23.5T480-880q18 0 34.5 7.5T543-849l112 145 170 57q26 8 41 29.5t15 47.5q0 12-3.5 24T866-523L756-367l4 164q1 35-23 59t-56 24q-2 0-22-3l-179-50-179 50q-5 2-11 2.5t-11 .5q-32 0-56-24t-23-59l4-165L95-523q-8-11-11.5-23T80-570q0-25 14.5-46.5T135-647l170-57Zm49 69-194 64 124 179-4 191 200-55 200 56-4-192 124-177-194-66-126-165-126 165Zm126 135Z"/></svg>
              <span class="text">${rating || '0'} Rating</span>
            </div>
            <div class="restaurant-item__info-location">
              <svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
              <span class="text">${city || 'N/A'}</span>
            </div>
          </div>
          <div class="restaurant-item__actions">
            <a href="#/resto-list/detail/${id}" class="anchor">
              <span class="text">View Details</span>
              <svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  _renderFavoriteIcon(favorited) {
    return favorited
      ? `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff6b6b" height="24px" width="24px" aria-hidden="true" focusable="false">
            <title>Favorited</title>
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
        <span class="sr-only">This restaurant is favorited</span>`
      : `
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960" fill="#ff6b6b">
          <title>Unfavorited</title>
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
        </svg>
        <span class="sr-only">This restaurant is unfavorited</span>`;
  }
}

customElements.define('list-restaurant-items', ListRestaurantItems);
