'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _parseServerCommon = require('@microbusiness/parse-server-common');

require('../../../bootstrap');

var _2 = require('../');

var _Restaurant = require('../../schema/__tests__/Restaurant.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();
var restaurantService = new _2.RestaurantService();

var getLanguages = function getLanguages(object) {
  var languages = object ? object.get('name').keySeq() : (0, _immutable.List)();
  var language = languages.isEmpty() ? null : languages.first();

  return { languages: languages, language: language };
};

var createCriteriaWthoutConditions = function createCriteriaWthoutConditions(languages, language) {
  return (0, _immutable.Map)({
    fields: _immutable.List.of('languages_name', 'websiteUrl', 'imageUrl', 'address', 'phones', 'geoLocation', 'parentRestaurant', 'ownedByUser', 'maintainedByUsers', 'status', 'googleMapUrl', 'menus', 'inheritParentRestaurantMenus', 'pin').concat(languages ? languages.map(function (_) {
      return _ + '_name';
    }) : (0, _immutable.List)()),
    language: language,
    include_parentRestaurant: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
    include_menus: true
  });
};

var createCriteria = function createCriteria(object) {
  var _getLanguages = getLanguages(object),
      language = _getLanguages.language,
      languages = _getLanguages.languages;

  return (0, _immutable.Map)({
    conditions: (0, _immutable.Map)({
      name: language ? object.get('name').get(language) : chance.string(),
      websiteUrl: object ? object.get('websiteUrl') : chance.string(),
      imageUrl: object ? object.get('imageUrl') : chance.string(),
      address: object ? object.get('address') : chance.string(),
      phones: object ? object.get('phones') : (0, _immutable.Map)({ business: chance.string() }),
      near_geoLocation: object ? object.get('geoLocation') : _parseServerCommon.ParseWrapperService.createGeoPoint({
        latitude: chance.floating({ min: 1, max: 20 }),
        longitude: chance.floating({ min: -30, max: -1 })
      }),
      parentRestaurantId: object && object.get('parentRestaurantId') ? object.get('parentRestaurantId') : undefined,
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : _immutable.List.of(chance.string(), chance.string()),
      status: object ? object.get('status') : chance.string(),
      googleMapUrl: object ? object.get('googleMapUrl') : chance.string(),
      menuIds: object ? object.get('menuIds') : _immutable.List.of(chance.string(), chance.string()),
      inheritParentRestaurantMenus: object ? object.get('inheritParentRestaurantMenus') : chance.bool(),
      pin: object ? object.get('pin') : chance.string()
    })
  }).merge(createCriteriaWthoutConditions(languages, language));
};

var createRestaurants = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(count) {
    var useSameInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var createParentRestaurant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var parentRestaurant, restaurant, _ref2, tempRestaurant;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!createParentRestaurant) {
              _context2.next = 6;
              break;
            }

            _context2.next = 3;
            return createRestaurants(1, false, false);

          case 3:
            _context2.t0 = _context2.sent;
            _context2.next = 7;
            break;

          case 6:
            _context2.t0 = undefined;

          case 7:
            parentRestaurant = _context2.t0;
            restaurant = void 0;

            if (!useSameInfo) {
              _context2.next = 15;
              break;
            }

            _context2.next = 12;
            return (0, _Restaurant.createRestaurantInfo)();

          case 12:
            _ref2 = _context2.sent;
            tempRestaurant = _ref2.restaurant;


            restaurant = tempRestaurant;

          case 15:
            _context2.t1 = _immutable2.default;
            _context2.next = 18;
            return Promise.all((0, _immutable.Range)(0, count).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var finalRestaurant, _ref4, _tempRestaurant;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      finalRestaurant = void 0;

                      if (!useSameInfo) {
                        _context.next = 5;
                        break;
                      }

                      finalRestaurant = restaurant;
                      _context.next = 10;
                      break;

                    case 5:
                      _context.next = 7;
                      return (0, _Restaurant.createRestaurantInfo)();

                    case 7:
                      _ref4 = _context.sent;
                      _tempRestaurant = _ref4.restaurant;


                      finalRestaurant = _tempRestaurant;

                    case 10:
                      _context.t0 = restaurantService;
                      _context.next = 13;
                      return restaurantService.create(createParentRestaurant ? finalRestaurant.merge((0, _immutable.Map)({ parentRestaurantId: parentRestaurant.get('id') })) : finalRestaurant);

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

          case 18:
            _context2.t2 = _context2.sent;
            return _context2.abrupt('return', _context2.t1.fromJS.call(_context2.t1, _context2.t2));

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function createRestaurants(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = createRestaurants;


describe('create', function () {
  test('should return the created restaurant Id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var restaurantId;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = restaurantService;
            _context3.next = 3;
            return (0, _Restaurant.createRestaurantInfo)();

          case 3:
            _context3.t1 = _context3.sent.restaurant;
            _context3.next = 6;
            return _context3.t0.create.call(_context3.t0, _context3.t1);

          case 6:
            restaurantId = _context3.sent;


            expect(restaurantId).toBeDefined();

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  test('should create the restaurant', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _ref7, restaurant, restaurantId, fetchedRestaurant;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _Restaurant.createRestaurantInfo)();

          case 2:
            _ref7 = _context4.sent;
            restaurant = _ref7.restaurant;
            _context4.next = 6;
            return restaurantService.create(restaurant);

          case 6:
            restaurantId = _context4.sent;
            _context4.next = 9;
            return restaurantService.read(restaurantId, createCriteriaWthoutConditions());

          case 9:
            fetchedRestaurant = _context4.sent;


            expect(fetchedRestaurant).toBeDefined();

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe('read', function () {
  test('should reject if the provided restaurant Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var restaurantId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            restaurantId = chance.string();
            _context5.prev = 1;
            _context5.next = 4;
            return restaurantService.read(restaurantId);

          case 4:
            _context5.next = 9;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5['catch'](1);

            expect(_context5.t0.message).toBe('No restaurant found with Id: ' + restaurantId);

          case 9:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[1, 6]]);
  })));

  test('should read the existing restaurant', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var _ref10, parentRestaurant, parentRestaurantId, _ref11, expectedRestaurant, expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus, expectedLanguages, restaurantId, restaurant;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _Restaurant.createRestaurantInfo)();

          case 2:
            _ref10 = _context6.sent;
            parentRestaurant = _ref10.restaurant;
            _context6.next = 6;
            return restaurantService.create(parentRestaurant);

          case 6:
            parentRestaurantId = _context6.sent;
            _context6.next = 9;
            return (0, _Restaurant.createRestaurantInfo)({
              parentRestaurantId: parentRestaurantId
            });

          case 9:
            _ref11 = _context6.sent;
            expectedRestaurant = _ref11.restaurant;
            expectedOwnedByUser = _ref11.ownedByUser;
            expectedMaintainedByUsers = _ref11.maintainedByUsers;
            expectedMenus = _ref11.menus;
            expectedLanguages = _ref11.languages;
            _context6.next = 17;
            return restaurantService.create(expectedRestaurant);

          case 17:
            restaurantId = _context6.sent;
            _context6.next = 20;
            return restaurantService.read(restaurantId, createCriteriaWthoutConditions());

          case 20:
            restaurant = _context6.sent;


            (0, _Restaurant.expectRestaurant)(restaurant, expectedRestaurant, {
              expectedOwnedByUser: expectedOwnedByUser,
              expectedMaintainedByUsers: expectedMaintainedByUsers,
              expectedMenus: expectedMenus,
              expectedLanguages: expectedLanguages
            });

          case 22:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));
});

