// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import { Map } from 'immutable';
import Restaurant from './Restaurant';

export default class PackageBundle extends BaseObject {
  static spawn = info => {
    const object = new PackageBundle();

    PackageBundle.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('url', info.get('url'));
    object.set('checksum', info.get('checksum'));
    BaseObject.createPointer(object, info, 'restaurant', Restaurant);
  };

  constructor(object) {
    super(object, 'PackageBundle');
  }

  updateInfo = info => {
    PackageBundle.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const restaurant = object.get('restaurant');

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        createdAt: object.get('createdAt'),
        updatedAt: object.get('updatedAt'),
        url: object.get('url'),
        checksum: object.get('checksum'),
        restaurant,
        restaurantId: restaurant ? restaurant.id : undefined,
      }),
    );
  };
}
