// @flow

import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { ServingTime } from '../';
import createTags from '../../services/__tests__/TagService.test';

export const createServingTimeInfo = async () => {
  const tag = (await createTags(1)).first();
  const addedByUser = await TestHelper.createUser();
  const removedByUser = await TestHelper.createUser();
  const servingTime = Map({
    tagId: tag.get('id'),
    addedByUserId: addedByUser.id,
    removedByUserId: removedByUser.id,
  });

  return {
    servingTime,
    tag,
    addedByUser,
    removedByUser,
  };
};

export const createServingTime = async object => ServingTime.spawn(object || (await createServingTimeInfo()).servingTime);

export const expectServingTime = (object, expectedObject, { servingTimeId, expectedTag } = {}) => {
  expect(object.get('tagId')).toBe(expectedObject.get('tagId'));
  expect(object.get('addedByUserId')).toBe(expectedObject.get('addedByUserId'));
  expect(object.get('removedByUserId')).toBe(expectedObject.get('removedByUserId'));

  if (servingTimeId) {
    expect(object.get('id')).toBe(servingTimeId);
  }

  if (expectedTag) {
    expect(object.get('tagId')).toEqual(expectedTag.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createServingTime()).className).toBe('ServingTime');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { servingTime } = await createServingTimeInfo();
    const object = await createServingTime(servingTime);
    const info = object.getInfo();

    expectServingTime(info, servingTime);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createServingTime();

    expect(new ServingTime(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createServingTime();

    expect(new ServingTime(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createServingTime();
    const { servingTime: updatedServingTime } = await createServingTimeInfo();

    object.updateInfo(updatedServingTime);

    const info = object.getInfo();

    expectServingTime(info, updatedServingTime);
  });

  test('getInfo should return provided info', async () => {
    const { servingTime } = await createServingTimeInfo();
    const object = await createServingTime(servingTime);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectServingTime(info, servingTime);
  });
});
