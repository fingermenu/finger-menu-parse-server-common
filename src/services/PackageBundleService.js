// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Restaurant, PackageBundle } from '../schema';

export default class PackageBundleService extends ServiceBase {
  static fields = List.of('url', 'checksum', 'restaurant');

  constructor() {
    super(PackageBundle, PackageBundleService.buildSearchQuery, PackageBundleService.buildIncludeQuery, 'package bundle');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'restaurant');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(PackageBundle, criteria);
    const query = PackageBundleService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    PackageBundleService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addEqualityQuery(conditions, query, 'url', 'url');
    ServiceBase.addEqualityQuery(conditions, query, 'checksum', 'checksum');
    ServiceBase.addLinkQuery(conditions, query, 'restaurant', 'restaurant', Restaurant);

    return query;
  };
}
