// @flow

import { Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';
import Table from './Table';

export default class TableStateChange extends BaseObject {
  static spawn = (info) => {
    const object = new TableStateChange();

    TableStateChange.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('state', info.get('state'));
    BaseObject.createPointer(object, info, 'table', Table);
    BaseObject.createUserPointer(object, info, 'changedByUser');
  };

  constructor(object) {
    super(object, 'TableStateChange');
  }

  updateInfo = (info) => {
    TableStateChange.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const table = object.get('table');
    const changedByUser = object.get('changedByUser');

    return Map({
      id: this.getId(),
      state: object.get('state'),
      table,
      tableId: table ? table.id : undefined,
      changedByUser,
      changedByUserId: changedByUser ? changedByUser.id : undefined,
    });
  };
}
