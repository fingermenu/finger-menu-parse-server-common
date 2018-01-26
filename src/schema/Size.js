// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import Immutable, { List, Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';

export default class Size extends BaseObject {
  static spawn = (info) => {
    const object = new Size();

    Size.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
  };

  constructor(object) {
    super(object, 'Size');
  }

  updateInfo = (info) => {
    Size.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));

    return ImmutableEx.removeUndefinedProps(Map({
      id: this.getId(),
      name: this.getMultiLanguagesString('name'),
      ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
    }));
  };
}
