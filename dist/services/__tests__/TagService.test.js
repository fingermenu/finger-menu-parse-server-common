'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

require('../../../bootstrap');

var _2 = require('../');

var _Tag = require('../../schema/__tests__/Tag.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chance = new _chance2.default();
var tagService = new _2.TagService();

var createCriteriaWthoutConditions = function createCriteriaWthoutConditions() {
  return (0, _immutable.Map)({
    fields: _immutable.List.of('name', 'description', 'level', 'forDisplay', 'parentTag'),
    include_parentTag: true
  });
};

var createCriteria = function createCriteria(tag) {
  return (0, _immutable.Map)({
    conditions: (0, _immutable.Map)({
      name: tag ? tag.get('name') : (0, _v2.default)(),
      description: tag ? tag.get('description') : (0, _v2.default)(),
      level: tag ? tag.get('level') : chance.integer({ min: 1, max: 1000 }),
      forDisplay: tag ? tag.get('forDisplay') : chance.integer({ min: 1, max: 1000 }) % 2 === 0,
      parentTagId: tag && tag.get('parentTagId') ? tag.get('parentTagId') : undefined
    })
  }).merge(createCriteriaWthoutConditions());
};

var createTags = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(count) {
    var useSameInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var createParentTag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var parentTag, tag, _ref2, tempTag;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!createParentTag) {
              _context2.next = 6;
              break;
            }

            _context2.next = 3;
            return createTags(1, false, false);

          case 3:
            _context2.t0 = _context2.sent;
            _context2.next = 7;
            break;

          case 6:
            _context2.t0 = undefined;

          case 7:
            parentTag = _context2.t0;
            tag = void 0;

            if (!useSameInfo) {
              _context2.next = 15;
              break;
            }

            _context2.next = 12;
            return (0, _Tag.createTagInfo)();

          case 12:
            _ref2 = _context2.sent;
            tempTag = _ref2.tag;


            tag = tempTag;

          case 15:
            _context2.t1 = _immutable2.default;
            _context2.next = 18;
            return Promise.all((0, _immutable.Range)(0, count).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var finalTag, _ref4, _tempTag;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      finalTag = void 0;

                      if (!useSameInfo) {
                        _context.next = 5;
                        break;
                      }

                      finalTag = tag;
                      _context.next = 10;
                      break;

                    case 5:
                      _context.next = 7;
                      return (0, _Tag.createTagInfo)();

                    case 7:
                      _ref4 = _context.sent;
                      _tempTag = _ref4.tag;


                      finalTag = _tempTag;

                    case 10:
                      _context.t0 = tagService;
                      _context.next = 13;
                      return tagService.create(createParentTag ? finalTag.set('parentTagId', parentTag.get('id')) : finalTag);

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

  return function createTags(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = createTags;


describe('create', function () {
  test('should return the created tag Id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var tagId;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = tagService;
            _context3.next = 3;
            return (0, _Tag.createTagInfo)();

          case 3:
            _context3.t1 = _context3.sent.tag;
            _context3.next = 6;
            return _context3.t0.create.call(_context3.t0, _context3.t1);

          case 6:
            tagId = _context3.sent;


            expect(tagId).toBeDefined();

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  test('should create the tag', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _ref7, tag, tagId, fetchedTag;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _Tag.createTagInfo)();

          case 2:
            _ref7 = _context4.sent;
            tag = _ref7.tag;
            _context4.next = 6;
            return tagService.create(tag);

          case 6:
            tagId = _context4.sent;
            _context4.next = 9;
            return tagService.read(tagId, createCriteriaWthoutConditions());

          case 9:
            fetchedTag = _context4.sent;


            expect(fetchedTag).toBeDefined();

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe('read', function () {
  test('should reject if the provided tag Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var tagId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            tagId = (0, _v2.default)();
            _context5.prev = 1;
            _context5.next = 4;
            return tagService.read(tagId);

          case 4:
            _context5.next = 9;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5['catch'](1);

            expect(_context5.t0.message).toBe('No tag found with Id: ' + tagId);

          case 9:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[1, 6]]);
  })));

  test('should read the existing tag', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var _ref10, parentTag, parentTagId, _ref11, expectedTag, tagId, tag;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _Tag.createTagInfo)();

          case 2:
            _ref10 = _context6.sent;
            parentTag = _ref10.tag;
            _context6.next = 6;
            return tagService.create(parentTag);

          case 6:
            parentTagId = _context6.sent;
            _context6.next = 9;
            return (0, _Tag.createTagInfo)({ parentTagId: parentTagId });

          case 9:
            _ref11 = _context6.sent;
            expectedTag = _ref11.tag;
            _context6.next = 13;
            return tagService.create(expectedTag);

          case 13:
            tagId = _context6.sent;
            _context6.next = 16;
            return tagService.read(tagId, createCriteriaWthoutConditions());

          case 16:
            tag = _context6.sent;


            (0, _Tag.expectTag)(tag, expectedTag);

          case 18:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));
});

