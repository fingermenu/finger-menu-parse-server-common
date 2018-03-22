// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Table, Order, Restaurant } from '../schema';

export default class OrderService extends ServiceBase {
  static fields = List.of(
    'details',
    'restaurant',
    'table',
    'numberOfAdults',
    'numberOfChildren',
    'customerName',
    'notes',
    'totalPrice',
    'placedAt',
    'cancelledAt',
    'correlationId',
  );

  constructor() {
    super(Order, OrderService.buildSearchQuery, OrderService.buildIncludeQuery, 'order');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'restaurant');
    ServiceBase.addIncludeQuery(criteria, query, 'table');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Order, criteria);
    const query = OrderService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    OrderService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addLinkQuery(conditions, query, 'restaurant', 'restaurant', Restaurant);
    ServiceBase.addLinkQuery(conditions, query, 'table', 'table', Table);
    ServiceBase.addEqualityQuery(conditions, query, 'numberOfAdults', 'numberOfAdults');
    ServiceBase.addEqualityQuery(conditions, query, 'numberOfChildren', 'numberOfChildren');
    ServiceBase.addStringQuery(conditions, query, 'customerName', 'customerNameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'notes', 'notesLowerCase');
    ServiceBase.addNumberQuery(conditions, query, 'totalPrice', 'totalPrice');
    ServiceBase.addDateTimeQuery(conditions, query, 'placedAt', 'placedAt');
    ServiceBase.addDateTimeQuery(conditions, query, 'cancelledAt', 'cancelledAt');
    ServiceBase.addEqualityQuery(conditions, query, 'correlationId', 'correlationId');

    return query;
  };
}
