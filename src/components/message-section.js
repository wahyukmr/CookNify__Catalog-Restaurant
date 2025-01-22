import styles from '../assets/styles/components/message-section.styles.scss';
import { clearContent } from '../utils/clearContent';

class MessageSection extends HTMLElement {
  _textMessage = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  set textMessage(msg) {
    this._textMessage = msg;
    this.render();
  }

  get textMessage() {
    return this._textMessage;
  }

  render() {
    clearContent(this);

    this._style.textContent = styles;
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <section class="message">
        <p class="message__content">${this._textMessage}</p>
      </section>
    `;
  }
}

customElements.define('message-section', MessageSection);