describe('update', function () {
  test('should reject if the provided tag Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var tagId, tag;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            tagId = (0, _v2.default)();
            _context7.prev = 1;
            _context7.t0 = tagService;
            _context7.t1 = tagService;
            _context7.next = 6;
            return (0, _Tag.createTagInfo)();

          case 6:
            _context7.t2 = _context7.sent.tag;
            _context7.next = 9;
            return _context7.t1.create.call(_context7.t1, _context7.t2);

          case 9:
            _context7.t3 = _context7.sent;
            _context7.t4 = createCriteriaWthoutConditions();
            _context7.next = 13;
            return _context7.t0.read.call(_context7.t0, _context7.t3, _context7.t4);

          case 13:
            tag = _context7.sent;
            _context7.next = 16;
            return tagService.update(tag.set('id', tagId));

          case 16:
            _context7.next = 21;
            break;

          case 18:
            _context7.prev = 18;
            _context7.t5 = _context7['catch'](1);

            expect(_context7.t5.message).toBe('No tag found with Id: ' + tagId);

          case 21:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[1, 18]]);
  })));

  test('should return the Id of the updated tag', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _ref14, expectedTag, tagId, id;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _Tag.createTagInfo)();

          case 2:
            _ref14 = _context8.sent;
            expectedTag = _ref14.tag;
            _context8.t0 = tagService;
            _context8.next = 7;
            return (0, _Tag.createTagInfo)();

          case 7:
            _context8.t1 = _context8.sent.tag;
            _context8.next = 10;
            return _context8.t0.create.call(_context8.t0, _context8.t1);

          case 10:
            tagId = _context8.sent;
            _context8.next = 13;
            return tagService.update(expectedTag.set('id', tagId));

          case 13:
            id = _context8.sent;


            expect(id).toBe(tagId);

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  test('should update the existing tag', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var _ref16, parentTag, parentTagId, _ref17, expectedTag, tagId, tag;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _Tag.createTagInfo)();

          case 2:
            _ref16 = _context9.sent;
            parentTag = _ref16.tag;
            _context9.next = 6;
            return tagService.create(parentTag);

          case 6:
            parentTagId = _context9.sent;
            _context9.next = 9;
            return (0, _Tag.createTagInfo)({ parentTagId: parentTagId });

          case 9:
            _ref17 = _context9.sent;
            expectedTag = _ref17.tag;
            _context9.t0 = tagService;
            _context9.next = 14;
            return (0, _Tag.createTagInfo)();

          case 14:
            _context9.t1 = _context9.sent.tag;
            _context9.next = 17;
            return _context9.t0.create.call(_context9.t0, _context9.t1);

          case 17:
            tagId = _context9.sent;
            _context9.next = 20;
            return tagService.update(expectedTag.set('id', tagId));

          case 20:
            _context9.next = 22;
            return tagService.read(tagId, createCriteriaWthoutConditions());

          case 22:
            tag = _context9.sent;


            (0, _Tag.expectTag)(tag, expectedTag);

          case 24:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));
});

describe('delete', function () {
  test('should reject if the provided tag Id does not exist', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var tagId;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            tagId = (0, _v2.default)();
            _context10.prev = 1;
            _context10.next = 4;
            return tagService.delete(tagId);

          case 4:
            _context10.next = 9;
            break;

          case 6:
            _context10.prev = 6;
            _context10.t0 = _context10['catch'](1);

            expect(_context10.t0.message).toBe('No tag found with Id: ' + tagId);

          case 9:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[1, 6]]);
  })));

  test('should delete the existing tag', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var tagId;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.t0 = tagService;
            _context11.next = 3;
            return (0, _Tag.createTagInfo)();

          case 3:
            _context11.t1 = _context11.sent.tag;
            _context11.next = 6;
            return _context11.t0.create.call(_context11.t0, _context11.t1);

          case 6:
            tagId = _context11.sent;
            _context11.next = 9;
            return tagService.delete(tagId);

          case 9:
            _context11.prev = 9;
            _context11.next = 12;
            return tagService.delete(tagId);

          case 12:
            _context11.next = 17;
            break;

          case 14:
            _context11.prev = 14;
            _context11.t2 = _context11['catch'](9);

            expect(_context11.t2.message).toBe('No tag found with Id: ' + tagId);

          case 17:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[9, 14]]);
  })));
});

