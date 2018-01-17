// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { TableState } from '../schema';

export default class TableStateService extends ServiceBase {
  static fields = List.of('key', 'imageUrl');

  constructor() {
    super(TableState, TableStateService.buildSearchQuery, TableStateService.buildIncludeQuery, 'tableState');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

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
    ServiceBase.addEqualityQuery(conditions, query, 'key', 'key');
    ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'name', 'nameLowerCase', criteria.get('language'));
    ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');

    return query;
  };
}
