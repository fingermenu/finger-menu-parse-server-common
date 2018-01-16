// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Language } from '../schema';

export default class LanguageService extends ServiceBase {
  static fields = List.of('key', 'name', 'imageUrl');

  constructor() {
    super(Language, LanguageService.buildSearchQuery, LanguageService.buildIncludeQuery, 'language');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Language, criteria);
    const query = LanguageService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    LanguageService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addEqualityQuery(conditions, query, 'key', 'key');
    ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
    ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');

    return query;
  };
}
