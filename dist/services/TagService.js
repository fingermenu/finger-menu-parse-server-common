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

var TagService = function (_ServiceBase) {
  _inherits(TagService, _ServiceBase);

  function TagService() {
    _classCallCheck(this, TagService);

    return _possibleConstructorReturn(this, (TagService.__proto__ || Object.getPrototypeOf(TagService)).call(this, _schema.Tag, TagService.buildSearchQuery, TagService.buildIncludeQuery, 'tag'));
  }

  return TagService;
}(_parseServerCommon.ServiceBase);

TagService.fields = _immutable.List.of('level', 'forDisplay', 'parentTag', 'ownedByUser', 'maintainedByUsers');

TagService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'parentTag');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

  return query;
};

TagService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.Tag, criteria);
  var query = TagService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  TagService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'name', 'nameLowerCase', criteria.get('language'));
  _parseServerCommon.ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'description', 'descriptionLowerCase', criteria.get('language'));
  _parseServerCommon.ServiceBase.addNumberQuery(conditions, query, 'level', 'level');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'forDisplay', 'forDisplay');
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'parentTag', 'parentTag', _schema.Tag);
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

  return query;
};

exports.default = TagService;