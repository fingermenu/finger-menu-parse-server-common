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

var RequestLogService = function (_ServiceBase) {
  _inherits(RequestLogService, _ServiceBase);

  function RequestLogService() {
    _classCallCheck(this, RequestLogService);

    return _possibleConstructorReturn(this, (RequestLogService.__proto__ || Object.getPrototypeOf(RequestLogService)).call(this, _schema.RequestLog, RequestLogService.buildSearchQuery, RequestLogService.buildIncludeQuery, 'request log'));
  }

  return RequestLogService;
}(_parseServerCommon.ServiceBase);

RequestLogService.fields = _immutable.List.of('appVersion', 'user');

RequestLogService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'user');

  return query;
};

RequestLogService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.RequestLog, criteria);
  var query = RequestLogService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  RequestLogService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'appVersion', 'appVersion');
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'user', 'user');

  return query;
};

exports.default = RequestLogService;