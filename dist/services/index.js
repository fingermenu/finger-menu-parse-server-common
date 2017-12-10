'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagService = exports.RestaurantService = exports.MenuItemService = exports.MenuService = undefined;

var _MenuService2 = require('./MenuService');

var _MenuService3 = _interopRequireDefault(_MenuService2);

var _MenuItemService2 = require('./MenuItemService');

var _MenuItemService3 = _interopRequireDefault(_MenuItemService2);

var _RestaurantService2 = require('./RestaurantService');

var _RestaurantService3 = _interopRequireDefault(_RestaurantService2);

var _TagService2 = require('./TagService');

var _TagService3 = _interopRequireDefault(_TagService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.MenuService = _MenuService3.default;
exports.MenuItemService = _MenuItemService3.default;
exports.RestaurantService = _RestaurantService3.default;
exports.TagService = _TagService3.default;