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

var OrderService = function (_ServiceBase) {
  _inherits(OrderService, _ServiceBase);

  function OrderService() {
    _classCallCheck(this, OrderService);

    return _possibleConstructorReturn(this, (OrderService.__proto__ || Object.getPrototypeOf(OrderService)).call(this, _schema.Order, OrderService.buildSearchQuery, OrderService.buildIncludeQuery, 'order'));
  }

  return OrderService;
}(_parseServerCommon.ServiceBase);

OrderService.fields = _immutable.List.of('details', 'restaurant', 'table', 'numberOfAdults', 'numberOfChildren', 'customerName', 'notes', 'totalPrice', 'placedAt', 'cancelledAt');

OrderService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'restaurant');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'table');

  return query;
};

OrderService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.Order, criteria);
  var query = OrderService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  OrderService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'restaurant', 'restaurant', _schema.Restaurant);
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'table', 'table', _schema.Table);
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'numberOfAdults', 'numberOfAdults');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'numberOfChildren', 'numberOfChildren');
  _parseServerCommon.ServiceBase.addStringQuery(conditions, query, 'customerName', 'customerNameLowerCase');
  _parseServerCommon.ServiceBase.addStringQuery(conditions, query, 'notes', 'notesLowerCase');
  _parseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'totalPrice', 'totalPrice');
  _parseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'placedAt', 'placedAt');
  _parseServerCommon.ServiceBase.addDateTimeQuery(conditions, query, 'cancelledAt', 'cancelledAt');

  return query;
};

exports.default = OrderService;