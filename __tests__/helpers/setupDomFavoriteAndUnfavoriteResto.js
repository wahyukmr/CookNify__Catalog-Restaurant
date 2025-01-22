export const setupDomFavoriteAndUnfavoriteResto = () => {
  // Mock elemen <resto-detail-page> dengan Shadow DOM
  const restoDetailPage = document.createElement('resto-detail-page');
  restoDetailPage.dataset.id = '1';
  const restoShadow = restoDetailPage.attachShadow({ mode: 'open' });

  const restaurantDetailContainer = document.createElement('div');
  restaurantDetailContainer.id = 'restaurantDetailContainer';
  restoShadow.appendChild(restaurantDetailContainer);

  // Mock elemen <list-restaurant-item-detail> dengan Shadow DOM
  const listRestaurantItemDetail = document.createElement('mock-list-restaurant-item-detail');

  // Tambahkan <list-restaurant-item-detail> ke <div id="restaurantDetailContainer">
  restaurantDetailContainer.appendChild(listRestaurantItemDetail);

  // Tambahkan <resto-detail-page> ke body
  document.body.appendChild(restoDetailPage);

  return {
    detailPage: restoDetailPage.shadowRoot
      .querySelector('#restaurantDetailContainer')
      .querySelector('mock-list-restaurant-item-detail'),
    favoriteBtn: restoDetailPage.shadowRoot
      .querySelector('#restaurantDetailContainer')
      .querySelector('mock-list-restaurant-item-detail')
      .shadowRoot.querySelector('#detailFavoriteBtn'),
  };
};
