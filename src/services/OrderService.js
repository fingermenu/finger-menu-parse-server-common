// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Table, Order, OrderState } from '../schema';

export default class OrderService extends ServiceBase {
  static fields = List.of('details', 'orderState', 'table', 'customerName', 'notes', 'totalPrice', 'placedAt');

  constructor() {
    super(Order, OrderService.buildSearchQuery, OrderService.buildIncludeQuery, 'order');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'table');
    ServiceBase.addIncludeQuery(criteria, query, 'orderState');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Order, criteria);
    const query = OrderService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    OrderService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addLinkQuery(conditions, query, 'table', 'table', Table);
    ServiceBase.addLinkQuery(conditions, query, 'orderState', 'orderState', OrderState);
    ServiceBase.addStringQuery(conditions, query, 'customerName', 'customerName');
    ServiceBase.addStringQuery(conditions, query, 'notes', 'notes');
    ServiceBase.addNumberQuery(conditions, query, 'totalPrice', 'totalPrice');
    ServiceBase.addDateTimeQuery(conditions, query, 'placedAt', 'placedAt');

    return query;
  };
}
