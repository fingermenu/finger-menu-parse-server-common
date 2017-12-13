// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import uuid from 'uuid/v4';
import '../../../bootstrap';
import { MenuItemPriceService } from '../';
import { createMenuItemPriceInfo, expectMenuItemPrice } from '../../schema/__tests__/MenuItemPrice.test';

const chance = new Chance();
const menuItemPriceService = new MenuItemPriceService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'menuItem', 'addedByUser', 'removedByUser'),
    include_menuItem: true,
    include_addedByUser: true,
    include_removedByUser: true,
  });

const createCriteria = menuItemPrice =>
  Map({
    conditions: Map({
      currentPrice: menuItemPrice ? menuItemPrice.get('currentPrice') : chance.floating({ min: 0, max: 1000 }),
      wasPrice: menuItemPrice ? menuItemPrice.get('wasPrice') : chance.floating({ min: 0, max: 1000 }),
      validFrom: menuItemPrice ? menuItemPrice.get('validFrom') : new Date(),
      validUntil: menuItemPrice ? menuItemPrice.get('validUntil') : new Date(),
      menuItemId: menuItemPrice ? menuItemPrice.get('menuItemId') : uuid(),
      addedByUserId: menuItemPrice ? menuItemPrice.get('addedByUserId') : uuid(),
      removedByUserId: menuItemPrice ? menuItemPrice.get('removedByUserId') : uuid(),
    }),
  }).merge(createCriteriaWthoutConditions());

