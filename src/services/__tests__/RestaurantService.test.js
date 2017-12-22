// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import uuid from 'uuid/v4';
import '../../../bootstrap';
import { RestaurantService } from '../';
import { createRestaurantInfo, expectRestaurant } from '../../schema/__tests__/Restaurant.test';

const chance = new Chance();
const restaurantService = new RestaurantService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of(
      'name',
      'websiteUrl',
      'imageUrl',
      'address',
      'phones',
      'geoLocation',
      'parentRestaurant',
      'ownedByUser',
      'maintainedByUsers',
      'status',
      'googleMapUrl',
      'menus',
      'inheritParentRestaurantMenus',
    ),
    include_parentRestaurant: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
    include_menus: true,
  });

const createCriteria = restaurant =>
  Map({
    conditions: Map({
      name: restaurant ? restaurant.get('name') : uuid(),
      websiteUrl: restaurant ? restaurant.get('websiteUrl') : uuid(),
      imageUrl: restaurant ? restaurant.get('imageUrl') : uuid(),
      address: restaurant ? restaurant.get('address') : uuid(),
      phones: restaurant ? restaurant.get('phones') : Map({ business: chance.integer({ min: 1000000, max: 999999999 }).toString() }),
      near_geoLocation: restaurant
        ? restaurant.get('geoLocation')
        : ParseWrapperService.createGeoPoint({
          latitude: chance.floating({ min: 1, max: 20 }),
          longitude: chance.floating({ min: -30, max: -1 }),
        }),
      parentRestaurantId: restaurant && restaurant.get('parentRestaurantId') ? restaurant.get('parentRestaurantId') : undefined,
      ownedByUserId: restaurant ? restaurant.get('ownedByUserId') : uuid(),
      maintainedByUserIds: restaurant ? restaurant.get('maintainedByUserIds') : List.of(uuid(), uuid()),
      status: restaurant ? restaurant.get('status') : uuid(),
      googleMapUrl: restaurant ? restaurant.get('googleMapUrl') : uuid(),
      menuIds: restaurant ? restaurant.get('menuIds') : List.of(uuid(), uuid()),
      inheritParentRestaurantMenus: restaurant ? restaurant.get('inheritParentRestaurantMenus') : chance.integer({ min: 1, max: 1000 }) % 2 === 0,
    }),
  }).merge(createCriteriaWthoutConditions());

const createRestaurants = async (count, useSameInfo = false, createParentRestaurant = true) => {
  const parentRestaurant = createParentRestaurant ? await createRestaurants(1, false, false) : undefined;
  let restaurant;

  if (useSameInfo) {
    const { restaurant: tempRestaurant } = await createRestaurantInfo();

    restaurant = tempRestaurant;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalRestaurant;

      if (useSameInfo) {
        finalRestaurant = restaurant;
      } else {
        const { restaurant: tempRestaurant } = await createRestaurantInfo();

        finalRestaurant = tempRestaurant;
      }

      return restaurantService.read(
        await restaurantService.create(createParentRestaurant ? finalRestaurant.merge(Map({ parentRestaurantId: parentRestaurant.get('id') })) : finalRestaurant),
        createCriteriaWthoutConditions(),
      );
    })
    .toArray()));
};

export default createRestaurants;

describe('create', () => {
  test('should return the created restaurant Id', async () => {
    const restaurantId = await restaurantService.create((await createRestaurantInfo()).restaurant);

    expect(restaurantId).toBeDefined();
  });

  test('should create the restaurant', async () => {
    const { restaurant } = await createRestaurantInfo();
    const restaurantId = await restaurantService.create(restaurant);
    const fetchedRestaurant = await restaurantService.read(restaurantId, createCriteriaWthoutConditions());

    expect(fetchedRestaurant).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided restaurant Id does not exist', async () => {
    const restaurantId = uuid();

    try {
      await restaurantService.read(restaurantId);
    } catch (ex) {
      expect(ex.message).toBe(`No restaurant found with Id: ${restaurantId}`);
    }
  });

  test('should read the existing restaurant', async () => {
    const { restaurant: parentRestaurant } = await createRestaurantInfo();
    const parentRestaurantId = await restaurantService.create(parentRestaurant);
    const {
      restaurant: expectedRestaurant,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
      menus: expectedMenus,
    } = await createRestaurantInfo({
      parentRestaurantId,
    });
    const restaurantId = await restaurantService.create(expectedRestaurant);
    const restaurant = await restaurantService.read(restaurantId, createCriteriaWthoutConditions());

    expectRestaurant(restaurant, expectedRestaurant, { expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus });
  });
});

