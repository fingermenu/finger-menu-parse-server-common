// @flow

import Chance from 'chance';
import { List, Map } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { Restaurant } from '../';
import createMenus from '../../services/__tests__/MenuService.test';
import createLanguages from '../../services/__tests__/LanguageService.test';

const chance = new Chance();

export const createRestaurantInfo = async ({ parentRestaurantId } = {}) => {
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const menus = await createMenus(chance.integer({ min: 1, max: 3 }));
  const languages = await createLanguages(chance.integer({ min: 1, max: 3 }));
  const restaurant = Map({
    name: TestHelper.createRandomMultiLanguagesString(),
    websiteUrl: chance.string(),
    address: chance.string(),
    phones: List.of(Map({ label: 'business', number: chance.string() }), Map({ label: 'business', number: chance.string() })),
    geoLocation: ParseWrapperService.createGeoPoint({
      latitude: chance.floating({ min: 1, max: 20 }),
      longitude: chance.floating({ min: -30, max: -1 }),
    }),
    parentRestaurantId,
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
    status: chance.string(),
    googleMapUrl: chance.string(),
    menuIds: menus.map(menu => menu.get('id')),
    inheritParentRestaurantMenus: chance.integer(),
    pin: chance.string(),
    languageIds: languages.map(language => language.get('id')),
    configurations: TestHelper.createRandomMap(),
  });

  return {
    restaurant,
    ownedByUser,
    maintainedByUsers,
    menus,
    languages,
  };
};

export const createRestaurant = async object => Restaurant.spawn(object || (await createRestaurantInfo()).restaurant);

export const expectRestaurant = (object, expectedObject, { expectedMenus, expectedLanguages } = {}) => {
  expect(object.get('name')).toEqual(expectedObject.get('name'));
  expect(object.get('websiteUrl')).toBe(expectedObject.get('websiteUrl'));
  expect(object.get('address')).toBe(expectedObject.get('address'));
  expect(object.get('phones')).toEqual(expectedObject.get('phones'));
  expect(object.get('geoLocation')).toEqual(expectedObject.get('geoLocation'));
  expect(object.get('parentRestaurantId')).toBe(expectedObject.get('parentRestaurantId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));
  expect(object.get('status')).toBe(expectedObject.get('status'));
  expect(object.get('googleMapUrl')).toBe(expectedObject.get('googleMapUrl'));
  expect(object.get('menuIds')).toEqual(expectedObject.get('menuIds'));
  expect(object.get('inheritParentRestaurantMenus')).toBe(expectedObject.get('inheritParentRestaurantMenus'));
  expect(object.get('ping')).toBe(expectedObject.get('pin'));
  expect(object.get('languageIds')).toEqual(expectedObject.get('languageIds'));
  expect(object.get('configurations')).toEqual(expectedObject.get('configurations'));

  if (expectedMenus) {
    expect(object.get('menuIds')).toEqual(expectedMenus.map(_ => _.get('id')));
  }

  if (expectedLanguages) {
    expect(object.get('languageIds')).toEqual(expectedLanguages.map(_ => _.get('id')));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createRestaurant()).className).toBe('Restaurant');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { restaurant } = await createRestaurantInfo();
    const object = await createRestaurant(restaurant);
    const info = object.getInfo();

    expectRestaurant(info, restaurant);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createRestaurant();

    expect(new Restaurant(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createRestaurant();

    expect(new Restaurant(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createRestaurant();
    const { restaurant: updatedRestaurant } = await createRestaurantInfo();

    object.updateInfo(updatedRestaurant);

    const info = object.getInfo();

    expectRestaurant(info, updatedRestaurant);
  });

  test('getInfo should return provided info', async () => {
    const { restaurant } = await createRestaurantInfo();
    const object = await createRestaurant(restaurant);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectRestaurant(info, restaurant);
  });
});
