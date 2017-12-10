'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

Object.defineProperty(exports, 'Menu', {
  enumerable: true,
  get: function get() {
    return _schema.Menu;
  }
});
Object.defineProperty(exports, 'MenuItem', {
  enumerable: true,
  get: function get() {
    return _schema.MenuItem;
  }
});
Object.defineProperty(exports, 'Restaurant', {
  enumerable: true,
  get: function get() {
    return _schema.Restaurant;
  }
});
Object.defineProperty(exports, 'Tag', {
  enumerable: true,
  get: function get() {
    return _schema.Tag;
  }
});

var _services = require('./services');

Object.defineProperty(exports, 'MenuService', {
  enumerable: true,
  get: function get() {
    return _services.MenuService;
  }
});
Object.defineProperty(exports, 'MenuItemService', {
  enumerable: true,
  get: function get() {
    return _services.MenuItemService;
  }
});
Object.defineProperty(exports, 'RestaurantService', {
  enumerable: true,
  get: function get() {
    return _services.RestaurantService;
  }
});
Object.defineProperty(exports, 'TagService', {
  enumerable: true,
  get: function get() {
    return _services.TagService;
  }
});