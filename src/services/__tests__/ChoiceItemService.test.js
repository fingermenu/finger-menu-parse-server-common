// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { ChoiceItemService } from '..';
import { createChoiceItemInfo, expectChoiceItem } from '../../schema/__tests__/ChoiceItem.test';

const chance = new Chance();
const choiceItemService = new ChoiceItemService();

const getLanguages = object => {
  const languages = object ? object.get('name').keySeq() : List();
  const language = languages.isEmpty() ? null : languages.first();

  return { languages, language };
};

const createCriteriaWthoutConditions = (languages, language) =>
  Map({
    fields: List.of('languages_name', 'languages_description', 'choiceItemPageUrl', 'imageUrl', 'tags', 'ownedByUser', 'maintainedByUsers')
      .concat(languages ? languages.map(_ => `${_}_name`) : List())
      .concat(languages ? languages.map(_ => `${_}_description`) : List()),
    language,
    include_tags: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = object => {
  const { language, languages } = getLanguages(object);

  return Map({
    conditions: Map({
      choiceItemPageUrl: object ? object.get('choiceItemPageUrl') : chance.string(),
      imageUrl: object ? object.get('imageUrl') : chance.string(),
      tagIds: object ? object.get('tagIds') : List.of(chance.string(), chance.string()),
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : List.of(chance.string(), chance.string()),
    }),
  }).merge(createCriteriaWthoutConditions(languages, language));
};

const createChoiceItems = async (count, useSameInfo = false) => {
  let choiceItem;

  if (useSameInfo) {
    const { choiceItem: tempChoiceItem } = await createChoiceItemInfo();

    choiceItem = tempChoiceItem;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalChoiceItem;

          if (useSameInfo) {
            finalChoiceItem = choiceItem;
          } else {
            const { choiceItem: tempChoiceItem } = await createChoiceItemInfo();

            finalChoiceItem = tempChoiceItem;
          }

          return choiceItemService.read(await choiceItemService.create(finalChoiceItem), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createChoiceItems;

describe('create', () => {
  test('should return the created choice item Id', async () => {
    const choiceItemId = await choiceItemService.create((await createChoiceItemInfo()).choiceItem);

    expect(choiceItemId).toBeDefined();
  });

  test('should create the choice item', async () => {
    const { choiceItem } = await createChoiceItemInfo();
    const choiceItemId = await choiceItemService.create(choiceItem);
    const fetchedChoiceItem = await choiceItemService.read(choiceItemId, createCriteriaWthoutConditions());

    expect(fetchedChoiceItem).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided choice item Id does not exist', async () => {
    const choiceItemId = chance.string();

    try {
      await choiceItemService.read(choiceItemId);
    } catch (ex) {
      expect(ex.message).toBe(`No choice item found with Id: ${choiceItemId}`);
    }
  });

  test('should read the existing choice item', async () => {
    const {
      choiceItem: expectedChoiceItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createChoiceItemInfo();
    const choiceItemId = await choiceItemService.create(expectedChoiceItem);
    const choiceItem = await choiceItemService.read(choiceItemId, createCriteriaWthoutConditions());

    expectChoiceItem(choiceItem, expectedChoiceItem, {
      choiceItemId,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided choice item Id does not exist', async () => {
    const choiceItemId = chance.string();

    try {
      const choiceItem = await choiceItemService.read(
        await choiceItemService.create((await createChoiceItemInfo()).choiceItem),
        createCriteriaWthoutConditions(),
      );

      await choiceItemService.update(choiceItem.set('id', choiceItemId));
    } catch (ex) {
      expect(ex.message).toBe(`No choice item found with Id: ${choiceItemId}`);
    }
  });

  test('should return the Id of the updated choice item', async () => {
    const { choiceItem: expectedChoiceItem } = await createChoiceItemInfo();
    const choiceItemId = await choiceItemService.create((await createChoiceItemInfo()).choiceItem);
    const id = await choiceItemService.update(expectedChoiceItem.set('id', choiceItemId));

    expect(id).toBe(choiceItemId);
  });

  test('should update the existing choice item', async () => {
    const {
      choiceItem: expectedChoiceItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createChoiceItemInfo();
    const choiceItemId = await choiceItemService.create((await createChoiceItemInfo()).choiceItem);

    await choiceItemService.update(expectedChoiceItem.set('id', choiceItemId));

    const choiceItem = await choiceItemService.read(choiceItemId, createCriteriaWthoutConditions());

    expectChoiceItem(choiceItem, expectedChoiceItem, {
      choiceItemId,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided choice item Id does not exist', async () => {
    const choiceItemId = chance.string();

    try {
      await choiceItemService.delete(choiceItemId);
    } catch (ex) {
      expect(ex.message).toBe(`No choice item found with Id: ${choiceItemId}`);
    }
  });

  test('should delete the existing choice item', async () => {
    const choiceItemId = await choiceItemService.create((await createChoiceItemInfo()).choiceItem);
    await choiceItemService.delete(choiceItemId);

    try {
      await choiceItemService.delete(choiceItemId);
    } catch (ex) {
      expect(ex.message).toBe(`No choice item found with Id: ${choiceItemId}`);
    }
  });
});

describe('search', () => {
  test('should return no choice item if provided criteria matches no choice item', async () => {
    const choiceItems = await choiceItemService.search(createCriteria());

    expect(choiceItems.count()).toBe(0);
  });

  test('should return the choice item matches the criteria', async () => {
    const {
      choiceItem: expectedChoiceItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createChoiceItemInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => choiceItemService.create(expectedChoiceItem))
          .toArray(),
      ),
    );
    const choiceItems = await choiceItemService.search(createCriteria(expectedChoiceItem));

    expect(choiceItems.count).toBe(results.count);
    choiceItems.forEach(choiceItem => {
      expect(results.find(_ => _.localeCompare(choiceItem.get('id')) === 0)).toBeDefined();
      expectChoiceItem(choiceItem, expectedChoiceItem, {
        choiceItemId: choiceItem.get('id'),
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no choice item if provided criteria matches no choice item', async () => {
    let choiceItems = List();
    const result = choiceItemService.searchAll(createCriteria());

    try {
      result.event.subscribe(info => {
        choiceItems = choiceItems.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(choiceItems.count()).toBe(0);
  });

  test('should return the choice item matches the criteria', async () => {
    const {
      choiceItem: expectedChoiceItem,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createChoiceItemInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => choiceItemService.create(expectedChoiceItem))
          .toArray(),
      ),
    );

    let choiceItems = List();
    const result = choiceItemService.searchAll(createCriteria(expectedChoiceItem));

    try {
      result.event.subscribe(info => {
        choiceItems = choiceItems.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(choiceItems.count).toBe(results.count);
    choiceItems.forEach(choiceItem => {
      expect(results.find(_ => _.localeCompare(choiceItem.get('id')) === 0)).toBeDefined();
      expectChoiceItem(choiceItem, expectedChoiceItem, {
        choiceItemId: choiceItem.get('id'),
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no choice item match provided criteria', async () => {
    expect(await choiceItemService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any choice item match provided criteria', async () => {
    const choiceItems = await createChoiceItems(chance.integer({ min: 1, max: 10 }), true);

    expect(await choiceItemService.exists(createCriteria(choiceItems.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no choice item match provided criteria', async () => {
    expect(await choiceItemService.count(createCriteria())).toBe(0);
  });

  test('should return the count of choice item match provided criteria', async () => {
    const choiceItems = await createChoiceItems(chance.integer({ min: 1, max: 10 }), true);

    expect(await choiceItemService.count(createCriteria(choiceItems.first()))).toBe(choiceItems.count());
  });
});
