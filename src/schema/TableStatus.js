// @flow

import { Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';
import Table from './Table';

export default class TableStatus extends BaseObject {
  static spawn = (info) => {
    const object = new TableStatus();

    TableStatus.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('status', info.get('status'));
    BaseObject.createPointer(object, info, 'table', Table);
    BaseObject.createUserPointer(object, info, 'user');
  };

  constructor(object) {
    super(object, 'TableStatus');
  }

  updateInfo = (info) => {
    TableStatus.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const table = object.get('table');
    const user = object.get('user');

    return Map({
      id: this.getId(),
      status: object.get('status'),
      table,
      tableId: table ? table.id : undefined,
      user,
      userId: user ? user.id : undefined,
    });
  };
}
