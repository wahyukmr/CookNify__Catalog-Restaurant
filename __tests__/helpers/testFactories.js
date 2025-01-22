const itActsAsFavoriteRestaurantModel = (getModel) => {
  test('should store and retrieve an restaurant that has been added', async () => {
    const model = getModel();

    const restaurant = { id: 1, name: 'Restaurant A' };
    await model.put(restaurant);

    const retrievedRestaurant = await model.get(1);

    expect(retrievedRestaurant).toEqual(restaurant);
  });

  test('should delete favorite restaurant and ensure it is no longer retrievable', async () => {
    const model = getModel();

    const restaurant = { id: 1, name: 'Restaurant A' };

    await model.put(restaurant);

    await model.delete(1);

    const deletedRestaurant = await model.get(1);

    expect(deletedRestaurant).toBeUndefined();
  });

  test('should overwrite an restaurant if put with the same ID', async () => {
    const model = getModel();

    const restaurant1 = { id: 1, name: 'Restaurant A' };
    const restaurant2 = { id: 1, name: 'Restaurant B' };

    await model.put(restaurant1);
    await model.put(restaurant2);

    const retrievedRestaurant = await model.get(1);

    expect(retrievedRestaurant).toEqual(restaurant2);
  });

  test('should store multiple restaurants and retrieve them', async () => {
    const model = getModel();

    const restaurants = [
      { id: 1, name: 'Restaurant A' },
      { id: 2, name: 'Restaurant B' },
    ];
    await model.bulkPut(restaurants);

    const allRestaurants = await model.getAll();

    expect(allRestaurants).toHaveLength(2);
    expect(allRestaurants).toEqual(restaurants);
  });

  test('should not allow adding a restaurant without an id', async () => {
    const model = getModel();

    const restaurantWithNoId = { name: 'Restaurant A' };

    await expect(model.put(restaurantWithNoId)).rejects.toThrow(
      'Data provided to an operation does not meet requirements.',
    );

    const allRestaurants = await model.getAll();

    expect(allRestaurants).toEqual([]);
  });

  test('should handle request to remove a restaurant even though the restaurant has not been added', async () => {
    const model = getModel();

    const restaurants = [
      { id: 1, name: 'Restaurant A' },
      { id: 2, name: 'Restaurant B' },
      { id: 3, name: 'Restaurant C' },
    ];
    await model.bulkPut(restaurants);

    await model.delete(4);

    const allRestaurants = await model.getAll();

    expect(allRestaurants).toEqual(restaurants);
  });
};

// eslint-disable-next-line jest/no-export
export { itActsAsFavoriteRestaurantModel };
