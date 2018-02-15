// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { Menu, Restaurant } from '../schema';

export default class RestaurantService extends ServiceBase {
  static fields = List.of(
    'websiteUrl',
    'address',
    'phones',
    'geoLocation',
    'parentRestaurant',
    'ownedByUser',
    'maintainedByUsers',
    'status',
    'googleMapUrl',
    'menus',
    'inheritParentRestaurantMenus',
    'pin',
    'configurations',
    'menuSortOrderIndices',
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
    ServiceBase.addIncludeQuery(criteria, query, 'menus');

    return query;
  };

  static buildSearchQuery = criteria => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(Restaurant, criteria);
    const query = RestaurantService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    RestaurantService.fields.forEach(field => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'name', 'nameLowerCase', criteria.get('language'));
    ServiceBase.addEqualityQuery(conditions, query, 'websiteUrl', 'websiteUrl');
    ServiceBase.addEqualityQuery(conditions, query, 'address', 'address');
    ServiceBase.addGeoLocationQuery(conditions, query, 'geoLocation', 'geoLocation');
    ServiceBase.addLinkQuery(conditions, query, 'parentRestaurant', 'parentRestaurant', Restaurant);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');
    ServiceBase.addEqualityQuery(conditions, query, 'status', 'status');
    ServiceBase.addEqualityQuery(conditions, query, 'googleMapUrl', 'googleMapUrl');
    ServiceBase.addLinkQuery(conditions, query, 'menu', 'menus', Menu);
    ServiceBase.addEqualityQuery(conditions, query, 'inheritParentRestaurantMenus', 'inheritParentRestaurantMenus');
    ServiceBase.addEqualityQuery(conditions, query, 'pin', 'pin');

    return query;
  };
}
