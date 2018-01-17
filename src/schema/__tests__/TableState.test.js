// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { TableState } from '../';

const chance = new Chance();

export const createTableStateInfo = async () => {
  const tableState = Map({
    key: chance.string(),
    name: TestHelper.createRandomMultiLanguagesString(),
    imageUrl: chance.string(),
  });

  return {
    tableState,
  };
};

export const createTableState = async object => TableState.spawn(object || (await createTableStateInfo()).tableState);

export const expectTableState = (object, expectedObject, { tableStateId } = {}) => {
  expect(object.get('key')).toBe(expectedObject.get('key'));
  expect(object.get('name')).toEqual(expectedObject.get('name'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));

  if (tableStateId) {
    expect(object.get('id')).toBe(tableStateId);
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
