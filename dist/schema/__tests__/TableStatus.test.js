'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectTableStatus = exports.createTableStatus = exports.createTableStatusInfo = undefined;

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

require('../../../bootstrap');

var _TestHelper = require('../../../TestHelper');

var _TestHelper2 = _interopRequireDefault(_TestHelper);

var _ = require('../');

var _TableService = require('../../services/__tests__/TableService.test');

var _TableService2 = _interopRequireDefault(_TableService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();

var createTableStatusInfo = exports.createTableStatusInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var table, user, tableStatus;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _TableService2.default)(1);

          case 2:
            table = _context.sent.first();
            _context.next = 5;
            return _TestHelper2.default.createUser();

          case 5:
            user = _context.sent;
            tableStatus = (0, _immutable.Map)({
              status: chance.string(),
              tableId: table.get('id'),
              userId: user.id
            });
            return _context.abrupt('return', {
              tableStatus: tableStatus,
              table: table,
              user: user
            });

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createTableStatusInfo() {
    return _ref.apply(this, arguments);
  };
}();

var createTableStatus = exports.createTableStatus = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(object) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _.TableStatus;
            _context2.t1 = object;

            if (_context2.t1) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return createTableStatusInfo();

          case 5:
            _context2.t1 = _context2.sent.tableStatus;

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

  return function createTableStatus(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var expectTableStatus = exports.expectTableStatus = function expectTableStatus(object, expectedObject) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      tableStatusId = _ref3.tableStatusId,
      expectedTable = _ref3.expectedTable;

  expect(object.get('status')).toBe(expectedObject.get('status'));
  expect(object.get('tableId')).toBe(expectedObject.get('tableId'));
  expect(object.get('userId')).toBe(expectedObject.get('userId'));

  if (tableStatusId) {
    expect(object.get('id')).toBe(tableStatusId);
  }

  if (expectedTable) {
    expect(object.get('tableId')).toEqual(expectedTable.get('id'));
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
            return createTableStatus();

          case 3:
            _context3.t1 = _context3.sent.className;
            (0, _context3.t0)(_context3.t1).toBe('TableStatus');

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
    var _ref6, tableStatus, object, info;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return createTableStatusInfo();

          case 2:
            _ref6 = _context4.sent;
            tableStatus = _ref6.tableStatus;
            _context4.next = 6;
            return createTableStatus(tableStatus);

          case 6:
            object = _context4.sent;
            info = object.getInfo();


            expectTableStatus(info, tableStatus);

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
            return createTableStatus();

          case 2:
            object = _context5.sent;


            expect(new _.TableStatus(object).getObject()).toBe(object);

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
            return createTableStatus();

          case 2:
            object = _context6.sent;


            expect(new _.TableStatus(object).getId()).toBe(object.id);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  test('updateInfo should update object info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var object, _ref10, updatedTableStatus, info;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return createTableStatus();

          case 2:
            object = _context7.sent;
            _context7.next = 5;
            return createTableStatusInfo();

          case 5:
            _ref10 = _context7.sent;
            updatedTableStatus = _ref10.tableStatus;


            object.updateInfo(updatedTableStatus);

            info = object.getInfo();


            expectTableStatus(info, updatedTableStatus);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  test('getInfo should return provided info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref12, tableStatus, object, info;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return createTableStatusInfo();

          case 2:
            _ref12 = _context8.sent;
            tableStatus = _ref12.tableStatus;
            _context8.next = 6;
            return createTableStatus(tableStatus);

          case 6:
            object = _context8.sent;
            info = object.getInfo();


            expect(info.get('id')).toBe(object.getId());
            expectTableStatus(info, tableStatus);

          case 10:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});