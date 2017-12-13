// @flow

import Immutable, { List, Map } from 'immutable';
import { BaseObject } from 'micro-business-parse-server-common';
import MenuItemPrice from './MenuItemPrice';
import Tag from './Tag';

export default class Menu extends BaseObject {
  static spawn = (info) => {
    const object = new Menu();

    Menu.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createStringColumn(object, info, 'name');
    BaseObject.createStringColumn(object, info, 'description');
    object.set('menuPageUrl', info.get('menuPageUrl'));
    object.set('imageUrl', info.get('imageUrl'));
    BaseObject.createArrayPointer(object, info, 'menuItemPrice', MenuItemPrice);
    BaseObject.createArrayPointer(object, info, 'tag', Tag);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
  };

  constructor(object) {
    super(object, 'Menu');
  }

  updateInfo = (info) => {
    Menu.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const menuItemPriceObjects = object.get('menuItemPrices');
    const menuItemPrices = menuItemPriceObjects
      ? Immutable.fromJS(menuItemPriceObjects).map(menuItemPrice => new MenuItemPrice(menuItemPrice).getInfo())
      : undefined;
    const tagObjects = object.get('tags');
    const tags = tagObjects ? Immutable.fromJS(tagObjects).map(tag => new Tag(tag).getInfo()) : undefined;
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));

    return Map({
      id: this.getId(),
      name: object.get('name'),
      description: object.get('description'),
      menuPageUrl: object.get('menuPageUrl'),
      imageUrl: object.get('imageUrl'),
      menuItemPrices,
      menuItemPriceIds: menuItemPrices ? menuItemPrices.map(menuItemPrice => menuItemPrice.get('id')) : List(),
      tags,
      tagIds: tags ? tags.map(tag => tag.get('id')) : List(),
      ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
    });
  };
}
