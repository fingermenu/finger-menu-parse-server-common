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

var RestaurantService = function (_ServiceBase) {
  _inherits(RestaurantService, _ServiceBase);

  function RestaurantService() {
    _classCallCheck(this, RestaurantService);

    return _possibleConstructorReturn(this, (RestaurantService.__proto__ || Object.getPrototypeOf(RestaurantService)).call(this, _schema.Restaurant, RestaurantService.buildSearchQuery, RestaurantService.buildIncludeQuery, 'restaurant'));
  }

  return RestaurantService;
}(_parseServerCommon.ServiceBase);

RestaurantService.fields = _immutable.List.of('name', 'websiteUrl', 'imageUrl', 'address', 'phones', 'geoLocation', 'parentRestaurant', 'ownedByUser', 'maintainedByUsers', 'status', 'googleMapUrl', 'menus', 'inheritParentRestaurantMenus');

RestaurantService.buildIncludeQuery = function (query, criteria) {
  if (!criteria) {
    return query;
  }

  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'parentRestaurant');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'ownedByUser');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'maintainedByUsers');
  _parseServerCommon.ServiceBase.addIncludeQuery(criteria, query, 'menus');

  return query;
};

RestaurantService.buildSearchQuery = function (criteria) {
  var queryWithoutIncludes = _parseServerCommon.ParseWrapperService.createQuery(_schema.Restaurant, criteria);
  var query = RestaurantService.buildIncludeQuery(queryWithoutIncludes, criteria);

  if (!criteria.has('conditions')) {
    return query;
  }

  var conditions = criteria.get('conditions');

  RestaurantService.fields.forEach(function (field) {
    _parseServerCommon.ServiceBase.addExistenceQuery(conditions, query, field);
  });
  _parseServerCommon.ServiceBase.addMultiLanguagesStringQuery(conditions, query, 'name', 'nameLowerCase', criteria.get('language'));
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'websiteUrl', 'websiteUrl');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'imageUrl', 'imageUrl');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'address', 'address');
  _parseServerCommon.ServiceBase.addGeoLocationQuery(conditions, query, 'geoLocation', 'geoLocation');
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'parentRestaurant', 'parentRestaurant', _schema.Restaurant);
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'ownedByUser', 'ownedByUser');
  _parseServerCommon.ServiceBase.addUserLinkQuery(conditions, query, 'maintainedByUser', 'maintainedByUsers');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'status', 'status');
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'googleMapUrl', 'googleMapUrl');
  _parseServerCommon.ServiceBase.addLinkQuery(conditions, query, 'menu', 'menus', _schema.Menu);
  _parseServerCommon.ServiceBase.addEqualityQuery(conditions, query, 'inheritParentRestaurantMenus', 'inheritParentRestaurantMenus');

  return query;
};

exports.default = RestaurantService;