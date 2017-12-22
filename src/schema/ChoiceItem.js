// @flow

import Immutable, { List, Map } from 'immutable';
import { BaseObject } from '@microbusiness/parse-server-common';
import Tag from './Tag';

export default class ChoiceItem extends BaseObject {
  static spawn = (info) => {
    const object = new ChoiceItem();

    ChoiceItem.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createStringColumn(object, info, 'name');
    BaseObject.createStringColumn(object, info, 'description');
    object.set('choiceItemPageUrl', info.get('choiceItemPageUrl'));
    object.set('imageUrl', info.get('imageUrl'));
    BaseObject.createArrayPointer(object, info, 'tag', Tag);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
  };

  constructor(object) {
    super(object, 'ChoiceItem');
  }

  updateInfo = (info) => {
    ChoiceItem.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const tagObjects = object.get('tags');
    const tags = tagObjects ? Immutable.fromJS(tagObjects).map(tag => new Tag(tag).getInfo()) : undefined;
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));

    return Map({
      id: this.getId(),
      name: object.get('name'),
      description: object.get('description'),
      choiceItemPageUrl: object.get('choiceItemPageUrl'),
      imageUrl: object.get('imageUrl'),
      tags,
      tagIds: tags ? tags.map(tag => tag.get('id')) : List(),
      ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
    });
  };
}
