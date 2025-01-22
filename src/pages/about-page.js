import styles from '../assets/styles/components/about-page.styles.scss';
import { clearContent } from '../utils/clearContent';

export default class Aboutpage extends HTMLElement {
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
      <section class="about-section">
        <div class="about-section__container">
          <h1 class="about-section__heading--primary">
            About Our Restaurant Catalog
          </h1>
          <p class="about-section__subheading">
            Welcome to our Restaurant Catalog, your ultimate guide to discovering popular dining spots! Our application is designed to provide users with easy access to a wide array of restaurants, from local favorites to internationally renowned establishments.
          </p>

          <h2 class="about-section__heading--secondary">
            What We Offer
          </h2>
          <p class="about-section__text">
            Take advantage of the following services we offer for your convenience:
          </p>
          <ul class="about-section__descriptions">
            <li class="about-section__description"><strong>
              Comprehensive Listings:</strong> Explore diverse restaurant options with detailed descriptions, ratings, and locations.
            </li>
            <li class="about-section__description">
              <strong>Personalized Recommendations:</strong> Receive recommendations based on your preferences to enhance your dining experience.
            </li>
            <li class="about-section__description">
              <strong>Easy-to-Use Interface:</strong> Our intuitive layout ensures seamless browsing and efficient searching.
            </li>
          </ul>

          <h2 class="about-section__heading--secondary">
            Features
          </h2>
          <p class="about-section__text">
            Our Restaurant Catalog offers features such as:
          </p>
          <ul class="about-section__descriptions">
            <li class="about-section__description">
              <strong>Search & Filter:</strong> Effortlessly search and filter restaurants by categories, location, or ratings.
            </li>
            <li class="about-section__description">
              <strong>Favorite Your Choices:</strong> Save your favorite restaurants to access them later in a dedicated favorites list.
            </li>
            <li class="about-section__description">
              <strong>Up-to-Date Information:</strong> Regularly updated to ensure you have the latest information on top dining spots.
            </li>
          </ul>

          <h2 class="about-section__heading--secondary">
            Our Vision
          </h2>
          <p class="about-section__text">
            We aim to help food lovers find the best restaurants with minimal effort. Whether you're a local or a traveler, our catalog connects you to culinary destinations that suit every taste and budget.
          </p>

          <h2 class="about-section__heading--secondary">
            About the Developer
          </h2>
          <p class="about-section__text">
            Developed with a passion for both food and technology, this catalog reflects my dedication to creating an efficient yet enjoyable browsing experience. Every detail, from layout to functionality, is carefully crafted to provide a top-notch user experience.
          </p>
          
          <br/>
          
          <p class="about-section__text">
            Connect with me on <a href="https://linkedin.com/in/wahyukmr" target="_blank" class="about-section__anchor" aria-label="Visit my LinkedIn profile">LinkedIn</a> to learn more about my work and future projects.
          </p>
        </div>
      </section>
    `;
  }
}
