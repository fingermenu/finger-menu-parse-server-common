// @flow

import Immutable, { List, Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';
import Menu from './Menu';

export default class Restaurant extends BaseObject {
  static spawn = (info) => {
    const object = new Restaurant();

    Restaurant.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
    object.set('websiteUrl', info.get('websiteUrl'));
    object.set('imageUrl', info.get('imageUrl'));
    object.set('address', info.get('address'));

    if (info.has('phones')) {
      const phones = info.get('phones');

      if (phones) {
        object.set('phones', phones.toJS());
      }
    }

    object.set('geoLocation', info.get('geoLocation'));
    BaseObject.createPointer(object, info, 'parentRestaurant', Restaurant);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
    object.set('status', info.get('status'));
    object.set('googleMapUrl', info.get('googleMapUrl'));
    BaseObject.createArrayPointer(object, info, 'menu', Menu);
    object.set('inheritParentRestaurantMenus', info.get('inheritParentRestaurantMenus'));
    object.set('pin', info.get('pin'));
  };

  constructor(object) {
    super(object, 'Restaurant');
  }

  updateInfo = (info) => {
    Restaurant.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const parentRestaurantObject = object.get('parentRestaurant');
    const parentRestaurant = parentRestaurantObject ? new Restaurant(parentRestaurantObject) : undefined;
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));
    const menuObjects = object.get('menus');
    const menus = menuObjects ? Immutable.fromJS(menuObjects).map(menu => new Menu(menu).getInfo()) : undefined;

    return Map({
      id: this.getId(),
      name: this.getMultiLanguagesString('name'),
      websiteUrl: object.get('websiteUrl'),
      imageUrl: object.get('imageUrl'),
      address: object.get('address'),
      phones: Immutable.fromJS(object.get('phones')),
      geoLocation: object.get('geoLocation'),
      parentRestaurant: parentRestaurant ? parentRestaurant.getInfo() : undefined,
      parentRestaurantId: parentRestaurant ? parentRestaurant.getId() : undefined,
      ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
      status: object.get('status'),
      googleMapUrl: object.get('googleMapUrl'),
      menus,
      menuIds: menus ? menus.map(menu => menu.get('id')) : List(),
      inheritParentRestaurantMenus: object.get('inheritParentRestaurantMenus'),
      pin: object.get('pin'),
    });
  };
}
