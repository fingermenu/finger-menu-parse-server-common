// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { TableStateChangeService } from '../';
import { createTableStateChangeInfo, expectTableStateChange } from '../../schema/__tests__/TableStateChange.test';

const chance = new Chance();
const tableStateChangeService = new TableStateChangeService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('state', 'table', 'user'),
    include_table: true,
    include_user: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      state: object ? object.get('state') : chance.string(),
      tableId: object ? object.get('tableId') : chance.string(),
      userId: object ? object.get('userId') : chance.string(),
    }),
  }).merge(createCriteriaWthoutConditions());

const createTableStateChanges = async (count, useSameInfo = false) => {
  let tableStateChange;

  if (useSameInfo) {
    const { tableStateChange: tempTableStateChange } = await createTableStateChangeInfo();

    tableStateChange = tempTableStateChange;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalTableStateChange;

      if (useSameInfo) {
        finalTableStateChange = tableStateChange;
      } else {
        const { tableStateChange: tempTableStateChange } = await createTableStateChangeInfo();

        finalTableStateChange = tempTableStateChange;
      }

      return tableStateChangeService.read(await tableStateChangeService.create(finalTableStateChange), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createTableStateChanges;

describe('create', () => {
  test('should return the created tableStateChange Id', async () => {
    const tableStateChangeId = await tableStateChangeService.create((await createTableStateChangeInfo()).tableStateChange);

    expect(tableStateChangeId).toBeDefined();
  });

  test('should create the tableStateChange', async () => {
    const { tableStateChange } = await createTableStateChangeInfo();
    const tableStateChangeId = await tableStateChangeService.create(tableStateChange);
    const fetchedTableStateChange = await tableStateChangeService.read(tableStateChangeId, createCriteriaWthoutConditions());

    expect(fetchedTableStateChange).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided tableStateChange Id does not exist', async () => {
    const tableStateChangeId = chance.string();

    try {
      await tableStateChangeService.read(tableStateChangeId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableStateChange found with Id: ${tableStateChangeId}`);
    }
  });

  test('should read the existing tableStateChange', async () => {
    const { tableStateChange: expectedTableStateChange, table: expectedTable, user: expectedOwnedByUser } = await createTableStateChangeInfo();
    const tableStateChangeId = await tableStateChangeService.create(expectedTableStateChange);
    const tableStateChange = await tableStateChangeService.read(tableStateChangeId, createCriteriaWthoutConditions());

    expectTableStateChange(tableStateChange, expectedTableStateChange, {
      tableStateChangeId,
      expectedTable,
      expectedOwnedByUser,
    });
  });
});

describe('update', () => {
  test('should reject if the provided tableStateChange Id does not exist', async () => {
    const tableStateChangeId = chance.string();

    try {
      const tableStateChange = await tableStateChangeService.read(
        await tableStateChangeService.create((await createTableStateChangeInfo()).tableStateChange),
        createCriteriaWthoutConditions(),
      );

      await tableStateChangeService.update(tableStateChange.set('id', tableStateChangeId));
    } catch (ex) {
      expect(ex.message).toBe(`No tableStateChange found with Id: ${tableStateChangeId}`);
    }
  });

  test('should return the Id of the updated tableStateChange', async () => {
    const { tableStateChange: expectedTableStateChange } = await createTableStateChangeInfo();
    const tableStateChangeId = await tableStateChangeService.create((await createTableStateChangeInfo()).tableStateChange);
    const id = await tableStateChangeService.update(expectedTableStateChange.set('id', tableStateChangeId));

    expect(id).toBe(tableStateChangeId);
  });

  test('should update the existing tableStateChange', async () => {
    const { tableStateChange: expectedTableStateChange, table: expectedTable, user: expectedOwnedByUser } = await createTableStateChangeInfo();
    const tableStateChangeId = await tableStateChangeService.create((await createTableStateChangeInfo()).tableStateChange);

    await tableStateChangeService.update(expectedTableStateChange.set('id', tableStateChangeId));

    const tableStateChange = await tableStateChangeService.read(tableStateChangeId, createCriteriaWthoutConditions());

    expectTableStateChange(tableStateChange, expectedTableStateChange, {
      tableStateChangeId,
      expectedTable,
      expectedOwnedByUser,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided tableStateChange Id does not exist', async () => {
    const tableStateChangeId = chance.string();

    try {
      await tableStateChangeService.delete(tableStateChangeId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableStateChange found with Id: ${tableStateChangeId}`);
    }
  });

  test('should delete the existing tableStateChange', async () => {
    const tableStateChangeId = await tableStateChangeService.create((await createTableStateChangeInfo()).tableStateChange);
    await tableStateChangeService.delete(tableStateChangeId);

    try {
      await tableStateChangeService.delete(tableStateChangeId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableStateChange found with Id: ${tableStateChangeId}`);
    }
  });
});

describe('search', () => {
  test('should return no tableStateChange if provided criteria matches no tableStateChange', async () => {
    const tableStateChanges = await tableStateChangeService.search(createCriteria());

    expect(tableStateChanges.count()).toBe(0);
  });

  test('should return the tableStateChange matches the criteria', async () => {
    const { tableStateChange: expectedTableStateChange, table: expectedTable, user: expectedOwnedByUser } = await createTableStateChangeInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => tableStateChangeService.create(expectedTableStateChange))
      .toArray()));
    const tableStateChanges = await tableStateChangeService.search(createCriteria(expectedTableStateChange));

    expect(tableStateChanges.count).toBe(results.count);
    tableStateChanges.forEach((tableStateChange) => {
      expect(results.find(_ => _.localeCompare(tableStateChange.get('id')) === 0)).toBeDefined();
      expectTableStateChange(tableStateChange, expectedTableStateChange, {
        tableStateChangeId: tableStateChange.get('id'),
        expectedTable,
        expectedOwnedByUser,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no tableStateChange if provided criteria matches no tableStateChange', async () => {
    let tableStateChanges = List();
    const result = tableStateChangeService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        tableStateChanges = tableStateChanges.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tableStateChanges.count()).toBe(0);
  });

  test('should return the tableStateChange matches the criteria', async () => {
    const { tableStateChange: expectedTableStateChange, table: expectedTable, user: expectedOwnedByUser } = await createTableStateChangeInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => tableStateChangeService.create(expectedTableStateChange))
      .toArray()));

    let tableStateChanges = List();
    const result = tableStateChangeService.searchAll(createCriteria(expectedTableStateChange));

    try {
      result.event.subscribe((info) => {
        tableStateChanges = tableStateChanges.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tableStateChanges.count).toBe(results.count);
    tableStateChanges.forEach((tableStateChange) => {
      expect(results.find(_ => _.localeCompare(tableStateChange.get('id')) === 0)).toBeDefined();
      expectTableStateChange(tableStateChange, expectedTableStateChange, {
        tableStateChangeId: tableStateChange.get('id'),
        expectedTable,
        expectedOwnedByUser,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no tableStateChange match provided criteria', async () => {
    expect(await tableStateChangeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any tableStateChange match provided criteria', async () => {
    const tableStateChanges = await createTableStateChanges(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableStateChangeService.exists(createCriteria(tableStateChanges.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no tableStateChange match provided criteria', async () => {
    expect(await tableStateChangeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of tableStateChange match provided criteria', async () => {
    const tableStateChanges = await createTableStateChanges(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableStateChangeService.count(createCriteria(tableStateChanges.first()))).toBe(tableStateChanges.count());
  });
});
