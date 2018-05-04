'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectRequestLog = exports.createRequestLog = exports.createRequestLogInfo = undefined;

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _TestHelper = require('../../../TestHelper');

var _TestHelper2 = _interopRequireDefault(_TestHelper);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();

var createRequestLogInfo = exports.createRequestLogInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var user, requestLog;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _TestHelper2.default.createUser();

          case 2:
            user = _context.sent;
            requestLog = (0, _immutable.Map)({
              appVersion: chance.string(),
              requestType: chance.string(),
              userId: user.id
            });
            return _context.abrupt('return', {
              requestLog: requestLog,
              user: user
            });

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createRequestLogInfo() {
    return _ref.apply(this, arguments);
  };
}();

var createRequestLog = exports.createRequestLog = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(object) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _.RequestLog;
            _context2.t1 = object;

            if (_context2.t1) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return createRequestLogInfo();

          case 5:
            _context2.t1 = _context2.sent.requestLog;

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

  return function createRequestLog(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var expectRequestLog = exports.expectRequestLog = function expectRequestLog(object, expectedObject) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      requestLogId = _ref3.requestLogId;

  expect(object.get('appVersion')).toBe(expectedObject.get('appVersion'));
  expect(object.get('requestType')).toBe(expectedObject.get('requestType'));
  expect(object.get('userId')).toBe(expectedObject.get('userId'));

  if (requestLogId) {
    expect(object.get('id')).toBe(requestLogId);
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
            return createRequestLog();

          case 3:
            _context3.t1 = _context3.sent.className;
            (0, _context3.t0)(_context3.t1).toBe('RequestLog');

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
    var _ref6, requestLog, object, info;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return createRequestLogInfo();

          case 2:
            _ref6 = _context4.sent;
            requestLog = _ref6.requestLog;
            _context4.next = 6;
            return createRequestLog(requestLog);

          case 6:
            object = _context4.sent;
            info = object.getInfo();


            expectRequestLog(info, requestLog);

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
            return createRequestLog();

          case 2:
            object = _context5.sent;


            expect(new _.RequestLog(object).getObject()).toBe(object);

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
            return createRequestLog();

          case 2:
            object = _context6.sent;


            expect(new _.RequestLog(object).getId()).toBe(object.id);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  test('updateInfo should update object info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var object, _ref10, updatedRequestLog, info;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return createRequestLog();

          case 2:
            object = _context7.sent;
            _context7.next = 5;
            return createRequestLogInfo();

          case 5:
            _ref10 = _context7.sent;
            updatedRequestLog = _ref10.requestLog;


            object.updateInfo(updatedRequestLog);

            info = object.getInfo();


            expectRequestLog(info, updatedRequestLog);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  test('getInfo should return provided info', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref12, requestLog, object, info;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return createRequestLogInfo();

          case 2:
            _ref12 = _context8.sent;
            requestLog = _ref12.requestLog;
            _context8.next = 6;
            return createRequestLog(requestLog);

          case 6:
            object = _context8.sent;
            info = object.getInfo();


            expect(info.get('id')).toBe(object.getId());
            expectRequestLog(info, requestLog);

          case 10:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});