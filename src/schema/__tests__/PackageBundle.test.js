// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import '../../../bootstrap';
import { PackageBundle } from '../';
import createRestaurants from '../../services/__tests__/RestaurantService.test';

const chance = new Chance();

export const createPackageBundleInfo = async () => {
  const restaurant = (await createRestaurants(1)).first();
  const packageBundle = Map({
    url: chance.string(),
    checksum: chance.string(),
    restaurantId: restaurant.get('id'),
  });

  return {
    packageBundle,
    restaurant,
  };
};

export const createPackageBundle = async object => PackageBundle.spawn(object || (await createPackageBundleInfo()).packageBundle);

export const expectPackageBundle = (object, expectedObject, { packageBundleId, expectedRestaurant } = {}) => {
  expect(object.get('url')).toBe(expectedObject.get('url'));
  expect(object.get('checksum')).toBe(expectedObject.get('checksum'));
  expect(object.get('restaurantId')).toBe(expectedObject.get('restaurantId'));

  if (packageBundleId) {
    expect(object.get('id')).toBe(packageBundleId);
  }

  if (expectedRestaurant) {
    expect(object.get('restaurantId')).toEqual(expectedRestaurant.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createPackageBundle()).className).toBe('PackageBundle');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { packageBundle } = await createPackageBundleInfo();
    const object = await createPackageBundle(packageBundle);
    const info = object.getInfo();

    expectPackageBundle(info, packageBundle);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createPackageBundle();

    expect(new PackageBundle(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createPackageBundle();

    expect(new PackageBundle(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createPackageBundle();
    const { packageBundle: updatedPackageBundle } = await createPackageBundleInfo();

    object.updateInfo(updatedPackageBundle);

    const info = object.getInfo();

    expectPackageBundle(info, updatedPackageBundle);
  });

  test('getInfo should return provided info', async () => {
    const { packageBundle } = await createPackageBundleInfo();
    const object = await createPackageBundle(packageBundle);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectPackageBundle(info, packageBundle);
  });
});
