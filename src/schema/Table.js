// @flow

import { Common, ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import Immutable, { List, Map } from 'immutable';
import Restaurant from './Restaurant';
import TableState from './TableState';

export default class Table extends BaseObject {
  static spawn = info => {
    const object = new Table();

    Table.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    const customers = info.get('customers');

    if (Common.isNull(customers)) {
      object.set('customers', []);
    } else if (customers) {
      object.set('customers', customers.toJS());
    }

    BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
    object.set('status', info.get('status'));
    BaseObject.createPointer(object, info, 'restaurant', Restaurant);
    BaseObject.createPointer(object, info, 'tableState', TableState);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
    BaseObject.createStringColumn(object, info, 'notes');
    object.set('sortOrderIndex', info.get('sortOrderIndex'));
    object.set('lastOrderCorrelationId', info.get('lastOrderCorrelationId'));
  };

  constructor(object) {
    super(object, 'Table');
  }

  updateInfo = info => {
    Table.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const restaurant = object.get('restaurant');
    const tableState = object.get('tableState');
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        createdAt: object.get('createdAt'),
        updatedAt: object.get('updatedAt'),
        customers: object.get('customers') ? Immutable.fromJS(object.get('customers')) : List(),
        name: this.getMultiLanguagesString('name'),
        status: object.get('status'),
        restaurant,
        restaurantId: restaurant ? restaurant.id : undefined,
        tableState,
        tableStateId: tableState ? tableState.id : undefined,
        ownedByUser,
        ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
        maintainedByUsers,
        maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
        notes: object.get('notes'),
        sortOrderIndex: object.get('sortOrderIndex'),
        lastOrderCorrelationId: object.get('lastOrderCorrelationId'),
      }),
    );
  };
}
