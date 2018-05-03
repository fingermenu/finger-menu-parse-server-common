// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import { Map } from 'immutable';

export default class RequestLog extends BaseObject {
  static spawn = info => {
    const object = new RequestLog();

    RequestLog.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('appVersion', info.get('appVersion'));
    BaseObject.createUserPointer(object, info, 'user');
  };

  constructor(object) {
    super(object, 'RequestLog');
  }

  updateInfo = info => {
    RequestLog.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const user = object.get('user');

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        createdAt: object.get('createdAt'),
        updatedAt: object.get('updatedAt'),
        appVersion: object.get('appVersion'),
        user,
        userId: user ? user.id : undefined,
      }),
    );
  };
}