describe('search', function () {
  test('should return no tag if provided criteria matches no tag', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var tags;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return tagService.search(createCriteria());

          case 2:
            tags = _context12.sent;


            expect(tags.count()).toBe(0);

          case 4:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  test('should return the tag matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var _ref22, parentTag, parentTagId, _ref23, expectedTag, results, tags;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _Tag.createTagInfo)();

          case 2:
            _ref22 = _context14.sent;
            parentTag = _ref22.tag;
            _context14.next = 6;
            return tagService.create(parentTag);

          case 6:
            parentTagId = _context14.sent;
            _context14.next = 9;
            return (0, _Tag.createTagInfo)({ parentTagId: parentTagId });

          case 9:
            _ref23 = _context14.sent;
            expectedTag = _ref23.tag;
            _context14.t0 = _immutable2.default;
            _context14.next = 14;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 2, max: 5 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
              return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      return _context13.abrupt('return', tagService.create(expectedTag));

                    case 1:
                    case 'end':
                      return _context13.stop();
                  }
                }
              }, _callee13, undefined);
            }))).toArray());

          case 14:
            _context14.t1 = _context14.sent;
            results = _context14.t0.fromJS.call(_context14.t0, _context14.t1);
            _context14.next = 18;
            return tagService.search(createCriteria(expectedTag));

          case 18:
            tags = _context14.sent;


            expect(tags.count).toBe(results.count);
            tags.forEach(function (tag) {
              expect(results.find(function (_) {
                return _.localeCompare(tag.get('id')) === 0;
              })).toBeDefined();
              (0, _Tag.expectTag)(tag, expectedTag);
            });

          case 21:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));
});

describe('searchAll', function () {
  test('should return no tag if provided criteria matches no tag', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var tags, result;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            tags = (0, _immutable.List)();
            result = tagService.searchAll(createCriteria());
            _context15.prev = 2;

            result.event.subscribe(function (info) {
              tags = tags.push(info);
            });

            _context15.next = 6;
            return result.promise;

          case 6:
            _context15.prev = 6;

            result.event.unsubscribeAll();
            return _context15.finish(6);

          case 9:

            expect(tags.count()).toBe(0);

          case 10:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined, [[2,, 6, 9]]);
  })));

  test('should return the tag matches the criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var _ref27, parentTag, parentTagId, _ref28, expectedTag, results, tags, result;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _Tag.createTagInfo)();

          case 2:
            _ref27 = _context17.sent;
            parentTag = _ref27.tag;
            _context17.next = 6;
            return tagService.create(parentTag);

          case 6:
            parentTagId = _context17.sent;
            _context17.next = 9;
            return (0, _Tag.createTagInfo)({ parentTagId: parentTagId });

          case 9:
            _ref28 = _context17.sent;
            expectedTag = _ref28.tag;
            _context17.t0 = _immutable2.default;
            _context17.next = 14;
            return Promise.all((0, _immutable.Range)(0, chance.integer({ min: 2, max: 5 })).map(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
              return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                  switch (_context16.prev = _context16.next) {
                    case 0:
                      return _context16.abrupt('return', tagService.create(expectedTag));

                    case 1:
                    case 'end':
                      return _context16.stop();
                  }
                }
              }, _callee16, undefined);
            }))).toArray());

          case 14:
            _context17.t1 = _context17.sent;
            results = _context17.t0.fromJS.call(_context17.t0, _context17.t1);
            tags = (0, _immutable.List)();
            result = tagService.searchAll(createCriteria(expectedTag));
            _context17.prev = 18;

            result.event.subscribe(function (info) {
              tags = tags.push(info);
            });

            _context17.next = 22;
            return result.promise;

          case 22:
            _context17.prev = 22;

            result.event.unsubscribeAll();
            return _context17.finish(22);

          case 25:

            expect(tags.count).toBe(results.count);
            tags.forEach(function (tag) {
              expect(results.find(function (_) {
                return _.localeCompare(tag.get('id')) === 0;
              })).toBeDefined();
              (0, _Tag.expectTag)(tag, expectedTag);
            });

          case 27:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined, [[18,, 22, 25]]);
  })));
});

describe('exists', function () {
  test('should return false if no tag match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.t0 = expect;
            _context18.next = 3;
            return tagService.exists(createCriteria());

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

  test('should return true if any tag match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var tags;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return createTags(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            tags = _context19.sent;
            _context19.t0 = expect;
            _context19.next = 6;
            return tagService.exists(createCriteria(tags.first()));

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
  test('should return 0 if no tag match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.t0 = expect;
            _context20.next = 3;
            return tagService.count(createCriteria());

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

  test('should return the count of tag match provided criteria', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
    var tags;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return createTags(chance.integer({ min: 1, max: 10 }), true);

          case 2:
            tags = _context21.sent;
            _context21.t0 = expect;
            _context21.next = 6;
            return tagService.count(createCriteria(tags.first()));

          case 6:
            _context21.t1 = _context21.sent;
            _context21.t2 = tags.count();
            (0, _context21.t0)(_context21.t1).toBe(_context21.t2);

          case 9:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  })));
});