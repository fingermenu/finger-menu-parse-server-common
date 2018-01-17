// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { TableService } from '../';
import { createTableInfo, expectTable } from '../../schema/__tests__/Table.test';

const chance = new Chance();
const tableService = new TableService();

const getLanguages = (object) => {
  const languages = object ? object.get('name').keySeq() : List();
  const language = languages.isEmpty() ? null : languages.first();

  return { languages, language };
};

const createCriteriaWthoutConditions = (languages, language) =>
  Map({
    fields: List.of('languages_name', 'status', 'restaurant', 'tableState', 'ownedByUser', 'maintainedByUsers').concat(languages ? languages.map(_ => `${_}_name`) : List()),
    language,
    include_restaurant: true,
    include_tableState: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = (object) => {
  const { language, languages } = getLanguages(object);

  return Map({
    conditions: Map({
      name: language ? object.get('name').get(language) : chance.string(),
      status: object ? object.get('status') : chance.string(),
      restaurantId: object ? object.get('restaurantId') : chance.string(),
      tableStateId: object ? object.get('tableStateId') : chance.string(),
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : List.of(chance.string(), chance.string()),
    }),
  }).merge(createCriteriaWthoutConditions(languages, language));
};

const createTables = async (count, useSameInfo = false) => {
  let table;

  if (useSameInfo) {
    const { table: tempTable } = await createTableInfo();

    table = tempTable;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalTable;

      if (useSameInfo) {
        finalTable = table;
      } else {
        const { table: tempTable } = await createTableInfo();

        finalTable = tempTable;
      }

      return tableService.read(await tableService.create(finalTable), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createTables;

describe('create', () => {
  test('should return the created table Id', async () => {
    const tableId = await tableService.create((await createTableInfo()).table);

    expect(tableId).toBeDefined();
  });

  test('should create the table', async () => {
    const { table } = await createTableInfo();
    const tableId = await tableService.create(table);
    const fetchedTable = await tableService.read(tableId, createCriteriaWthoutConditions());

    expect(fetchedTable).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided table Id does not exist', async () => {
    const tableId = chance.string();

    try {
      await tableService.read(tableId);
    } catch (ex) {
      expect(ex.message).toBe(`No table found with Id: ${tableId}`);
    }
  });

  test('should read the existing table', async () => {
    const {
      table: expectedTable,
      restaurant: expectedRestaurant,
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableInfo();
    const tableId = await tableService.create(expectedTable);
    const table = await tableService.read(tableId, createCriteriaWthoutConditions());

    expectTable(table, expectedTable, {
      tableId,
      expectedRestaurant,
      expectedTableState,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided table Id does not exist', async () => {
    const tableId = chance.string();

    try {
      const table = await tableService.read(await tableService.create((await createTableInfo()).table), createCriteriaWthoutConditions());

      await tableService.update(table.set('id', tableId));
    } catch (ex) {
      expect(ex.message).toBe(`No table found with Id: ${tableId}`);
    }
  });

  test('should return the Id of the updated table', async () => {
    const { table: expectedTable } = await createTableInfo();
    const tableId = await tableService.create((await createTableInfo()).table);
    const id = await tableService.update(expectedTable.set('id', tableId));

    expect(id).toBe(tableId);
  });

  test('should update the existing table', async () => {
    const {
      table: expectedTable,
      restaurant: expectedRestaurant,
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableInfo();
    const tableId = await tableService.create((await createTableInfo()).table);

    await tableService.update(expectedTable.set('id', tableId));

    const table = await tableService.read(tableId, createCriteriaWthoutConditions());

    expectTable(table, expectedTable, {
      tableId,
      expectedRestaurant,
      expectedTableState,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided table Id does not exist', async () => {
    const tableId = chance.string();

    try {
      await tableService.delete(tableId);
    } catch (ex) {
      expect(ex.message).toBe(`No table found with Id: ${tableId}`);
    }
  });

  test('should delete the existing table', async () => {
    const tableId = await tableService.create((await createTableInfo()).table);
    await tableService.delete(tableId);

    try {
      await tableService.delete(tableId);
    } catch (ex) {
      expect(ex.message).toBe(`No table found with Id: ${tableId}`);
    }
  });
});

describe('search', () => {
  test('should return no table if provided criteria matches no table', async () => {
    const tables = await tableService.search(createCriteria());

    expect(tables.count()).toBe(0);
  });

  test('should return the table matches the criteria', async () => {
    const {
      table: expectedTable,
      restaurant: expectedRestaurant,
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => tableService.create(expectedTable))
      .toArray()));
    const tables = await tableService.search(createCriteria(expectedTable));

    expect(tables.count).toBe(results.count);
    tables.forEach((table) => {
      expect(results.find(_ => _.localeCompare(table.get('id')) === 0)).toBeDefined();
      expectTable(table, expectedTable, {
        tableId: table.get('id'),
        expectedRestaurant,
        expectedTableState,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no table if provided criteria matches no table', async () => {
    let tables = List();
    const result = tableService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        tables = tables.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tables.count()).toBe(0);
  });

  test('should return the table matches the criteria', async () => {
    const {
      table: expectedTable,
      restaurant: expectedRestaurant,
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => tableService.create(expectedTable))
      .toArray()));

    let tables = List();
    const result = tableService.searchAll(createCriteria(expectedTable));

    try {
      result.event.subscribe((info) => {
        tables = tables.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tables.count).toBe(results.count);
    tables.forEach((table) => {
      expect(results.find(_ => _.localeCompare(table.get('id')) === 0)).toBeDefined();
      expectTable(table, expectedTable, {
        tableId: table.get('id'),
        expectedRestaurant,
        expectedTableState,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no table match provided criteria', async () => {
    expect(await tableService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any table match provided criteria', async () => {
    const tables = await createTables(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableService.exists(createCriteria(tables.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no table match provided criteria', async () => {
    expect(await tableService.count(createCriteria())).toBe(0);
  });

  test('should return the count of table match provided criteria', async () => {
    const tables = await createTables(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableService.count(createCriteria(tables.first()))).toBe(tables.count());
  });
});
