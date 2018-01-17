// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { TableStateService } from '../';
import { createTableStateInfo, expectTableState } from '../../schema/__tests__/TableState.test';

const chance = new Chance();
const tableStateService = new TableStateService();

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

const createTableStates = async (count, useSameInfo = false) => {
  let tableState;

  if (useSameInfo) {
    const { tableState: tempTableState } = await createTableStateInfo();

    tableState = tempTableState;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalTableState;

      if (useSameInfo) {
        finalTableState = tableState;
      } else {
        const { tableState: tempTableState } = await createTableStateInfo();

        finalTableState = tempTableState;
      }

      return tableStateService.read(await tableStateService.create(finalTableState), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createTableStates;

describe('create', () => {
  test('should return the created tableState Id', async () => {
    const tableStateId = await tableStateService.create((await createTableStateInfo()).tableState);

    expect(tableStateId).toBeDefined();
  });

  test('should create the tableState', async () => {
    const { tableState } = await createTableStateInfo();
    const tableStateId = await tableStateService.create(tableState);
    const fetchedTableState = await tableStateService.read(tableStateId, createCriteriaWthoutConditions());

    expect(fetchedTableState).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided tableState Id does not exist', async () => {
    const tableStateId = chance.string();

    try {
      await tableStateService.read(tableStateId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableState found with Id: ${tableStateId}`);
    }
  });

  test('should read the existing tableState', async () => {
    const {
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableStateInfo();
    const tableStateId = await tableStateService.create(expectedTableState);
    const tableState = await tableStateService.read(tableStateId, createCriteriaWthoutConditions());

    expectTableState(tableState, expectedTableState, {
      tableStateId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided tableState Id does not exist', async () => {
    const tableStateId = chance.string();

    try {
      const tableState = await tableStateService.read(
        await tableStateService.create((await createTableStateInfo()).tableState),
        createCriteriaWthoutConditions(),
      );

      await tableStateService.update(tableState.set('id', tableStateId));
    } catch (ex) {
      expect(ex.message).toBe(`No tableState found with Id: ${tableStateId}`);
    }
  });

  test('should return the Id of the updated tableState', async () => {
    const { tableState: expectedTableState } = await createTableStateInfo();
    const tableStateId = await tableStateService.create((await createTableStateInfo()).tableState);
    const id = await tableStateService.update(expectedTableState.set('id', tableStateId));

    expect(id).toBe(tableStateId);
  });

  test('should update the existing tableState', async () => {
    const {
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableStateInfo();
    const tableStateId = await tableStateService.create((await createTableStateInfo()).tableState);

    await tableStateService.update(expectedTableState.set('id', tableStateId));

    const tableState = await tableStateService.read(tableStateId, createCriteriaWthoutConditions());

    expectTableState(tableState, expectedTableState, {
      tableStateId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided tableState Id does not exist', async () => {
    const tableStateId = chance.string();

    try {
      await tableStateService.delete(tableStateId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableState found with Id: ${tableStateId}`);
    }
  });

  test('should delete the existing tableState', async () => {
    const tableStateId = await tableStateService.create((await createTableStateInfo()).tableState);
    await tableStateService.delete(tableStateId);

    try {
      await tableStateService.delete(tableStateId);
    } catch (ex) {
      expect(ex.message).toBe(`No tableState found with Id: ${tableStateId}`);
    }
  });
});

describe('search', () => {
  test('should return no tableState if provided criteria matches no tableState', async () => {
    const tableStates = await tableStateService.search(createCriteria());

    expect(tableStates.count()).toBe(0);
  });

  test('should return the tableState matches the criteria', async () => {
    const {
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableStateInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => tableStateService.create(expectedTableState))
      .toArray()));
    const tableStates = await tableStateService.search(createCriteria(expectedTableState));

    expect(tableStates.count).toBe(results.count);
    tableStates.forEach((tableState) => {
      expect(results.find(_ => _.localeCompare(tableState.get('id')) === 0)).toBeDefined();
      expectTableState(tableState, expectedTableState, {
        tableStateId: tableState.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no tableState if provided criteria matches no tableState', async () => {
    let tableStates = List();
    const result = tableStateService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        tableStates = tableStates.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tableStates.count()).toBe(0);
  });

  test('should return the tableState matches the criteria', async () => {
    const {
      tableState: expectedTableState,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createTableStateInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => tableStateService.create(expectedTableState))
      .toArray()));

    let tableStates = List();
    const result = tableStateService.searchAll(createCriteria(expectedTableState));

    try {
      result.event.subscribe((info) => {
        tableStates = tableStates.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tableStates.count).toBe(results.count);
    tableStates.forEach((tableState) => {
      expect(results.find(_ => _.localeCompare(tableState.get('id')) === 0)).toBeDefined();
      expectTableState(tableState, expectedTableState, {
        tableStateId: tableState.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no tableState match provided criteria', async () => {
    expect(await tableStateService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any tableState match provided criteria', async () => {
    const tableStates = await createTableStates(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableStateService.exists(createCriteria(tableStates.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no tableState match provided criteria', async () => {
    expect(await tableStateService.count(createCriteria())).toBe(0);
  });

  test('should return the count of tableState match provided criteria', async () => {
    const tableStates = await createTableStates(chance.integer({ min: 1, max: 10 }), true);

    expect(await tableStateService.count(createCriteria(tableStates.first()))).toBe(tableStates.count());
  });
});