describe('update', function () {
  test('should reject if the provided restaurant Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var restaurantId, restaurant;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            restaurantId = chance.string();
            _context7.prev = 1;
            _context7.t0 = restaurantService;
            _context7.t1 = restaurantService;
            _context7.next = 6;
            return (0, _Restaurant.createRestaurantInfo)();

          case 6:
            _context7.t2 = _context7.sent.restaurant;
            _context7.next = 9;
            return _context7.t1.create.call(_context7.t1, _context7.t2);

          case 9:
            _context7.t3 = _context7.sent;
            _context7.t4 = createCriteriaWthoutConditions();
            _context7.next = 13;
            return _context7.t0.read.call(_context7.t0, _context7.t3, _context7.t4);

          case 13:
            restaurant = _context7.sent;
            _context7.next = 16;
            return restaurantService.update(restaurant.set('id', restaurantId));

          case 16:
            _context7.next = 21;
            break;

          case 18:
            _context7.prev = 18;
            _context7.t5 = _context7['catch'](1);

            expect(_context7.t5.message).toBe('No restaurant found with Id: ' + restaurantId);

          case 21:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[1, 18]]);
  })));

  test('should return the Id of the updated restaurant', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref14, expectedRestaurant, restaurantId, id;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _Restaurant.createRestaurantInfo)();

          case 2:
            _ref14 = _context8.sent;
            expectedRestaurant = _ref14.restaurant;
            _context8.t0 = restaurantService;
            _context8.next = 7;
            return (0, _Restaurant.createRestaurantInfo)();

          case 7:
            _context8.t1 = _context8.sent.restaurant;
            _context8.next = 10;
            return _context8.t0.create.call(_context8.t0, _context8.t1);

          case 10:
            restaurantId = _context8.sent;
            _context8.next = 13;
            return restaurantService.update(expectedRestaurant.set('id', restaurantId));

          case 13:
            id = _context8.sent;


            expect(id).toBe(restaurantId);

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  test('should update the existing restaurant', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var _ref16, parentRestaurant, parentRestaurantId, _ref17, expectedRestaurant, expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus, expectedLanguages, restaurantId, restaurant;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _Restaurant.createRestaurantInfo)();

          case 2:
            _ref16 = _context9.sent;
            parentRestaurant = _ref16.restaurant;
            _context9.next = 6;
            return restaurantService.create(parentRestaurant);

          case 6:
            parentRestaurantId = _context9.sent;
            _context9.next = 9;
            return (0, _Restaurant.createRestaurantInfo)({
              parentRestaurantId: parentRestaurantId
            });

          case 9:
            _ref17 = _context9.sent;
            expectedRestaurant = _ref17.restaurant;
            expectedOwnedByUser = _ref17.ownedByUser;
            expectedMaintainedByUsers = _ref17.maintainedByUsers;
            expectedMenus = _ref17.menus;
            expectedLanguages = _ref17.languages;
            _context9.t0 = restaurantService;
            _context9.next = 18;
            return (0, _Restaurant.createRestaurantInfo)();

          case 18:
            _context9.t1 = _context9.sent.restaurant;
            _context9.next = 21;
            return _context9.t0.create.call(_context9.t0, _context9.t1);

          case 21:
            restaurantId = _context9.sent;
            _context9.next = 24;
            return restaurantService.update(expectedRestaurant.set('id', restaurantId));

          case 24:
            _context9.next = 26;
            return restaurantService.read(restaurantId, createCriteriaWthoutConditions());

          case 26:
            restaurant = _context9.sent;


            (0, _Restaurant.expectRestaurant)(restaurant, expectedRestaurant, {
              expectedOwnedByUser: expectedOwnedByUser,
              expectedMaintainedByUsers: expectedMaintainedByUsers,
              expectedMenus: expectedMenus,
              expectedLanguages: expectedLanguages
            });

          case 28:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));
});

