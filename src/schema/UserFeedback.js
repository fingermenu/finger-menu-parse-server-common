// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import Immutable, { Map } from 'immutable';
import Restaurant from './Restaurant';

export default class UserFeedback extends BaseObject {
  static spawn = info => {
    const object = new UserFeedback();

    UserFeedback.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    const questionAndAnswers = info.get('questionAndAnswers');

    object.set('questionAndAnswers', questionAndAnswers ? questionAndAnswers.toJS() : []);
    BaseObject.createStringColumn(object, info, 'others');
    object.set('submittedAt', info.get('submittedAt'));
    BaseObject.createPointer(object, info, 'restaurant', Restaurant);
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
    const restaurant = object.get('restaurant');
    const addedByUser = object.get('addedByUser');

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        questionAndAnswers: Immutable.fromJS(object.get('questionAndAnswers')),
        others: object.get('others'),
        submittedAt: object.get('submittedAt'),
        restaurant,
        restaurantId: restaurant ? restaurant.id : undefined,
        addedByUser,
        addedByUserId: addedByUser ? addedByUser.id : undefined,
      }),
    );
  };
}
