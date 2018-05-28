'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

require('../../../bootstrap');

var _2 = require('..');

var _ChoiceItem = require('../../schema/__tests__/ChoiceItem.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();
var choiceItemService = new _2.ChoiceItemService();

var getLanguages = function getLanguages(object) {
  var languages = object ? object.get('name').keySeq() : (0, _immutable.List)();
  var language = languages.isEmpty() ? null : languages.first();

  return { languages: languages, language: language };
};

var createCriteriaWthoutConditions = function createCriteriaWthoutConditions(languages, language) {
  return (0, _immutable.Map)({
    fields: _immutable.List.of('languages_name', 'languages_description', 'choiceItemPageUrl', 'imageUrl', 'tags', 'ownedByUser', 'maintainedByUsers').concat(languages ? languages.map(function (_) {
      return _ + '_name';
    }) : (0, _immutable.List)()).concat(languages ? languages.map(function (_) {
      return _ + '_description';
    }) : (0, _immutable.List)()),
    language: language,
    include_tags: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true
  });
};

var createCriteria = function createCriteria(object) {
  var _getLanguages = getLanguages(object),
      language = _getLanguages.language,
      languages = _getLanguages.languages;

  return (0, _immutable.Map)({
    conditions: (0, _immutable.Map)({
      choiceItemPageUrl: object ? object.get('choiceItemPageUrl') : chance.string(),
      imageUrl: object ? object.get('imageUrl') : chance.string(),
      tagIds: object ? object.get('tagIds') : _immutable.List.of(chance.string(), chance.string()),
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : _immutable.List.of(chance.string(), chance.string())
    })
  }).merge(createCriteriaWthoutConditions(languages, language));
};

var createChoiceItems = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(count) {
    var useSameInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var choiceItem, _ref2, tempChoiceItem;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            choiceItem = void 0;

            if (!useSameInfo) {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 4:
            _ref2 = _context2.sent;
            tempChoiceItem = _ref2.choiceItem;


            choiceItem = tempChoiceItem;

          case 7:
            _context2.t0 = _immutable2.default;
            _context2.next = 10;
            return Promise.all((0, _immutable.Range)(0, count).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var finalChoiceItem, _ref4, _tempChoiceItem;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      finalChoiceItem = void 0;

                      if (!useSameInfo) {
                        _context.next = 5;
                        break;
                      }

                      finalChoiceItem = choiceItem;
                      _context.next = 10;
                      break;

                    case 5:
                      _context.next = 7;
                      return (0, _ChoiceItem.createChoiceItemInfo)();

                    case 7:
                      _ref4 = _context.sent;
                      _tempChoiceItem = _ref4.choiceItem;


                      finalChoiceItem = _tempChoiceItem;

                    case 10:
                      _context.t0 = choiceItemService;
                      _context.next = 13;
                      return choiceItemService.create(finalChoiceItem);

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

  return function createChoiceItems(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = createChoiceItems;


describe('create', function () {
  test('should return the created choice item Id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var choiceItemId;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = choiceItemService;
            _context3.next = 3;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 3:
            _context3.t1 = _context3.sent.choiceItem;
            _context3.next = 6;
            return _context3.t0.create.call(_context3.t0, _context3.t1);

          case 6:
            choiceItemId = _context3.sent;


            expect(choiceItemId).toBeDefined();

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  test('should create the choice item', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _ref7, choiceItem, choiceItemId, fetchedChoiceItem;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 2:
            _ref7 = _context4.sent;
            choiceItem = _ref7.choiceItem;
            _context4.next = 6;
            return choiceItemService.create(choiceItem);

          case 6:
            choiceItemId = _context4.sent;
            _context4.next = 9;
            return choiceItemService.read(choiceItemId, createCriteriaWthoutConditions());

          case 9:
            fetchedChoiceItem = _context4.sent;


            expect(fetchedChoiceItem).toBeDefined();

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe('read', function () {
  test('should reject if the provided choice item Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var choiceItemId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            choiceItemId = chance.string();
            _context5.prev = 1;
            _context5.next = 4;
            return choiceItemService.read(choiceItemId);

          case 4:
            _context5.next = 9;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5['catch'](1);

            expect(_context5.t0.message).toBe('No choice item found with Id: ' + choiceItemId);

          case 9:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[1, 6]]);
  })));

  test('should read the existing choice item', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var _ref10, expectedChoiceItem, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, choiceItemId, choiceItem;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 2:
            _ref10 = _context6.sent;
            expectedChoiceItem = _ref10.choiceItem;
            expectedTags = _ref10.tags;
            expectedOwnedByUser = _ref10.ownedByUser;
            expectedMaintainedByUsers = _ref10.maintainedByUsers;
            _context6.next = 9;
            return choiceItemService.create(expectedChoiceItem);

          case 9:
            choiceItemId = _context6.sent;
            _context6.next = 12;
            return choiceItemService.read(choiceItemId, createCriteriaWthoutConditions());

          case 12:
            choiceItem = _context6.sent;


            (0, _ChoiceItem.expectChoiceItem)(choiceItem, expectedChoiceItem, {
              choiceItemId: choiceItemId,
              expectedTags: expectedTags,
              expectedOwnedByUser: expectedOwnedByUser,
              expectedMaintainedByUsers: expectedMaintainedByUsers
            });

          case 14:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));
});

describe('update', function () {
  test('should reject if the provided choice item Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var choiceItemId, choiceItem;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            choiceItemId = chance.string();
            _context7.prev = 1;
            _context7.t0 = choiceItemService;
            _context7.t1 = choiceItemService;
            _context7.next = 6;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 6:
            _context7.t2 = _context7.sent.choiceItem;
            _context7.next = 9;
            return _context7.t1.create.call(_context7.t1, _context7.t2);

          case 9:
            _context7.t3 = _context7.sent;
            _context7.t4 = createCriteriaWthoutConditions();
            _context7.next = 13;
            return _context7.t0.read.call(_context7.t0, _context7.t3, _context7.t4);

          case 13:
            choiceItem = _context7.sent;
            _context7.next = 16;
            return choiceItemService.update(choiceItem.set('id', choiceItemId));

          case 16:
            _context7.next = 21;
            break;

          case 18:
            _context7.prev = 18;
            _context7.t5 = _context7['catch'](1);

            expect(_context7.t5.message).toBe('No choice item found with Id: ' + choiceItemId);

          case 21:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[1, 18]]);
  })));

  test('should return the Id of the updated choice item', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref13, expectedChoiceItem, choiceItemId, id;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 2:
            _ref13 = _context8.sent;
            expectedChoiceItem = _ref13.choiceItem;
            _context8.t0 = choiceItemService;
            _context8.next = 7;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 7:
            _context8.t1 = _context8.sent.choiceItem;
            _context8.next = 10;
            return _context8.t0.create.call(_context8.t0, _context8.t1);

          case 10:
            choiceItemId = _context8.sent;
            _context8.next = 13;
            return choiceItemService.update(expectedChoiceItem.set('id', choiceItemId));

          case 13:
            id = _context8.sent;


            expect(id).toBe(choiceItemId);

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  test('should update the existing choice item', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var _ref15, expectedChoiceItem, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, choiceItemId, choiceItem;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 2:
            _ref15 = _context9.sent;
            expectedChoiceItem = _ref15.choiceItem;
            expectedTags = _ref15.tags;
            expectedOwnedByUser = _ref15.ownedByUser;
            expectedMaintainedByUsers = _ref15.maintainedByUsers;
            _context9.t0 = choiceItemService;
            _context9.next = 10;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 10:
            _context9.t1 = _context9.sent.choiceItem;
            _context9.next = 13;
            return _context9.t0.create.call(_context9.t0, _context9.t1);

          case 13:
            choiceItemId = _context9.sent;
            _context9.next = 16;
            return choiceItemService.update(expectedChoiceItem.set('id', choiceItemId));

          case 16:
            _context9.next = 18;
            return choiceItemService.read(choiceItemId, createCriteriaWthoutConditions());

          case 18:
            choiceItem = _context9.sent;


            (0, _ChoiceItem.expectChoiceItem)(choiceItem, expectedChoiceItem, {
              choiceItemId: choiceItemId,
              expectedTags: expectedTags,
              expectedOwnedByUser: expectedOwnedByUser,
              expectedMaintainedByUsers: expectedMaintainedByUsers
            });

          case 20:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));
});

