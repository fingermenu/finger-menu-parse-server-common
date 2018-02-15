// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Restaurant, Table, TableState } from '../schema';

export default class TableService extends ServiceBase {
  static fields = List.of(
    'tableState',
    'status',
    'restaurant',
    'ownedByUser',
    'maintainedByUsers',
    'numberOfAdults',
    'numberOfChildren',
    'customerName',
    'notes',
    'sortOrderIndex',
  );

  constructor() {
    super(Table, TableService.buildSearchQuery, TableService.buildIncludeQuery, 'table');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'restaurant');
    ServiceBase.addIncludeQuery(criteria, query, 'tableState');
    ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Table, criteria);
    const query = TableService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    TableService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'name', 'nameLowerCase', criteria.get('language'));
    ServiceBase.addEqualityQuery(conditions, query, 'status', 'status');
    ServiceBase.addLinkQuery(conditions, query, 'restaurant', 'restaurant', Restaurant);
    ServiceBase.addLinkQuery(conditions, query, 'tableState', 'tableState', TableState);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');
    ServiceBase.addEqualityQuery(conditions, query, 'numberOfAdults', 'numberOfAdults');
    ServiceBase.addEqualityQuery(conditions, query, 'numberOfChildren', 'numberOfChildren');
    ServiceBase.addStringQuery(conditions, query, 'customerName', 'customerNameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'notes', 'notesLowerCase');
    ServiceBase.addEqualityQuery(conditions, query, 'sortOrderIndex', 'sortOrderIndex');

    return query;
  };
}
