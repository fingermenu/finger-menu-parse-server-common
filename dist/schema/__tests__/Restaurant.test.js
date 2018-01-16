'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectRestaurant = exports.createRestaurant = exports.createRestaurantInfo = undefined;

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _parseServerCommon = require('@microbusiness/parse-server-common');

require('../../../bootstrap');

var _TestHelper = require('../../../TestHelper');

var _TestHelper2 = _interopRequireDefault(_TestHelper);

var _2 = require('../');

var _MenuService = require('../../services/__tests__/MenuService.test');

var _MenuService2 = _interopRequireDefault(_MenuService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();

var createRestaurantInfo = exports.createRestaurantInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        parentRestaurantId = _ref2.parentRestaurantId;

    var ownedByUser, maintainedByUsers, menus, restaurant;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _TestHelper2.default.createUser();

          case 2:
            ownedByUser = _context.sent;
            _context.next = 5;
            return _TestHelper2.default.createUsers();

          case 5:
            maintainedByUsers = _context.sent;
            _context.next = 8;
            return (0, _MenuService2.default)(chance.integer({ min: 1, max: 3 }));

          case 8:
            menus = _context.sent;
            restaurant = (0, _immutable.Map)({
              name: _TestHelper2.default.createRandomMultiLanguagesString(),
              websiteUrl: chance.string(),
              imageUrl: chance.string(),
              address: chance.string(),
              phones: _immutable.List.of((0, _immutable.Map)({ label: 'business', number: chance.string() }), (0, _immutable.Map)({ label: 'business', number: chance.string() })),
              geoLocation: _parseServerCommon.ParseWrapperService.createGeoPoint({
                latitude: chance.floating({ min: 1, max: 20 }),
                longitude: chance.floating({ min: -30, max: -1 })
              }),
              parentRestaurantId: parentRestaurantId,
              ownedByUserId: ownedByUser.id,
              maintainedByUserIds: maintainedByUsers.map(function (maintainedByUser) {
                return maintainedByUser.id;
              }),
              status: chance.string(),
              googleMapUrl: chance.string(),
              menuIds: menus.map(function (menu) {
                return menu.get('id');
              }),
              inheritParentRestaurantMenus: chance.integer(),
              pin: chance.string()
            });
            return _context.abrupt('return', {
              restaurant: restaurant,
              ownedByUser: ownedByUser,
              maintainedByUsers: maintainedByUsers,
              menus: menus
            });

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createRestaurantInfo() {
    return _ref.apply(this, arguments);
  };
}();

var createRestaurant = exports.createRestaurant = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(object) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _2.Restaurant;
            _context2.t1 = object;

            if (_context2.t1) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return createRestaurantInfo();

          case 5:
            _context2.t1 = _context2.sent.restaurant;

          case 6:
            _context2.t2 = _context2.t1;
            return _context2.abrupt('return', _context2.t0.spawn.call(_context2.t0, _context2.t2));

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function createRestaurant(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var expectRestaurant = exports.expectRestaurant = function expectRestaurant(object, expectedObject) {
  var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      expectedMenus = _ref4.expectedMenus;

  expect(object.get('name')).toEqual(expectedObject.get('name'));
  expect(object.get('websiteUrl')).toBe(expectedObject.get('websiteUrl'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));
  expect(object.get('address')).toBe(expectedObject.get('address'));
  expect(object.get('phones')).toEqual(expectedObject.get('phones'));
  expect(object.get('geoLocation')).toEqual(expectedObject.get('geoLocation'));
  expect(object.get('parentRestaurantId')).toBe(expectedObject.get('parentRestaurantId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));
  expect(object.get('status')).toBe(expectedObject.get('status'));
  expect(object.get('googleMapUrl')).toBe(expectedObject.get('googleMapUrl'));
  expect(object.get('menuIds')).toEqual(expectedObject.get('menuIds'));
  expect(object.get('inheritParentRestaurantMenus')).toBe(expectedObject.get('inheritParentRestaurantMenus'));
  expect(object.get('ping')).toBe(expectedObject.get('pin'));

  if (expectedMenus) {
    expect(object.get('menuIds')).toEqual(expectedMenus.map(function (_) {
      return _.get('id');
    }));
  }
};

describe('constructor', function () {
  test('should set class name', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = expect;
            _context3.next = 3;
            return createRestaurant();

          case 3:
            _context3.t1 = _context3.sent.className;
            (0, _context3.t0)(_context3.t1).toBe('Restaurant');

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
});

describe('static public methods', function () {
  test('spawn should set provided info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _ref7, restaurant, object, info;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return createRestaurantInfo();

          case 2:
            _ref7 = _context4.sent;
            restaurant = _ref7.restaurant;
            _context4.next = 6;
            return createRestaurant(restaurant);

          case 6:
            object = _context4.sent;
            info = object.getInfo();


            expectRestaurant(info, restaurant);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe('public methods', function () {
  test('getObject should return provided object', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var object;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return createRestaurant();

          case 2:
            object = _context5.sent;


            expect(new _2.Restaurant(object).getObject()).toBe(object);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  test('getId should return provided object Id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var object;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return createRestaurant();

          case 2:
            object = _context6.sent;


            expect(new _2.Restaurant(object).getId()).toBe(object.id);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  test('updateInfo should update object info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var object, _ref11, updatedRestaurant, info;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return createRestaurant();

          case 2:
            object = _context7.sent;
            _context7.next = 5;
            return createRestaurantInfo();

          case 5:
            _ref11 = _context7.sent;
            updatedRestaurant = _ref11.restaurant;


            object.updateInfo(updatedRestaurant);

            info = object.getInfo();


            expectRestaurant(info, updatedRestaurant);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  test('getInfo should return provided info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref13, restaurant, object, info;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return createRestaurantInfo();

          case 2:
            _ref13 = _context8.sent;
            restaurant = _ref13.restaurant;
            _context8.next = 6;
            return createRestaurant(restaurant);

          case 6:
            object = _context8.sent;
            info = object.getInfo();


            expect(info.get('id')).toBe(object.getId());
            expectRestaurant(info, restaurant);

          case 10:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});