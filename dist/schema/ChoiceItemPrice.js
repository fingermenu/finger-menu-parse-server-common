'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _ChoiceItem = require('./ChoiceItem');

var _ChoiceItem2 = _interopRequireDefault(_ChoiceItem);

var _Tag = require('./Tag');

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChoiceItemPrice = function (_BaseObject) {
  _inherits(ChoiceItemPrice, _BaseObject);

  function ChoiceItemPrice(object) {
    _classCallCheck(this, ChoiceItemPrice);

    var _this = _possibleConstructorReturn(this, (ChoiceItemPrice.__proto__ || Object.getPrototypeOf(ChoiceItemPrice)).call(this, object, 'ChoiceItemPrice'));

    _initialiseProps.call(_this);

    return _this;
  }

  return ChoiceItemPrice;
}(_parseServerCommon.BaseObject);

ChoiceItemPrice.spawn = function (info) {
  var object = new ChoiceItemPrice();

  ChoiceItemPrice.updateInfoInternal(object, info);

  return object;
};

ChoiceItemPrice.updateInfoInternal = function (object, info) {
  object.set('currentPrice', info.get('currentPrice'));
  object.set('wasPrice', info.get('wasPrice'));
  object.set('validFrom', info.get('validFrom'));
  object.set('validUntil', info.get('validUntil'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'choiceItem', _ChoiceItem2.default);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'addedByUser');
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'removedByUser');
  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'tag', _Tag2.default);
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    ChoiceItemPrice.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var choiceItem = object.get('choiceItem');
    var addedByUser = object.get('addedByUser');
    var removedByUser = object.get('removedByUser');
    var tagObjects = object.get('tags');
    var tags = tagObjects ? _immutable2.default.fromJS(tagObjects).map(function (tag) {
      return new _Tag2.default(tag).getInfo();
    }) : undefined;

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      createdAt: object.get('createdAt'),
      updatedAt: object.get('updatedAt'),
      currentPrice: object.get('currentPrice'),
      wasPrice: object.get('wasPrice'),
      validFrom: object.get('validFrom'),
      validUntil: object.get('validUntil'),
      choiceItem: choiceItem,
      choiceItemId: choiceItem ? choiceItem.id : undefined,
      addedByUser: addedByUser,
      addedByUserId: addedByUser ? addedByUser.id : undefined,
      removedByUser: removedByUser,
      removedByUserId: removedByUser ? removedByUser.id : undefined,
      tags: tags,
      tagIds: tags ? tags.map(function (tag) {
        return tag.get('id');
      }) : (0, _immutable.List)()
    }));
  };
};

exports.default = ChoiceItemPrice;