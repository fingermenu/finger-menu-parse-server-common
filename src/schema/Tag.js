// @flow

import { Map } from 'immutable';
import { BaseObject } from 'micro-business-parse-server-common';

export default class Tag extends BaseObject {
  static spawn = (info) => {
    const object = new Tag();

    Tag.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createStringColumn(object, info, 'name');
    BaseObject.createStringColumn(object, info, 'description');
    object.set('level', info.get('level'));
    object.set('forDisplay', info.get('forDisplay'));
    BaseObject.createPointer(object, info, 'parentTag', Tag);
  };

  constructor(object) {
    super(object, 'Tag');
  }

  updateInfo = (info) => {
    Tag.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const parentTagObject = object.get('parentTag');
    const parentTag = parentTagObject ? new Tag(parentTagObject) : undefined;

    return Map({
      id: this.getId(),
      name: object.get('name'),
      description: object.get('description'),
      level: object.get('level'),
      forDisplay: object.get('forDisplay'),
      parentTag: parentTag ? parentTag.getInfo() : undefined,
      parentTagId: parentTag ? parentTag.getId() : undefined,
    });
  };
}
