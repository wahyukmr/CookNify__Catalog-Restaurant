import heroImage1031 from '../assets/images/hero-image,w_1031.jpg';
import heroImage1248 from '../assets/images/hero-image,w_1248.jpg';
import heroImage1400 from '../assets/images/hero-image,w_1400.jpg';
import heroImage200 from '../assets/images/hero-image,w_200.jpg';
import heroImage555 from '../assets/images/hero-image,w_555.jpg';
import heroImage815 from '../assets/images/hero-image,w_815.jpg';
import styles from '../assets/styles/components/hero-section.styles.scss';
import { lazysizesForShadowDom } from '../utils';
import { clearContent } from '../utils/clearContent';

class HeroSection extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
    this._onCtaButtonClick = this._onCtaButtonClick.bind(this);
  }

  get webpSrcset() {
    return `
      ${heroImage200}?as=webp 200w,
      ${heroImage555}?as=webp 555w,
      ${heroImage815}?as=webp 815w,
      ${heroImage1031}?as=webp 1031w,
      ${heroImage1248}?as=webp 1248w,
      ${heroImage1400}?as=webp 1400w
    `;
  }

  get jpegSrcset() {
    return `
      ${heroImage200} 200w,
      ${heroImage555} 555w,
      ${heroImage815} 815w,
      ${heroImage1031} 1031w,
      ${heroImage1248} 1248w,
      ${heroImage1400} 1400w
    `;
  }

  connectedCallback() {
    this._shadowRoot.querySelector('#heroCtaBtn').addEventListener('click', this._onCtaButtonClick);

    lazysizesForShadowDom(this._shadowRoot, '.hero__image-container');
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector('#heroCtaBtn')
      .removeEventListener('click', this._onCtaButtonClick);
  }

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <section class="hero">
        <picture class="hero__image-container">
          <div class="skeleton"></div>
          <source
            type="image/webp"
            data-srcset="${this.webpSrcset}"
            data-sizes="auto">
          <source
            type="image/jpeg"
            data-srcset="${this.jpegSrcset}"
            data-sizes="auto">
          <img 
            class="hero__image-content lazyload" 
            data-src="${heroImage1400}" 
            data-srcset="${this.jpegSrcset}"
            data-sizes="auto"
            alt="Top view of a dark surface with a bowl containing four cookies, surrounded by yellow flowers, scattered crumbs, and slices of lemon"
            max-width="1200"
            max-height="750">
        </picture>
        
        <div class="hero__content">
          <h1 class="hero__heading">
            Discover <span class="hero__heading--highlight">Exceptional Culinary Experiences</span> Curated Just for You
          </h1>
          <p class="hero__description">Discover unique flavors and exclusive dining spots curated just for you, all at your fingertips. Find the perfect restaurant for every occasion.</p>
          <a href="#/resto-list" role="button" id="heroCtaBtn" class="hero__cta-button" aria-label="Explore restaurants now">
            <span class="hero__cta-text">Explore Now</span>
            <svg class="hero__cta-svg" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="none">
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
            </svg>
          </a>
        </div>
      </section>
    `;
  }

  _onCtaButtonClick() {
    this.dispatchEvent(new CustomEvent('heroCtaBtnClick'));
  }
}

customElements.define('hero-section', HeroSection);
