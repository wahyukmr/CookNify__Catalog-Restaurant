import brandLogo from '../../public/svg/logo-brand-transparent.svg';
import styles from '../assets/styles/components/brand-logo.styles.scss';
import { clearContent } from '../utils';

class BrandLogo extends HTMLElement {
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
      <a href="#/" class="brand-logo" aria-label="Go to home page via clicking the brand logo">
        <img src=${brandLogo} class="brand-logo__img" alt="brand logo on screen"/>
      </a>
    `;
  }
}

customElements.define('brand-logo', BrandLogo);
