class DomService {
  toggleClass(element, className, condition) {
    element.classList.toggle(className, condition);
  }

  addClass(element, className) {
    element.classList.add(className);
  }

  removeClass(element, className) {
    element.classList.remove(className);
  }

  setAttribute(element, attribute, value) {
    element.setAttribute(attribute, value);
  }

  getAttribute(element, attribute) {
    return element.getAttribute(attribute);
  }

  removeAttribute(element, attribute) {
    element.removeAttribute(attribute);
  }
}

export default new DomService();
