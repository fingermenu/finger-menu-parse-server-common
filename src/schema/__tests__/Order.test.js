// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { Order } from '../';
import createRestaurants from '../../services/__tests__/RestaurantService.test';
import createTables from '../../services/__tests__/TableService.test';

const chance = new Chance();

export const createOrderInfo = async () => {
  const restaurant = (await createRestaurants(1)).first();
  const table = (await createTables(1)).first();
  const order = Map({
    details: TestHelper.createRandomList(),
    restaurantId: restaurant.get('id'),
    tableId: table.get('id'),
    numberOfAdults: chance.integer(),
    numberOfChildren: chance.integer(),
    customerName: chance.string(),
    notes: chance.string(),
    totalPrice: chance.floating({ min: 0, max: 1000 }),
    placedAt: new Date(),
    cancelledAt: new Date(),
    correlationId: chance.string(),
  });

  return {
    order,
    restaurant,
    table,
  };
};

export const createOrder = async object => Order.spawn(object || (await createOrderInfo()).order);

export const expectOrder = (object, expectedObject, { orderId, expectedTable, expectedRestaurant } = {}) => {
  expect(object.get('details')).toEqual(expectedObject.get('details'));
  expect(object.get('restaurantId')).toBe(expectedObject.get('restaurantId'));
  expect(object.get('tableId')).toBe(expectedObject.get('tableId'));
  expect(object.get('numberOfAdults')).toBe(expectedObject.get('numberOfAdults'));
  expect(object.get('numberOfChildren')).toBe(expectedObject.get('numberOfChildren'));
  expect(object.get('customerName')).toBe(expectedObject.get('customerName'));
  expect(object.get('notes')).toBe(expectedObject.get('notes'));
  expect(object.get('totalPrice')).toBe(expectedObject.get('totalPrice'));
  expect(object.get('placedAt')).toBe(expectedObject.get('placedAt'));
  expect(object.get('cancelledAt')).toBe(expectedObject.get('cancelledAt'));
  expect(object.get('correlationId')).toBe(expectedObject.get('correlationId'));

  if (orderId) {
    expect(object.get('id')).toBe(orderId);
  }

  if (expectedRestaurant) {
    expect(object.get('restaurantId')).toEqual(expectedRestaurant.get('id'));
  }

  if (expectedTable) {
    expect(object.get('tableId')).toEqual(expectedTable.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createOrder()).className).toBe('Order');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { order } = await createOrderInfo();
    const object = await createOrder(order);
    const info = object.getInfo();

    expectOrder(info, order);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createOrder();

    expect(new Order(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createOrder();

    expect(new Order(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createOrder();
    const { order: updatedOrder } = await createOrderInfo();

    object.updateInfo(updatedOrder);

    const info = object.getInfo();

    expectOrder(info, updatedOrder);
  });

  test('getInfo should return provided info', async () => {
    const { order } = await createOrderInfo();
    const object = await createOrder(order);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectOrder(info, order);
  });
});