describe('delete', function () {
  test('should reject if the provided restaurant Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var restaurantId;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            restaurantId = chance.string();
            _context10.prev = 1;
            _context10.next = 4;
            return restaurantService.delete(restaurantId);

          case 4:
            _context10.next = 9;
            break;

          case 6:
            _context10.prev = 6;
            _context10.t0 = _context10['catch'](1);

            expect(_context10.t0.message).toBe('No restaurant found with Id: ' + restaurantId);

          case 9:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[1, 6]]);
  })));

  test('should delete the existing restaurant', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var restaurantId;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.t0 = restaurantService;
            _context11.next = 3;
            return (0, _Restaurant.createRestaurantInfo)();

          case 3:
            _context11.t1 = _context11.sent.restaurant;
            _context11.next = 6;
            return _context11.t0.create.call(_context11.t0, _context11.t1);

          case 6:
            restaurantId = _context11.sent;
            _context11.next = 9;
            return restaurantService.delete(restaurantId);

          case 9:
            _context11.prev = 9;
            _context11.next = 12;
            return restaurantService.delete(restaurantId);

          case 12:
            _context11.next = 17;
            break;

          case 14:
            _context11.prev = 14;
            _context11.t2 = _context11['catch'](9);

            expect(_context11.t2.message).toBe('No restaurant found with Id: ' + restaurantId);

          case 17:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[9, 14]]);
  })));
});

