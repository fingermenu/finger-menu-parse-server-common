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

var TableStatusService = function (_ServiceBase) {
  _inherits(TableStatusService, _ServiceBase);

  function TableStatusService() {
    _classCallCheck(this, TableStatusService);

    return _possibleConstructorReturn(this, (TableStatusService.__proto__ || Object.getPrototypeOf(TableStatusService)).call(this, _schema.TableStatus, TableStatusService.buildSearchQuery, TableStatusService.buildIncludeQuery, 'tableStatus'));
  }

  return TableStatusService;
}(_parseServerCommon.ServiceBase);

TableStatusService.fields = _immutable.List.of('table', 'user');

TableStatusService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'table');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'user');

  return query;
};

TableStatusService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.TableStatus, criteria);
  var query = TableStatusService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  TableStatusService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'table', 'table', _schema.Table);
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'user', 'user');

  return query;
};

exports.default = TableStatusService;