// @flow

import { Map } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { TableStateChange } from '../';
import createTables from '../../services/__tests__/TableService.test';
import createTableStates from '../../services/__tests__/TableStateService.test';

export const createTableStateChangeInfo = async () => {
  const table = (await createTables(1)).first();
  const tableState = (await createTableStates(1)).first();
  const changedByUser = await TestHelper.createUser();
  const tableStateChange = Map({
    tableStateId: tableState.get('id'),
    tableId: table.get('id'),
    changedByUserId: changedByUser.id,
  });

  return {
    tableStateChange,
    tableState,
    table,
    changedByUser,
  };
};

export const createTableStateChange = async object => TableStateChange.spawn(object || (await createTableStateChangeInfo()).tableStateChange);

export const expectTableStateChange = (object, expectedObject, { tableStateChangeId, expectedTable, expectedTableState } = {}) => {
  expect(object.get('tableStateId')).toBe(expectedObject.get('tableStateId'));
  expect(object.get('tableId')).toBe(expectedObject.get('tableId'));
  expect(object.get('changedByUserId')).toBe(expectedObject.get('changedByUserId'));

  if (tableStateChangeId) {
    expect(object.get('id')).toBe(tableStateChangeId);
  }

  if (expectedTable) {
    expect(object.get('tableId')).toEqual(expectedTable.get('id'));
  }

  if (expectedTableState) {
    expect(object.get('tableStateId')).toEqual(expectedTableState.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createTableStateChange()).className).toBe('TableStateChange');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { tableStateChange } = await createTableStateChangeInfo();
    const object = await createTableStateChange(tableStateChange);
    const info = object.getInfo();

    expectTableStateChange(info, tableStateChange);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createTableStateChange();

    expect(new TableStateChange(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createTableStateChange();

    expect(new TableStateChange(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createTableStateChange();
    const { tableStateChange: updatedTableStateChange } = await createTableStateChangeInfo();

    object.updateInfo(updatedTableStateChange);

    const info = object.getInfo();

    expectTableStateChange(info, updatedTableStateChange);
  });

  test('getInfo should return provided info', async () => {
    const { tableStateChange } = await createTableStateChangeInfo();
    const object = await createTableStateChange(tableStateChange);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectTableStateChange(info, tableStateChange);
  });
});
