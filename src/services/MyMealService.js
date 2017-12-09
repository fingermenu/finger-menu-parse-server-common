// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from 'micro-business-parse-server-common';
import { MyMeal, Tag } from '../schema';

export default class MyMealService extends ServiceBase {
  static fields = List.of('name', 'description', 'mealPageUrl', 'imageUrl', 'tags', 'ownedByUser');

  constructor() {
    super(MyMeal, MyMealService.buildSearchQuery, MyMealService.buildIncludeQuery, 'my meal');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'tags');
    ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(MyMeal, criteria);
    const query = MyMealService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    MyMealService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
    ServiceBase.addStringQuery(conditions, query, 'description', 'descriptionLowerCase');
    ServiceBase.addEqualityQuery(conditions, query, 'mealPageUrl', 'mealPageUrl');
    ServiceBase.addStringQuery(conditions, query, 'mealPageUrl', 'mealPageUrl');
    ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');
    ServiceBase.addLinkQuery(conditions, query, 'tag', 'tags', Tag);
    ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');

    return query;
  };
}
