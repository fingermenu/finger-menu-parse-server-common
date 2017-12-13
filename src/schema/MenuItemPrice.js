// @flow

import { Map } from 'immutable';
import { BaseObject } from 'micro-business-parse-server-common';
import MenuItem from './MenuItem';

export default class MenuItemPrice extends BaseObject {
  static spawn = (info) => {
    const object = new MenuItemPrice();

    MenuItemPrice.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('currentPrice', info.get('currentPrice'));
    object.set('wasPrice', info.get('wasPrice'));
    object.set('validFrom', info.get('validFrom'));
    object.set('validUntil', info.get('validUntil'));
    BaseObject.createPointer(object, info, 'menuItem', MenuItem);
    BaseObject.createUserPointer(object, info, 'addedByUser');
    BaseObject.createUserPointer(object, info, 'removedByUser');
  };

  constructor(object) {
    super(object, 'MenuItemPrice');
  }

  updateInfo = (info) => {
    MenuItemPrice.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const menuItem = object.get('menuItem');
    const addedByUser = object.get('addedByUser');
    const removedByUser = object.get('removedByUser');

    return Map({
      id: this.getId(),
      currentPrice: object.get('currentPrice'),
      wasPrice: object.get('wasPrice'),
      validFrom: object.get('validFrom'),
      validUntil: object.get('validUntil'),
      menuItem,
      menuItemId: menuItem ? menuItem.id : undefined,
      addedByUser,
      addedByUserId: addedByUser ? addedByUser.id : undefined,
      removedByUser,
      removedByUserId: removedByUser ? removedByUser.id : undefined,
    });
  };
}
