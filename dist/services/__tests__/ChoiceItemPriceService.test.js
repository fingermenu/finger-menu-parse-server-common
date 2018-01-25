'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

require('../../../bootstrap');

var _2 = require('../');

var _ChoiceItemPrice = require('../../schema/__tests__/ChoiceItemPrice.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();
var choiceItemPriceService = new _2.ChoiceItemPriceService();

var createCriteriaWthoutConditions = function createCriteriaWthoutConditions() {
  return (0, _immutable.Map)({
    fields: _immutable.List.of('currentPrice', 'wasPrice', 'validFrom', 'validUntil', 'choiceItem', 'size', 'addedByUser', 'removedByUser'),
    include_choiceItem: true,
    include_size: true,
    include_addedByUser: true,
    include_removedByUser: true
  });
};

var createCriteria = function createCriteria(object) {
  return (0, _immutable.Map)({
    conditions: (0, _immutable.Map)({
      currentPrice: object ? object.get('currentPrice') : chance.floating({ min: 0, max: 1000 }),
      wasPrice: object ? object.get('wasPrice') : chance.floating({ min: 0, max: 1000 }),
      validFrom: object ? object.get('validFrom') : new Date(),
      validUntil: object ? object.get('validUntil') : new Date(),
      choiceItemId: object ? object.get('choiceItemId') : chance.string(),
      sizeId: object ? object.get('sizeId') : chance.string(),
      addedByUserId: object ? object.get('addedByUserId') : chance.string(),
      removedByUserId: object ? object.get('removedByUserId') : chance.string()
    })
  }).merge(createCriteriaWthoutConditions());
};

var createChoiceItemPrices = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(count) {
    var useSameInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var choiceItemPrice, _ref2, tempChoiceItemPrice;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            choiceItemPrice = void 0;

            if (!useSameInfo) {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 4:
            _ref2 = _context2.sent;
            tempChoiceItemPrice = _ref2.choiceItemPrice;


            choiceItemPrice = tempChoiceItemPrice;

          case 7:
            _context2.t0 = _immutable2.default;
            _context2.next = 10;
            return Promise.all((0, _immutable.Range)(0, count).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var finalChoiceItemPrice, _ref4, _tempChoiceItemPrice;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      finalChoiceItemPrice = void 0;

                      if (!useSameInfo) {
                        _context.next = 5;
                        break;
                      }

                      finalChoiceItemPrice = choiceItemPrice;
                      _context.next = 10;
                      break;

                    case 5:
                      _context.next = 7;
                      return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

                    case 7:
                      _ref4 = _context.sent;
                      _tempChoiceItemPrice = _ref4.choiceItemPrice;


                      finalChoiceItemPrice = _tempChoiceItemPrice;

                    case 10:
                      _context.t0 = choiceItemPriceService;
                      _context.next = 13;
                      return choiceItemPriceService.create(finalChoiceItemPrice);

                    case 13:
                      _context.t1 = _context.sent;
                      _context.t2 = createCriteriaWthoutConditions();
                      return _context.abrupt('return', _context.t0.read.call(_context.t0, _context.t1, _context.t2));

                    case 16:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined);
            }))).toArray());

          case 10:
            _context2.t1 = _context2.sent;
            return _context2.abrupt('return', _context2.t0.fromJS.call(_context2.t0, _context2.t1));

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function createChoiceItemPrices(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = createChoiceItemPrices;


describe('create', function () {
  test('should return the created choice item price Id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var choiceItemPriceId;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = choiceItemPriceService;
            _context3.next = 3;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 3:
            _context3.t1 = _context3.sent.choiceItemPrice;
            _context3.next = 6;
            return _context3.t0.create.call(_context3.t0, _context3.t1);

          case 6:
            choiceItemPriceId = _context3.sent;


            expect(choiceItemPriceId).toBeDefined();

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  test('should create the choice item price', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _ref7, choiceItemPrice, choiceItemPriceId, fetchedChoiceItemPrice;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 2:
            _ref7 = _context4.sent;
            choiceItemPrice = _ref7.choiceItemPrice;
            _context4.next = 6;
            return choiceItemPriceService.create(choiceItemPrice);

          case 6:
            choiceItemPriceId = _context4.sent;
            _context4.next = 9;
            return choiceItemPriceService.read(choiceItemPriceId, createCriteriaWthoutConditions());

          case 9:
            fetchedChoiceItemPrice = _context4.sent;


            expect(fetchedChoiceItemPrice).toBeDefined();

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe('read', function () {
  test('should reject if the provided choice item price Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var choiceItemPriceId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            choiceItemPriceId = chance.string();
            _context5.prev = 1;
            _context5.next = 4;
            return choiceItemPriceService.read(choiceItemPriceId);

          case 4:
            _context5.next = 9;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5['catch'](1);

            expect(_context5.t0.message).toBe('No choice item price found with Id: ' + choiceItemPriceId);

          case 9:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[1, 6]]);
  })));

  test('should read the existing choice item price', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var _ref10, expectedChoiceItemPrice, expectedChoiceItem, expectedSize, expectedAddedByUser, expectedRemovedByUser, choiceItemPriceId, choiceItemPrice;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 2:
            _ref10 = _context6.sent;
            expectedChoiceItemPrice = _ref10.choiceItemPrice;
            expectedChoiceItem = _ref10.choiceItem;
            expectedSize = _ref10.size;
            expectedAddedByUser = _ref10.addedByUser;
            expectedRemovedByUser = _ref10.removedByUser;
            _context6.next = 10;
            return choiceItemPriceService.create(expectedChoiceItemPrice);

          case 10:
            choiceItemPriceId = _context6.sent;
            _context6.next = 13;
            return choiceItemPriceService.read(choiceItemPriceId, createCriteriaWthoutConditions());

          case 13:
            choiceItemPrice = _context6.sent;


            (0, _ChoiceItemPrice.expectChoiceItemPrice)(choiceItemPrice, expectedChoiceItemPrice, {
              choiceItemPriceId: choiceItemPriceId,
              expectedChoiceItem: expectedChoiceItem,
              expectedSize: expectedSize,
              expectedAddedByUser: expectedAddedByUser,
              expectedRemovedByUser: expectedRemovedByUser
            });

          case 15:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));
});

