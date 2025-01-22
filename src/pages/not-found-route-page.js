import notFoundIcon from '../../public/svg/404-not-found.svg';
import styles from '../assets/styles/components/not-found-route-page.styles.scss';
import { clearContent } from '../utils';

export default class NotFoundRoutePage extends HTMLElement {
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
      <section class="not-found">
        <img src=${notFoundIcon} class="not-found__img" alt="not found 404 logo on screen"/>
        <p class="not-found__text">The page you are looking for does not exist.</p>
      </section>
    `;
  }
}
