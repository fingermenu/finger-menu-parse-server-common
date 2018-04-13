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

var DietaryOptionService = function (_ServiceBase) {
  _inherits(DietaryOptionService, _ServiceBase);

  function DietaryOptionService() {
    _classCallCheck(this, DietaryOptionService);

    return _possibleConstructorReturn(this, (DietaryOptionService.__proto__ || Object.getPrototypeOf(DietaryOptionService)).call(this, _schema.DietaryOption, DietaryOptionService.buildSearchQuery, DietaryOptionService.buildIncludeQuery, 'serving time'));
  }

  return DietaryOptionService;
}(_parseServerCommon.ServiceBase);

DietaryOptionService.fields = _immutable.List.of('tag', 'ownedByUser', 'maintainedByUsers');

DietaryOptionService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'tag');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

  return query;
};

DietaryOptionService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.DietaryOption, criteria);
  var query = DietaryOptionService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  DietaryOptionService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'tag', 'tag', _schema.Tag);
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');

  return query;
};

exports.default = DietaryOptionService;