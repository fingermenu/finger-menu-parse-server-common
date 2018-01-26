'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _Menu = require('./Menu');

var _Menu2 = _interopRequireDefault(_Menu);

var _Language = require('./Language');

var _Language2 = _interopRequireDefault(_Language);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Restaurant = function (_BaseObject) {
  _inherits(Restaurant, _BaseObject);

  function Restaurant(object) {
    _classCallCheck(this, Restaurant);

    var _this = _possibleConstructorReturn(this, (Restaurant.__proto__ || Object.getPrototypeOf(Restaurant)).call(this, object, 'Restaurant'));

    _initialiseProps.call(_this);

    return _this;
  }

  return Restaurant;
}(_parseServerCommon.BaseObject);

Restaurant.spawn = function (info) {
  var object = new Restaurant();

  Restaurant.updateInfoInternal(object, info);

  return object;
};

Restaurant.updateInfoInternal = function (object, info) {
  _parseServerCommon.BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
  object.set('websiteUrl', info.get('websiteUrl'));
  object.set('imageUrl', info.get('imageUrl'));
  object.set('address', info.get('address'));

  if (info.has('phones')) {
    var phones = info.get('phones');

    if (phones) {
      object.set('phones', phones.toJS());
    }
  }

  object.set('geoLocation', info.get('geoLocation'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'parentRestaurant', Restaurant);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'ownedByUser');
  _parseServerCommon.BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
  object.set('status', info.get('status'));
  object.set('googleMapUrl', info.get('googleMapUrl'));
  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'menu', _Menu2.default);
  object.set('inheritParentRestaurantMenus', info.get('inheritParentRestaurantMenus'));
  object.set('pin', info.get('pin'));
  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'language', _Language2.default);
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    Restaurant.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var parentRestaurantObject = object.get('parentRestaurant');
    var parentRestaurant = parentRestaurantObject ? new Restaurant(parentRestaurantObject) : undefined;
    var ownedByUser = object.get('ownedByUser');
    var maintainedByUsers = _immutable2.default.fromJS(object.get('maintainedByUsers'));
    var menuObjects = object.get('menus');
    var menus = menuObjects ? _immutable2.default.fromJS(menuObjects).map(function (menu) {
      return new _Menu2.default(menu).getInfo();
    }) : undefined;
    var languageObjects = object.get('languages');
    var languages = languageObjects ? _immutable2.default.fromJS(languageObjects).map(function (language) {
      return new _Language2.default(language).getInfo();
    }) : undefined;

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      name: _this2.getMultiLanguagesString('name'),
      websiteUrl: object.get('websiteUrl'),
      imageUrl: object.get('imageUrl'),
      address: object.get('address'),
      phones: _immutable2.default.fromJS(object.get('phones')),
      geoLocation: object.get('geoLocation'),
      parentRestaurant: parentRestaurant ? parentRestaurant.getInfo() : undefined,
      parentRestaurantId: parentRestaurant ? parentRestaurant.getId() : undefined,
      ownedByUser: ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers: maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(function (maintainedByUser) {
        return maintainedByUser.id;
      }) : (0, _immutable.List)(),
      status: object.get('status'),
      googleMapUrl: object.get('googleMapUrl'),
      menus: menus,
      menuIds: menus ? menus.map(function (menu) {
        return menu.get('id');
      }) : (0, _immutable.List)(),
      inheritParentRestaurantMenus: object.get('inheritParentRestaurantMenus'),
      pin: object.get('pin'),
      languages: languages,
      languageIds: languages ? languages.map(function (language) {
        return language.get('id');
      }) : (0, _immutable.List)()
    }));
  };
};

exports.default = Restaurant;