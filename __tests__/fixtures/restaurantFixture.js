import { test as base } from '@playwright/test';
import { API_ENPOINTS, DATABASE } from '../../src/config/constants';
import { navigateFromHeroToRestoList } from '../helpers';

export const test = base.extend({
  restaurantList: async ({ page }, use) => {
    await page.goto('/');

    const response = await page.request.get(API_ENPOINTS.RESTO_LIST);
    const data = await response.json();

    if (!data.restaurants || data.restaurants.length === 0) {
      throw new Error('No restaurants found from API.');
    }

    const firstRestaurant = data.restaurants[0];
    const lastRestaurant = data.restaurants[data.restaurants.length - 1];

    if (!firstRestaurant.id) {
      throw new Error('🚨 First restaurant does not have an ID.');
    }

    await use({ firstRestaurant, lastRestaurant });
  },

  favoriteRestaurant: async ({ page, restaurantList }, use) => {
    const { firstRestaurant } = restaurantList;

    await page.evaluate(
      async ({ restaurantId, dbConfig }) => {
        return new Promise((resolve, reject) => {
          const dbRequest = window.indexedDB.open(dbConfig.NAME, dbConfig.VERSION);
          dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(dbConfig.OBJECT_STORE_NAME, 'readwrite');
            const store = tx.objectStore(dbConfig.OBJECT_STORE_NAME);
            const putRequest = store.delete(restaurantId);

            putRequest.onsuccess = () => {
              resolve();
            };

            putRequest.onerror = (e) => {
              reject(e);
            };
          };

          dbRequest.onerror = (e) => {
            reject(e);
          };
        });
      },
      { restaurantId: firstRestaurant.id, dbConfig: DATABASE },
    );

    await navigateFromHeroToRestoList(page);

    await use({ firstRestaurant });
  },

  unfavoriteRestaurant: async ({ page, restaurantList }, use) => {
    const { firstRestaurant } = restaurantList;

    await page.evaluate(
      async ({ restaurant, dbConfig }) => {
        return new Promise((resolve, reject) => {
          const dbRequest = window.indexedDB.open(dbConfig.NAME, dbConfig.VERSION);
          dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(dbConfig.OBJECT_STORE_NAME, 'readwrite');
            const store = tx.objectStore(dbConfig.OBJECT_STORE_NAME);
            const putRequest = store.put({ ...restaurant, favorited: true });

            putRequest.onsuccess = () => {
              resolve();
            };

            putRequest.onerror = (e) => {
              reject(e);
            };
          };

          dbRequest.onerror = (e) => {
            reject(e);
          };
        });
      },
      { restaurant: firstRestaurant, dbConfig: DATABASE },
    );

    await navigateFromHeroToRestoList(page);

    await use({ firstRestaurant });
  },
});
