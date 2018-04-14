// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Restaurant, UserFeedback } from '../schema';

export default class UserFeedbackService extends ServiceBase {
  static fields = List.of('questionAndAnswers', 'others', 'submittedAt', 'restaurant', 'addedByUser');

  constructor() {
    super(UserFeedback, UserFeedbackService.buildSearchQuery, UserFeedbackService.buildIncludeQuery, 'user feedback');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'restaurant');
    ServiceBase.addIncludeQuery(criteria, query, 'addedByUser');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(UserFeedback, criteria);
    const query = UserFeedbackService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    UserFeedbackService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addStringQuery(conditions, query, 'others', 'othersLowerCase');
    ServiceBase.addDateTimeQuery(conditions, query, 'submittedAt', 'submittedAt');
    ServiceBase.addLinkQuery(conditions, query, 'restaurant', 'restaurant', Restaurant);
    ServiceBase.addUserLinkQuery(conditions, query, 'addedByUser', 'addedByUser');

    return query;
  };
}
