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

var TableService = function (_ServiceBase) {
  _inherits(TableService, _ServiceBase);

  function TableService() {
    _classCallCheck(this, TableService);

    return _possibleConstructorReturn(this, (TableService.__proto__ || Object.getPrototypeOf(TableService)).call(this, _schema.Table, TableService.buildSearchQuery, TableService.buildIncludeQuery, 'table'));
  }

  return TableService;
}(_parseServerCommon.ServiceBase);

TableService.fields = _immutable.List.of('state', 'status', 'restaurant', 'ownedByUser', 'maintainedByUsers');

TableService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'restaurant');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

  return query;
};

TableService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.Table, criteria);
  var query = TableService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  TableService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'name', 'nameLowerCase', criteria.get('language'));
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'state', 'state');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'status', 'status');
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'restaurant', 'restaurant', _schema.Restaurant);
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

  return query;
};

exports.default = TableService;