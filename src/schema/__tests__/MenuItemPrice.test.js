// @flow

import Chance from 'chance';
import { List, Map } from 'immutable';
import { ParseWrapperService } from 'micro-business-parse-server-common';
import uuid from 'uuid/v4';
import { MenuItemPrice } from '../';
import createMenuItems from '../../services/__tests__/MenuItemService.test';
import createChoiceItemPrices from '../../services/__tests__/ChoiceItemPriceService.test';

const chance = new Chance();

export const createMenuItemPriceInfo = async ({ toBeServedWithMenuItemPriceIds } = {}) => {
  const menuItem = (await createMenuItems(chance.integer({ min: 1, max: 1 }))).first();
  const choiceItemPrices = await createChoiceItemPrices(chance.integer({ min: 1, max: 3 }));
  const addedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const removedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const menuItemPrice = Map({
    currentPrice: chance.floating({ min: 0, max: 1000 }),
    wasPrice: chance.floating({ min: 0, max: 1000 }),
    validFrom: new Date(),
    validUntil: new Date(),
    menuItemId: menuItem.get('id'),
    toBeServedWithMenuItemPriceIds: toBeServedWithMenuItemPriceIds || List(),
    choiceItemPriceIds: choiceItemPrices.map(choiceItemPrice => choiceItemPrice.get('id')),
    addedByUserId: addedByUser.id,
    removedByUserId: removedByUser.id,
  });

  return {
    menuItemPrice,
    menuItem,
    choiceItemPrices,
    addedByUser,
    removedByUser,
  };
};

export const createMenuItemPrice = async object => MenuItemPrice.spawn(object || (await createMenuItemPriceInfo()).menuItemPrice);

export const expectMenuItemPrice = (object, expectedObject, { menuItemPriceId, expectedMenuItem, expectedChoiceItemPrices } = {}) => {
  expect(object.get('currentPrice')).toBe(expectedObject.get('currentPrice'));
  expect(object.get('wasPrice')).toBe(expectedObject.get('wasPrice'));
  expect(object.get('validFrom')).toEqual(expectedObject.get('validFrom'));
  expect(object.get('validUntil')).toEqual(expectedObject.get('validUntil'));
  expect(object.get('menuItemId')).toBe(expectedObject.get('menuItemId'));
  expect(object.get('toBeServedWithMenuItemPriceIds')).toEqual(expectedObject.get('toBeServedWithMenuItemPriceIds'));
  expect(object.get('choiceItemPriceIds')).toEqual(expectedObject.get('choiceItemPriceIds'));
  expect(object.get('addedByUserId')).toBe(expectedObject.get('addedByUserId'));
  expect(object.get('removedByUserId')).toBe(expectedObject.get('removedByUserId'));

  if (menuItemPriceId) {
    expect(object.get('id')).toBe(menuItemPriceId);
  }

  if (expectedMenuItem) {
    expect(object.get('menuItemId')).toEqual(expectedMenuItem.get('id'));
  }

  if (expectedChoiceItemPrices) {
    expect(object.get('choiceItemPriceIds')).toEqual(expectedChoiceItemPrices.map(_ => _.get('id')));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createMenuItemPrice()).className).toBe('MenuItemPrice');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { menuItemPrice } = await createMenuItemPriceInfo();
    const object = await createMenuItemPrice(menuItemPrice);
    const info = object.getInfo();

    expectMenuItemPrice(info, menuItemPrice);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createMenuItemPrice();

    expect(new MenuItemPrice(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createMenuItemPrice();

    expect(new MenuItemPrice(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createMenuItemPrice();
    const { menuItemPrice: updatedMenuItemPrice } = await createMenuItemPriceInfo();

    object.updateInfo(updatedMenuItemPrice);

    const info = object.getInfo();

    expectMenuItemPrice(info, updatedMenuItemPrice);
  });

  test('getInfo should return provided info', async () => {
    const { menuItemPrice } = await createMenuItemPriceInfo();
    const object = await createMenuItemPrice(menuItemPrice);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectMenuItemPrice(info, menuItemPrice);
  });
});
