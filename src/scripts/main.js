import 'regenerator-runtime'; /* for async await transpile */
import '../assets/styles/main.scss';
import '../components/index.js';
import '../layouts/index.js';
import routeHandlers from '../routes/routeHandlers.js';
import Router from '../routes/Router.js';
import RestoListController from './controllers/RestoListController.js';
import IndexedDBService from '../services/IndexedDBServices.js';
import RestoDetailController from './controllers/RestoDetailController.js';
import NavigationView from './views/NavigationView.js';
import RestoFavoriteController from './controllers/RestoFavoriteController.js';
import { DomHandlerNestedSelectors } from '../utils/DomHandlerNestedSelectors.js';
import { DATABASE } from '../config/constants.js';
import RestoDetailModel from './models/RestoDetailModel.js';
import RestoDetailView from './views/RestoDetailView.js';
import RestoFavoriteView from './views/RestoFavoriteView.js';
import RestoFavoriteModel from './models/RestoFavoriteModel.js';
import RestoListView from './views/RestoListView.js';
import RestoListModel from './models/RestoListModel.js';

function initializeApp() {
  const domElements = new DomHandlerNestedSelectors(
    document,
    {
      bodyElement: 'body',
      headerElement: 'header-component >> header',
      mainElement: 'main',
      skipToContentButton: '.skip-to-content',
      navigationMenuElement: 'navigation-menu!',
      brandLogoElement: 'brand-logo!',
    },
    true,
  );

  const elements = domElements.elements;

  initializeRouter(elements.mainElement);
  initializeNavigation(elements);
  initializeRestoListObserver(elements.mainElement);
}

function initializeRouter(mainElement) {
  const router = new Router(routeHandlers, mainElement);
  router.startListening();
}

function initializeNavigation(elements) {
  const navigationView = new NavigationView(elements);
  navigationView.initialize();
}

function initializeRestoListObserver(mainElement) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        const { restoListPage, restoFavoritePage, restoDetailPage } = new DomHandlerNestedSelectors(
          mainElement,
          {
            restoListPage: 'resto-list-page!',
            restoFavoritePage: 'favorite-page!',
            restoDetailPage: 'resto-detail-page!',
          },
          false,
        ).elements;

        const favoriteRestaurantIdb = new IndexedDBService({
          databaseName: DATABASE.NAME,
          databaseVersion: DATABASE.VERSION,
          objectStoreName: DATABASE.OBJECT_STORE_NAME,
        });

        if (restoListPage) {
          const model = new RestoListModel(favoriteRestaurantIdb);
          const view = new RestoListView(restoListPage);
          const controller = new RestoListController({
            model,
            view,
          });
          controller.init();
        }
        if (restoFavoritePage) {
          const model = new RestoFavoriteModel(favoriteRestaurantIdb);
          const view = new RestoFavoriteView(restoFavoritePage);
          const controller = new RestoFavoriteController({
            model,
            view,
          });
          controller.init();
        }
        if (restoDetailPage) {
          const model = new RestoDetailModel();
          const view = new RestoDetailView(restoDetailPage);
          const controller = new RestoDetailController({
            favoriteRestaurantIdb,
            restoDetailPage,
            model,
            view,
          });
          controller.init();
        }
      }
    });
  });

  observer.observe(mainElement, { childList: true });
}

document.addEventListener('DOMContentLoaded', initializeApp);
