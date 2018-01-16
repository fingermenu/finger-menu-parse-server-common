// @flow

import { Map } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { TableStatus } from '../';
import createTables from '../../services/__tests__/TableService.test';

export const createTableStatusInfo = async () => {
  const table = (await createTables(1)).first();
  const user = await TestHelper.createUser();
  const tableStatus = Map({
    tableId: table.get('id'),
    userId: user.id,
  });

  return {
    tableStatus,
    table,
    user,
  };
};

export const createTableStatus = async object => TableStatus.spawn(object || (await createTableStatusInfo()).tableStatus);

export const expectTableStatus = (object, expectedObject, { tableStatusId, expectedTable } = {}) => {
  expect(object.get('tableId')).toBe(expectedObject.get('tableId'));
  expect(object.get('userId')).toBe(expectedObject.get('userId'));

  if (tableStatusId) {
    expect(object.get('id')).toBe(tableStatusId);
  }

  if (expectedTable) {
    expect(object.get('tableId')).toEqual(expectedTable.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createTableStatus()).className).toBe('TableStatus');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { tableStatus } = await createTableStatusInfo();
    const object = await createTableStatus(tableStatus);
    const info = object.getInfo();

    expectTableStatus(info, tableStatus);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createTableStatus();

    expect(new TableStatus(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createTableStatus();

    expect(new TableStatus(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createTableStatus();
    const { tableStatus: updatedTableStatus } = await createTableStatusInfo();

    object.updateInfo(updatedTableStatus);

    const info = object.getInfo();

    expectTableStatus(info, updatedTableStatus);
  });

  test('getInfo should return provided info', async () => {
    const { tableStatus } = await createTableStatusInfo();
    const object = await createTableStatus(tableStatus);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectTableStatus(info, tableStatus);
  });
});
