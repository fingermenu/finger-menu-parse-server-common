// @flow

import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { DietaryOption } from '..';
import createTags from '../../services/__tests__/TagService.test';

export const createDietaryOptionInfo = async () => {
  const tag = (await createTags(1)).first();
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const dietaryOption = Map({
    tagId: tag.get('id'),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    dietaryOption,
    tag,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createDietaryOption = async object => DietaryOption.spawn(object || (await createDietaryOptionInfo()).dietaryOption);

export const expectDietaryOption = (object, expectedObject, { dietaryOptionId, expectedTag } = {}) => {
  expect(object.get('tagId')).toBe(expectedObject.get('tagId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (dietaryOptionId) {
    expect(object.get('id')).toBe(dietaryOptionId);
  }

  if (expectedTag) {
    expect(object.get('tagId')).toEqual(expectedTag.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createDietaryOption()).className).toBe('DietaryOption');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { dietaryOption } = await createDietaryOptionInfo();
    const object = await createDietaryOption(dietaryOption);
    const info = object.getInfo();

    expectDietaryOption(info, dietaryOption);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createDietaryOption();

    expect(new DietaryOption(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createDietaryOption();

    expect(new DietaryOption(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createDietaryOption();
    const { dietaryOption: updatedDietaryOption } = await createDietaryOptionInfo();

    object.updateInfo(updatedDietaryOption);

    const info = object.getInfo();

    expectDietaryOption(info, updatedDietaryOption);
  });

  test('getInfo should return provided info', async () => {
    const { dietaryOption } = await createDietaryOptionInfo();
    const object = await createDietaryOption(dietaryOption);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectDietaryOption(info, dietaryOption);
  });
});
