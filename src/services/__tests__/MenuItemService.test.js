// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { MenuItemService } from '../';
import { createMenuItemInfo, expectMenuItem } from '../../schema/__tests__/MenuItem.test';

const chance = new Chance();
const menuItemService = new MenuItemService();

const getLanguages = (object) => {
  const languages = object ? object.get('name').keySeq() : List();
  const language = languages.isEmpty() ? null : languages.first();

  return { languages, language };
};

const createCriteriaWthoutConditions = (languages, language) =>
  Map({
    fields: List.of('languages_name', 'languages_description', 'menuItemPageUrl', 'imageUrl', 'tags', 'ownedByUser', 'maintainedByUsers')
      .concat(languages ? languages.map(_ => `${_}_name`) : List())
      .concat(languages ? languages.map(_ => `${_}_description`) : List()),
    language,
    include_tags: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = (object) => {
  const { language, languages } = getLanguages(object);

  return Map({
    conditions: Map({
      name: language ? object.get('name').get(language) : chance.string(),
      description: language ? object.get('description').get(language) : chance.string(),
      menuItemPageUrl: object ? object.get('menuItemPageUrl') : chance.string(),
      imageUrl: object ? object.get('imageUrl') : chance.string(),
      tagIds: object ? object.get('tagIds') : List.of(chance.string(), chance.string()),
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : List.of(chance.string(), chance.string()),
    }),
  }).merge(createCriteriaWthoutConditions(languages, language));
};

const createMenuItems = async (count, useSameInfo = false) => {
  let menuItem;

  if (useSameInfo) {
    const { menuItem: tempMenuItem } = await createMenuItemInfo();

    menuItem = tempMenuItem;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalMenuItem;

      if (useSameInfo) {
        finalMenuItem = menuItem;
      } else {
        const { menuItem: tempMenuItem } = await createMenuItemInfo();

        finalMenuItem = tempMenuItem;
      }

      return menuItemService.read(await menuItemService.create(finalMenuItem), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createMenuItems;

describe('create', () => {
  test('should return the created menu item Id', async () => {
    const menuItemId = await menuItemService.create((await createMenuItemInfo()).menuItem);

    expect(menuItemId).toBeDefined();
  });

  test('should create the menu item', async () => {
    const { menuItem } = await createMenuItemInfo();
    const menuItemId = await menuItemService.create(menuItem);
    const fetchedMenuItem = await menuItemService.read(menuItemId, createCriteriaWthoutConditions());

    expect(fetchedMenuItem).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided menu item Id does not exist', async () => {
    const menuItemId = chance.string();

    try {
      await menuItemService.read(menuItemId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu item found with Id: ${menuItemId}`);
    }
  });

  test('should read the existing menu item', async () => {
    const {
      menuItem: expectedMenuItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuItemInfo();
    const menuItemId = await menuItemService.create(expectedMenuItem);
    const menuItem = await menuItemService.read(menuItemId, createCriteriaWthoutConditions());

    expectMenuItem(menuItem, expectedMenuItem, {
      menuItemId,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided menu item Id does not exist', async () => {
    const menuItemId = chance.string();

    try {
      const menuItem = await menuItemService.read(
        await menuItemService.create((await createMenuItemInfo()).menuItem),
        createCriteriaWthoutConditions(),
      );

      await menuItemService.update(menuItem.set('id', menuItemId));
    } catch (ex) {
      expect(ex.message).toBe(`No menu item found with Id: ${menuItemId}`);
    }
  });

  test('should return the Id of the updated menu item', async () => {
    const { menuItem: expectedMenuItem } = await createMenuItemInfo();
    const menuItemId = await menuItemService.create((await createMenuItemInfo()).menuItem);
    const id = await menuItemService.update(expectedMenuItem.set('id', menuItemId));

    expect(id).toBe(menuItemId);
  });

  test('should update the existing menu item', async () => {
    const {
      menuItem: expectedMenuItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuItemInfo();
    const menuItemId = await menuItemService.create((await createMenuItemInfo()).menuItem);

    await menuItemService.update(expectedMenuItem.set('id', menuItemId));

    const menuItem = await menuItemService.read(menuItemId, createCriteriaWthoutConditions());

    expectMenuItem(menuItem, expectedMenuItem, {
      menuItemId,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided menu item Id does not exist', async () => {
    const menuItemId = chance.string();

    try {
      await menuItemService.delete(menuItemId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu item found with Id: ${menuItemId}`);
    }
  });

  test('should delete the existing menu item', async () => {
    const menuItemId = await menuItemService.create((await createMenuItemInfo()).menuItem);
    await menuItemService.delete(menuItemId);

    try {
      await menuItemService.delete(menuItemId);
    } catch (ex) {
      expect(ex.message).toBe(`No menu item found with Id: ${menuItemId}`);
    }
  });
});

describe('search', () => {
  test('should return no menu item if provided criteria matches no menu item', async () => {
    const menuItems = await menuItemService.search(createCriteria());

    expect(menuItems.count()).toBe(0);
  });

  test('should return the menu item matches the criteria', async () => {
    const {
      menuItem: expectedMenuItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuItemInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => menuItemService.create(expectedMenuItem))
      .toArray()));
    const menuItems = await menuItemService.search(createCriteria(expectedMenuItem));

    expect(menuItems.count).toBe(results.count);
    menuItems.forEach((menuItem) => {
      expect(results.find(_ => _.localeCompare(menuItem.get('id')) === 0)).toBeDefined();
      expectMenuItem(menuItem, expectedMenuItem, {
        menuItemId: menuItem.get('id'),
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no menu item if provided criteria matches no menu item', async () => {
    let menuItems = List();
    const result = menuItemService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        menuItems = menuItems.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(menuItems.count()).toBe(0);
  });

  test('should return the menu item matches the criteria', async () => {
    const {
      menuItem: expectedMenuItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMenuItemInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => menuItemService.create(expectedMenuItem))
      .toArray()));

    let menuItems = List();
    const result = menuItemService.searchAll(createCriteria(expectedMenuItem));

    try {
      result.event.subscribe((info) => {
        menuItems = menuItems.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(menuItems.count).toBe(results.count);
    menuItems.forEach((menuItem) => {
      expect(results.find(_ => _.localeCompare(menuItem.get('id')) === 0)).toBeDefined();
      expectMenuItem(menuItem, expectedMenuItem, {
        menuItemId: menuItem.get('id'),
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no menu item match provided criteria', async () => {
    expect(await menuItemService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any menu item match provided criteria', async () => {
    const menuItems = await createMenuItems(chance.integer({ min: 1, max: 10 }), true);

    expect(await menuItemService.exists(createCriteria(menuItems.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no menu item match provided criteria', async () => {
    expect(await menuItemService.count(createCriteria())).toBe(0);
  });

  test('should return the count of menu item match provided criteria', async () => {
    const menuItems = await createMenuItems(chance.integer({ min: 1, max: 10 }), true);

    expect(await menuItemService.count(createCriteria(menuItems.first()))).toBe(menuItems.count());
  });
});
