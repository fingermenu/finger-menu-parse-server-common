// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Table, TableStatus } from '../schema';

export default class TableStatusService extends ServiceBase {
  static fields = List.of('table', 'user');

  constructor() {
    super(TableStatus, TableStatusService.buildSearchQuery, TableStatusService.buildIncludeQuery, 'tableStatus');
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
    const queryWithoutIncludes = ParseWrapperService.createQuery(TableStatus, criteria);
    const query = TableStatusService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    TableStatusService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addLinkQuery(conditions, query, 'table', 'table', Table);
    ServiceBase.addUserLinkQuery(conditions, query, 'user', 'user');

    return query;
  };
}
