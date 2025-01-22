import styles from '../assets/styles/components/restaurant-detail-page.styles.scss';
import { clearContent } from '../utils';

export default class RestoDetailPage extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <section class="detail-page">
        <div class="detail-page__container">
          <h1 class="detail-page__heading">Restaurant Detail</h1>
          <div id="restaurantDetailContainer" class="detail-page__restaurant"></div>
        </div>
      </section>
    `;
  }
}
