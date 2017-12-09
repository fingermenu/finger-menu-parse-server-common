// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import uuid from 'uuid/v4';
import { Tag } from '../';

const chance = new Chance();

export const createTagInfo = async ({ parentTagId } = {}) => {
  const tag = Map({
    key: uuid(),
    name: uuid(),
    description: uuid(),
    level: chance.integer({ min: 1, max: 1000 }),
    forDisplay: chance.integer({ min: 1, max: 1000 }) % 2 === 0,
    parentTagId,
  });

  return { tag };
};

export const createTag = async object => Tag.spawn(object || (await createTagInfo()).tag);

export const expectTag = (object, expectedObject) => {
  expect(object.get('key')).toBe(expectedObject.get('key'));
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('description')).toBe(expectedObject.get('description'));
  expect(object.get('level')).toBe(expectedObject.get('level'));
  expect(object.get('forDisplay')).toBe(expectedObject.get('forDisplay'));
  expect(object.get('parentTagId')).toBe(expectedObject.get('parentTagId'));
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
