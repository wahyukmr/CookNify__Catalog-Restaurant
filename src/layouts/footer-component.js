import styles from '../assets/styles/components/footer-component.styles.scss';

class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  render() {
    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <footer class="footer">
        <section class="footer__brand">
          <brand-logo></brand-logo>
          <p class="footer__brand--description">
            Cooknify is a project designed to showcase popular restaurants with reliable and detailed information.
            Built to enhance your dining experience by helping you find the perfect spot that matches your taste.
          </p>
        </section>

        <p class="footer__copyright">© ${new Date().getFullYear()} <strong>Cooknify</strong>, All rights reserved. Made with 💖 from <strong>"Indie Programmer"</strong></p>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);
