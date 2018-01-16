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

var LanguageService = function (_ServiceBase) {
  _inherits(LanguageService, _ServiceBase);

  function LanguageService() {
    _classCallCheck(this, LanguageService);

    return _possibleConstructorReturn(this, (LanguageService.__proto__ || Object.getPrototypeOf(LanguageService)).call(this, _schema.Language, LanguageService.buildSearchQuery, LanguageService.buildIncludeQuery, 'language'));
  }

  return LanguageService;
}(_parseServerCommon.ServiceBase);

LanguageService.fields = _immutable.List.of('key', 'name', 'imageUrl');

LanguageService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  return query;
};

LanguageService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.Language, criteria);
  var query = LanguageService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  LanguageService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'key', 'key');
  _parseServerCommon.ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');

  return query;
};

exports.default = LanguageService;