// @flow

import Chance from 'chance';
import Immutable, { Map, Range } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import uuid from 'uuid/v4';
import { Menu } from '../';
import createTags from '../../services/__tests__/TagService.test';
import createMenuItemPrices from '../../services/__tests__/MenuItemPriceService.test';

const chance = new Chance();

export const createMenuInfo = async () => {
  const ownedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const maintainedByUsers = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 0, max: 3 }))
    .map(() => ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp())
    .toArray()));
  const tags = await createTags(chance.integer({ min: 1, max: 3 }));
  const menuItemPrices = await createMenuItemPrices(chance.integer({ min: 1, max: 3 }));
  const menu = Map({
    name: uuid(),
    description: uuid(),
    menuPageUrl: uuid(),
    imageUrl: uuid(),
    tagIds: tags.map(tag => tag.get('id')),
    menuItemPriceIds: menuItemPrices.map(menuItemPrice => menuItemPrice.get('id')),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    menu,
    menuItemPrices,
    tags,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createMenu = async object => Menu.spawn(object || (await createMenuInfo()).menu);

export const expectMenu = (object, expectedObject, { menuId, expectedMenuItemPrices, expectedTags } = {}) => {
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('description')).toBe(expectedObject.get('description'));
  expect(object.get('menuPageUrl')).toBe(expectedObject.get('menuPageUrl'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));
  expect(object.get('menuItemPriceIds')).toEqual(expectedObject.get('menuItemPriceIds'));
  expect(object.get('tagIds')).toEqual(expectedObject.get('tagIds'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (menuId) {
    expect(object.get('id')).toBe(menuId);
  }

  if (expectedMenuItemPrices) {
    expect(object.get('menuItemPriceIds')).toEqual(expectedMenuItemPrices.map(_ => _.get('id')));
  }

  if (expectedTags) {
    expect(object.get('tagIds')).toEqual(expectedTags.map(_ => _.get('id')));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createMenu()).className).toBe('Menu');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { menu } = await createMenuInfo();
    const object = await createMenu(menu);
    const info = object.getInfo();

    expectMenu(info, menu);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createMenu();

    expect(new Menu(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createMenu();

    expect(new Menu(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createMenu();
    const { menu: updatedMenu } = await createMenuInfo();

    object.updateInfo(updatedMenu);

    const info = object.getInfo();

    expectMenu(info, updatedMenu);
  });

  test('getInfo should return provided info', async () => {
    const { menu } = await createMenuInfo();
    const object = await createMenu(menu);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectMenu(info, menu);
  });
});
