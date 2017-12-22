// @flow

import { List } from 'immutable';
import { ParseWrapperService, ServiceBase } from '@microbusiness/parse-server-common';
import { ChoiceItemPrice, ChoiceItem } from '../schema';

export default class ChoiceItemPriceService extends ServiceBase {
  static fields = List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'choiceItem', 'addedByUser', 'removedByUser');

  constructor() {
    super(ChoiceItemPrice, ChoiceItemPriceService.buildSearchQuery, ChoiceItemPriceService.buildIncludeQuery, 'choice item price');
  }

  static buildIncludeQuery = (query, criteria) => {
    if (!criteria) {
      return query;
    }

    ServiceBase.addIncludeQuery(criteria, query, 'choiceItem');
    ServiceBase.addIncludeQuery(criteria, query, 'addedByUser');
    ServiceBase.addIncludeQuery(criteria, query, 'removedByUser');

    return query;
  };

  static buildSearchQuery = (criteria) => {
    const queryWithoutIncludes = ParseWrapperService.createQuery(ChoiceItemPrice, criteria);
    const query = ChoiceItemPriceService.buildIncludeQuery(queryWithoutIncludes, criteria);

    if (!criteria.has('conditions')) {
      return query;
    }

    const conditions = criteria.get('conditions');

    ChoiceItemPriceService.fields.forEach((field) => {
      ServiceBase.addExistenceQuery(conditions, query, field);
    });
    ServiceBase.addNumberQuery(conditions, query, 'currentPrice', 'currentPrice');
    ServiceBase.addNumberQuery(conditions, query, 'wasPrice', 'wasPrice');
    ServiceBase.addDateTimeQuery(conditions, query, 'validFrom', 'validFrom');
    ServiceBase.addDateTimeQuery(conditions, query, 'validUntil', 'validUntil');
    ServiceBase.addLinkQuery(conditions, query, 'choiceItem', 'choiceItem', ChoiceItem);
    ServiceBase.addUserLinkQuery(conditions, query, 'addedByUser', 'addedByUser');
    ServiceBase.addUserLinkQuery(conditions, query, 'removedByUser', 'removedByUser');

    return query;
  };
}
