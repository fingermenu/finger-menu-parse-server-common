// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import uuid from 'uuid/v4';
import '../../../bootstrap';
import { Restaurant } from '../';
import createMenus from '../../services/__tests__/MenuService.test';

export const createRestaurantInfo = async ({ parentRestaurantId } = {}) => {
  const chance = new Chance();
  const ownedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const maintainedByUsers = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 0, max: 3 }))
    .map(() => ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp())
    .toArray()));
  const menus = await createMenus(chance.integer({ min: 1, max: 3 }));
  const restaurant = Map({
    name: uuid(),
    websiteUrl: uuid(),
    imageUrl: uuid(),
    address: uuid(),
    phones: List.of(
      Map({ label: 'business', number: chance.integer({ min: 1000000, max: 999999999 }).toString() }),
      Map({ label: 'business', number: chance.integer({ min: 1000000, max: 999999999 }).toString() }),
    ),
    geoLocation: ParseWrapperService.createGeoPoint({
      latitude: chance.floating({ min: 1, max: 20 }),
      longitude: chance.floating({ min: -30, max: -1 }),
    }),
    parentRestaurantId,
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
    status: uuid(),
    googleMapUrl: uuid(),
    menuIds: menus.map(menu => menu.get('id')),
    inheritParentRestaurantMenus: chance.integer({ min: 1, max: 1000 }) % 2 === 0,
  });

  return {
    restaurant,
    ownedByUser,
    maintainedByUsers,
    menus,
  };
};

export const createRestaurant = async object => Restaurant.spawn(object || (await createRestaurantInfo()).restaurant);

export const expectRestaurant = (object, expectedObject, { expectedMenus } = {}) => {
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('websiteUrl')).toBe(expectedObject.get('websiteUrl'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));
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

  if (expectedMenus) {
    expect(object.get('menuIds')).toEqual(expectedMenus.map(_ => _.get('id')));
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
