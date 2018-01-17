// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { TableState } from '../';
import createTables from '../../services/__tests__/TableService.test';

const chance = new Chance();

export const createTableStateInfo = async () => {
  const table = (await createTables(1)).first();
  const user = await TestHelper.createUser();
  const tableState = Map({
    status: chance.string(),
    tableId: table.get('id'),
    userId: user.id,
  });

  return {
    tableState,
    table,
    user,
  };
};

export const createTableState = async object => TableState.spawn(object || (await createTableStateInfo()).tableState);

export const expectTableState = (object, expectedObject, { tableStateId, expectedTable } = {}) => {
  expect(object.get('status')).toBe(expectedObject.get('status'));
  expect(object.get('tableId')).toBe(expectedObject.get('tableId'));
  expect(object.get('userId')).toBe(expectedObject.get('userId'));

  if (tableStateId) {
    expect(object.get('id')).toBe(tableStateId);
  }

  if (expectedTable) {
    expect(object.get('tableId')).toEqual(expectedTable.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createTableState()).className).toBe('TableState');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { tableState } = await createTableStateInfo();
    const object = await createTableState(tableState);
    const info = object.getInfo();

    expectTableState(info, tableState);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createTableState();

    expect(new TableState(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createTableState();

    expect(new TableState(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createTableState();
    const { tableState: updatedTableState } = await createTableStateInfo();

    object.updateInfo(updatedTableState);

    const info = object.getInfo();

    expectTableState(info, updatedTableState);
  });

  test('getInfo should return provided info', async () => {
    const { tableState } = await createTableStateInfo();
    const object = await createTableState(tableState);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectTableState(info, tableState);
  });
});
