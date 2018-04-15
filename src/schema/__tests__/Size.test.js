// @flow

import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { Size } from '../';
import createTags from '../../services/__tests__/TagService.test';

export const createSizeInfo = async () => {
  const tag = (await createTags(1)).first();
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const size = Map({
    tagId: tag.get('id'),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    size,
    tag,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createSize = async object => Size.spawn(object || (await createSizeInfo()).size);

export const expectSize = (object, expectedObject, { sizeId, expectedTag } = {}) => {
  expect(object.get('tagId')).toBe(expectedObject.get('tagId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (sizeId) {
    expect(object.get('id')).toBe(sizeId);
  }

  if (expectedTag) {
    expect(object.get('tagId')).toEqual(expectedTag.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createSize()).className).toBe('Size');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { size } = await createSizeInfo();
    const object = await createSize(size);
    const info = object.getInfo();

    expectSize(info, size);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createSize();

    expect(new Size(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createSize();

    expect(new Size(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createSize();
    const { size: updatedSize } = await createSizeInfo();

    object.updateInfo(updatedSize);

    const info = object.getInfo();

    expectSize(info, updatedSize);
  });

  test('getInfo should return provided info', async () => {
    const { size } = await createSizeInfo();
    const object = await createSize(size);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectSize(info, size);
  });
});
