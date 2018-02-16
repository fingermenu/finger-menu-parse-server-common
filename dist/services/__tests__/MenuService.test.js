'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

require('../../../bootstrap');

var _TestHelper = require('../../../TestHelper');

var _TestHelper2 = _interopRequireDefault(_TestHelper);

var _2 = require('../');

var _Menu = require('../../schema/__tests__/Menu.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();
var menuService = new _2.MenuService();

var getLanguages = function getLanguages(object) {
  var languages = object ? object.get('name').keySeq() : (0, _immutable.List)();
  var language = languages.isEmpty() ? null : languages.first();

  return { languages: languages, language: language };
};

var createCriteriaWthoutConditions = function createCriteriaWthoutConditions(languages, language) {
  return (0, _immutable.Map)({
    fields: _immutable.List.of('languages_name', 'languages_description', 'menuPageUrl', 'imageUrl', 'menuItemPrices', 'tags', 'ownedByUser', 'maintainedByUsers', 'menuItemPriceSortOrderIndices').concat(languages ? languages.map(function (_) {
      return _ + '_name';
    }) : (0, _immutable.List)()).concat(languages ? languages.map(function (_) {
      return _ + '_description';
    }) : (0, _immutable.List)()),
    language: language,
    include_menuItemPrices: true,
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
      name: language ? object.get('name').get(language) : chance.string(),
      description: language ? object.get('description').get(language) : chance.string(),
      menuPageUrl: object ? object.get('menuPageUrl') : chance.string(),
      imageUrl: object ? object.get('imageUrl') : chance.string(),
      menuItemPriceIds: object ? object.get('menuItemPriceIds') : _immutable.List.of(chance.string(), chance.string()),
      tagIds: object ? object.get('tagIds') : _immutable.List.of(chance.string(), chance.string()),
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : _immutable.List.of(chance.string(), chance.string()),
      menuItemPriceSortOrderIndices: object ? object.get('menuItemPriceSortOrderIndices') : _TestHelper2.default.createRandomMap()
    })
  }).merge(createCriteriaWthoutConditions(languages, language));
};

