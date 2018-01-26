// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';

export default class TableState extends BaseObject {
  static spawn = (info) => {
    const object = new TableState();

    TableState.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    object.set('key', info.get('key'));
    BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
    object.set('imageUrl', info.get('imageUrl'));
  };

  constructor(object) {
    super(object, 'TableState');
  }

  updateInfo = (info) => {
    TableState.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();

    return ImmutableEx.removeUndefinedProps(Map({
      id: this.getId(),
      key: object.get('key'),
      name: this.getMultiLanguagesString('name'),
      imageUrl: object.get('imageUrl'),
    }));
  };
}
