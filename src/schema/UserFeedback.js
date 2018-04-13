// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import Immutable, { Map } from 'immutable';

export default class UserFeedback extends BaseObject {
  static spawn = info => {
    const object = new UserFeedback();

    UserFeedback.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    const feedback = info.get('feedback');

    object.set('feedback', feedback ? feedback.toJS() : []);
    BaseObject.createUserPointer(object, info, 'addedByUser');
  };

  constructor(object) {
    super(object, 'UserFeedback');
  }

  updateInfo = info => {
    UserFeedback.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const addedByUser = object.get('addedByUser');

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        feedback: Immutable.fromJS(object.get('feedback')),
        addedByUser,
        addedByUserId: addedByUser ? addedByUser.id : undefined,
      }),
    );
  };
}
