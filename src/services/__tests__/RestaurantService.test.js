// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { RestaurantService } from '../';
import { createRestaurantInfo, expectRestaurant } from '../../schema/__tests__/Restaurant.test';

const chance = new Chance();
const restaurantService = new RestaurantService();

const getLanguages = (object) => {
  const languages = object ? object.get('name').keySeq() : List();
  const language = languages.isEmpty() ? null : languages.first();

  return { languages, language };
};

const createCriteriaWthoutConditions = (languages, language) =>
  Map({
    fields: List.of(
      'languages_name',
      'websiteUrl',
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
      'pin',
      'configurations',
    ).concat(languages ? languages.map(_ => `${_}_name`) : List()),
    language,
    include_parentRestaurant: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
    include_menus: true,
  });

const createCriteria = (object) => {
  const { language, languages } = getLanguages(object);

  return Map({
    conditions: Map({
      name: language ? object.get('name').get(language) : chance.string(),
      websiteUrl: object ? object.get('websiteUrl') : chance.string(),
      address: object ? object.get('address') : chance.string(),
      phones: object ? object.get('phones') : Map({ business: chance.string() }),
      near_geoLocation: object
        ? object.get('geoLocation')
        : ParseWrapperService.createGeoPoint({
          latitude: chance.floating({ min: 1, max: 20 }),
          longitude: chance.floating({ min: -30, max: -1 }),
        }),
      parentRestaurantId: object && object.get('parentRestaurantId') ? object.get('parentRestaurantId') : undefined,
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : List.of(chance.string(), chance.string()),
      status: object ? object.get('status') : chance.string(),
      googleMapUrl: object ? object.get('googleMapUrl') : chance.string(),
      menuIds: object ? object.get('menuIds') : List.of(chance.string(), chance.string()),
      inheritParentRestaurantMenus: object ? object.get('inheritParentRestaurantMenus') : chance.bool(),
      pin: object ? object.get('pin') : chance.string(),
      configurations: object ? object.get('configurations') : TestHelper.createRandomMap(),
    }),
  }).merge(createCriteriaWthoutConditions(languages, language));
};

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
    const restaurantId = chance.string();

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

    expectRestaurant(restaurant, expectedRestaurant, {
      expectedOwnedByUser,
      expectedMaintainedByUsers,
      expectedMenus,
    });
  });
});

describe('update', () => {
  test('should reject if the provided restaurant Id does not exist', async () => {
    const restaurantId = chance.string();

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

    expectRestaurant(restaurant, expectedRestaurant, {
      expectedOwnedByUser,
      expectedMaintainedByUsers,
      expectedMenus,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided restaurant Id does not exist', async () => {
    const restaurantId = chance.string();

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
      expectRestaurant(restaurant, expectedRestaurant, {
        expectedOwnedByUser,
        expectedMaintainedByUsers,
        expectedMenus,
      });
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
      expectRestaurant(restaurant, expectedRestaurant, {
        expectedOwnedByUser,
        expectedMaintainedByUsers,
        expectedMenus,
      });
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