describe('delete', function () {
  test('should reject if the provided choice item Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var choiceItemId;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            choiceItemId = chance.string();
            _context10.prev = 1;
            _context10.next = 4;
            return choiceItemService.delete(choiceItemId);

          case 4:
            _context10.next = 9;
            break;

          case 6:
            _context10.prev = 6;
            _context10.t0 = _context10['catch'](1);

            expect(_context10.t0.message).toBe('No choice item found with Id: ' + choiceItemId);

          case 9:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[1, 6]]);
  })));

  test('should delete the existing choice item', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var choiceItemId;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.t0 = choiceItemService;
            _context11.next = 3;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 3:
            _context11.t1 = _context11.sent.choiceItem;
            _context11.next = 6;
            return _context11.t0.create.call(_context11.t0, _context11.t1);

          case 6:
            choiceItemId = _context11.sent;
            _context11.next = 9;
            return choiceItemService.delete(choiceItemId);

          case 9:
            _context11.prev = 9;
            _context11.next = 12;
            return choiceItemService.delete(choiceItemId);

          case 12:
            _context11.next = 17;
            break;

          case 14:
            _context11.prev = 14;
            _context11.t2 = _context11['catch'](9);

            expect(_context11.t2.message).toBe('No choice item found with Id: ' + choiceItemId);

          case 17:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[9, 14]]);
  })));
});

