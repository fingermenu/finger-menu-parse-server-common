// @flow

import Immutable, { List, Map } from 'immutable';
import { BaseObject } from 'micro-business-parse-server-common';

export default class Restaurant extends BaseObject {
  static spawn = (info) => {
    const object = new Restaurant();

    Restaurant.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('key', info.get('key'));
    BaseObject.createStringColumn(object, info, 'name');
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
    object.set('forDisplay', info.get('forDisplay'));
    BaseObject.createPointer(object, info, 'parentRestaurant', Restaurant);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
    object.set('status', info.get('status'));
    object.set('googleMapUrl', info.get('googleMapUrl'));
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

    return Map({
      id: this.getId(),
      key: object.get('key'),
      name: object.get('name'),
      websiteUrl: object.get('websiteUrl'),
      imageUrl: object.get('imageUrl'),
      address: object.get('address'),
      phones: Immutable.fromJS(object.get('phones')),
      geoLocation: object.get('geoLocation'),
      forDisplay: object.get('forDisplay'),
      parentRestaurant: parentRestaurant ? parentRestaurant.getInfo() : undefined,
      parentRestaurantId: parentRestaurant ? parentRestaurant.getId() : undefined,
      ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
      status: object.get('status'),
      googleMapUrl: object.get('googleMapUrl'),
    });
  };
}
