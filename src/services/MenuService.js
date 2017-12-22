// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Menu, MenuItemPrice, Tag } from '../schema';

export default class MenuService extends ServiceBase {
  static fields = List.of('name', 'description', 'menuPageUrl', 'imageUrl', 'menuItemPrices', 'tags', 'ownedByUser', 'maintainedByUsers');

  constructor() {
    super(Menu, MenuService.buildSearchQuery, MenuService.buildIncludeQuery, 'menu');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'menuItemPrices');
    ServiceBase.addIncludeQuery(criteria, query, 'tags');
    ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Menu, criteria);
    const query = MenuService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    MenuService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'description', 'descriptionLowerCase');
    ServiceBase.addEqualityQuery(conditions, query, 'menuPageUrl', 'menuPageUrl');
    ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');
    ServiceBase.addLinkQuery(conditions, query, 'menuItemPrice', 'menuItemPrices', MenuItemPrice);
    ServiceBase.addLinkQuery(conditions, query, 'tag', 'tags', Tag);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

    return query;
  };
}
