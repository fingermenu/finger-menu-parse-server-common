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

var ChoiceItemPriceService = function (_ServiceBase) {
  _inherits(ChoiceItemPriceService, _ServiceBase);

  function ChoiceItemPriceService() {
    _classCallCheck(this, ChoiceItemPriceService);

    return _possibleConstructorReturn(this, (ChoiceItemPriceService.__proto__ || Object.getPrototypeOf(ChoiceItemPriceService)).call(this, _schema.ChoiceItemPrice, ChoiceItemPriceService.buildSearchQuery, ChoiceItemPriceService.buildIncludeQuery, 'choice item price'));
  }

  return ChoiceItemPriceService;
}(_microBusinessParseServerCommon.ServiceBase);

ChoiceItemPriceService.fields = _immutable.List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'choiceItem', 'addedByUser', 'removedByUser');

ChoiceItemPriceService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'choiceItem');
  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'addedByUser');
  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'removedByUser');

  return query;
};

ChoiceItemPriceService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _microBusinessParseServerCommon.ParseWrapperService.createQuery(_schema.ChoiceItemPrice, criteria);
  var query = ChoiceItemPriceService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  ChoiceItemPriceService.fields.forEach(function (field) {
    _microBusinessParseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _microBusinessParseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'currentPrice', 'currentPrice');
  _microBusinessParseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'wasPrice', 'wasPrice');
  _microBusinessParseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'validFrom', 'validFrom');
  _microBusinessParseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'validUntil', 'validUntil');
  _microBusinessParseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'choiceItem', 'choiceItem', _schema.ChoiceItem);
  _microBusinessParseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'addedByUser', 'addedByUser');
  _microBusinessParseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'removedByUser', 'removedByUser');

  return query;
};

exports.default = ChoiceItemPriceService;