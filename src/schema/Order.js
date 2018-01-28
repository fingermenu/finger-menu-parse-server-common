// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import Immutable, { Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';
import OrderState from './OrderState';
import Table from './Table';

export default class Order extends BaseObject {
  static spawn = (info) => {
    const object = new Order();

    Order.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('details', info.get('details').toJS());
    BaseObject.createPointer(object, info, 'table', Table);
    BaseObject.createPointer(object, info, 'orderState', OrderState);
    BaseObject.createStringColumn(object, info, 'customerName');
    object.set('notes', info.get('notes'));
    object.set('totalPrice', info.get('totalPrice'));
    object.set('placedAt', info.get('placedAt'));
  };

  constructor(object) {
    super(object, 'Order');
  }

  updateInfo = (info) => {
    Order.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const table = object.get('table');
    const orderState = object.get('orderState');

    return ImmutableEx.removeUndefinedProps(Map({
      id: this.getId(),
      details: Immutable.fromJS(object.get('details')),
      table,
      tableId: table ? table.id : undefined,
      orderState,
      orderStateId: orderState ? orderState.id : undefined,
      customerName: object.get('customerName'),
      notes: object.get('notes'),
      totalPrice: object.get('totalPrice'),
      placedAt: object.get('placedAt'),
    }));
  };
}