const createMenuItemPrices = async (count, useSameInfo = false) => {
  let menuItemPrice;

  if (useSameInfo) {
    const { menuItemPrice: tempMenuItemPrice } = await createMenuItemPriceInfo();

    menuItemPrice = tempMenuItemPrice;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalMenuItemPrice;

      if (useSameInfo) {
        finalMenuItemPrice = menuItemPrice;
      } else {
        const { menuItemPrice: tempMenuItemPrice } = await createMenuItemPriceInfo();

        finalMenuItemPrice = tempMenuItemPrice;
      }

      return menuItemPriceService.read(await menuItemPriceService.create(finalMenuItemPrice), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createMenuItemPrices;

describe('create', () => {
  test('should return the created menu item price Id', async () => {
    const menuItemPriceId = await menuItemPriceService.create((await createMenuItemPriceInfo()).menuItemPrice);

    expect(menuItemPriceId).toBeDefined();
  });

  test('should create the menu item price', async () => {
    const { menuItemPrice } = await createMenuItemPriceInfo();
    const menuItemPriceId = await menuItemPriceService.create(menuItemPrice);
    const fetchedMenuItemPrice = await menuItemPriceService.read(menuItemPriceId, createCriteriaWthoutConditions());

    expect(fetchedMenuItemPrice).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided menu item price Id does not exist', async () => {
    const menuItemPriceId = uuid();

    try {
      await menuItemPriceService.read(menuItemPriceId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu item price found with Id: ${menuItemPriceId}`);
    }
  });

  test('should read the existing menu item price', async () => {
    const {
      menuItemPrice: expectedMenuItemPrice,
      menuItem: expectedMenuItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createMenuItemPriceInfo();
    const menuItemPriceId = await menuItemPriceService.create(expectedMenuItemPrice);
    const menuItemPrice = await menuItemPriceService.read(menuItemPriceId, createCriteriaWthoutConditions());

    expectMenuItemPrice(menuItemPrice, expectedMenuItemPrice, {
      menuItemPriceId,
      expectedMenuItem,
      expectedAddedByUser,
      expectedRemovedByUser,
    });
  });
});

describe('update', () => {
  test('should reject if the provided menu item price Id does not exist', async () => {
    const menuItemPriceId = uuid();

    try {
      const menuItemPrice = await menuItemPriceService.read(
        await menuItemPriceService.create((await createMenuItemPriceInfo()).menuItemPrice),
        createCriteriaWthoutConditions(),
      );

      await menuItemPriceService.update(menuItemPrice.set('id', menuItemPriceId));
    } catch (ex) {
      expect(ex.message).toBe(`No menu item price found with Id: ${menuItemPriceId}`);
    }
  });

  test('should return the Id of the updated menu item price', async () => {
    const { menuItemPrice: expectedMenuItemPrice } = await createMenuItemPriceInfo();
    const menuItemPriceId = await menuItemPriceService.create((await createMenuItemPriceInfo()).menuItemPrice);
    const id = await menuItemPriceService.update(expectedMenuItemPrice.set('id', menuItemPriceId));

    expect(id).toBe(menuItemPriceId);
  });

  test('should update the existing menu item price', async () => {
    const {
      menuItemPrice: expectedMenuItemPrice,
      menuItem: expectedMenuItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createMenuItemPriceInfo();
    const menuItemPriceId = await menuItemPriceService.create((await createMenuItemPriceInfo()).menuItemPrice);

    await menuItemPriceService.update(expectedMenuItemPrice.set('id', menuItemPriceId));

    const menuItemPrice = await menuItemPriceService.read(menuItemPriceId, createCriteriaWthoutConditions());

    expectMenuItemPrice(menuItemPrice, expectedMenuItemPrice, {
      menuItemPriceId,
      expectedMenuItem,
      expectedAddedByUser,
      expectedRemovedByUser,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided menu item price Id does not exist', async () => {
    const menuItemPriceId = uuid();

    try {
      await menuItemPriceService.delete(menuItemPriceId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu item price found with Id: ${menuItemPriceId}`);
    }
  });

  test('should delete the existing menu item price', async () => {
    const menuItemPriceId = await menuItemPriceService.create((await createMenuItemPriceInfo()).menuItemPrice);
    await menuItemPriceService.delete(menuItemPriceId);

    try {
      await menuItemPriceService.delete(menuItemPriceId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu item price found with Id: ${menuItemPriceId}`);
    }
  });
});

describe('search', () => {
  test('should return no menu item price if provided criteria matches no menu item price', async () => {
    const menuItemPrices = await menuItemPriceService.search(createCriteria());

    expect(menuItemPrices.count()).toBe(0);
  });

  test('should return the menu item price matches the criteria', async () => {
    const {
      menuItemPrice: expectedMenuItemPrice,
      menuItem: expectedMenuItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createMenuItemPriceInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => menuItemPriceService.create(expectedMenuItemPrice))
      .toArray()));
    const menuItemPrices = await menuItemPriceService.search(createCriteria(expectedMenuItemPrice));

    expect(menuItemPrices.count).toBe(results.count);
    menuItemPrices.forEach((menuItemPrice) => {
      expect(results.find(_ => _.localeCompare(menuItemPrice.get('id')) === 0)).toBeDefined();
      expectMenuItemPrice(menuItemPrice, expectedMenuItemPrice, {
        menuItemPriceId: menuItemPrice.get('id'),
        expectedMenuItem,
        expectedAddedByUser,
        expectedRemovedByUser,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no menu item price if provided criteria matches no menu item price', async () => {
    let menuItemPrices = List();
    const result = menuItemPriceService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        menuItemPrices = menuItemPrices.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(menuItemPrices.count()).toBe(0);
  });

  test('should return the menu item price matches the criteria', async () => {
    const {
      menuItemPrice: expectedMenuItemPrice,
      menuItem: expectedMenuItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createMenuItemPriceInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => menuItemPriceService.create(expectedMenuItemPrice))
      .toArray()));

    let menuItemPrices = List();
    const result = menuItemPriceService.searchAll(createCriteria(expectedMenuItemPrice));

    try {
      result.event.subscribe((info) => {
        menuItemPrices = menuItemPrices.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(menuItemPrices.count).toBe(results.count);
    menuItemPrices.forEach((menuItemPrice) => {
      expect(results.find(_ => _.localeCompare(menuItemPrice.get('id')) === 0)).toBeDefined();
      expectMenuItemPrice(menuItemPrice, expectedMenuItemPrice, {
        menuItemPriceId: menuItemPrice.get('id'),
        expectedMenuItem,
        expectedAddedByUser,
        expectedRemovedByUser,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no menu item price match provided criteria', async () => {
    expect(await menuItemPriceService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any menu item price match provided criteria', async () => {
    const menuItemPrices = await createMenuItemPrices(chance.integer({ min: 1, max: 10 }), true);

    expect(await menuItemPriceService.exists(createCriteria(menuItemPrices.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no menu item price match provided criteria', async () => {
    expect(await menuItemPriceService.count(createCriteria())).toBe(0);
  });

  test('should return the count of menu item price match provided criteria', async () => {
    const menuItemPrices = await createMenuItemPrices(chance.integer({ min: 1, max: 10 }), true);

    expect(await menuItemPriceService.count(createCriteria(menuItemPrices.first()))).toBe(menuItemPrices.count());
  });
});
