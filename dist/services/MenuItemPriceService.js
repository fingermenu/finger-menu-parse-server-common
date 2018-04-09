'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _schema = require('../schema');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuItemPriceService = function (_ServiceBase) {
  _inherits(MenuItemPriceService, _ServiceBase);

  function MenuItemPriceService() {
    _classCallCheck(this, MenuItemPriceService);

    return _possibleConstructorReturn(this, (MenuItemPriceService.__proto__ || Object.getPrototypeOf(MenuItemPriceService)).call(this, _schema.MenuItemPrice, MenuItemPriceService.buildSearchQuery, MenuItemPriceService.buildIncludeQuery, 'menu item price'));
  }

  return MenuItemPriceService;
}(_parseServerCommon.ServiceBase);

MenuItemPriceService.fields = _immutable.List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'menuItem', 'size', 'toBeServedWithMenuItemPrices', 'choiceItemPrices', 'addedByUser', 'removedByUser', 'toBeServedWithMenuItemPriceSortOrderIndices', 'choiceItemPriceSortOrderIndices', 'tags');

MenuItemPriceService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'toBeServedWithMenuItemPrices');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'menuItem');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'size');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'choiceItemPrices');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'addedByUser');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'removedByUser');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'tags');

  return query;
};

MenuItemPriceService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.MenuItemPrice, criteria);
  var query = MenuItemPriceService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  MenuItemPriceService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'currentPrice', 'currentPrice');
  _parseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'wasPrice', 'wasPrice');
  _parseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'validFrom', 'validFrom');
  _parseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'validUntil', 'validUntil');
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'menuItem', 'menuItem', _schema.MenuItem);
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'size', 'size', _schema.Size);
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'toBeServedWithMenuItemPrice', 'toBeServedWithMenuItemPrices', _schema.MenuItemPrice);
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'choiceItemPrice', 'choiceItemPrices', _schema.ChoiceItemPrice);
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'addedByUser', 'addedByUser');
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'removedByUser', 'removedByUser');
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'tag', 'tags', _schema.Tag);

  return query;
};

exports.default = MenuItemPriceService;