'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectChoiceItem = exports.createChoiceItem = exports.createChoiceItemInfo = undefined;

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _2 = require('../');

var _TagService = require('../../services/__tests__/TagService.test');

var _TagService2 = _interopRequireDefault(_TagService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();

var createChoiceItemInfo = exports.createChoiceItemInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var ownedByUser, maintainedByUsers, tags, choiceItem;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _parseServerCommon.ParseWrapperService.createNewUser({ username: (0, _v2.default)() + '@email.com', password: '123456' }).signUp();

          case 2:
            ownedByUser = _context.sent;
            _context.t0 = _immutable2.default;
            _context.next = 6;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 0, max: 3 })).map(function () {
              return _parseServerCommon.ParseWrapperService.createNewUser({ username: (0, _v2.default)() + '@email.com', password: '123456' }).signUp();
            }).toArray());

          case 6:
            _context.t1 = _context.sent;
            maintainedByUsers = _context.t0.fromJS.call(_context.t0, _context.t1);
            _context.next = 10;
            return (0, _TagService2.default)(chance.integer({ min: 1, max: 3 }));

          case 10:
            tags = _context.sent;
            choiceItem = (0, _immutable.Map)({
              name: (0, _v2.default)(),
              description: (0, _v2.default)(),
              choiceItemPageUrl: (0, _v2.default)(),
              imageUrl: (0, _v2.default)(),
              tagIds: tags.map(function (tag) {
                return tag.get('id');
              }),
              ownedByUserId: ownedByUser.id,
              maintainedByUserIds: maintainedByUsers.map(function (maintainedByUser) {
                return maintainedByUser.id;
              })
            });
            return _context.abrupt('return', {
              choiceItem: choiceItem,
              tags: tags,
              ownedByUser: ownedByUser,
              maintainedByUsers: maintainedByUsers
            });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createChoiceItemInfo() {
    return _ref.apply(this, arguments);
  };
}();

var createChoiceItem = exports.createChoiceItem = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(object) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _2.ChoiceItem;
            _context2.t1 = object;

            if (_context2.t1) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return createChoiceItemInfo();

          case 5:
            _context2.t1 = _context2.sent.choiceItem;

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

  return function createChoiceItem(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var expectChoiceItem = exports.expectChoiceItem = function expectChoiceItem(object, expectedObject) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      choiceItemId = _ref3.choiceItemId,
      expectedTags = _ref3.expectedTags;

  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('description')).toBe(expectedObject.get('description'));
  expect(object.get('choiceItemPageUrl')).toBe(expectedObject.get('choiceItemPageUrl'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));
  expect(object.get('tagIds')).toEqual(expectedObject.get('tagIds'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (choiceItemId) {
    expect(object.get('id')).toBe(choiceItemId);
  }

  if (expectedTags) {
    expect(object.get('tagIds')).toEqual(expectedTags.map(function (_) {
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
            return createChoiceItem();

          case 3:
            _context3.t1 = _context3.sent.className;
            (0, _context3.t0)(_context3.t1).toBe('ChoiceItem');

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
    var _ref6, choiceItem, object, info;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return createChoiceItemInfo();

          case 2:
            _ref6 = _context4.sent;
            choiceItem = _ref6.choiceItem;
            _context4.next = 6;
            return createChoiceItem(choiceItem);

          case 6:
            object = _context4.sent;
            info = object.getInfo();


            expectChoiceItem(info, choiceItem);

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
            return createChoiceItem();

          case 2:
            object = _context5.sent;


            expect(new _2.ChoiceItem(object).getObject()).toBe(object);

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
            return createChoiceItem();

          case 2:
            object = _context6.sent;


            expect(new _2.ChoiceItem(object).getId()).toBe(object.id);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  test('updateInfo should update object info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var object, _ref10, updatedChoiceItem, info;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return createChoiceItem();

          case 2:
            object = _context7.sent;
            _context7.next = 5;
            return createChoiceItemInfo();

          case 5:
            _ref10 = _context7.sent;
            updatedChoiceItem = _ref10.choiceItem;


            object.updateInfo(updatedChoiceItem);

            info = object.getInfo();


            expectChoiceItem(info, updatedChoiceItem);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  test('getInfo should return provided info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref12, choiceItem, object, info;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return createChoiceItemInfo();

          case 2:
            _ref12 = _context8.sent;
            choiceItem = _ref12.choiceItem;
            _context8.next = 6;
            return createChoiceItem(choiceItem);

          case 6:
            object = _context8.sent;
            info = object.getInfo();


            expect(info.get('id')).toBe(object.getId());
            expectChoiceItem(info, choiceItem);

          case 10:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});