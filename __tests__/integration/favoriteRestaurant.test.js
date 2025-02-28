import '../../__tests__/mocks/listRestaurantItemDetail.mock';
import { mockRestaurant } from '../mocks';
import RestoDetailController from '../../src/scripts/controllers/RestoDetailController';
import RestoDetailModel from '../../src/scripts/models/RestoDetailModel';
import RestoDetailView from '../../src/scripts/views/RestoDetailView';
import domService from '../../src/services/domService';
import { showErrorNotification, showSuccessNotification } from '../../src/utils';
import {
  createIndexedDBService,
  setupDomFavoriteAndUnfavoriteResto,
  setupMockFavoriteAndUnfavoriteResto as setupMocks,
} from '../helpers';

jest.mock('../../src/utils', () => ({
  showErrorNotification: jest.fn(() => Promise.resolve()),
  showSuccessNotification: jest.fn(() => Promise.resolve()),
}));

describe('Testing the favorite restaurant feature', () => {
  let indexedDBService, detailPage, detailFavoriteBtn, model, controller, view;

  beforeEach(async () => {
    indexedDBService = createIndexedDBService();

    const domElements = setupDomFavoriteAndUnfavoriteResto();

    detailFavoriteBtn = domElements.detailFavoriteBtn;
    detailPage = domElements.detailPage;

    model = new RestoDetailModel();
    view = new RestoDetailView(detailPage);
    controller = new RestoDetailController({
      favoriteRestaurantIdb: indexedDBService,
      restoDetailPage: detailPage,
      model,
      view,
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('positive scenarios', () => {
    test('should render the favorite button if the restaurant is not already in favorites', async () => {
      setupMocks({
        isFavorited: false,
        indexedDBService,
        detailPage,
        detailFavoriteBtn,
        model,
        view,
      });

      await controller.init();

      const textSpan = detailFavoriteBtn.querySelector('span');
      expect(textSpan).not.toBeNull();
      expect(textSpan.textContent).toBe('Favorite');
      expect(detailFavoriteBtn.getAttribute('aria-pressed')).toBe('false');
      expect(detailFavoriteBtn.getAttribute('aria-label')).toBe('Mark this restaurant as favorite');
    });

    test('should add restaurant to favorites when favorite button is clicked', async () => {
      setupMocks({
        isFavorited: false,
        indexedDBService,
        detailPage,
        detailFavoriteBtn,
        model,
        view,
      });
      jest.spyOn(indexedDBService, 'put');

      await controller.init();

      detailFavoriteBtn.click();

      expect(await indexedDBService.put).toHaveBeenCalledWith(mockRestaurant);

      const resto = await indexedDBService.getAll();
      expect(resto).toEqual([mockRestaurant]);
    });

    test('should show notify success when a restaurant is added to favorites', async () => {
      setupMocks({
        isFavorited: false,
        indexedDBService,
        detailPage,
        detailFavoriteBtn,
        model,
        view,
      });
      jest.spyOn(indexedDBService, 'put').mockResolvedValue(mockRestaurant);

      await controller.init();

      detailFavoriteBtn.click();

      await indexedDBService.put;

      await Promise.resolve();

      expect(showSuccessNotification).toHaveBeenCalledWith(
        'The restaurant has been added from the favorites list',
      );
    });

    test('should disable the favorite button while processing favorite button clicked', async () => {
      setupMocks({
        isFavorited: false,
        indexedDBService,
        detailPage,
        detailFavoriteBtn,
        model,
        view,
      });
      jest.spyOn(indexedDBService, 'put').mockResolvedValue(mockRestaurant);

      await controller.init();

      expect(detailFavoriteBtn.disabled).toBe(false);

      await detailFavoriteBtn.click();

      expect(detailFavoriteBtn.disabled).toBe(true);

      await Promise.resolve();

      expect(detailFavoriteBtn.disabled).toBe(false);
    });

    test('should render the favorite button with the favorite state and proper attributes', () => {
      jest.spyOn(domService, 'setAttribute');

      view.renderFavoriteButton(detailFavoriteBtn, false);

      // Pastikan elemen <span> dibuat
      const textSpan = detailFavoriteBtn.querySelector('span');
      expect(textSpan).not.toBeNull();

      // Periksa atribut yang di-set dengan domService
      expect(domService.setAttribute).toHaveBeenCalledWith(
        detailFavoriteBtn,
        'aria-pressed',
        'false',
      );
      expect(domService.setAttribute).toHaveBeenCalledWith(
        detailFavoriteBtn,
        'aria-label',
        'Mark this restaurant as favorite',
      );

      // Validasi teks elemen <span>
      expect(textSpan.textContent).toBe('Favorite');
    });
  });

  describe('negative scenarios', () => {
    test('should not render the unfavorite button if the restaurant is not already in favorites', async () => {
      setupMocks({
        isFavorited: false,
        indexedDBService,
        detailPage,
        detailFavoriteBtn,
        model,
        view,
      });

      await controller.init();

      const textSpan = detailFavoriteBtn.querySelector('span');
      expect(textSpan).not.toBeNull();
      expect(textSpan.textContent).not.toBe('Unfavorite');
      expect(detailFavoriteBtn.getAttribute('aria-pressed')).not.toBe('true');
      expect(detailFavoriteBtn.getAttribute('aria-label')).not.toBe('Unfavorite this restaurant');
    });

    test('should show correct error message when a restaurant is added to favorites', async () => {
      const errorMessage = 'Specific error occurred';

      setupMocks({
        isFavorited: false,
        indexedDBService,
        detailPage,
        detailFavoriteBtn,
        model,
        view,
      });
      jest.spyOn(indexedDBService, 'put').mockRejectedValue(new Error(errorMessage));

      await controller.init();

      detailFavoriteBtn.click();

      await indexedDBService.put;

      await Promise.resolve();

      expect(showErrorNotification).toHaveBeenCalledWith(errorMessage);
    });

    test('should show a default error message if error has no message when adding a restaurant to favorites', async () => {
      setupMocks({
        isFavorited: false,
        indexedDBService,
        detailPage,
        detailFavoriteBtn,
        model,
        view,
      });
      jest.spyOn(indexedDBService, 'put').mockRejectedValue(new Error());

      await controller.init();

      detailFavoriteBtn.click();

      await indexedDBService.put;

      await Promise.resolve();

      expect(showErrorNotification).toHaveBeenCalledWith(
        'An error occurred while handling the favorite button',
      );
    });
  });
});
