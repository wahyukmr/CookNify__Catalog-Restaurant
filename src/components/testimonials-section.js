import styles from '../assets/styles/components/testimonials-section.styles.scss';
import { clearContent, lazysizesForShadowDom } from '../utils';
import jamesBrown from '../assets/images/james-brown.jpg';
import mariaLopez from '../assets/images/maria-lopez.jpg';
import lisaChen from '../assets/images/lisa-chen.jpg';

class TestimonialsSection extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  connectedCallback() {
    lazysizesForShadowDom(this._shadowRoot, '.testimonial__picture');
  }

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <section class="testimonials">
        <div class="testimonials__container">
          <h2 class="testimonials__header">What people say</h2>
          <p class="testimonials__description">
            Discover what our guests have to say about their dining experiences at our featured restaurants.
          </p>
          <div class="testimonial">
            <article class="testimonial__card">
              <div class="wrapper">
                <picture class="testimonial__picture">
                  <div class="skeleton"></div>
                  <source
                    class="lazyload"
                    type="image/webp"
                    data-srcset="${mariaLopez}?as=webp">
                  <source
                    class="lazyload"
                    type="image/jpeg"
                    data-srcset="${mariaLopez}">
                  <img
                    data-src="${mariaLopez}" alt="Profile picture of Maria Lopez"
                    width="120"
                    height="120"
                    class="testimonial__picture-avatar lazyload">
                </picture>
              </div>
              <div class="testimonial__profile">
                <h3 class="testimonial__name">Maria Lopez</h3>
                <p class="testimonial__role">Food Blogger</p>
              </div>
              <p class="testimonial__text">
                "The variety and quality of restaurants on this platform are outstanding! I always find new gems that exceed my expectations every time."
              </p>
            </article>
            <article class="testimonial__card">
              <div class="wrapper">
                <picture class="testimonial__picture">
                  <div class="skeleton"></div>
                  <source
                    class="lazyload"
                    type="image/webp"
                    data-srcset="${jamesBrown}?as=webp">
                  <source
                    class="lazyload"
                    type="image/jpeg"
                    data-srcset="${jamesBrown}">
                  <img
                    data-src="${jamesBrown}" alt="Profile picture of James Brown"
                    loading="lazy"
                    width="120"
                    height="120"
                    class="testimonial__picture-avatar lazyload">
                </picture>
              </div>
              <div class="testimonial__profile">
                <h3 class="testimonial__name">James Brown</h3>
                <p class="testimonial__role">Frequent Diner</p>
              </div>
              <p class="testimonial__text">
                "Thanks to this catalog, I discovered my new favorite spot. The user-friendly layout and detailed reviews made choosing a restaurant effortless!"
              </p>
            </article>
            <article class="testimonial__card">
              <div class="wrapper">
                <picture class="testimonial__picture">
                  <div class="skeleton"></div>
                  <source
                    class="lazyload"
                    type="image/webp"
                    data-srcset="${lisaChen}?as=webp">
                  <source
                    class="lazyload"
                    type="image/jpeg"
                    data-srcset="${lisaChen}">
                  <img
                    data-src="${lisaChen}" alt="Profile picture of Lisa Chen"
                    loading="lazy"
                    width="120"
                    height="120"
                    class="testimonial__picture-avatar lazyload">
                </picture>
              </div>
              <div class="testimonial__profile">
                <h3 class="testimonial__name">Lisa Chen</h3>
                <p class="testimonial__role">Chef</p>
              </div>
              <p class="testimonial__text">
                "As a chef, I appreciate the exposure this platform provides. It’s a fantastic way for food enthusiasts to discover our culinary offerings."
              </p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('testimonials-section', TestimonialsSection);