describe('update', function () {
  test('should reject if the provided choice item price Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var choiceItemPriceId, choiceItemPrice;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            choiceItemPriceId = chance.string();
            _context7.prev = 1;
            _context7.t0 = choiceItemPriceService;
            _context7.t1 = choiceItemPriceService;
            _context7.next = 6;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 6:
            _context7.t2 = _context7.sent.choiceItemPrice;
            _context7.next = 9;
            return _context7.t1.create.call(_context7.t1, _context7.t2);

          case 9:
            _context7.t3 = _context7.sent;
            _context7.t4 = createCriteriaWthoutConditions();
            _context7.next = 13;
            return _context7.t0.read.call(_context7.t0, _context7.t3, _context7.t4);

          case 13:
            choiceItemPrice = _context7.sent;
            _context7.next = 16;
            return choiceItemPriceService.update(choiceItemPrice.set('id', choiceItemPriceId));

          case 16:
            _context7.next = 21;
            break;

          case 18:
            _context7.prev = 18;
            _context7.t5 = _context7['catch'](1);

            expect(_context7.t5.message).toBe('No choice item price found with Id: ' + choiceItemPriceId);

          case 21:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[1, 18]]);
  })));

  test('should return the Id of the updated choice item price', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref13, expectedChoiceItemPrice, choiceItemPriceId, id;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 2:
            _ref13 = _context8.sent;
            expectedChoiceItemPrice = _ref13.choiceItemPrice;
            _context8.t0 = choiceItemPriceService;
            _context8.next = 7;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 7:
            _context8.t1 = _context8.sent.choiceItemPrice;
            _context8.next = 10;
            return _context8.t0.create.call(_context8.t0, _context8.t1);

          case 10:
            choiceItemPriceId = _context8.sent;
            _context8.next = 13;
            return choiceItemPriceService.update(expectedChoiceItemPrice.set('id', choiceItemPriceId));

          case 13:
            id = _context8.sent;


            expect(id).toBe(choiceItemPriceId);

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  test('should update the existing choice item price', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var _ref15, expectedChoiceItemPrice, expectedChoiceItem, expectedSize, expectedAddedByUser, expectedRemovedByUser, choiceItemPriceId, choiceItemPrice;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 2:
            _ref15 = _context9.sent;
            expectedChoiceItemPrice = _ref15.choiceItemPrice;
            expectedChoiceItem = _ref15.choiceItem;
            expectedSize = _ref15.size;
            expectedAddedByUser = _ref15.addedByUser;
            expectedRemovedByUser = _ref15.removedByUser;
            _context9.t0 = choiceItemPriceService;
            _context9.next = 11;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 11:
            _context9.t1 = _context9.sent.choiceItemPrice;
            _context9.next = 14;
            return _context9.t0.create.call(_context9.t0, _context9.t1);

          case 14:
            choiceItemPriceId = _context9.sent;
            _context9.next = 17;
            return choiceItemPriceService.update(expectedChoiceItemPrice.set('id', choiceItemPriceId));

          case 17:
            _context9.next = 19;
            return choiceItemPriceService.read(choiceItemPriceId, createCriteriaWthoutConditions());

          case 19:
            choiceItemPrice = _context9.sent;


            (0, _ChoiceItemPrice.expectChoiceItemPrice)(choiceItemPrice, expectedChoiceItemPrice, {
              choiceItemPriceId: choiceItemPriceId,
              expectedChoiceItem: expectedChoiceItem,
              expectedSize: expectedSize,
              expectedAddedByUser: expectedAddedByUser,
              expectedRemovedByUser: expectedRemovedByUser
            });

          case 21:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));
});

