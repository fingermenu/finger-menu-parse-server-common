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

var TableStateChangeService = function (_ServiceBase) {
  _inherits(TableStateChangeService, _ServiceBase);

  function TableStateChangeService() {
    _classCallCheck(this, TableStateChangeService);

    return _possibleConstructorReturn(this, (TableStateChangeService.__proto__ || Object.getPrototypeOf(TableStateChangeService)).call(this, _schema.TableStateChange, TableStateChangeService.buildSearchQuery, TableStateChangeService.buildIncludeQuery, 'tableStateChange'));
  }

  return TableStateChangeService;
}(_parseServerCommon.ServiceBase);

TableStateChangeService.fields = _immutable.List.of('tableState', 'table', 'changedByUser', 'numberOfAdults', 'numberOfChildren', 'customerName', 'notes');

TableStateChangeService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'tableState');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'table');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'changedByUser');

  return query;
};

TableStateChangeService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.TableStateChange, criteria);
  var query = TableStateChangeService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  TableStateChangeService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'tableState', 'tableState', _schema.TableState);
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'table', 'table', _schema.Table);
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'changedByUser', 'changedByUser');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'numberOfAdults', 'numberOfAdults');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'numberOfChildren', 'numberOfChildren');
  _parseServerCommon.ServiceBase.addStringQuery(conditions, query, 'customerName', 'customerName');
  _parseServerCommon.ServiceBase.addStringQuery(conditions, query, 'notes', 'notes');

  return query;
};

exports.default = TableStateChangeService;