var createMenus = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(count) {
    var useSameInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var menu, _ref2, tempMenu;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            menu = void 0;

            if (!useSameInfo) {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return (0, _Menu.createMenuInfo)();

          case 4:
            _ref2 = _context2.sent;
            tempMenu = _ref2.menu;


            menu = tempMenu;

          case 7:
            _context2.t0 = _immutable2.default;
            _context2.next = 10;
            return Promise.all((0, _immutable.Range)(0, count).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var finalMenu, _ref4, _tempMenu;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      finalMenu = void 0;

                      if (!useSameInfo) {
                        _context.next = 5;
                        break;
                      }

                      finalMenu = menu;
                      _context.next = 10;
                      break;

                    case 5:
                      _context.next = 7;
                      return (0, _Menu.createMenuInfo)();

                    case 7:
                      _ref4 = _context.sent;
                      _tempMenu = _ref4.menu;


                      finalMenu = _tempMenu;

                    case 10:
                      _context.t0 = menuService;
                      _context.next = 13;
                      return menuService.create(finalMenu);

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

  return function createMenus(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = createMenus;


describe('create', function () {
  test('should return the created menu Id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var menuId;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = menuService;
            _context3.next = 3;
            return (0, _Menu.createMenuInfo)();

          case 3:
            _context3.t1 = _context3.sent.menu;
            _context3.next = 6;
            return _context3.t0.create.call(_context3.t0, _context3.t1);

          case 6:
            menuId = _context3.sent;


            expect(menuId).toBeDefined();

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  test('should create the menu', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _ref7, menu, menuId, fetchedMenu;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _Menu.createMenuInfo)();

          case 2:
            _ref7 = _context4.sent;
            menu = _ref7.menu;
            _context4.next = 6;
            return menuService.create(menu);

          case 6:
            menuId = _context4.sent;
            _context4.next = 9;
            return menuService.read(menuId, createCriteriaWthoutConditions());

          case 9:
            fetchedMenu = _context4.sent;


            expect(fetchedMenu).toBeDefined();

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe('read', function () {
  test('should reject if the provided menu Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var menuId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            menuId = chance.string();
            _context5.prev = 1;
            _context5.next = 4;
            return menuService.read(menuId);

          case 4:
            _context5.next = 9;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5['catch'](1);

            expect(_context5.t0.message).toBe('No menu found with Id: ' + menuId);

          case 9:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[1, 6]]);
  })));

  test('should read the existing menu', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var _ref10, expectedMenu, expectedMenuItemPrices, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, menuId, menu;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _Menu.createMenuInfo)();

          case 2:
            _ref10 = _context6.sent;
            expectedMenu = _ref10.menu;
            expectedMenuItemPrices = _ref10.menuItemPrices;
            expectedTags = _ref10.tags;
            expectedOwnedByUser = _ref10.ownedByUser;
            expectedMaintainedByUsers = _ref10.maintainedByUsers;
            _context6.next = 10;
            return menuService.create(expectedMenu);

          case 10:
            menuId = _context6.sent;
            _context6.next = 13;
            return menuService.read(menuId, createCriteriaWthoutConditions());

          case 13:
            menu = _context6.sent;


            (0, _Menu.expectMenu)(menu, expectedMenu, {
              menuId: menuId,
              expectedMenuItemPrices: expectedMenuItemPrices,
              expectedTags: expectedTags,
              expectedOwnedByUser: expectedOwnedByUser,
              expectedMaintainedByUsers: expectedMaintainedByUsers
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
  test('should reject if the provided menu Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var menuId, menu;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            menuId = chance.string();
            _context7.prev = 1;
            _context7.t0 = menuService;
            _context7.t1 = menuService;
            _context7.next = 6;
            return (0, _Menu.createMenuInfo)();

          case 6:
            _context7.t2 = _context7.sent.menu;
            _context7.next = 9;
            return _context7.t1.create.call(_context7.t1, _context7.t2);

          case 9:
            _context7.t3 = _context7.sent;
            _context7.t4 = createCriteriaWthoutConditions();
            _context7.next = 13;
            return _context7.t0.read.call(_context7.t0, _context7.t3, _context7.t4);

          case 13:
            menu = _context7.sent;
            _context7.next = 16;
            return menuService.update(menu.set('id', menuId));

          case 16:
            _context7.next = 21;
            break;

          case 18:
            _context7.prev = 18;
            _context7.t5 = _context7['catch'](1);

            expect(_context7.t5.message).toBe('No menu found with Id: ' + menuId);

          case 21:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[1, 18]]);
  })));

  test('should return the Id of the updated menu', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref13, expectedMenu, menuId, id;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _Menu.createMenuInfo)();

          case 2:
            _ref13 = _context8.sent;
            expectedMenu = _ref13.menu;
            _context8.t0 = menuService;
            _context8.next = 7;
            return (0, _Menu.createMenuInfo)();

          case 7:
            _context8.t1 = _context8.sent.menu;
            _context8.next = 10;
            return _context8.t0.create.call(_context8.t0, _context8.t1);

          case 10:
            menuId = _context8.sent;
            _context8.next = 13;
            return menuService.update(expectedMenu.set('id', menuId));

          case 13:
            id = _context8.sent;


            expect(id).toBe(menuId);

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  test('should update the existing menu', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var _ref15, expectedMenu, expectedMenuItemPrices, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, menuId, menu;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _Menu.createMenuInfo)();

          case 2:
            _ref15 = _context9.sent;
            expectedMenu = _ref15.menu;
            expectedMenuItemPrices = _ref15.menuItemPrices;
            expectedTags = _ref15.tags;
            expectedOwnedByUser = _ref15.ownedByUser;
            expectedMaintainedByUsers = _ref15.maintainedByUsers;
            _context9.t0 = menuService;
            _context9.next = 11;
            return (0, _Menu.createMenuInfo)();

          case 11:
            _context9.t1 = _context9.sent.menu;
            _context9.next = 14;
            return _context9.t0.create.call(_context9.t0, _context9.t1);

          case 14:
            menuId = _context9.sent;
            _context9.next = 17;
            return menuService.update(expectedMenu.set('id', menuId));

          case 17:
            _context9.next = 19;
            return menuService.read(menuId, createCriteriaWthoutConditions());

          case 19:
            menu = _context9.sent;


            (0, _Menu.expectMenu)(menu, expectedMenu, {
              menuId: menuId,
              expectedMenuItemPrices: expectedMenuItemPrices,
              expectedTags: expectedTags,
              expectedOwnedByUser: expectedOwnedByUser,
              expectedMaintainedByUsers: expectedMaintainedByUsers
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
  test('should reject if the provided menu Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var menuId;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            menuId = chance.string();
            _context10.prev = 1;
            _context10.next = 4;
            return menuService.delete(menuId);

          case 4:
            _context10.next = 9;
            break;

          case 6:
            _context10.prev = 6;
            _context10.t0 = _context10['catch'](1);

            expect(_context10.t0.message).toBe('No menu found with Id: ' + menuId);

          case 9:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[1, 6]]);
  })));

  test('should delete the existing menu', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var menuId;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.t0 = menuService;
            _context11.next = 3;
            return (0, _Menu.createMenuInfo)();

          case 3:
            _context11.t1 = _context11.sent.menu;
            _context11.next = 6;
            return _context11.t0.create.call(_context11.t0, _context11.t1);

          case 6:
            menuId = _context11.sent;
            _context11.next = 9;
            return menuService.delete(menuId);

          case 9:
            _context11.prev = 9;
            _context11.next = 12;
            return menuService.delete(menuId);

          case 12:
            _context11.next = 17;
            break;

          case 14:
            _context11.prev = 14;
            _context11.t2 = _context11['catch'](9);

            expect(_context11.t2.message).toBe('No menu found with Id: ' + menuId);

          case 17:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[9, 14]]);
  })));
});