describe('delete', function () {
  test('should reject if the provided choice item price Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var choiceItemPriceId;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            choiceItemPriceId = chance.string();
            _context10.prev = 1;
            _context10.next = 4;
            return choiceItemPriceService.delete(choiceItemPriceId);

          case 4:
            _context10.next = 9;
            break;

          case 6:
            _context10.prev = 6;
            _context10.t0 = _context10['catch'](1);

            expect(_context10.t0.message).toBe('No choice item price found with Id: ' + choiceItemPriceId);

          case 9:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[1, 6]]);
  })));

  test('should delete the existing choice item price', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var choiceItemPriceId;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.t0 = choiceItemPriceService;
            _context11.next = 3;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 3:
            _context11.t1 = _context11.sent.choiceItemPrice;
            _context11.next = 6;
            return _context11.t0.create.call(_context11.t0, _context11.t1);

          case 6:
            choiceItemPriceId = _context11.sent;
            _context11.next = 9;
            return choiceItemPriceService.delete(choiceItemPriceId);

          case 9:
            _context11.prev = 9;
            _context11.next = 12;
            return choiceItemPriceService.delete(choiceItemPriceId);

          case 12:
            _context11.next = 17;
            break;

          case 14:
            _context11.prev = 14;
            _context11.t2 = _context11['catch'](9);

            expect(_context11.t2.message).toBe('No choice item price found with Id: ' + choiceItemPriceId);

          case 17:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[9, 14]]);
  })));
});

describe('search', function () {
  test('should return no choice item price if provided criteria matches no choice item price', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var choiceItemPrices;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return choiceItemPriceService.search(createCriteria());

          case 2:
            choiceItemPrices = _context12.sent;


            expect(choiceItemPrices.count()).toBe(0);

          case 4:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  test('should return the choice item price matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var _ref20, expectedChoiceItemPrice, expectedChoiceItem, expectedSize, expectedAddedByUser, expectedRemovedByUser, results, choiceItemPrices;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 2:
            _ref20 = _context14.sent;
            expectedChoiceItemPrice = _ref20.choiceItemPrice;
            expectedChoiceItem = _ref20.choiceItem;
            expectedSize = _ref20.size;
            expectedAddedByUser = _ref20.addedByUser;
            expectedRemovedByUser = _ref20.removedByUser;
            _context14.t0 = _immutable2.default;
            _context14.next = 11;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 1, max: 10 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
              return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      return _context13.abrupt('return', choiceItemPriceService.create(expectedChoiceItemPrice));

                    case 1:
                    case 'end':
                      return _context13.stop();
                  }
                }
              }, _callee13, undefined);
            }))).toArray());

          case 11:
            _context14.t1 = _context14.sent;
            results = _context14.t0.fromJS.call(_context14.t0, _context14.t1);
            _context14.next = 15;
            return choiceItemPriceService.search(createCriteria(expectedChoiceItemPrice));

          case 15:
            choiceItemPrices = _context14.sent;


            expect(choiceItemPrices.count).toBe(results.count);
            choiceItemPrices.forEach(function (choiceItemPrice) {
              expect(results.find(function (_) {
                return _.localeCompare(choiceItemPrice.get('id')) === 0;
              })).toBeDefined();
              (0, _ChoiceItemPrice.expectChoiceItemPrice)(choiceItemPrice, expectedChoiceItemPrice, {
                choiceItemPriceId: choiceItemPrice.get('id'),
                expectedChoiceItem: expectedChoiceItem,
                expectedSize: expectedSize,
                expectedAddedByUser: expectedAddedByUser,
                expectedRemovedByUser: expectedRemovedByUser
              });
            });

          case 18:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));
});

