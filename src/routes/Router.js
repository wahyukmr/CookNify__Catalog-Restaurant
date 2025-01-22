import { ROUTE } from '../config/constants.js';
import domService from '../services/domService.js';
import { serviceWorkerRegister, showErrorNotification } from '../utils';

export default class Router {
  constructor(routeHandlers, mainElement) {
    this._routes = routeHandlers;
    this._mainElement = mainElement;
    this._handleRouteChange = this._handleRouteChange.bind(this);
  }

  startListening() {
    window.addEventListener('hashchange', async () => {
      await this._handleRouteChange();
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    });
    window.addEventListener('load', async () => {
      await this._handleRouteChange();
      await serviceWorkerRegister();
    });
  }

  async _handleRouteChange() {
    const { path, paramId, isValidRoute } = this._extractRouteAndParam();
    const notFoundRoutePage = () => import('../pages/not-found-route-page.js');

    let pageLoader;
    if (isValidRoute) {
      pageLoader = this._routes[path] || notFoundRoutePage;
    } else {
      pageLoader = notFoundRoutePage;
    }

    if (pageLoader) {
      this._mainElement.innerHTML = '';
      const loaderElement = document.createElement('loader-section');
      this._mainElement.appendChild(loaderElement);

      try {
        const { default: Page } = await pageLoader();
        const componentName = this._getComponentName(path);

        if (!customElements.get(componentName)) {
          customElements.define(componentName, Page);
        }

        this._mainElement.innerHTML = '';
        const pageElement = document.createElement(componentName);

        if (paramId) {
          domService.setAttribute(pageElement, 'data-id', paramId);
        }

        this._mainElement.appendChild(pageElement);
      } catch (error) {
        showErrorNotification(error.message);
      }
    } else {
      showErrorNotification(`Route ${path} not found`);
    }
  }

  _extractRouteAndParam() {
    const url = window.location.hash.slice(1).toLowerCase();
    const urlSplits = url.split('/');
    let path = '/';
    let paramId = null;
    let isValidRoute = true;

    if (urlSplits.length >= 2) path = `/${urlSplits[1]}`;
    if (urlSplits.length >= 3) path += `/${urlSplits[2]}`;
    if (path === '/resto-list/detail' && urlSplits.length === 4) {
      path += '/:id';
      paramId = urlSplits[3];
    } else if (path === '/resto-list/detail' && urlSplits.length > 4) {
      isValidRoute = false;
    }

    return { path, paramId, isValidRoute };
  }

  _getComponentName(route) {
    const { HOME, FAVORITE, RESTO_LIST, RESTO_DETAIL, ABOUT } = ROUTE;

    switch (route) {
      case HOME:
        return 'home-page';
      case FAVORITE:
        return 'favorite-page';
      case RESTO_LIST:
        return 'resto-list-page';
      case RESTO_DETAIL:
        return 'resto-detail-page';
      case ABOUT:
        return 'about-page';
      default:
        return 'not-found-route-page';
    }
  }
}
