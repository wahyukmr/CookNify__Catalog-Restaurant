import styles from '../assets/styles/components/list-restaurant-container.styles.scss';
import { clearContent } from '../utils/clearContent';

class ListRestaurantContainer extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  get _btnLeft() {
    return this._shadowRoot.getElementById('btnLeft');
  }

  get _btnRight() {
    return this._shadowRoot.getElementById('btnRight');
  }

  connectedCallback() {
    this._btnLeft.addEventListener('click', this._handleScrollBtnClickLeft);
    this._btnRight.addEventListener('click', this._handleScrollBtnClickRight);
  }

  disconnectedCallback() {
    this._btnLeft.removeEventListener('click', this._handleScrollBtnClickLeft);
    this._btnRight.removeEventListener('click', this._handleScrollBtnClickRight);
  }

  _handleScrollBtnClickLeft = () => this._onScrollBtnClick('left');
  _handleScrollBtnClickRight = () => this._onScrollBtnClick('right');

  _onScrollBtnClick = (direction) => {
    this.dispatchEvent(
      new CustomEvent('scroll-btn-click', { detail: { direction }, bubbles: true, composed: true }),
    );
  };

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="card__container-wrapper" id="card-container">
        <button class="card__scroll-btn left" id="btnLeft" aria-label="Scroll Left">
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="card__list" id="listItemContainer"></div>
        <button class="card__scroll-btn right" id="btnRight" aria-label="Scroll Right">
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;
  }
}

customElements.define('list-restaurant-container', ListRestaurantContainer);
