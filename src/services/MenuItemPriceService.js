// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from 'micro-business-parse-server-common';
import { MenuItemPrice, MenuItem } from '../schema';

export default class MenuItemPriceService extends ServiceBase {
  static fields = List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'menuItem', 'addedByUser', 'removedByUser');

  constructor() {
    super(MenuItemPrice, MenuItemPriceService.buildSearchQuery, MenuItemPriceService.buildIncludeQuery, 'menu item price');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'menuItem');
    ServiceBase.addIncludeQuery(criteria, query, 'addedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'removedByUser');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(MenuItemPrice, criteria);
    const query = MenuItemPriceService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    MenuItemPriceService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addNumberQuery(conditions, query, 'currentPrice', 'currentPrice');
    ServiceBase.addNumberQuery(conditions, query, 'wasPrice', 'wasPrice');
    ServiceBase.addDateTimeQuery(conditions, query, 'validFrom', 'validFrom');
    ServiceBase.addDateTimeQuery(conditions, query, 'validUntil', 'validUntil');
    ServiceBase.addLinkQuery(conditions, query, 'menuItem', 'menuItem', MenuItem);
    ServiceBase.addUserLinkQuery(conditions, query, 'addedByUser', 'addedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'removedByUser', 'removedByUser');

    return query;
  };
}
