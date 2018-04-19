// @flow

import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { DishType } from '../';
import createTags from '../../services/__tests__/TagService.test';

export const createDishTypeInfo = async () => {
  const tag = (await createTags(1)).first();
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const dishType = Map({
    tagId: tag.get('id'),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    dishType,
    tag,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createDishType = async object => DishType.spawn(object || (await createDishTypeInfo()).dishType);

export const expectDishType = (object, expectedObject, { dishTypeId, expectedTag } = {}) => {
  expect(object.get('tagId')).toBe(expectedObject.get('tagId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (dishTypeId) {
    expect(object.get('id')).toBe(dishTypeId);
  }

  if (expectedTag) {
    expect(object.get('tagId')).toEqual(expectedTag.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createDishType()).className).toBe('DishType');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { dishType } = await createDishTypeInfo();
    const object = await createDishType(dishType);
    const info = object.getInfo();

    expectDishType(info, dishType);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createDishType();

    expect(new DishType(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createDishType();

    expect(new DishType(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createDishType();
    const { dishType: updatedDishType } = await createDishTypeInfo();

    object.updateInfo(updatedDishType);

    const info = object.getInfo();

    expectDishType(info, updatedDishType);
  });

  test('getInfo should return provided info', async () => {
    const { dishType } = await createDishTypeInfo();
    const object = await createDishType(dishType);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectDishType(info, dishType);
  });
});
