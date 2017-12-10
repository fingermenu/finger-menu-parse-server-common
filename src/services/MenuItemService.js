// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from 'micro-business-parse-server-common';
import { MenuItem, Tag } from '../schema';

export default class MenuItemService extends ServiceBase {
  static fields = List.of('name', 'description', 'menuItemPageUrl', 'imageUrl', 'tags', 'ownedByUser', 'maintainedByUsers');

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
    ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'description', 'descriptionLowerCase');
    ServiceBase.addEqualityQuery(conditions, query, 'mealPageUrl', 'mealPageUrl');
    ServiceBase.addStringQuery(conditions, query, 'mealPageUrl', 'mealPageUrl');
    ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');
    ServiceBase.addLinkQuery(conditions, query, 'tag', 'tags', Tag);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

    return query;
  };
}
