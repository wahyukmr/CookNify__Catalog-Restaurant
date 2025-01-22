import styles from '../assets/styles/components/favorite-page.styles.scss';
import { clearContent } from '../utils/clearContent';

export default class FavoritePage extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <section class="favorite-section">
        <div class="favorite-section__container">
          <h1 class="favorite-section__heading">Your Favorite Restaurants</h1>
          
          <list-restaurant-container></list-restaurant-container>
        </div>
      </section>
    `;
  }
}
