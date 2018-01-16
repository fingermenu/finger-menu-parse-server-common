// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { TableStatusService } from '../';
import { createTableStatusInfo, expectTableStatus } from '../../schema/__tests__/TableStatus.test';

const chance = new Chance();
const tableStatusService = new TableStatusService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('status', 'table', 'user'),
    include_table: true,
    include_user: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      status: object ? object.get('status') : chance.string(),
      tableId: object ? object.get('tableId') : chance.string(),
      userId: object ? object.get('userId') : chance.string(),
    }),
  }).merge(createCriteriaWthoutConditions());

const createTableStatuss = async (count, useSameInfo = false) => {
  let tableStatus;

  if (useSameInfo) {
    const { tableStatus: tempTableStatus } = await createTableStatusInfo();

    tableStatus = tempTableStatus;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalTableStatus;

      if (useSameInfo) {
        finalTableStatus = tableStatus;
      } else {
        const { tableStatus: tempTableStatus } = await createTableStatusInfo();

        finalTableStatus = tempTableStatus;
      }

      return tableStatusService.read(await tableStatusService.create(finalTableStatus), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createTableStatuss;

describe('create', () => {
  test('should return the created tableStatus Id', async () => {
    const tableStatusId = await tableStatusService.create((await createTableStatusInfo()).tableStatus);

    expect(tableStatusId).toBeDefined();
  });

  test('should create the tableStatus', async () => {
    const { tableStatus } = await createTableStatusInfo();
    const tableStatusId = await tableStatusService.create(tableStatus);
    const fetchedTableStatus = await tableStatusService.read(tableStatusId, createCriteriaWthoutConditions());

    expect(fetchedTableStatus).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided tableStatus Id does not exist', async () => {
    const tableStatusId = chance.string();

    try {
      await tableStatusService.read(tableStatusId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableStatus found with Id: ${tableStatusId}`);
    }
  });

  test('should read the existing tableStatus', async () => {
    const { tableStatus: expectedTableStatus, table: expectedTable, user: expectedOwnedByUser } = await createTableStatusInfo();
    const tableStatusId = await tableStatusService.create(expectedTableStatus);
    const tableStatus = await tableStatusService.read(tableStatusId, createCriteriaWthoutConditions());

    expectTableStatus(tableStatus, expectedTableStatus, {
      tableStatusId,
      expectedTable,
      expectedOwnedByUser,
    });
  });
});

describe('update', () => {
  test('should reject if the provided tableStatus Id does not exist', async () => {
    const tableStatusId = chance.string();

    try {
      const tableStatus = await tableStatusService.read(
        await tableStatusService.create((await createTableStatusInfo()).tableStatus),
        createCriteriaWthoutConditions(),
      );

      await tableStatusService.update(tableStatus.set('id', tableStatusId));
    } catch (ex) {
      expect(ex.message).toBe(`No tableStatus found with Id: ${tableStatusId}`);
    }
  });

  test('should return the Id of the updated tableStatus', async () => {
    const { tableStatus: expectedTableStatus } = await createTableStatusInfo();
    const tableStatusId = await tableStatusService.create((await createTableStatusInfo()).tableStatus);
    const id = await tableStatusService.update(expectedTableStatus.set('id', tableStatusId));

    expect(id).toBe(tableStatusId);
  });

  test('should update the existing tableStatus', async () => {
    const { tableStatus: expectedTableStatus, table: expectedTable, user: expectedOwnedByUser } = await createTableStatusInfo();
    const tableStatusId = await tableStatusService.create((await createTableStatusInfo()).tableStatus);

    await tableStatusService.update(expectedTableStatus.set('id', tableStatusId));

    const tableStatus = await tableStatusService.read(tableStatusId, createCriteriaWthoutConditions());

    expectTableStatus(tableStatus, expectedTableStatus, {
      tableStatusId,
      expectedTable,
      expectedOwnedByUser,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided tableStatus Id does not exist', async () => {
    const tableStatusId = chance.string();

    try {
      await tableStatusService.delete(tableStatusId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableStatus found with Id: ${tableStatusId}`);
    }
  });

  test('should delete the existing tableStatus', async () => {
    const tableStatusId = await tableStatusService.create((await createTableStatusInfo()).tableStatus);
    await tableStatusService.delete(tableStatusId);

    try {
      await tableStatusService.delete(tableStatusId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableStatus found with Id: ${tableStatusId}`);
    }
  });
});

describe('search', () => {
  test('should return no tableStatus if provided criteria matches no tableStatus', async () => {
    const tableStatuss = await tableStatusService.search(createCriteria());

    expect(tableStatuss.count()).toBe(0);
  });

  test('should return the tableStatus matches the criteria', async () => {
    const { tableStatus: expectedTableStatus, table: expectedTable, user: expectedOwnedByUser } = await createTableStatusInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => tableStatusService.create(expectedTableStatus))
      .toArray()));
    const tableStatuss = await tableStatusService.search(createCriteria(expectedTableStatus));

    expect(tableStatuss.count).toBe(results.count);
    tableStatuss.forEach((tableStatus) => {
      expect(results.find(_ => _.localeCompare(tableStatus.get('id')) === 0)).toBeDefined();
      expectTableStatus(tableStatus, expectedTableStatus, {
        tableStatusId: tableStatus.get('id'),
        expectedTable,
        expectedOwnedByUser,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no tableStatus if provided criteria matches no tableStatus', async () => {
    let tableStatuss = List();
    const result = tableStatusService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        tableStatuss = tableStatuss.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tableStatuss.count()).toBe(0);
  });

  test('should return the tableStatus matches the criteria', async () => {
    const { tableStatus: expectedTableStatus, table: expectedTable, user: expectedOwnedByUser } = await createTableStatusInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => tableStatusService.create(expectedTableStatus))
      .toArray()));

    let tableStatuss = List();
    const result = tableStatusService.searchAll(createCriteria(expectedTableStatus));

    try {
      result.event.subscribe((info) => {
        tableStatuss = tableStatuss.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tableStatuss.count).toBe(results.count);
    tableStatuss.forEach((tableStatus) => {
      expect(results.find(_ => _.localeCompare(tableStatus.get('id')) === 0)).toBeDefined();
      expectTableStatus(tableStatus, expectedTableStatus, {
        tableStatusId: tableStatus.get('id'),
        expectedTable,
        expectedOwnedByUser,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no tableStatus match provided criteria', async () => {
    expect(await tableStatusService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any tableStatus match provided criteria', async () => {
    const tableStatuss = await createTableStatuss(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableStatusService.exists(createCriteria(tableStatuss.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no tableStatus match provided criteria', async () => {
    expect(await tableStatusService.count(createCriteria())).toBe(0);
  });

  test('should return the count of tableStatus match provided criteria', async () => {
    const tableStatuss = await createTableStatuss(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableStatusService.count(createCriteria(tableStatuss.first()))).toBe(tableStatuss.count());
  });
});
