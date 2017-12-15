'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _microBusinessParseServerCommon = require('micro-business-parse-server-common');

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
}(_microBusinessParseServerCommon.ServiceBase);

MenuItemPriceService.fields = _immutable.List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'menuItem', 'choiceItemPrices', 'addedByUser', 'removedByUser');

MenuItemPriceService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'choiceItemPrices');
  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'menuItem');
  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'addedByUser');
  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'removedByUser');

  return query;
};

MenuItemPriceService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _microBusinessParseServerCommon.ParseWrapperService.createQuery(_schema.MenuItemPrice, criteria);
  var query = MenuItemPriceService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  MenuItemPriceService.fields.forEach(function (field) {
    _microBusinessParseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _microBusinessParseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'currentPrice', 'currentPrice');
  _microBusinessParseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'wasPrice', 'wasPrice');
  _microBusinessParseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'validFrom', 'validFrom');
  _microBusinessParseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'validUntil', 'validUntil');
  _microBusinessParseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'menuItem', 'menuItem', _schema.MenuItem);
  _microBusinessParseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'choiceItemPrice', 'choiceItemPrices', _schema.ChoiceItemPrice);
  _microBusinessParseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'addedByUser', 'addedByUser');
  _microBusinessParseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'removedByUser', 'removedByUser');

  return query;
};

exports.default = MenuItemPriceService;