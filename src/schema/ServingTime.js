// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import { Map } from 'immutable';
import Tag from './Tag';

export default class ServingTime extends BaseObject {
  static spawn = info => {
    const object = new ServingTime();

    ServingTime.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createPointer(object, info, 'tag', Tag);
    BaseObject.createUserPointer(object, info, 'addedByUser');
    BaseObject.createUserPointer(object, info, 'removedByUser');
  };

  constructor(object) {
    super(object, 'ServingTime');
  }

  updateInfo = info => {
    ServingTime.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const tag = object.get('tag');
    const addedByUser = object.get('addedByUser');
    const removedByUser = object.get('removedByUser');

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        tag,
        tagId: tag ? tag.id : undefined,
        addedByUser,
        addedByUserId: addedByUser ? addedByUser.id : undefined,
        removedByUser,
        removedByUserId: removedByUser ? removedByUser.id : undefined,
      }),
    );
  };
}
