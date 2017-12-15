// @flow

import Chance from 'chance';
import Immutable, { Map, Range } from 'immutable';
import { ParseWrapperService } from 'micro-business-parse-server-common';
import uuid from 'uuid/v4';
import '../../../bootstrap';
import { Tag } from '../';

const chance = new Chance();

export const createTagInfo = async ({ parentTagId } = {}) => {
  const ownedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const maintainedByUsers = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 0, max: 3 }))
    .map(() => ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp())
    .toArray()));
  const tag = Map({
    name: uuid(),
    description: uuid(),
    level: chance.integer({ min: 1, max: 1000 }),
    forDisplay: chance.integer({ min: 1, max: 1000 }) % 2 === 0,
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
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('description')).toBe(expectedObject.get('description'));
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
