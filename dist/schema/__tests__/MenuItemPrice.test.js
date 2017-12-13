'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectMenuItemPrice = exports.createMenuItemPrice = exports.createMenuItemPriceInfo = undefined;

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _microBusinessParseServerCommon = require('micro-business-parse-server-common');

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _ = require('../');

var _MenuItemService = require('../../services/__tests__/MenuItemService.test');

var _MenuItemService2 = _interopRequireDefault(_MenuItemService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();

var createMenuItemPriceInfo = exports.createMenuItemPriceInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var menuItem, addedByUser, removedByUser, menuItemPrice;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _MenuItemService2.default)(chance.integer({ min: 1, max: 1 }));

          case 2:
            menuItem = _context.sent.first();
            _context.next = 5;
            return _microBusinessParseServerCommon.ParseWrapperService.createNewUser({ username: (0, _v2.default)() + '@email.com', password: '123456' }).signUp();

          case 5:
            addedByUser = _context.sent;
            _context.next = 8;
            return _microBusinessParseServerCommon.ParseWrapperService.createNewUser({ username: (0, _v2.default)() + '@email.com', password: '123456' }).signUp();

          case 8:
            removedByUser = _context.sent;
            menuItemPrice = (0, _immutable.Map)({
              currentPrice: chance.floating({ min: 0, max: 1000 }),
              wasPrice: chance.floating({ min: 0, max: 1000 }),
              validFrom: new Date(),
              validUntil: new Date(),
              menuItemId: menuItem.get('id'),
              addedByUserId: addedByUser.id,
              removedByUserId: removedByUser.id
            });
            return _context.abrupt('return', {
              menuItemPrice: menuItemPrice,
              menuItem: menuItem,
              addedByUser: addedByUser,
              removedByUser: removedByUser
            });

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createMenuItemPriceInfo() {
    return _ref.apply(this, arguments);
  };
}();

var createMenuItemPrice = exports.createMenuItemPrice = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(object) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _.MenuItemPrice;
            _context2.t1 = object;

            if (_context2.t1) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return createMenuItemPriceInfo();

          case 5:
            _context2.t1 = _context2.sent.menuItemPrice;

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

  return function createMenuItemPrice(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var expectMenuItemPrice = exports.expectMenuItemPrice = function expectMenuItemPrice(object, expectedObject) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      menuItemPriceId = _ref3.menuItemPriceId,
      expectedMenuItem = _ref3.expectedMenuItem;

  expect(object.get('currentPrice')).toBe(expectedObject.get('currentPrice'));
  expect(object.get('wasPrice')).toBe(expectedObject.get('wasPrice'));
  expect(object.get('validFrom')).toEqual(expectedObject.get('validFrom'));
  expect(object.get('validUntil')).toEqual(expectedObject.get('validUntil'));
  expect(object.get('menuItemId')).toBe(expectedObject.get('menuItemId'));
  expect(object.get('addedByUserId')).toBe(expectedObject.get('addedByUserId'));
  expect(object.get('removedByUserId')).toBe(expectedObject.get('removedByUserId'));

  if (menuItemPriceId) {
    expect(object.get('id')).toBe(menuItemPriceId);
  }

  if (expectedMenuItem) {
    expect(object.get('menuItemId')).toEqual(expectedMenuItem.get('id'));
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
            return createMenuItemPrice();

          case 3:
            _context3.t1 = _context3.sent.className;
            (0, _context3.t0)(_context3.t1).toBe('MenuItemPrice');

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
    var _ref6, menuItemPrice, object, info;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return createMenuItemPriceInfo();

          case 2:
            _ref6 = _context4.sent;
            menuItemPrice = _ref6.menuItemPrice;
            _context4.next = 6;
            return createMenuItemPrice(menuItemPrice);

          case 6:
            object = _context4.sent;
            info = object.getInfo();


            expectMenuItemPrice(info, menuItemPrice);

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
            return createMenuItemPrice();

          case 2:
            object = _context5.sent;


            expect(new _.MenuItemPrice(object).getObject()).toBe(object);

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
            return createMenuItemPrice();

          case 2:
            object = _context6.sent;


            expect(new _.MenuItemPrice(object).getId()).toBe(object.id);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  test('updateInfo should update object info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var object, _ref10, updatedMenuItemPrice, info;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return createMenuItemPrice();

          case 2:
            object = _context7.sent;
            _context7.next = 5;
            return createMenuItemPriceInfo();

          case 5:
            _ref10 = _context7.sent;
            updatedMenuItemPrice = _ref10.menuItemPrice;


            object.updateInfo(updatedMenuItemPrice);

            info = object.getInfo();


            expectMenuItemPrice(info, updatedMenuItemPrice);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  test('getInfo should return provided info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref12, menuItemPrice, object, info;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return createMenuItemPriceInfo();

          case 2:
            _ref12 = _context8.sent;
            menuItemPrice = _ref12.menuItemPrice;
            _context8.next = 6;
            return createMenuItemPrice(menuItemPrice);

          case 6:
            object = _context8.sent;
            info = object.getInfo();


            expect(info.get('id')).toBe(object.getId());
            expectMenuItemPrice(info, menuItemPrice);

          case 10:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});