// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import uuid from 'uuid/v4';
import '../../../bootstrap';
import { MenuService } from '../';
import { createMenuInfo, expectMenu } from '../../schema/__tests__/Menu.test';

const chance = new Chance();
const menuService = new MenuService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('name', 'description', 'menuPageUrl', 'imageUrl', 'menuItemPrices', 'tags', 'ownedByUser', 'maintainedByUsers'),
    include_menuItemPrices: true,
    include_tags: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = menu =>
  Map({
    conditions: Map({
      name: menu ? menu.get('name') : uuid(),
      description: menu ? menu.get('description') : uuid(),
      menuPageUrl: menu ? menu.get('menuPageUrl') : uuid(),
      imageUrl: menu ? menu.get('imageUrl') : uuid(),
      menuItemPriceIds: menu ? menu.get('menuItemPriceIds') : List.of(uuid(), uuid()),
      tagIds: menu ? menu.get('tagIds') : List.of(uuid(), uuid()),
      ownedByUserId: menu ? menu.get('ownedByUserId') : uuid(),
      maintainedByUserIds: menu ? menu.get('maintainedByUserIds') : List.of(uuid(), uuid()),
    }),
  }).merge(createCriteriaWthoutConditions());

const createMenus = async (count, useSameInfo = false) => {
  let menu;

  if (useSameInfo) {
    const { menu: tempMenu } = await createMenuInfo();

    menu = tempMenu;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalMenu;

      if (useSameInfo) {
        finalMenu = menu;
      } else {
        const { menu: tempMenu } = await createMenuInfo();

        finalMenu = tempMenu;
      }

      return menuService.read(await menuService.create(finalMenu), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createMenus;

describe('create', () => {
  test('should return the created menu Id', async () => {
    const menuId = await menuService.create((await createMenuInfo()).menu);

    expect(menuId).toBeDefined();
  });

  test('should create the menu', async () => {
    const { menu } = await createMenuInfo();
    const menuId = await menuService.create(menu);
    const fetchedMenu = await menuService.read(menuId, createCriteriaWthoutConditions());

    expect(fetchedMenu).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided menu Id does not exist', async () => {
    const menuId = uuid();

    try {
      await menuService.read(menuId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu found with Id: ${menuId}`);
    }
  });

  test('should read the existing menu', async () => {
    const {
      menu: expectedMenu,
      menuItemPrices: expectedMenuItemPrices,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuInfo();
    const menuId = await menuService.create(expectedMenu);
    const menu = await menuService.read(menuId, createCriteriaWthoutConditions());

    expectMenu(menu, expectedMenu, {
      menuId,
      expectedMenuItemPrices,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided menu Id does not exist', async () => {
    const menuId = uuid();

    try {
      const menu = await menuService.read(await menuService.create((await createMenuInfo()).menu), createCriteriaWthoutConditions());

      await menuService.update(menu.set('id', menuId));
    } catch (ex) {
      expect(ex.message).toBe(`No menu found with Id: ${menuId}`);
    }
  });

  test('should return the Id of the updated menu', async () => {
    const { menu: expectedMenu } = await createMenuInfo();
    const menuId = await menuService.create((await createMenuInfo()).menu);
    const id = await menuService.update(expectedMenu.set('id', menuId));

    expect(id).toBe(menuId);
  });

  test('should update the existing menu', async () => {
    const {
      menu: expectedMenu,
      menuItemPrices: expectedMenuItemPrices,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuInfo();
    const menuId = await menuService.create((await createMenuInfo()).menu);

    await menuService.update(expectedMenu.set('id', menuId));

    const menu = await menuService.read(menuId, createCriteriaWthoutConditions());

    expectMenu(menu, expectedMenu, {
      menuId,
      expectedMenuItemPrices,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided menu Id does not exist', async () => {
    const menuId = uuid();

    try {
      await menuService.delete(menuId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu found with Id: ${menuId}`);
    }
  });

  test('should delete the existing menu', async () => {
    const menuId = await menuService.create((await createMenuInfo()).menu);
    await menuService.delete(menuId);

    try {
      await menuService.delete(menuId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu found with Id: ${menuId}`);
    }
  });
});

describe('search', () => {
  test('should return no menu if provided criteria matches no menu', async () => {
    const menus = await menuService.search(createCriteria());

    expect(menus.count()).toBe(0);
  });

  test('should return the menu matches the criteria', async () => {
    const {
      menu: expectedMenu,
      menuItemPrices: expectedMenuItemPrices,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => menuService.create(expectedMenu))
      .toArray()));
    const menus = await menuService.search(createCriteria(expectedMenu));

    expect(menus.count).toBe(results.count);
    menus.forEach((menu) => {
      expect(results.find(_ => _.localeCompare(menu.get('id')) === 0)).toBeDefined();
      expectMenu(menu, expectedMenu, {
        menuId: menu.get('id'),
        expectedMenuItemPrices,
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no menu if provided criteria matches no menu', async () => {
    let menus = List();
    const result = menuService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        menus = menus.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(menus.count()).toBe(0);
  });

  test('should return the menu matches the criteria', async () => {
    const {
      menu: expectedMenu,
      menuItemPrices: expectedMenuItemPrices,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => menuService.create(expectedMenu))
      .toArray()));

    let menus = List();
    const result = menuService.searchAll(createCriteria(expectedMenu));

    try {
      result.event.subscribe((info) => {
        menus = menus.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(menus.count).toBe(results.count);
    menus.forEach((menu) => {
      expect(results.find(_ => _.localeCompare(menu.get('id')) === 0)).toBeDefined();
      expectMenu(menu, expectedMenu, {
        menuId: menu.get('id'),
        expectedMenuItemPrices,
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no menu match provided criteria', async () => {
    expect(await menuService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any menu match provided criteria', async () => {
    const menus = await createMenus(chance.integer({ min: 1, max: 10 }), true);

    expect(await menuService.exists(createCriteria(menus.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no menu match provided criteria', async () => {
    expect(await menuService.count(createCriteria())).toBe(0);
  });

  test('should return the count of menu match provided criteria', async () => {
    const menus = await createMenus(chance.integer({ min: 1, max: 10 }), true);

    expect(await menuService.count(createCriteria(menus.first()))).toBe(menus.count());
  });
});
