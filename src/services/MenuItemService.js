// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { MenuItem, Tag } from '../schema';

export default class MenuItemService extends ServiceBase {
  static fields = List.of('menuItemPageUrl', 'imageUrl', 'tags', 'ownedByUser', 'maintainedByUsers');

  constructor() {
    super(MenuItem, MenuItemService.buildSearchQuery, MenuItemService.buildIncludeQuery, 'menu item');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'tags');
    ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(MenuItem, criteria);
    const query = MenuItemService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    MenuItemService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'name', 'nameLowerCase', criteria.get('language'));
    ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'description', 'descriptionLowerCase', criteria.get('language'));
    ServiceBase.addEqualityQuery(conditions, query, 'menuItemPageUrl', 'menuItemPageUrl');
    ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');
    ServiceBase.addLinkQuery(conditions, query, 'tag', 'tags', Tag);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

    return query;
  };
}
