// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { DietaryOptions, Tag } from '../schema';

export default class DietaryOptionsService extends ServiceBase {
  static fields = List.of('tag', 'ownedByUser', 'maintainedByUsers');

  constructor() {
    super(DietaryOptions, DietaryOptionsService.buildSearchQuery, DietaryOptionsService.buildIncludeQuery, 'serving time');
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
    const queryWithoutIncludes = ParseWrapperService.createQuery(DietaryOptions, criteria);
    const query = DietaryOptionsService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    DietaryOptionsService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addLinkQuery(conditions, query, 'tag', 'tag', Tag);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

    return query;
  };
}
