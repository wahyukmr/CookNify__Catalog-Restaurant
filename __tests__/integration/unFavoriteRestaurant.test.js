import '../../__tests__/mocks/listRestaurantItemDetail.mock';
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

describe('Testing the unfavorite restaurant feature', () => {
  let indexedDBService, detailPage, favoriteBtn, model, controller, view;

  beforeEach(async () => {
    indexedDBService = createIndexedDBService();

    const domElements = setupDomFavoriteAndUnfavoriteResto();

    favoriteBtn = domElements.favoriteBtn;
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
    test('should render the unfavorite button if the restaurant is already in favorites', async () => {
      setupMocks({ isFavorited: true, indexedDBService, detailPage, favoriteBtn, model, view });

      await controller.init();

      const textSpan = favoriteBtn.querySelector('span');
      expect(textSpan).not.toBeNull();
      expect(textSpan.textContent).toBe('Unfavorite');
      expect(favoriteBtn.getAttribute('aria-pressed')).toBe('true');
      expect(favoriteBtn.getAttribute('aria-label')).toBe('Unfavorite this restaurant');
    });

    test('should remove restaurant to favorites when unfavorite button is clicked', async () => {
      setupMocks({ isFavorited: true, indexedDBService, detailPage, favoriteBtn, model, view });
      jest.spyOn(indexedDBService, 'delete');

      await controller.init();

      favoriteBtn.click();

      expect(await indexedDBService.delete).toHaveBeenCalled();

      const resto = await indexedDBService.getAll();
      expect(resto).toEqual([]);
    });

    test('should show notify success when a restaurant is removed to favorites', async () => {
      setupMocks({ isFavorited: true, indexedDBService, detailPage, favoriteBtn, model, view });
      jest.spyOn(indexedDBService, 'delete').mockResolvedValue();

      await controller.init();

      favoriteBtn.click();

      await indexedDBService.delete;

      await Promise.resolve();

      expect(showSuccessNotification).toHaveBeenCalledWith(
        'The restaurant has been removed from the favorites list',
      );
    });

    test('should disable the unfavorite button while processing unfavorite button clicked', async () => {
      setupMocks({ isFavorited: true, indexedDBService, detailPage, favoriteBtn, model, view });
      jest.spyOn(indexedDBService, 'delete').mockResolvedValue();

      await controller.init();

      expect(favoriteBtn.disabled).toBe(false);

      await favoriteBtn.click();

      expect(favoriteBtn.disabled).toBe(true);

      await Promise.resolve();

      expect(favoriteBtn.disabled).toBe(false);
    });

    test('should render the unfavorite button with the unfavorite state and proper attributes', () => {
      jest.spyOn(domService, 'setAttribute');

      view.renderFavoriteButton(favoriteBtn, true);

      // Pastikan elemen <span> dibuat
      const textSpan = favoriteBtn.querySelector('span');
      expect(textSpan).not.toBeNull();

      // Periksa atribut yang di-set dengan domService
      expect(domService.setAttribute).toHaveBeenCalledWith(favoriteBtn, 'aria-pressed', 'true');
      expect(domService.setAttribute).toHaveBeenCalledWith(
        favoriteBtn,
        'aria-label',
        'Unfavorite this restaurant',
      );

      // Validasi teks elemen <span>
      expect(textSpan.textContent).toBe('Unfavorite');
    });
  });

  describe('negative scenarios', () => {
    test('should not render the favorite button if the restaurant is already in favorites', async () => {
      setupMocks({ isFavorited: true, indexedDBService, detailPage, favoriteBtn, model, view });

      await controller.init();

      const textSpan = favoriteBtn.querySelector('span');
      expect(textSpan).not.toBeNull();
      expect(textSpan.textContent).not.toBe('Favorite');
      expect(favoriteBtn.getAttribute('aria-pressed')).not.toBe('false');
      expect(favoriteBtn.getAttribute('aria-label')).not.toBe('Mark this restaurant as favorite');
    });

    test('should show correct error message when a restaurant is removed to favorites', async () => {
      const errorMessage = 'Specific error occurred';

      setupMocks({ isFavorited: true, indexedDBService, detailPage, favoriteBtn, model, view });
      jest.spyOn(indexedDBService, 'delete').mockRejectedValue(new Error(errorMessage));

      await controller.init();

      favoriteBtn.click();

      await indexedDBService.delete;

      await Promise.resolve();

      expect(showErrorNotification).toHaveBeenCalledWith(errorMessage);
    });

    test('should show a default error message if error has no message when adding a restaurant to favorites', async () => {
      setupMocks({ isFavorited: true, indexedDBService, detailPage, favoriteBtn, model, view });
      jest.spyOn(indexedDBService, 'delete').mockRejectedValue(new Error());

      await controller.init();

      favoriteBtn.click();

      await indexedDBService.delete;

      await Promise.resolve();

      expect(showErrorNotification).toHaveBeenCalledWith(
        'An error occurred while handling the favorite button',
      );
    });
  });
});
