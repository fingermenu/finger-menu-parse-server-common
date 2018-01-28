// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { OrderStateService } from '../';
import { createOrderStateInfo, expectOrderState } from '../../schema/__tests__/OrderState.test';

const chance = new Chance();
const orderStateService = new OrderStateService();

const getLanguages = (object) => {
  const languages = object ? object.get('name').keySeq() : List();
  const language = languages.isEmpty() ? null : languages.first();

  return { languages, language };
};

const createCriteriaWthoutConditions = (languages, language) =>
  Map({
    fields: List.of('key', 'languages_name', 'imageUrl').concat(languages ? languages.map(_ => `${_}_name`) : List()),
    language,
  });

const createCriteria = (object) => {
  const { language, languages } = getLanguages(object);

  return Map({
    conditions: Map({
      key: object ? object.get('key') : chance.string(),
      name: language ? object.get('name').get(language) : chance.string(),
      imageUrl: object ? object.get('imageUrl') : chance.string(),
    }),
  }).merge(createCriteriaWthoutConditions(languages, language));
};

const createOrderStates = async (count, useSameInfo = false) => {
  let orderState;

  if (useSameInfo) {
    const { orderState: tempOrderState } = await createOrderStateInfo();

    orderState = tempOrderState;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalOrderState;

      if (useSameInfo) {
        finalOrderState = orderState;
      } else {
        const { orderState: tempOrderState } = await createOrderStateInfo();

        finalOrderState = tempOrderState;
      }

      return orderStateService.read(await orderStateService.create(finalOrderState), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createOrderStates;

describe('create', () => {
  test('should return the created orderState Id', async () => {
    const orderStateId = await orderStateService.create((await createOrderStateInfo()).orderState);

    expect(orderStateId).toBeDefined();
  });

  test('should create the orderState', async () => {
    const { orderState } = await createOrderStateInfo();
    const orderStateId = await orderStateService.create(orderState);
    const fetchedOrderState = await orderStateService.read(orderStateId, createCriteriaWthoutConditions());

    expect(fetchedOrderState).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided orderState Id does not exist', async () => {
    const orderStateId = chance.string();

    try {
      await orderStateService.read(orderStateId);
    } catch (ex) {
      expect(ex.message).toBe(`No orderState found with Id: ${orderStateId}`);
    }
  });

  test('should read the existing orderState', async () => {
    const {
      orderState: expectedOrderState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createOrderStateInfo();
    const orderStateId = await orderStateService.create(expectedOrderState);
    const orderState = await orderStateService.read(orderStateId, createCriteriaWthoutConditions());

    expectOrderState(orderState, expectedOrderState, {
      orderStateId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided orderState Id does not exist', async () => {
    const orderStateId = chance.string();

    try {
      const orderState = await orderStateService.read(
        await orderStateService.create((await createOrderStateInfo()).orderState),
        createCriteriaWthoutConditions(),
      );

      await orderStateService.update(orderState.set('id', orderStateId));
    } catch (ex) {
      expect(ex.message).toBe(`No orderState found with Id: ${orderStateId}`);
    }
  });

  test('should return the Id of the updated orderState', async () => {
    const { orderState: expectedOrderState } = await createOrderStateInfo();
    const orderStateId = await orderStateService.create((await createOrderStateInfo()).orderState);
    const id = await orderStateService.update(expectedOrderState.set('id', orderStateId));

    expect(id).toBe(orderStateId);
  });

  test('should update the existing orderState', async () => {
    const {
      orderState: expectedOrderState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createOrderStateInfo();
    const orderStateId = await orderStateService.create((await createOrderStateInfo()).orderState);

    await orderStateService.update(expectedOrderState.set('id', orderStateId));

    const orderState = await orderStateService.read(orderStateId, createCriteriaWthoutConditions());

    expectOrderState(orderState, expectedOrderState, {
      orderStateId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided orderState Id does not exist', async () => {
    const orderStateId = chance.string();

    try {
      await orderStateService.delete(orderStateId);
    } catch (ex) {
      expect(ex.message).toBe(`No orderState found with Id: ${orderStateId}`);
    }
  });

  test('should delete the existing orderState', async () => {
    const orderStateId = await orderStateService.create((await createOrderStateInfo()).orderState);
    await orderStateService.delete(orderStateId);

    try {
      await orderStateService.delete(orderStateId);
    } catch (ex) {
      expect(ex.message).toBe(`No orderState found with Id: ${orderStateId}`);
    }
  });
});

describe('search', () => {
  test('should return no orderState if provided criteria matches no orderState', async () => {
    const orderStates = await orderStateService.search(createCriteria());

    expect(orderStates.count()).toBe(0);
  });

  test('should return the orderState matches the criteria', async () => {
    const {
      orderState: expectedOrderState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createOrderStateInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => orderStateService.create(expectedOrderState))
      .toArray()));
    const orderStates = await orderStateService.search(createCriteria(expectedOrderState));

    expect(orderStates.count).toBe(results.count);
    orderStates.forEach((orderState) => {
      expect(results.find(_ => _.localeCompare(orderState.get('id')) === 0)).toBeDefined();
      expectOrderState(orderState, expectedOrderState, {
        orderStateId: orderState.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no orderState if provided criteria matches no orderState', async () => {
    let orderStates = List();
    const result = orderStateService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        orderStates = orderStates.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(orderStates.count()).toBe(0);
  });

  test('should return the orderState matches the criteria', async () => {
    const {
      orderState: expectedOrderState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createOrderStateInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => orderStateService.create(expectedOrderState))
      .toArray()));

    let orderStates = List();
    const result = orderStateService.searchAll(createCriteria(expectedOrderState));

    try {
      result.event.subscribe((info) => {
        orderStates = orderStates.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(orderStates.count).toBe(results.count);
    orderStates.forEach((orderState) => {
      expect(results.find(_ => _.localeCompare(orderState.get('id')) === 0)).toBeDefined();
      expectOrderState(orderState, expectedOrderState, {
        orderStateId: orderState.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no orderState match provided criteria', async () => {
    expect(await orderStateService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any orderState match provided criteria', async () => {
    const orderStates = await createOrderStates(chance.integer({ min: 1, max: 10 }), true);

    expect(await orderStateService.exists(createCriteria(orderStates.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no orderState match provided criteria', async () => {
    expect(await orderStateService.count(createCriteria())).toBe(0);
  });

  test('should return the count of orderState match provided criteria', async () => {
    const orderStates = await createOrderStates(chance.integer({ min: 1, max: 10 }), true);

    expect(await orderStateService.count(createCriteria(orderStates.first()))).toBe(orderStates.count());
  });
});
