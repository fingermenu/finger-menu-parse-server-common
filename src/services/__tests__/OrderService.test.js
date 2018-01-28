// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import TestHelper from '../../../TestHelper';
import { OrderService } from '../';
import { createOrderInfo, expectOrder } from '../../schema/__tests__/Order.test';

const chance = new Chance();
const orderService = new OrderService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('details', 'table', 'orderState', 'customerName', 'notes', 'totalPrice', 'placedAt'),
    include_table: true,
    include_orderState: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      details: object ? object.get('details') : TestHelper.createRandomList(),
      tableId: object ? object.get('tableId') : chance.string(),
      orderStateId: object ? object.get('orderStateId') : chance.string(),
      customerName: object ? object.get('customerName') : chance.string(),
      notes: object ? object.get('notes') : chance.string(),
      totalPrice: object ? object.get('totalPrice') : chance.floating({ min: 0, max: 1000 }),
      placedAt: object ? object.get('placedAt') : new Date(),
    }),
  });

const createOrders = async (count, useSameInfo = false) => {
  let order;

  if (useSameInfo) {
    const { order: tempOrder } = await createOrderInfo();

    order = tempOrder;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalOrder;

      if (useSameInfo) {
        finalOrder = order;
      } else {
        const { order: tempOrder } = await createOrderInfo();

        finalOrder = tempOrder;
      }

      return orderService.read(await orderService.create(finalOrder), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createOrders;

describe('create', () => {
  test('should return the created order Id', async () => {
    const orderId = await orderService.create((await createOrderInfo()).order);

    expect(orderId).toBeDefined();
  });

  test('should create the order', async () => {
    const { order } = await createOrderInfo();
    const orderId = await orderService.create(order);
    const fetchedOrder = await orderService.read(orderId, createCriteriaWthoutConditions());

    expect(fetchedOrder).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided order Id does not exist', async () => {
    const orderId = chance.string();

    try {
      await orderService.read(orderId);
    } catch (ex) {
      expect(ex.message).toBe(`No order found with Id: ${orderId}`);
    }
  });

  test('should read the existing order', async () => {
    const { order: expectedOrder, table: expectedTable, orderState: expectedOrderState } = await createOrderInfo();
    const orderId = await orderService.create(expectedOrder);
    const order = await orderService.read(orderId, createCriteriaWthoutConditions());

    expectOrder(order, expectedOrder, {
      orderId,
      expectedTable,
      expectedOrderState,
    });
  });
});

describe('update', () => {
  test('should reject if the provided order Id does not exist', async () => {
    const orderId = chance.string();

    try {
      const order = await orderService.read(await orderService.create((await createOrderInfo()).order), createCriteriaWthoutConditions());

      await orderService.update(order.set('id', orderId));
    } catch (ex) {
      expect(ex.message).toBe(`No order found with Id: ${orderId}`);
    }
  });

  test('should return the Id of the updated order', async () => {
    const { order: expectedOrder } = await createOrderInfo();
    const orderId = await orderService.create((await createOrderInfo()).order);
    const id = await orderService.update(expectedOrder.set('id', orderId));

    expect(id).toBe(orderId);
  });

  test('should update the existing order', async () => {
    const { order: expectedOrder, table: expectedTable, orderState: expectedOrderState } = await createOrderInfo();
    const orderId = await orderService.create((await createOrderInfo()).order);

    await orderService.update(expectedOrder.set('id', orderId));

    const order = await orderService.read(orderId, createCriteriaWthoutConditions());

    expectOrder(order, expectedOrder, {
      orderId,
      expectedTable,
      expectedOrderState,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided order Id does not exist', async () => {
    const orderId = chance.string();

    try {
      await orderService.delete(orderId);
    } catch (ex) {
      expect(ex.message).toBe(`No order found with Id: ${orderId}`);
    }
  });

  test('should delete the existing order', async () => {
    const orderId = await orderService.create((await createOrderInfo()).order);
    await orderService.delete(orderId);

    try {
      await orderService.delete(orderId);
    } catch (ex) {
      expect(ex.message).toBe(`No order found with Id: ${orderId}`);
    }
  });
});

describe('search', () => {
  test('should return no order if provided criteria matches no order', async () => {
    const orders = await orderService.search(createCriteria());

    expect(orders.count()).toBe(0);
  });

  test('should return the order matches the criteria', async () => {
    const { order: expectedOrder, table: expectedTable, orderState: expectedOrderState } = await createOrderInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => orderService.create(expectedOrder))
      .toArray()));
    const orders = await orderService.search(createCriteria(expectedOrder));

    expect(orders.count).toBe(results.count);
    orders.forEach((order) => {
      expect(results.find(_ => _.localeCompare(order.get('id')) === 0)).toBeDefined();
      expectOrder(order, expectedOrder, {
        orderId: order.get('id'),
        expectedTable,
        expectedOrderState,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no order if provided criteria matches no order', async () => {
    let orders = List();
    const result = orderService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        orders = orders.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(orders.count()).toBe(0);
  });

  test('should return the order matches the criteria', async () => {
    const { order: expectedOrder, table: expectedTable, orderState: expectedOrderState } = await createOrderInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => orderService.create(expectedOrder))
      .toArray()));

    let orders = List();
    const result = orderService.searchAll(createCriteria(expectedOrder));

    try {
      result.event.subscribe((info) => {
        orders = orders.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(orders.count).toBe(results.count);
    orders.forEach((order) => {
      expect(results.find(_ => _.localeCompare(order.get('id')) === 0)).toBeDefined();
      expectOrder(order, expectedOrder, {
        orderId: order.get('id'),
        expectedTable,
        expectedOrderState,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no order match provided criteria', async () => {
    expect(await orderService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any order match provided criteria', async () => {
    const orders = await createOrders(chance.integer({ min: 1, max: 10 }), true);

    expect(await orderService.exists(createCriteria(orders.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no order match provided criteria', async () => {
    expect(await orderService.count(createCriteria())).toBe(0);
  });

  test('should return the count of order match provided criteria', async () => {
    const orders = await createOrders(chance.integer({ min: 1, max: 10 }), true);

    expect(await orderService.count(createCriteria(orders.first()))).toBe(orders.count());
  });
});
