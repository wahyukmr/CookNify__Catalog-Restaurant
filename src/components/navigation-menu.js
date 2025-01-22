import styles from '../assets/styles/components/navigation-menu.styles.scss';
import { clearContent } from '../utils';

class NavigationMenu extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  get _navLinks() {
    return this._shadowRoot.querySelectorAll('.topnav__link');
  }

  connectedCallback() {
    this._shadowRoot
      .getElementById('btnOpen')
      .addEventListener('click', this._onOpenBtnClick.bind(this));
    this._shadowRoot
      .getElementById('btnClose')
      .addEventListener('click', this._onCloseBtnClick.bind(this));
    this._navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('click-nav-item'));
      });
    });
  }

  disconnectedCallback() {
    this._shadowRoot
      .getElementById('btnOpen')
      .removeEventListener('click', this._onOpenBtnClick.bind(this));
    this._shadowRoot
      .getElementById('btnClose')
      .removeEventListener('click', this._onCloseBtnClick.bind(this));
    this._navLinks.forEach((link) => {
      link.removeEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('click-nav-item'));
      });
    });
  }

  render() {
    clearContent(this);
    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <nav class="topnav">
        <span id="nav-label" class="sr-only">Navigation menu</span>
        
        <button type="button" id="btnOpen" class="topnav__btnOpen" aria-expanded="false" aria-labelledby="nav-label">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z"/></svg>
        </button>
      
        <div class="topnav__menu" role="dialog" aria-labelledby="nav-label">
          <button type="button" class="topnav__btnClose" id="btnClose" aria-label="Close navigation menu">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </button>
          <ul aria-label="Main navigation" class="topnav__links">
            <li class="topnav__item">
              <a href="#/" class="topnav__link" aria-label="Home">Home</a>
            </li>
            <li class="topnav__item">
              <a href="#/favorite" class="topnav__link" aria-label="Favorite">Favorite</a>
            </li>
            <li class="topnav__item">
              <a href="#/about" class="topnav__link" aria-label="About Us">About Us</a>
            </li>
          </ul>
        </div>
      </nav>
    `;
  }

  _onOpenBtnClick() {
    this.dispatchEvent(new CustomEvent('click-open-nav-btn'));
  }

  _onCloseBtnClick() {
    this.dispatchEvent(new CustomEvent('click-close-nav-btn'));
  }
}

customElements.define('navigation-menu', NavigationMenu);
