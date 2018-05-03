// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import { Map } from 'immutable';

export default class Language extends BaseObject {
  static spawn = info => {
    const object = new Language();

    Language.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('key', info.get('key'));
    BaseObject.createStringColumn(object, info, 'name');
    object.set('imageUrl', info.get('imageUrl'));
  };

  constructor(object) {
    super(object, 'Language');
  }

  updateInfo = info => {
    Language.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        createdAt: object.get('createdAt'),
        updatedAt: object.get('updatedAt'),
        key: object.get('key'),
        name: object.get('name'),
        imageUrl: object.get('imageUrl'),
      }),
    );
  };
}
