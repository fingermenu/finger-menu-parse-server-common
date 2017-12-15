// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from 'micro-business-parse-server-common';
import { Tag } from '../schema';

export default class TagService extends ServiceBase {
  static fields = List.of('name', 'description', 'level', 'forDisplay', 'parentTag');

  constructor() {
    super(Tag, TagService.buildSearchQuery, TagService.buildIncludeQuery, 'tag');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'parentTag');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Tag, criteria);
    const query = TagService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    TagService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'description', 'descriptionLowerCase');
    ServiceBase.addNumberQuery(conditions, query, 'level', 'level');
    ServiceBase.addEqualityQuery(conditions, query, 'forDisplay', 'forDisplay');
    ServiceBase.addLinkQuery(conditions, query, 'parentTag', 'parentTag', Tag);

    return query;
  };
}
