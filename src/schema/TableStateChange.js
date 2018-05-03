// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import { Map } from 'immutable';
import Table from './Table';
import TableState from './TableState';

export default class TableStateChange extends BaseObject {
  static spawn = info => {
    const object = new TableStateChange();

    TableStateChange.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createPointer(object, info, 'tableState', TableState);
    BaseObject.createPointer(object, info, 'table', Table);
    BaseObject.createUserPointer(object, info, 'changedByUser');
    object.set('numberOfAdults', info.get('numberOfAdults'));
    object.set('numberOfChildren', info.get('numberOfChildren'));
    BaseObject.createStringColumn(object, info, 'customerName');
    BaseObject.createStringColumn(object, info, 'notes');
  };

  constructor(object) {
    super(object, 'TableStateChange');
  }

  updateInfo = info => {
    TableStateChange.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const tableState = object.get('tableState');
    const table = object.get('table');
    const changedByUser = object.get('changedByUser');

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        createdAt: object.get('createdAt'),
        updatedAt: object.get('updatedAt'),
        tableState,
        tableStateId: tableState ? tableState.id : undefined,
        table,
        tableId: table ? table.id : undefined,
        changedByUser,
        changedByUserId: changedByUser ? changedByUser.id : undefined,
        numberOfAdults: object.get('numberOfAdults'),
        numberOfChildren: object.get('numberOfChildren'),
        customerName: object.get('customerName'),
        notes: object.get('notes'),
      }),
    );
  };
}
