// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { DietaryOption, Tag } from '../schema';

export default class DietaryOptionService extends ServiceBase {
  static fields = List.of('tag', 'ownedByUser', 'maintainedByUsers');

  constructor() {
    super(DietaryOption, DietaryOptionService.buildSearchQuery, DietaryOptionService.buildIncludeQuery, 'serving time');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'tag');
    ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(DietaryOption, criteria);
    const query = DietaryOptionService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    DietaryOptionService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addLinkQuery(conditions, query, 'tag', 'tag', Tag);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

    return query;
  };
}
