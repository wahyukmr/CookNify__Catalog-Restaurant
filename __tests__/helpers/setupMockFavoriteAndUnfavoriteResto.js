import { mockRestaurant } from '../mocks';

export const setupMockFavoriteAndUnfavoriteResto = ({
  isFavorited,
  indexedDBService,
  model,
  view,
  detailFavoriteBtn,
  detailPage,
}) => {
  jest.spyOn(indexedDBService, 'get').mockResolvedValue(isFavorited ? mockRestaurant.id : null);
  jest.spyOn(model, 'getRestaurantByID').mockResolvedValue(mockRestaurant);

  view.renderLoader = jest.fn();
  view.getElements = jest.fn().mockReturnValue({ detailFavoriteBtn });
  view.renderRestaurantItemDetails = jest
    .fn()
    .mockImplementation(() => (detailPage.dataRestaurant = mockRestaurant));
};
