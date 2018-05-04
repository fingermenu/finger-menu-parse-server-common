// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { RequestLog } from '../schema';

export default class RequestLogService extends ServiceBase {
  static fields = List.of('appVersion', 'requestType', 'user');

  constructor() {
    super(RequestLog, RequestLogService.buildSearchQuery, RequestLogService.buildIncludeQuery, 'request log');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'user');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(RequestLog, criteria);
    const query = RequestLogService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    RequestLogService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addEqualityQuery(conditions, query, 'appVersion', 'appVersion');
    ServiceBase.addEqualityQuery(conditions, query, 'requestType', 'requestType');
    ServiceBase.addUserLinkQuery(conditions, query, 'user', 'user');

    return query;
  };
}
