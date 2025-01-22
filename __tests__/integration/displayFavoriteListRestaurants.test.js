import RestoFavoriteModel from '../../src/scripts/models/RestoFavoriteModel';
import RestoFavoriteController from '../../src/scripts/controllers/RestoFavoriteController';
import RestoBaseView from '../../src/scripts/views/base/RestoBaseView';
import { showErrorNotification } from '../../src/utils';
import { createIndexedDBService } from '../helpers';

jest.mock('../../src/utils', () => ({
  showErrorNotification: jest.fn(),
}));

const mockRenderer = {
  clearContainer: jest.fn(),
  createLoaderElement: jest.fn(),
  createFallbackElement: jest.fn(),
};

const mockBatchLoader = {
  initialize: jest.fn(),
  setRestaurants: jest.fn(),
  renderInitialBatch: jest.fn(),
};

const mockItemNavigation = {
  initialize: jest.fn(),
  updateButtonsState: jest.fn(),
};

describe('should display a list of favorite restaurants', () => {
  let indexedDBService, model, view, controller;

  const mockRestaurants = [
    { id: 1, name: 'Restaurant A', description: 'Description A', favorited: true },
    { id: 2, name: 'Restaurant B', description: 'Description B', favorited: true },
  ];

  beforeEach(() => {
    indexedDBService = createIndexedDBService();

    model = new RestoFavoriteModel(indexedDBService);
    view = new RestoBaseView({
      renderer: mockRenderer,
      itemNavigation: mockItemNavigation,
      batchLoader: mockBatchLoader,
    });
    mockBatchLoader.initialize();
    controller = new RestoFavoriteController({ model, view });

    view.initializeEvents();

    jest.spyOn(view, 'renderFallback');
    jest.spyOn(view, 'renderLoader');
    jest.spyOn(view, 'renderRestaurantItems');
    jest.spyOn(view, 'updateButtonsState');
  });

  afterEach(async () => {
    const restaurants = await indexedDBService.getAll();
    await Promise.all(restaurants.map((restaurant) => indexedDBService.delete(restaurant.id)));
    jest.clearAllMocks();
  });

  test('should display favorite restaurants correctly', async () => {
    await indexedDBService.bulkPut(mockRestaurants);

    await controller.init();

    expect(view.renderLoader).toHaveBeenCalled();
    expect(mockRenderer.clearContainer).toHaveBeenCalled();
    expect(mockRenderer.createLoaderElement).toHaveBeenCalled();

    expect(view.renderRestaurantItems).toHaveBeenCalledWith(mockRestaurants);
    expect(mockRenderer.clearContainer).toHaveBeenCalled();
    expect(mockBatchLoader.setRestaurants).toHaveBeenCalledWith(mockRestaurants);
    expect(mockBatchLoader.renderInitialBatch).toHaveBeenCalled();
    expect(view.updateButtonsState).toHaveBeenCalled();
  });

  test('should render fallback message if no favorite restaurants', async () => {
    const restaurants = await indexedDBService.getAll();
    await Promise.all(restaurants.map((restaurant) => indexedDBService.delete(restaurant.id)));

    await controller.init();

    expect(view.renderLoader).toHaveBeenCalled();
    expect(mockRenderer.clearContainer).toHaveBeenCalled();
    expect(mockRenderer.createLoaderElement).toHaveBeenCalled();

    expect(view.renderFallback).toHaveBeenCalledWith('No saved list of favorite restaurants.');
    expect(mockRenderer.clearContainer).toHaveBeenCalled();
    expect(mockBatchLoader.setRestaurants).toHaveBeenCalledWith([]);
    expect(mockRenderer.createFallbackElement).toHaveBeenCalled();

    expect(view.renderRestaurantItems).not.toHaveBeenCalled();
  });

  test('should handle error when model fails', async () => {
    jest
      .spyOn(model, 'getListFavoriteRestaurants')
      .mockRejectedValue(new Error('Failed to get list favorite restaurants'));

    await controller.init();

    expect(view.renderLoader).toHaveBeenCalled();
    expect(mockRenderer.clearContainer).toHaveBeenCalled();
    expect(mockRenderer.createLoaderElement).toHaveBeenCalled();

    expect(showErrorNotification).toHaveBeenCalledWith('Failed to get list favorite restaurants');

    expect(view.renderFallback).toHaveBeenCalled();
    expect(mockRenderer.clearContainer).toHaveBeenCalled();
    expect(mockBatchLoader.setRestaurants).toHaveBeenCalledWith([]);
    expect(mockRenderer.createFallbackElement).toHaveBeenCalledWith(
      'Failed to get list favorite restaurants',
      undefined,
    );
  });
});
