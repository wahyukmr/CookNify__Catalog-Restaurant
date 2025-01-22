import styles from '../assets/styles/components/loader-section.styles.scss';
import { clearContent } from '../utils';

class LoaderSection extends HTMLElement {
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
      <div class="container">
        <div class="custom-loader"></div>
      </div>
    `;
  }
}

customElements.define('loader-section', LoaderSection);