describe('search', function () {
  test('should return no menu if provided criteria matches no menu', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var menus;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return menuService.search(createCriteria());

          case 2:
            menus = _context12.sent;


            expect(menus.count()).toBe(0);

          case 4:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  test('should return the menu matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var _ref20, expectedMenu, expectedMenuItemPrices, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, results, menus;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _Menu.createMenuInfo)();

          case 2:
            _ref20 = _context14.sent;
            expectedMenu = _ref20.menu;
            expectedMenuItemPrices = _ref20.menuItemPrices;
            expectedTags = _ref20.tags;
            expectedOwnedByUser = _ref20.ownedByUser;
            expectedMaintainedByUsers = _ref20.maintainedByUsers;
            _context14.t0 = _immutable2.default;
            _context14.next = 11;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 1, max: 10 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
              return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      return _context13.abrupt('return', menuService.create(expectedMenu));

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
            return menuService.search(createCriteria(expectedMenu));

          case 15:
            menus = _context14.sent;


            expect(menus.count).toBe(results.count);
            menus.forEach(function (menu) {
              expect(results.find(function (_) {
                return _.localeCompare(menu.get('id')) === 0;
              })).toBeDefined();
              (0, _Menu.expectMenu)(menu, expectedMenu, {
                menuId: menu.get('id'),
                expectedMenuItemPrices: expectedMenuItemPrices,
                expectedTags: expectedTags,
                expectedOwnedByUser: expectedOwnedByUser,
                expectedMaintainedByUsers: expectedMaintainedByUsers
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
  test('should return no menu if provided criteria matches no menu', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var menus, result;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            menus = (0, _immutable.List)();
            result = menuService.searchAll(createCriteria());
            _context15.prev = 2;

            result.event.subscribe(function (info) {
              menus = menus.push(info);
            });

            _context15.next = 6;
            return result.promise;

          case 6:
            _context15.prev = 6;

            result.event.unsubscribeAll();
            return _context15.finish(6);

          case 9:

            expect(menus.count()).toBe(0);

          case 10:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined, [[2,, 6, 9]]);
  })));

  test('should return the menu matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var _ref24, expectedMenu, expectedMenuItemPrices, expectedTags, expectedOwnedByUser, expectedMaintainedByUsers, results, menus, result;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _Menu.createMenuInfo)();

          case 2:
            _ref24 = _context17.sent;
            expectedMenu = _ref24.menu;
            expectedMenuItemPrices = _ref24.menuItemPrices;
            expectedTags = _ref24.tags;
            expectedOwnedByUser = _ref24.ownedByUser;
            expectedMaintainedByUsers = _ref24.maintainedByUsers;
            _context17.t0 = _immutable2.default;
            _context17.next = 11;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 2, max: 5 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
              return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                  switch (_context16.prev = _context16.next) {
                    case 0:
                      return _context16.abrupt('return', menuService.create(expectedMenu));

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
            menus = (0, _immutable.List)();
            result = menuService.searchAll(createCriteria(expectedMenu));
            _context17.prev = 15;

            result.event.subscribe(function (info) {
              menus = menus.push(info);
            });

            _context17.next = 19;
            return result.promise;

          case 19:
            _context17.prev = 19;

            result.event.unsubscribeAll();
            return _context17.finish(19);

          case 22:

            expect(menus.count).toBe(results.count);
            menus.forEach(function (menu) {
              expect(results.find(function (_) {
                return _.localeCompare(menu.get('id')) === 0;
              })).toBeDefined();
              (0, _Menu.expectMenu)(menu, expectedMenu, {
                menuId: menu.get('id'),
                expectedMenuItemPrices: expectedMenuItemPrices,
                expectedTags: expectedTags,
                expectedOwnedByUser: expectedOwnedByUser,
                expectedMaintainedByUsers: expectedMaintainedByUsers
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
  test('should return false if no menu match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.t0 = expect;
            _context18.next = 3;
            return menuService.exists(createCriteria());

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

  test('should return true if any menu match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var menus;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return createMenus(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            menus = _context19.sent;
            _context19.t0 = expect;
            _context19.next = 6;
            return menuService.exists(createCriteria(menus.first()));

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
  test('should return 0 if no menu match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.t0 = expect;
            _context20.next = 3;
            return menuService.count(createCriteria());

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

  test('should return the count of menu match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
    var menus;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return createMenus(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            menus = _context21.sent;
            _context21.t0 = expect;
            _context21.next = 6;
            return menuService.count(createCriteria(menus.first()));

          case 6:
            _context21.t1 = _context21.sent;
            _context21.t2 = menus.count();
            (0, _context21.t0)(_context21.t1).toBe(_context21.t2);

          case 9:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  })));
});