describe('search', function () {
  test('should return no restaurant if provided criteria matches no restaurant', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var restaurants;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return restaurantService.search(createCriteria());

          case 2:
            restaurants = _context12.sent;


            expect(restaurants.count()).toBe(0);

          case 4:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  test('should return the restaurant matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var _ref22, parentRestaurant, parentRestaurantId, _ref23, expectedRestaurant, expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus, expectedLanguages, results, restaurants;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _Restaurant.createRestaurantInfo)();

          case 2:
            _ref22 = _context14.sent;
            parentRestaurant = _ref22.restaurant;
            _context14.next = 6;
            return restaurantService.create(parentRestaurant);

          case 6:
            parentRestaurantId = _context14.sent;
            _context14.next = 9;
            return (0, _Restaurant.createRestaurantInfo)({
              parentRestaurantId: parentRestaurantId
            });

          case 9:
            _ref23 = _context14.sent;
            expectedRestaurant = _ref23.restaurant;
            expectedOwnedByUser = _ref23.ownedByUser;
            expectedMaintainedByUsers = _ref23.maintainedByUsers;
            expectedMenus = _ref23.menus;
            expectedLanguages = _ref23.languages;
            _context14.t0 = _immutable2.default;
            _context14.next = 18;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 2, max: 5 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
              return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      return _context13.abrupt('return', restaurantService.create(expectedRestaurant));

                    case 1:
                    case 'end':
                      return _context13.stop();
                  }
                }
              }, _callee13, undefined);
            }))).toArray());

          case 18:
            _context14.t1 = _context14.sent;
            results = _context14.t0.fromJS.call(_context14.t0, _context14.t1);
            _context14.next = 22;
            return restaurantService.search(createCriteria(expectedRestaurant));

          case 22:
            restaurants = _context14.sent;


            expect(restaurants.count).toBe(results.count);
            restaurants.forEach(function (restaurant) {
              expect(results.find(function (_) {
                return _.localeCompare(restaurant.get('id')) === 0;
              })).toBeDefined();
              (0, _Restaurant.expectRestaurant)(restaurant, expectedRestaurant, {
                expectedOwnedByUser: expectedOwnedByUser,
                expectedMaintainedByUsers: expectedMaintainedByUsers,
                expectedMenus: expectedMenus,
                expectedLanguages: expectedLanguages
              });
            });

          case 25:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));
});

