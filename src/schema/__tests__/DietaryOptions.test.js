// @flow

import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { DietaryOptions } from '../';
import createTags from '../../services/__tests__/TagService.test';

export const createDietaryOptionsInfo = async () => {
  const tag = (await createTags(1)).first();
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const dietaryOptions = Map({
    tagId: tag.get('id'),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    dietaryOptions,
    tag,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createDietaryOptions = async object => DietaryOptions.spawn(object || (await createDietaryOptionsInfo()).dietaryOptions);

export const expectDietaryOptions = (object, expectedObject, { dietaryOptionsId, expectedTag } = {}) => {
  expect(object.get('tagId')).toBe(expectedObject.get('tagId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (dietaryOptionsId) {
    expect(object.get('id')).toBe(dietaryOptionsId);
  }

  if (expectedTag) {
    expect(object.get('tagId')).toEqual(expectedTag.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createDietaryOptions()).className).toBe('DietaryOptions');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { dietaryOptions } = await createDietaryOptionsInfo();
    const object = await createDietaryOptions(dietaryOptions);
    const info = object.getInfo();

    expectDietaryOptions(info, dietaryOptions);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createDietaryOptions();

    expect(new DietaryOptions(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createDietaryOptions();

    expect(new DietaryOptions(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createDietaryOptions();
    const { dietaryOptions: updatedDietaryOptions } = await createDietaryOptionsInfo();

    object.updateInfo(updatedDietaryOptions);

    const info = object.getInfo();

    expectDietaryOptions(info, updatedDietaryOptions);
  });

  test('getInfo should return provided info', async () => {
    const { dietaryOptions } = await createDietaryOptionsInfo();
    const object = await createDietaryOptions(dietaryOptions);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectDietaryOptions(info, dietaryOptions);
  });
});
