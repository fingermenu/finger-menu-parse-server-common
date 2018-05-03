// @flow

import { Common, ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import Immutable, { Map } from 'immutable';
import Restaurant from './Restaurant';
import Table from './Table';

export default class Order extends BaseObject {
  static spawn = info => {
    const object = new Order();

    Order.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    const details = info.get('details');

    if (Common.isNull(details)) {
      object.set('details', []);
    } else if (details) {
      object.set('details', details.toJS());
    }

    BaseObject.createPointer(object, info, 'table', Table);
    BaseObject.createPointer(object, info, 'restaurant', Restaurant);
    object.set('numberOfAdults', info.get('numberOfAdults'));
    object.set('numberOfChildren', info.get('numberOfChildren'));
    BaseObject.createStringColumn(object, info, 'customerName');
    BaseObject.createStringColumn(object, info, 'notes');
    object.set('placedAt', info.get('placedAt'));
    object.set('cancelledAt', info.get('cancelledAt'));
    object.set('correlationId', info.get('correlationId'));
  };

  constructor(object) {
    super(object, 'Order');
  }

  updateInfo = info => {
    Order.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const restaurant = object.get('restaurant');
    const table = object.get('table');

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        createdAt: object.get('createdAt'),
        updatedAt: object.get('updatedAt'),
        details: Immutable.fromJS(object.get('details')),
        restaurant,
        restaurantId: restaurant ? restaurant.id : undefined,
        table,
        tableId: table ? table.id : undefined,
        numberOfAdults: object.get('numberOfAdults'),
        numberOfChildren: object.get('numberOfChildren'),
        customerName: object.get('customerName'),
        notes: object.get('notes'),
        placedAt: object.get('placedAt'),
        cancelledAt: object.get('cancelledAt'),
        correlationId: object.get('correlationId'),
      }),
    );
  };
}
