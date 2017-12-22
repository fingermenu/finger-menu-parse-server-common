// @flow

import Chance from 'chance';
import Immutable, { Map, Range } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import uuid from 'uuid/v4';
import { MenuItem } from '../';
import createTags from '../../services/__tests__/TagService.test';

const chance = new Chance();

export const createMenuItemInfo = async () => {
  const ownedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const maintainedByUsers = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 0, max: 3 }))
    .map(() => ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp())
    .toArray()));
  const tags = await createTags(chance.integer({ min: 1, max: 3 }));
  const menuItem = Map({
    name: uuid(),
    description: uuid(),
    menuItemPageUrl: uuid(),
    imageUrl: uuid(),
    tagIds: tags.map(tag => tag.get('id')),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    menuItem,
    tags,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createMenuItem = async object => MenuItem.spawn(object || (await createMenuItemInfo()).menuItem);

export const expectMenuItem = (object, expectedObject, { menuItemId, expectedTags } = {}) => {
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('description')).toBe(expectedObject.get('description'));
  expect(object.get('menuItemPageUrl')).toBe(expectedObject.get('menuItemPageUrl'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));
  expect(object.get('tagIds')).toEqual(expectedObject.get('tagIds'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (menuItemId) {
    expect(object.get('id')).toBe(menuItemId);
  }

  if (expectedTags) {
    expect(object.get('tagIds')).toEqual(expectedTags.map(_ => _.get('id')));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createMenuItem()).className).toBe('MenuItem');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { menuItem } = await createMenuItemInfo();
    const object = await createMenuItem(menuItem);
    const info = object.getInfo();

    expectMenuItem(info, menuItem);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createMenuItem();

    expect(new MenuItem(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createMenuItem();

    expect(new MenuItem(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createMenuItem();
    const { menuItem: updatedMenuItem } = await createMenuItemInfo();

    object.updateInfo(updatedMenuItem);

    const info = object.getInfo();

    expectMenuItem(info, updatedMenuItem);
  });

  test('getInfo should return provided info', async () => {
    const { menuItem } = await createMenuItemInfo();
    const object = await createMenuItem(menuItem);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectMenuItem(info, menuItem);
  });
});
