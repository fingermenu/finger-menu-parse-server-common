// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { ServingTime, Tag } from '../schema';

export default class ServingTimeService extends ServiceBase {
  static fields = List.of('tag', 'addedByUser', 'removedByUser');

  constructor() {
    super(ServingTime, ServingTimeService.buildSearchQuery, ServingTimeService.buildIncludeQuery, 'serving time');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'tag');
    ServiceBase.addIncludeQuery(criteria, query, 'addedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'removedByUser');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(ServingTime, criteria);
    const query = ServingTimeService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    ServingTimeService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addLinkQuery(conditions, query, 'tag', 'tag', Tag);
    ServiceBase.addUserLinkQuery(conditions, query, 'addedByUser', 'addedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'removedByUser', 'removedByUser');

    return query;
  };
}
