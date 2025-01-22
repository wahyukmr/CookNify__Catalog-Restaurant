import { ROUTE } from '../config/constants.js';

const { HOME, FAVORITE, RESTO_LIST, RESTO_DETAIL, ABOUT } = ROUTE;

export default {
  [HOME]: () => import('../pages/home-page.js'),
  [RESTO_LIST]: () => import('../pages/resto-list-page.js'),
  [RESTO_DETAIL]: () => import('../pages/resto-detail-page.js'),
  [FAVORITE]: () => import('../pages/favorite-page.js'),
  [ABOUT]: () => import('../pages/about-page.js'),
};