describe('searchAll', function () {
  test('should return no restaurant if provided criteria matches no restaurant', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var restaurants, result;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            restaurants = (0, _immutable.List)();
            result = restaurantService.searchAll(createCriteria());
            _context15.prev = 2;

            result.event.subscribe(function (info) {
              restaurants = restaurants.push(info);
            });

            _context15.next = 6;
            return result.promise;

          case 6:
            _context15.prev = 6;

            result.event.unsubscribeAll();
            return _context15.finish(6);

          case 9:

            expect(restaurants.count()).toBe(0);

          case 10:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined, [[2,, 6, 9]]);
  })));

  test('should return the restaurant matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var _ref27, parentRestaurant, parentRestaurantId, _ref28, expectedRestaurant, expectedOwnedByUser, expectedMaintainedByUsers, expectedMenus, expectedLanguages, results, restaurants, result;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _Restaurant.createRestaurantInfo)();

          case 2:
            _ref27 = _context17.sent;
            parentRestaurant = _ref27.restaurant;
            _context17.next = 6;
            return restaurantService.create(parentRestaurant);

          case 6:
            parentRestaurantId = _context17.sent;
            _context17.next = 9;
            return (0, _Restaurant.createRestaurantInfo)({
              parentRestaurantId: parentRestaurantId
            });

          case 9:
            _ref28 = _context17.sent;
            expectedRestaurant = _ref28.restaurant;
            expectedOwnedByUser = _ref28.ownedByUser;
            expectedMaintainedByUsers = _ref28.maintainedByUsers;
            expectedMenus = _ref28.menus;
            expectedLanguages = _ref28.languages;
            _context17.t0 = _immutable2.default;
            _context17.next = 18;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 2, max: 5 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
              return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                  switch (_context16.prev = _context16.next) {
                    case 0:
                      return _context16.abrupt('return', restaurantService.create(expectedRestaurant));

                    case 1:
                    case 'end':
                      return _context16.stop();
                  }
                }
              }, _callee16, undefined);
            }))).toArray());

          case 18:
            _context17.t1 = _context17.sent;
            results = _context17.t0.fromJS.call(_context17.t0, _context17.t1);
            restaurants = (0, _immutable.List)();
            result = restaurantService.searchAll(createCriteria(expectedRestaurant));
            _context17.prev = 22;

            result.event.subscribe(function (info) {
              restaurants = restaurants.push(info);
            });

            _context17.next = 26;
            return result.promise;

          case 26:
            _context17.prev = 26;

            result.event.unsubscribeAll();
            return _context17.finish(26);

          case 29:

            expect(restaurants.count).toBe(results.count);
            restaurants.forEach(function (restaurant) {
              expect(results.find(function (_) {
                return _.localeCompare(restaurant.get('id')) === 0;
              })).toBeDefined();
              (0, _Restaurant.expectRestaurant)(restaurant, expectedRestaurant, {
                expectedOwnedByUser: expectedOwnedByUser,
                expectedMaintainedByUsers: expectedMaintainedByUsers,
                expectedMenus: expectedMenus,
                expectedLanguages: expectedLanguages
              });
            });

          case 31:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined, [[22,, 26, 29]]);
  })));
});

describe('exists', function () {
  test('should return false if no restaurant match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.t0 = expect;
            _context18.next = 3;
            return restaurantService.exists(createCriteria());

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

  test('should return true if any restaurant match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var restaurants;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return createRestaurants(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            restaurants = _context19.sent;
            _context19.t0 = expect;
            _context19.next = 6;
            return restaurantService.exists(createCriteria(restaurants.first()));

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
  test('should return 0 if no restaurant match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.t0 = expect;
            _context20.next = 3;
            return restaurantService.count(createCriteria());

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

  test('should return the count of restaurant match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
    var restaurants;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return createRestaurants(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            restaurants = _context21.sent;
            _context21.t0 = expect;
            _context21.next = 6;
            return restaurantService.count(createCriteria(restaurants.first()));

          case 6:
            _context21.t1 = _context21.sent;
            _context21.t2 = restaurants.count();
            (0, _context21.t0)(_context21.t1).toBe(_context21.t2);

          case 9:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  })));
});