describe('update', () => {
  test('should reject if the provided restaurant Id does not exist', async () => {
    const restaurantId = uuid();

    try {
      const restaurant = await restaurantService.read(
        await restaurantService.create((await createRestaurantInfo()).restaurant),
        createCriteriaWthoutConditions(),
      );

      await restaurantService.update(restaurant.set('id', restaurantId));
    } catch (ex) {
      expect(ex.message).toBe(`No restaurant found with Id: ${restaurantId}`);
    }
  });

  test('should return the Id of the updated restaurant', async () => {
    const { restaurant: expectedRestaurant } = await createRestaurantInfo();
    const restaurantId = await restaurantService.create((await createRestaurantInfo()).restaurant);
    const id = await restaurantService.update(expectedRestaurant.set('id', restaurantId));

    expect(id).toBe(restaurantId);
  });

  test('should update the existing restaurant', async () => {
    const { restaurant: parentRestaurant } = await createRestaurantInfo();
    const parentRestaurantId = await restaurantService.create(parentRestaurant);
    const {
      restaurant: expectedRestaurant,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
      menus: expectedMenus,
    } = await createRestaurantInfo({
      parentRestaurantId,
    });
    const restaurantId = await restaurantService.create((await createRestaurantInfo()).restaurant);

    await restaurantService.update(expectedRestaurant.set('id', restaurantId));

    const restaurant = await restaurantService.read(restaurantId, createCriteriaWthoutConditions());

    expectRestaurant(restaurant, expectedRestaurant, { expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus });
  });
});

describe('delete', () => {
  test('should reject if the provided restaurant Id does not exist', async () => {
    const restaurantId = uuid();

    try {
      await restaurantService.delete(restaurantId);
    } catch (ex) {
      expect(ex.message).toBe(`No restaurant found with Id: ${restaurantId}`);
    }
  });

  test('should delete the existing restaurant', async () => {
    const restaurantId = await restaurantService.create((await createRestaurantInfo()).restaurant);
    await restaurantService.delete(restaurantId);

    try {
      await restaurantService.delete(restaurantId);
    } catch (ex) {
      expect(ex.message).toBe(`No restaurant found with Id: ${restaurantId}`);
    }
  });
});

describe('search', () => {
  test('should return no restaurant if provided criteria matches no restaurant', async () => {
    const restaurants = await restaurantService.search(createCriteria());

    expect(restaurants.count()).toBe(0);
  });

  test('should return the restaurant matches the criteria', async () => {
    const { restaurant: parentRestaurant } = await createRestaurantInfo();
    const parentRestaurantId = await restaurantService.create(parentRestaurant);
    const {
      restaurant: expectedRestaurant,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
      menus: expectedMenus,
    } = await createRestaurantInfo({
      parentRestaurantId,
    });
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => restaurantService.create(expectedRestaurant))
      .toArray()));
    const restaurants = await restaurantService.search(createCriteria(expectedRestaurant));

    expect(restaurants.count).toBe(results.count);
    restaurants.forEach((restaurant) => {
      expect(results.find(_ => _.localeCompare(restaurant.get('id')) === 0)).toBeDefined();
      expectRestaurant(restaurant, expectedRestaurant, { expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus });
    });
  });
});

describe('searchAll', () => {
  test('should return no restaurant if provided criteria matches no restaurant', async () => {
    let restaurants = List();
    const result = restaurantService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        restaurants = restaurants.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(restaurants.count()).toBe(0);
  });

  test('should return the restaurant matches the criteria', async () => {
    const { restaurant: parentRestaurant } = await createRestaurantInfo();
    const parentRestaurantId = await restaurantService.create(parentRestaurant);
    const {
      restaurant: expectedRestaurant,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
      menus: expectedMenus,
    } = await createRestaurantInfo({
      parentRestaurantId,
    });
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => restaurantService.create(expectedRestaurant))
      .toArray()));

    let restaurants = List();
    const result = restaurantService.searchAll(createCriteria(expectedRestaurant));

    try {
      result.event.subscribe((info) => {
        restaurants = restaurants.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(restaurants.count).toBe(results.count);
    restaurants.forEach((restaurant) => {
      expect(results.find(_ => _.localeCompare(restaurant.get('id')) === 0)).toBeDefined();
      expectRestaurant(restaurant, expectedRestaurant, { expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus });
    });
  });
});

describe('exists', () => {
  test('should return false if no restaurant match provided criteria', async () => {
    expect(await restaurantService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any restaurant match provided criteria', async () => {
    const restaurants = await createRestaurants(chance.integer({ min: 1, max: 10 }), true);

    expect(await restaurantService.exists(createCriteria(restaurants.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no restaurant match provided criteria', async () => {
    expect(await restaurantService.count(createCriteria())).toBe(0);
  });

  test('should return the count of restaurant match provided criteria', async () => {
    const restaurants = await createRestaurants(chance.integer({ min: 1, max: 10 }), true);

    expect(await restaurantService.count(createCriteria(restaurants.first()))).toBe(restaurants.count());
  });
});
