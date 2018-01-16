// @flow

import Immutable, { List, Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';
import Restaurant from './Restaurant';

export default class Table extends BaseObject {
  static spawn = (info) => {
    const object = new Table();

    Table.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
    object.set('status', info.get('status'));
    BaseObject.createPointer(object, info, 'restaurant', Restaurant);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
  };

  constructor(object) {
    super(object, 'Table');
  }

  updateInfo = (info) => {
    Table.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const restaurant = object.get('restaurant');
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));

    return Map({
      id: this.getId(),
      name: this.getMultiLanguagesString('name'),
      status: object.get('status'),
      restaurant,
      restaurantId: restaurant ? restaurant.id : undefined,
      ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
    });
  };
}
