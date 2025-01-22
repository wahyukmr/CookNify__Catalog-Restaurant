class MockListRestaurantItemDetail extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._dataRestaurant = {};
    this.render();
  }

  set dataRestaurant(data) {
    this._dataRestaurant = data;
    this.render();
  }

  get dataRestaurant() {
    return this._dataRestaurant;
  }

  connectedCallback() {
    this._detailFavoriteBtn = this._shadowRoot.getElementById('detailFavoriteBtn');
    this._detailFavoriteBtn.addEventListener('click', this._onCLickFavorite.bind(this));
  }

  render() {
    this._shadowRoot.innerHTML = `
      <button type="button" id="detailFavoriteBtn" class="favorite-btn"></button>
    `;
  }

  _onCLickFavorite() {
    const customEvent = new CustomEvent('click-favorite', {
      detail: { dataResto: this._dataRestaurant },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define('mock-list-restaurant-item-detail', MockListRestaurantItemDetail);
