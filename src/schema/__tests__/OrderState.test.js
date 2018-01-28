// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { OrderState } from '../';

const chance = new Chance();

export const createOrderStateInfo = async () => {
  const orderState = Map({
    key: chance.string(),
    name: TestHelper.createRandomMultiLanguagesString(),
    imageUrl: chance.string(),
  });

  return {
    orderState,
  };
};

export const createOrderState = async object => OrderState.spawn(object || (await createOrderStateInfo()).orderState);

export const expectOrderState = (object, expectedObject, { orderStateId } = {}) => {
  expect(object.get('key')).toBe(expectedObject.get('key'));
  expect(object.get('name')).toEqual(expectedObject.get('name'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));

  if (orderStateId) {
    expect(object.get('id')).toBe(orderStateId);
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createOrderState()).className).toBe('OrderState');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { orderState } = await createOrderStateInfo();
    const object = await createOrderState(orderState);
    const info = object.getInfo();

    expectOrderState(info, orderState);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createOrderState();

    expect(new OrderState(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createOrderState();

    expect(new OrderState(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createOrderState();
    const { orderState: updatedOrderState } = await createOrderStateInfo();

    object.updateInfo(updatedOrderState);

    const info = object.getInfo();

    expectOrderState(info, updatedOrderState);
  });

  test('getInfo should return provided info', async () => {
    const { orderState } = await createOrderStateInfo();
    const object = await createOrderState(orderState);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectOrderState(info, orderState);
  });
});
