'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

Object.defineProperty(exports, 'MyMeal', {
  enumerable: true,
  get: function get() {
    return _schema.MyMeal;
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

Object.defineProperty(exports, 'MyMealService', {
  enumerable: true,
  get: function get() {
    return _services.MyMealService;
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