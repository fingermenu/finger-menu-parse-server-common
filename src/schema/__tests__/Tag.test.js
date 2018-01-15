// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { Tag } from '../';

const chance = new Chance();

export const createTagInfo = async ({ parentTagId } = {}) => {
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const tag = Map({
    name: TestHelper.createRandomMultiLanguagesString(),
    description: TestHelper.createRandomMultiLanguagesString(),
    level: chance.integer(),
    forDisplay: chance.bool(),
    parentTagId,
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    tag,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createTag = async object => Tag.spawn(object || (await createTagInfo()).tag);

export const expectTag = (object, expectedObject) => {
  expect(object.get('name')).toEqual(expectedObject.get('name'));
  expect(object.get('description')).toEqual(expectedObject.get('description'));
  expect(object.get('level')).toBe(expectedObject.get('level'));
  expect(object.get('forDisplay')).toBe(expectedObject.get('forDisplay'));
  expect(object.get('parentTagId')).toBe(expectedObject.get('parentTagId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createTag()).className).toBe('Tag');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { tag } = await createTagInfo();
    const object = await createTag(tag);
    const info = object.getInfo();

    expectTag(info, tag);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createTag();

    expect(new Tag(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createTag();

    expect(new Tag(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createTag();
    const { tag: updatedTag } = await createTagInfo();

    object.updateInfo(updatedTag);

    const info = object.getInfo();

    expectTag(info, updatedTag);
  });

  test('getInfo should return provided info', async () => {
    const { tag } = await createTagInfo();
    const object = await createTag(tag);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectTag(info, tag);
  });
});
