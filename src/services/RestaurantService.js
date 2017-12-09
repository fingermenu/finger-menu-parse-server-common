// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from 'micro-business-parse-server-common';
import { Restaurant } from '../schema';

export default class RestaurantService extends ServiceBase {
  static fields = List.of(
    'key',
    'name',
    'websiteUrl',
    'imageUrl',
    'address',
    'phones',
    'geoLocation',
    'forDisplay',
    'parentRestaurant',
    'ownedByUser',
    'maintainedByUsers',
    'status',
    'googleMapUrl',
  );

  constructor() {
    super(Restaurant, RestaurantService.buildSearchQuery, RestaurantService.buildIncludeQuery, 'restaurant');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'parentRestaurant');
    ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Restaurant, criteria);
    const query = RestaurantService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    RestaurantService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addEqualityQuery(conditions, query, 'key', 'key');
    ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
    ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');
    ServiceBase.addEqualityQuery(conditions, query, 'address', 'address');
    ServiceBase.addGeoLocationQuery(conditions, query, 'geoLocation', 'geoLocation');
    ServiceBase.addEqualityQuery(conditions, query, 'forDisplay', 'forDisplay');
    ServiceBase.addLinkQuery(conditions, query, 'parentRestaurant', 'parentRestaurant', Restaurant);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');
    ServiceBase.addEqualityQuery(conditions, query, 'status', 'status');
    ServiceBase.addEqualityQuery(conditions, query, 'googleMapUrl', 'googleMapUrl');

    return query;
  };
}
