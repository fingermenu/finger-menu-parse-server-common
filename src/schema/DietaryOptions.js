// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import Immutable, { List, Map } from 'immutable';
import Tag from './Tag';

export default class DietaryOptions extends BaseObject {
  static spawn = info => {
    const object = new DietaryOptions();

    DietaryOptions.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createPointer(object, info, 'tag', Tag);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
  };

  constructor(object) {
    super(object, 'DietaryOptions');
  }

  updateInfo = info => {
    DietaryOptions.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const tag = object.get('tag');
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        tag,
        tagId: tag ? tag.id : undefined,
        ownedByUser,
        ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
        maintainedByUsers,
        maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
      }),
    );
  };
}
