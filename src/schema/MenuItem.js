// @flow

import { Common, ImmutableEx } from '@microbusiness/common-javascript';
import { BaseObject } from '@microbusiness/parse-server-common';
import Immutable, { List, Map } from 'immutable';
import Tag from './Tag';

export default class MenuItem extends BaseObject {
  static spawn = info => {
    const object = new MenuItem();

    MenuItem.updateInfoInternal(object, info);

    return object;
  };

  static updateInfoInternal = (object, info) => {
    BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
    BaseObject.createMultiLanguagesStringColumn(object, info, 'description');
    object.set('menuItemPageUrl', info.get('menuItemPageUrl'));
    object.set('imageUrl', info.get('imageUrl'));
    BaseObject.createArrayPointer(object, info, 'tag', Tag);
    BaseObject.createUserPointer(object, info, 'ownedByUser');
    BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');

    const linkedPrinters = info.get('linkedPrinters');

    if (Common.isNull(linkedPrinters)) {
      object.set('linkedPrinters', []);
    } else if (linkedPrinters) {
      object.set('linkedPrinters', linkedPrinters.toJS());
    }
  };

  constructor(object) {
    super(object, 'MenuItem');
  }

  updateInfo = info => {
    MenuItem.updateInfoInternal(this.getObject(), info);

    return this;
  };

  getInfo = () => {
    const object = this.getObject();
    const tagObjects = object.get('tags');
    const tags = tagObjects ? Immutable.fromJS(tagObjects).map(tag => new Tag(tag).getInfo()) : undefined;
    const ownedByUser = object.get('ownedByUser');
    const maintainedByUsers = Immutable.fromJS(object.get('maintainedByUsers'));

    return ImmutableEx.removeUndefinedProps(
      Map({
        id: this.getId(),
        createdAt: object.get('createdAt'),
        updatedAt: object.get('updatedAt'),
        name: this.getMultiLanguagesString('name'),
        description: this.getMultiLanguagesString('description'),
        menuItemPageUrl: object.get('menuItemPageUrl'),
        imageUrl: object.get('imageUrl'),
        tags,
        tagIds: tags ? tags.map(tag => tag.get('id')) : List(),
        ownedByUser,
        ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
        maintainedByUsers,
        maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(maintainedByUser => maintainedByUser.id) : List(),
        linkedPrinters: Immutable.fromJS(object.get('linkedPrinters')),
      }),
    );
  };
}
