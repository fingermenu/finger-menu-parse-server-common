// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Table, TableState } from '../schema';

export default class TableStateService extends ServiceBase {
  static fields = List.of('status', 'table', 'user');

  constructor() {
    super(TableState, TableStateService.buildSearchQuery, TableStateService.buildIncludeQuery, 'tableState');
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
    const queryWithoutIncludes = ParseWrapperService.createQuery(TableState, criteria);
    const query = TableStateService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    TableStateService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addEqualityQuery(conditions, query, 'status', 'status');
    ServiceBase.addLinkQuery(conditions, query, 'table', 'table', Table);
    ServiceBase.addUserLinkQuery(conditions, query, 'user', 'user');

    return query;
  };
}
