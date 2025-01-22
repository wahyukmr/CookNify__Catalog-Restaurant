import domService from '../services/domService';
import { clearContent } from '../utils';

export default class HomePage extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this._sections = [
      { tag: 'hero-section' },
      { tag: 'features-section' },
      { tag: 'testimonials-section' },
    ];
    this._observer = null;
    this.render();
  }

  connectedCallback() {
    this._initializeObserver();
    this._observeSections();
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  render() {
    clearContent(this);
  }

  _initializeObserver() {
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const placeholder = entry.target;
            const tagName = domService.getAttribute(placeholder, 'data-tag');
            this._loadSection(tagName, placeholder);
            this._observer.unobserve(placeholder);
          }
        });
      },
      {
        root: null, // Viewport
        rootMargin: '0px',
        threshold: 0.15, // Hanya aktif jika elemen terlihat 15%
      },
    );
  }

  _observeSections() {
    this._sections.forEach((section) => {
      const placeholder = document.createElement('div');
      domService.setAttribute(placeholder, 'data-tag', section.tag);
      placeholder.style.minHeight = '100vh';
      placeholder.style.backgroundColor = 'rgb(95, 20, 21)';

      // Tambahkan placeholder ke shadow DOM
      this._shadowRoot.appendChild(placeholder);

      // Awasi placeholder dengan observer
      this._observer.observe(placeholder);
    });
  }

  _loadSection(tagName, placeholder) {
    const customElement = document.createElement(tagName);

    this._shadowRoot.replaceChild(customElement, placeholder);
  }
}
