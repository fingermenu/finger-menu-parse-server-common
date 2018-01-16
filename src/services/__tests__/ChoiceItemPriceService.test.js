// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { ChoiceItemPriceService } from '../';
import { createChoiceItemPriceInfo, expectChoiceItemPrice } from '../../schema/__tests__/ChoiceItemPrice.test';

const chance = new Chance();
const choiceItemPriceService = new ChoiceItemPriceService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'choiceItem', 'addedByUser', 'removedByUser'),
    include_choiceItem: true,
    include_addedByUser: true,
    include_removedByUser: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      currentPrice: object ? object.get('currentPrice') : chance.floating({ min: 0, max: 1000 }),
      wasPrice: object ? object.get('wasPrice') : chance.floating({ min: 0, max: 1000 }),
      validFrom: object ? object.get('validFrom') : new Date(),
      validUntil: object ? object.get('validUntil') : new Date(),
      choiceItemId: object ? object.get('choiceItemId') : chance.string(),
      addedByUserId: object ? object.get('addedByUserId') : chance.string(),
      removedByUserId: object ? object.get('removedByUserId') : chance.string(),
    }),
  }).merge(createCriteriaWthoutConditions());

const createChoiceItemPrices = async (count, useSameInfo = false) => {
  let choiceItemPrice;

  if (useSameInfo) {
    const { choiceItemPrice: tempChoiceItemPrice } = await createChoiceItemPriceInfo();

    choiceItemPrice = tempChoiceItemPrice;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalChoiceItemPrice;

      if (useSameInfo) {
        finalChoiceItemPrice = choiceItemPrice;
      } else {
        const { choiceItemPrice: tempChoiceItemPrice } = await createChoiceItemPriceInfo();

        finalChoiceItemPrice = tempChoiceItemPrice;
      }

      return choiceItemPriceService.read(await choiceItemPriceService.create(finalChoiceItemPrice), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createChoiceItemPrices;

describe('create', () => {
  test('should return the created choice item price Id', async () => {
    const choiceItemPriceId = await choiceItemPriceService.create((await createChoiceItemPriceInfo()).choiceItemPrice);

    expect(choiceItemPriceId).toBeDefined();
  });

  test('should create the choice item price', async () => {
    const { choiceItemPrice } = await createChoiceItemPriceInfo();
    const choiceItemPriceId = await choiceItemPriceService.create(choiceItemPrice);
    const fetchedChoiceItemPrice = await choiceItemPriceService.read(choiceItemPriceId, createCriteriaWthoutConditions());

    expect(fetchedChoiceItemPrice).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided choice item price Id does not exist', async () => {
    const choiceItemPriceId = chance.string();

    try {
      await choiceItemPriceService.read(choiceItemPriceId);
    } catch (ex) {
      expect(ex.message).toBe(`No choice item price found with Id: ${choiceItemPriceId}`);
    }
  });

  test('should read the existing choice item price', async () => {
    const {
      choiceItemPrice: expectedChoiceItemPrice,
      choiceItem: expectedChoiceItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createChoiceItemPriceInfo();
    const choiceItemPriceId = await choiceItemPriceService.create(expectedChoiceItemPrice);
    const choiceItemPrice = await choiceItemPriceService.read(choiceItemPriceId, createCriteriaWthoutConditions());

    expectChoiceItemPrice(choiceItemPrice, expectedChoiceItemPrice, {
      choiceItemPriceId,
      expectedChoiceItem,
      expectedAddedByUser,
      expectedRemovedByUser,
    });
  });
});

describe('update', () => {
  test('should reject if the provided choice item price Id does not exist', async () => {
    const choiceItemPriceId = chance.string();

    try {
      const choiceItemPrice = await choiceItemPriceService.read(
        await choiceItemPriceService.create((await createChoiceItemPriceInfo()).choiceItemPrice),
        createCriteriaWthoutConditions(),
      );

      await choiceItemPriceService.update(choiceItemPrice.set('id', choiceItemPriceId));
    } catch (ex) {
      expect(ex.message).toBe(`No choice item price found with Id: ${choiceItemPriceId}`);
    }
  });

  test('should return the Id of the updated choice item price', async () => {
    const { choiceItemPrice: expectedChoiceItemPrice } = await createChoiceItemPriceInfo();
    const choiceItemPriceId = await choiceItemPriceService.create((await createChoiceItemPriceInfo()).choiceItemPrice);
    const id = await choiceItemPriceService.update(expectedChoiceItemPrice.set('id', choiceItemPriceId));

    expect(id).toBe(choiceItemPriceId);
  });

  test('should update the existing choice item price', async () => {
    const {
      choiceItemPrice: expectedChoiceItemPrice,
      choiceItem: expectedChoiceItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createChoiceItemPriceInfo();
    const choiceItemPriceId = await choiceItemPriceService.create((await createChoiceItemPriceInfo()).choiceItemPrice);

    await choiceItemPriceService.update(expectedChoiceItemPrice.set('id', choiceItemPriceId));

    const choiceItemPrice = await choiceItemPriceService.read(choiceItemPriceId, createCriteriaWthoutConditions());

    expectChoiceItemPrice(choiceItemPrice, expectedChoiceItemPrice, {
      choiceItemPriceId,
      expectedChoiceItem,
      expectedAddedByUser,
      expectedRemovedByUser,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided choice item price Id does not exist', async () => {
    const choiceItemPriceId = chance.string();

    try {
      await choiceItemPriceService.delete(choiceItemPriceId);
    } catch (ex) {
      expect(ex.message).toBe(`No choice item price found with Id: ${choiceItemPriceId}`);
    }
  });

  test('should delete the existing choice item price', async () => {
    const choiceItemPriceId = await choiceItemPriceService.create((await createChoiceItemPriceInfo()).choiceItemPrice);
    await choiceItemPriceService.delete(choiceItemPriceId);

    try {
      await choiceItemPriceService.delete(choiceItemPriceId);
    } catch (ex) {
      expect(ex.message).toBe(`No choice item price found with Id: ${choiceItemPriceId}`);
    }
  });
});

describe('search', () => {
  test('should return no choice item price if provided criteria matches no choice item price', async () => {
    const choiceItemPrices = await choiceItemPriceService.search(createCriteria());

    expect(choiceItemPrices.count()).toBe(0);
  });

  test('should return the choice item price matches the criteria', async () => {
    const {
      choiceItemPrice: expectedChoiceItemPrice,
      choiceItem: expectedChoiceItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createChoiceItemPriceInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => choiceItemPriceService.create(expectedChoiceItemPrice))
      .toArray()));
    const choiceItemPrices = await choiceItemPriceService.search(createCriteria(expectedChoiceItemPrice));

    expect(choiceItemPrices.count).toBe(results.count);
    choiceItemPrices.forEach((choiceItemPrice) => {
      expect(results.find(_ => _.localeCompare(choiceItemPrice.get('id')) === 0)).toBeDefined();
      expectChoiceItemPrice(choiceItemPrice, expectedChoiceItemPrice, {
        choiceItemPriceId: choiceItemPrice.get('id'),
        expectedChoiceItem,
        expectedAddedByUser,
        expectedRemovedByUser,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no choice item price if provided criteria matches no choice item price', async () => {
    let choiceItemPrices = List();
    const result = choiceItemPriceService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        choiceItemPrices = choiceItemPrices.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(choiceItemPrices.count()).toBe(0);
  });

  test('should return the choice item price matches the criteria', async () => {
    const {
      choiceItemPrice: expectedChoiceItemPrice,
      choiceItem: expectedChoiceItem,
      addedByUser: expectedAddedByUser,
      removedByUser: expectedRemovedByUser,
    } = await createChoiceItemPriceInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => choiceItemPriceService.create(expectedChoiceItemPrice))
      .toArray()));

    let choiceItemPrices = List();
    const result = choiceItemPriceService.searchAll(createCriteria(expectedChoiceItemPrice));

    try {
      result.event.subscribe((info) => {
        choiceItemPrices = choiceItemPrices.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(choiceItemPrices.count).toBe(results.count);
    choiceItemPrices.forEach((choiceItemPrice) => {
      expect(results.find(_ => _.localeCompare(choiceItemPrice.get('id')) === 0)).toBeDefined();
      expectChoiceItemPrice(choiceItemPrice, expectedChoiceItemPrice, {
        choiceItemPriceId: choiceItemPrice.get('id'),
        expectedChoiceItem,
        expectedAddedByUser,
        expectedRemovedByUser,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no choice item price match provided criteria', async () => {
    expect(await choiceItemPriceService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any choice item price match provided criteria', async () => {
    const choiceItemPrices = await createChoiceItemPrices(chance.integer({ min: 1, max: 10 }), true);

    expect(await choiceItemPriceService.exists(createCriteria(choiceItemPrices.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no choice item price match provided criteria', async () => {
    expect(await choiceItemPriceService.count(createCriteria())).toBe(0);
  });

  test('should return the count of choice item price match provided criteria', async () => {
    const choiceItemPrices = await createChoiceItemPrices(chance.integer({ min: 1, max: 10 }), true);

    expect(await choiceItemPriceService.count(createCriteria(choiceItemPrices.first()))).toBe(choiceItemPrices.count());
  });
});
