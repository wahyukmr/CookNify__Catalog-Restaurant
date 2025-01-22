/* eslint-disable no-useless-catch */
import { API_ENPOINTS } from '../../config/constants';
import { ajax } from '../../services/apiServices';

export default class RestoDetailModel {
  async getRestaurantByID(restoID) {
    try {
      const fetchedData = await ajax(API_ENPOINTS.RESTO_DETAIL(restoID));

      if (fetchedData.error) {
        throw new Error(`Failed to get a restaurant with id ${restoID}`);
      }

      return fetchedData.restaurant;
    } catch (error) {
      throw error;
    }
  }

  async addReviewRestaurant(reviewData) {
    try {
      const addedReview = await ajax(API_ENPOINTS.REVIEW, 'POST', reviewData);

      if (addedReview.error) {
        throw new Error('Failed to add review for the restaurant');
      }
      const { customerReviews, message } = addedReview;
      return { customerReviews, message };
    } catch (error) {
      throw error;
    }
  }
}