describe('searchAll', function () {
  test('should return no choice item price if provided criteria matches no choice item price', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var choiceItemPrices, result;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            choiceItemPrices = (0, _immutable.List)();
            result = choiceItemPriceService.searchAll(createCriteria());
            _context15.prev = 2;

            result.event.subscribe(function (info) {
              choiceItemPrices = choiceItemPrices.push(info);
            });

            _context15.next = 6;
            return result.promise;

          case 6:
            _context15.prev = 6;

            result.event.unsubscribeAll();
            return _context15.finish(6);

          case 9:

            expect(choiceItemPrices.count()).toBe(0);

          case 10:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined, [[2,, 6, 9]]);
  })));

  test('should return the choice item price matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var _ref24, expectedChoiceItemPrice, expectedChoiceItem, expectedSize, expectedAddedByUser, expectedRemovedByUser, results, choiceItemPrices, result;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _ChoiceItemPrice.createChoiceItemPriceInfo)();

          case 2:
            _ref24 = _context17.sent;
            expectedChoiceItemPrice = _ref24.choiceItemPrice;
            expectedChoiceItem = _ref24.choiceItem;
            expectedSize = _ref24.size;
            expectedAddedByUser = _ref24.addedByUser;
            expectedRemovedByUser = _ref24.removedByUser;
            _context17.t0 = _immutable2.default;
            _context17.next = 11;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 2, max: 5 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
              return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                  switch (_context16.prev = _context16.next) {
                    case 0:
                      return _context16.abrupt('return', choiceItemPriceService.create(expectedChoiceItemPrice));

                    case 1:
                    case 'end':
                      return _context16.stop();
                  }
                }
              }, _callee16, undefined);
            }))).toArray());

          case 11:
            _context17.t1 = _context17.sent;
            results = _context17.t0.fromJS.call(_context17.t0, _context17.t1);
            choiceItemPrices = (0, _immutable.List)();
            result = choiceItemPriceService.searchAll(createCriteria(expectedChoiceItemPrice));
            _context17.prev = 15;

            result.event.subscribe(function (info) {
              choiceItemPrices = choiceItemPrices.push(info);
            });

            _context17.next = 19;
            return result.promise;

          case 19:
            _context17.prev = 19;

            result.event.unsubscribeAll();
            return _context17.finish(19);

          case 22:

            expect(choiceItemPrices.count).toBe(results.count);
            choiceItemPrices.forEach(function (choiceItemPrice) {
              expect(results.find(function (_) {
                return _.localeCompare(choiceItemPrice.get('id')) === 0;
              })).toBeDefined();
              (0, _ChoiceItemPrice.expectChoiceItemPrice)(choiceItemPrice, expectedChoiceItemPrice, {
                choiceItemPriceId: choiceItemPrice.get('id'),
                expectedChoiceItem: expectedChoiceItem,
                expectedSize: expectedSize,
                expectedAddedByUser: expectedAddedByUser,
                expectedRemovedByUser: expectedRemovedByUser
              });
            });

          case 24:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined, [[15,, 19, 22]]);
  })));
});

describe('exists', function () {
  test('should return false if no choice item price match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.t0 = expect;
            _context18.next = 3;
            return choiceItemPriceService.exists(createCriteria());

          case 3:
            _context18.t1 = _context18.sent;
            (0, _context18.t0)(_context18.t1).toBeFalsy();

          case 5:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, undefined);
  })));

  test('should return true if any choice item price match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var choiceItemPrices;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return createChoiceItemPrices(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            choiceItemPrices = _context19.sent;
            _context19.t0 = expect;
            _context19.next = 6;
            return choiceItemPriceService.exists(createCriteria(choiceItemPrices.first()));

          case 6:
            _context19.t1 = _context19.sent;
            (0, _context19.t0)(_context19.t1).toBeTruthy();

          case 8:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, undefined);
  })));
});

describe('count', function () {
  test('should return 0 if no choice item price match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.t0 = expect;
            _context20.next = 3;
            return choiceItemPriceService.count(createCriteria());

          case 3:
            _context20.t1 = _context20.sent;
            (0, _context20.t0)(_context20.t1).toBe(0);

          case 5:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  })));

  test('should return the count of choice item price match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
    var choiceItemPrices;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return createChoiceItemPrices(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            choiceItemPrices = _context21.sent;
            _context21.t0 = expect;
            _context21.next = 6;
            return choiceItemPriceService.count(createCriteria(choiceItemPrices.first()));

          case 6:
            _context21.t1 = _context21.sent;
            _context21.t2 = choiceItemPrices.count();
            (0, _context21.t0)(_context21.t1).toBe(_context21.t2);

          case 9:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  })));
});