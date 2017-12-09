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

var RestaurantService = function (_ServiceBase) {
  _inherits(RestaurantService, _ServiceBase);

  function RestaurantService() {
    _classCallCheck(this, RestaurantService);

    return _possibleConstructorReturn(this, (RestaurantService.__proto__ || Object.getPrototypeOf(RestaurantService)).call(this, _schema.Restaurant, RestaurantService.buildSearchQuery, RestaurantService.buildIncludeQuery, 'restaurant'));
  }

  return RestaurantService;
}(_microBusinessParseServerCommon.ServiceBase);

RestaurantService.fields = _immutable.List.of('key', 'name', 'websiteUrl', 'imageUrl', 'address', 'phones', 'geoLocation', 'forDisplay', 'parentRestaurant', 'ownedByUser', 'maintainedByUsers', 'status', 'googleMapUrl');

RestaurantService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'parentRestaurant');
  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
  _microBusinessParseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');

  return query;
};

RestaurantService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _microBusinessParseServerCommon.ParseWrapperService.createQuery(_schema.Restaurant, criteria);
  var query = RestaurantService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  RestaurantService.fields.forEach(function (field) {
    _microBusinessParseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _microBusinessParseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'key', 'key');
  _microBusinessParseServerCommon.ServiceBase.addStringQuery(conditions, query, 'name', 'nameLowerCase');
  _microBusinessParseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');
  _microBusinessParseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'address', 'address');
  _microBusinessParseServerCommon.ServiceBase.addGeoLocationQuery(conditions, query, 'geoLocation', 'geoLocation');
  _microBusinessParseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'forDisplay', 'forDisplay');
  _microBusinessParseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'parentRestaurant', 'parentRestaurant', _schema.Restaurant);
  _microBusinessParseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
  _microBusinessParseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');
  _microBusinessParseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'status', 'status');
  _microBusinessParseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'googleMapUrl', 'googleMapUrl');

  return query;
};

exports.default = RestaurantService;