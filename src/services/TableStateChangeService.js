// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Table, TableState, TableStateChange } from '../schema';

export default class TableStateChangeService extends ServiceBase {
  static fields = List.of('tableState', 'table', 'changedByUser', 'numberOfAdults', 'numberOfChildren', 'customerName', 'notes');

  constructor() {
    super(TableStateChange, TableStateChangeService.buildSearchQuery, TableStateChangeService.buildIncludeQuery, 'tableStateChange');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'tableState');
    ServiceBase.addIncludeQuery(criteria, query, 'table');
    ServiceBase.addIncludeQuery(criteria, query, 'changedByUser');

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
    ServiceBase.addLinkQuery(conditions, query, 'tableState', 'tableState', TableState);
    ServiceBase.addLinkQuery(conditions, query, 'table', 'table', Table);
    ServiceBase.addUserLinkQuery(conditions, query, 'changedByUser', 'changedByUser');
    ServiceBase.addEqualityQuery(conditions, query, 'numberOfAdults', 'numberOfAdults');
    ServiceBase.addEqualityQuery(conditions, query, 'numberOfChildren', 'numberOfChildren');
    ServiceBase.addStringQuery(conditions, query, 'customerName', 'customerNameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'notes', 'notesLowerCase');

    return query;
  };
}