describe('search', function () {
  test('should return no choice item if provided criteria matches no choice item', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var choiceItems;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return choiceItemService.search(createCriteria());

          case 2:
            choiceItems = _context12.sent;


            expect(choiceItems.count()).toBe(0);

          case 4:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  test('should return the choice item matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var _ref20, expectedChoiceItem, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, results, choiceItems;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 2:
            _ref20 = _context14.sent;
            expectedChoiceItem = _ref20.choiceItem;
            expectedTags = _ref20.tags;
            expectedOwnedByUser = _ref20.ownedByUser;
            expectedMaintainedByUsers = _ref20.maintainedByUsers;
            _context14.t0 = _immutable2.default;
            _context14.next = 10;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 1, max: 10 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
              return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      return _context13.abrupt('return', choiceItemService.create(expectedChoiceItem));

                    case 1:
                    case 'end':
                      return _context13.stop();
                  }
                }
              }, _callee13, undefined);
            }))).toArray());

          case 10:
            _context14.t1 = _context14.sent;
            results = _context14.t0.fromJS.call(_context14.t0, _context14.t1);
            _context14.next = 14;
            return choiceItemService.search(createCriteria(expectedChoiceItem));

          case 14:
            choiceItems = _context14.sent;


            expect(choiceItems.count).toBe(results.count);
            choiceItems.forEach(function (choiceItem) {
              expect(results.find(function (_) {
                return _.localeCompare(choiceItem.get('id')) === 0;
              })).toBeDefined();
              (0, _ChoiceItem.expectChoiceItem)(choiceItem, expectedChoiceItem, {
                choiceItemId: choiceItem.get('id'),
                expectedTags: expectedTags,
                expectedOwnedByUser: expectedOwnedByUser,
                expectedMaintainedByUsers: expectedMaintainedByUsers
              });
            });

          case 17:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));
});

describe('searchAll', function () {
  test('should return no choice item if provided criteria matches no choice item', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var choiceItems, result;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            choiceItems = (0, _immutable.List)();
            result = choiceItemService.searchAll(createCriteria());
            _context15.prev = 2;

            result.event.subscribe(function (info) {
              choiceItems = choiceItems.push(info);
            });

            _context15.next = 6;
            return result.promise;

          case 6:
            _context15.prev = 6;

            result.event.unsubscribeAll();
            return _context15.finish(6);

          case 9:

            expect(choiceItems.count()).toBe(0);

          case 10:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined, [[2,, 6, 9]]);
  })));

  test('should return the choice item matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var _ref24, expectedChoiceItem, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, results, choiceItems, result;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _ChoiceItem.createChoiceItemInfo)();

          case 2:
            _ref24 = _context17.sent;
            expectedChoiceItem = _ref24.choiceItem;
            expectedTags = _ref24.tags;
            expectedOwnedByUser = _ref24.ownedByUser;
            expectedMaintainedByUsers = _ref24.maintainedByUsers;
            _context17.t0 = _immutable2.default;
            _context17.next = 10;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 2, max: 5 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
              return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                  switch (_context16.prev = _context16.next) {
                    case 0:
                      return _context16.abrupt('return', choiceItemService.create(expectedChoiceItem));

                    case 1:
                    case 'end':
                      return _context16.stop();
                  }
                }
              }, _callee16, undefined);
            }))).toArray());

          case 10:
            _context17.t1 = _context17.sent;
            results = _context17.t0.fromJS.call(_context17.t0, _context17.t1);
            choiceItems = (0, _immutable.List)();
            result = choiceItemService.searchAll(createCriteria(expectedChoiceItem));
            _context17.prev = 14;

            result.event.subscribe(function (info) {
              choiceItems = choiceItems.push(info);
            });

            _context17.next = 18;
            return result.promise;

          case 18:
            _context17.prev = 18;

            result.event.unsubscribeAll();
            return _context17.finish(18);

          case 21:

            expect(choiceItems.count).toBe(results.count);
            choiceItems.forEach(function (choiceItem) {
              expect(results.find(function (_) {
                return _.localeCompare(choiceItem.get('id')) === 0;
              })).toBeDefined();
              (0, _ChoiceItem.expectChoiceItem)(choiceItem, expectedChoiceItem, {
                choiceItemId: choiceItem.get('id'),
                expectedTags: expectedTags,
                expectedOwnedByUser: expectedOwnedByUser,
                expectedMaintainedByUsers: expectedMaintainedByUsers
              });
            });

          case 23:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined, [[14,, 18, 21]]);
  })));
});

describe('exists', function () {
  test('should return false if no choice item match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.t0 = expect;
            _context18.next = 3;
            return choiceItemService.exists(createCriteria());

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

  test('should return true if any choice item match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var choiceItems;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return createChoiceItems(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            choiceItems = _context19.sent;
            _context19.t0 = expect;
            _context19.next = 6;
            return choiceItemService.exists(createCriteria(choiceItems.first()));

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
  test('should return 0 if no choice item match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.t0 = expect;
            _context20.next = 3;
            return choiceItemService.count(createCriteria());

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

  test('should return the count of choice item match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
    var choiceItems;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return createChoiceItems(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            choiceItems = _context21.sent;
            _context21.t0 = expect;
            _context21.next = 6;
            return choiceItemService.count(createCriteria(choiceItems.first()));

          case 6:
            _context21.t1 = _context21.sent;
            _context21.t2 = choiceItems.count();
            (0, _context21.t0)(_context21.t1).toBe(_context21.t2);

          case 9:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  })));
});