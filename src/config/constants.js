const BASE_API_URL = process.env.BASE_API_URL;

const RESTO_IMG_SMALL = `${BASE_API_URL}/images/small`;
const RESTO_IMG_MEDIUM = `${BASE_API_URL}/images/medium`;
const RESTO_IMG_LARGE = `${BASE_API_URL}/images/large`;

const API_ENPOINTS = {
  RESTO_LIST: `${BASE_API_URL}/list`,
  RESTO_DETAIL: (id) => `${BASE_API_URL}/detail/${id}`,
  RESTO_SEARCH: (query) => `${BASE_API_URL}/search?q=${query}`,
  REVIEW: `${BASE_API_URL}/review`,
};

const TIMEOUT = {
  SHORT: 1000,
  LONG: 5000,
};

const ROUTE = {
  HOME: '/',
  FAVORITE: '/favorite',
  RESTO_LIST: '/resto-list',
  RESTO_DETAIL: '/resto-list/detail/:id',
  ABOUT: '/about',
};

const DATABASE = {
  NAME: process.env.DATABASE_NAME,
  VERSION: Number(process.env.DATABASE_VERSION) || 1,
  OBJECT_STORE_NAME: process.env.DATABASE_OBJECT_STORE_NAME,
};

const SHORT_LABELS = {
  all: 'All Restaurants',
  4: '4+ ⭐',
  3: '3+ ⭐',
  2: '≤2 ⭐',
};

export {
  BASE_API_URL,
  API_ENPOINTS,
  TIMEOUT,
  ROUTE,
  RESTO_IMG_MEDIUM,
  RESTO_IMG_LARGE,
  RESTO_IMG_SMALL,
  DATABASE,
  SHORT_LABELS,
};
