export class DomHandlerNestedSelectors {
  /**
   * @param {Document | HTMLElement | ShadowRoot} root - Root element (e.g., document, shadowRoot or normal DOM root)
   * @param {Object} elementMap - Map of element selectors or callbacks
   * @param {Boolean} isValidated - Choice to validate the element or not
   */
  constructor(root, elementMap, isValidated) {
    this._root =
      root === document || root instanceof ShadowRoot || root instanceof HTMLElement ? root : null;
    this._elementMap = elementMap || {};
    this._isValidate = isValidated;
  }

  /**
   * Resolves and validates DOM elements based on the provided map
   * @returns {Object} Map of resolved DOM elements
   */
  get elements() {
    if (!this._root) throw new Error('Invalid root element');

    const resolvedElements = {};

    for (const [key, selectorOrCallback] of Object.entries(this._elementMap)) {
      resolvedElements[key] = this._resolveElement(selectorOrCallback);
    }

    if (this._isValidate) {
      this._validateElements(resolvedElements);
    }
    return resolvedElements;
  }

  /**
   * Resolves a single element based on a selector string or callback function
   * @param {String | Function} selectorOrCallback
   * @returns {HTMLElement | null} resolved element
   */
  _resolveElement(selectorOrCallback) {
    if (typeof selectorOrCallback === 'string') {
      return this._resolveNestedSelectors(selectorOrCallback);
    }

    if (typeof selectorOrCallback === 'function') {
      return selectorOrCallback(this._root);
    }

    throw new Error('Invalid selector or callback: must be a string or function.');
  }

  /**
   * Resolved nested selectors, including those involving shadowRoots
   * @param {String} selector - Nested selector, with levels separated by ' >> '
   * @returns {HTMLElement | null} Resolved element
   */
  _resolveNestedSelectors(selector) {
    const levels = selector.split('>>').map((level) => level.trim());
    let currentContext = this._root;

    for (const level of levels) {
      if (
        currentContext instanceof Document ||
        currentContext instanceof ShadowRoot ||
        currentContext instanceof HTMLElement
      ) {
        // Periksa apakah selector memiliki flag khusus `!`
        const isNoShadow = level.endsWith('!');
        const cleanedLevel = isNoShadow ? level.slice(0, -1) : level; // Hapus `!` jika ada

        // Seleksi elemen berdasarkan ID atau querySelector
        currentContext = cleanedLevel.startsWith('#')
          ? currentContext.getElementById(cleanedLevel.slice(1))
          : currentContext.querySelector(cleanedLevel);

        // Jika elemen ditemukan dan tidak ada flag `!`, masuk ke shadowRoot
        if (currentContext?.shadowRoot && !isNoShadow) {
          currentContext = currentContext.shadowRoot;
        }
      } else {
        return null;
      }
    }

    return currentContext;
  }

  /**
   * Validate that all resolved elements are not null
   * @param {Object} elements Resolved elements
   */
  _validateElements(elements) {
    if (Object.values(elements).some((el) => el == null)) {
      throw new Error('Some required DOM elements are missing');
    }
  }
}
