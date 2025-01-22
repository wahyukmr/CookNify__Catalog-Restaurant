import { delay, showErrorNotification, showSuccessNotification } from '../../utils';

export default class RestoDetailController {
  constructor({ favoriteRestaurantIdb, restoDetailPage, model, view }) {
    this._favoriteRestaurantIdb = favoriteRestaurantIdb;
    this._restoDetailPage = restoDetailPage;
    this._restoDetailModel = model;
    this._restoDetailView = view;

    this._detailItemContainer = this._restoDetailPage.shadowRoot.getElementById(
      'restaurantDetailContainer',
    );

    this._restoDetailId = this._restoDetailPage.dataset.id;

    this._restoDetailView.bindClickFavoriteButton(this._handleClickFavoriteButton.bind(this));
    this._restoDetailView.bindSubmitReview(this._handleSubmitReview.bind(this));
  }

  async init() {
    try {
      this._restoDetailView.renderLoader(this._detailItemContainer);

      const isFavorited = await this._favoriteRestaurantIdb.get(this._restoDetailId);
      const dataRestaurant = await this._restoDetailModel.getRestaurantByID(this._restoDetailId);

      if (dataRestaurant) {
        this._restoDetailView.renderRestaurantItemDetails(
          dataRestaurant,
          this._detailItemContainer,
        );

        const { favoriteBtn, categories, menus, review } = this._restoDetailView.getElements();

        this._restoDetailView.renderFavoriteButton(favoriteBtn, !!isFavorited);
        this._restoDetailView.renderCategories(categories, dataRestaurant.categories);
        this._restoDetailView.renderMenus(menus, dataRestaurant.menus);
        this._restoDetailView.renderCustomerReview(review, dataRestaurant.customerReviews);
      } else {
        this._restoDetailView.renderFallback(
          'Can"t find this detail restaurant',
          this._detailItemContainer,
        );
      }
    } catch (error) {
      showErrorNotification(error.message);
    }
  }

  async _handleClickFavoriteButton(dataResto) {
    const favoriteBtn = this._restoDetailView.getElements().favoriteBtn;

    try {
      favoriteBtn.disabled = true;

      const isFavorited = await this._favoriteRestaurantIdb.get(this._restoDetailId);

      if (isFavorited) {
        await this._favoriteRestaurantIdb.delete(this._restoDetailId);
        showSuccessNotification('The restaurant has been removed from the favorites list');
        await delay(3000);
      } else {
        await this._favoriteRestaurantIdb.put(dataResto);
        showSuccessNotification('The restaurant has been added from the favorites list');
        await delay(3000);
      }

      this._restoDetailView.renderFavoriteButton(favoriteBtn, !isFavorited);
    } catch (error) {
      showErrorNotification(
        error.message || 'An error occurred while handling the favorite button',
      );
      await delay(3000);
    } finally {
      favoriteBtn.disabled = false;
    }
  }

  async _handleSubmitReview(reviewData) {
    const submitReviewBtn = this._restoDetailView.getElements().submitReviewBtn;

    try {
      submitReviewBtn.disabled = true;

      const body = { ...reviewData, id: this._restoDetailId };

      const { customerReviews, message } = await this._restoDetailModel.addReviewRestaurant(body);

      this._restoDetailView.renderCustomerReview(this._elements.review, customerReviews);

      if (message === 'success') {
        showSuccessNotification('Successfully added a restaurant review');
        await delay(3000);
      }
    } catch (error) {
      showErrorNotification(error.message);
    } finally {
      submitReviewBtn.disabled = false;
    }
  }
}
