// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Table, TableStateChange } from '../schema';

export default class TableStateChangeService extends ServiceBase {
  static fields = List.of('state', 'table', 'user');

  constructor() {
    super(TableStateChange, TableStateChangeService.buildSearchQuery, TableStateChangeService.buildIncludeQuery, 'tableStateChange');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'table');
    ServiceBase.addIncludeQuery(criteria, query, 'user');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(TableStateChange, criteria);
    const query = TableStateChangeService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    TableStateChangeService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addEqualityQuery(conditions, query, 'state', 'state');
    ServiceBase.addLinkQuery(conditions, query, 'table', 'table', Table);
    ServiceBase.addUserLinkQuery(conditions, query, 'user', 'user');

    return query;
  };
}
