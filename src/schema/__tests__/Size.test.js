// @flow

import Chance from 'chance';
import Immutable, { Map, Range } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import uuid from 'uuid/v4';
import '../../../bootstrap';
import { Size } from '../';

const chance = new Chance();

export const createSizeInfo = async () => {
  const ownedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const maintainedByUsers = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 0, max: 3 }))
    .map(() => ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp())
    .toArray()));
  const size = Map({
    name: uuid(),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    size,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createSize = async object => Size.spawn(object || (await createSizeInfo()).size);

export const expectSize = (object, expectedObject, { sizeId } = {}) => {
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (sizeId) {
    expect(object.get('id')).toBe(sizeId);
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
