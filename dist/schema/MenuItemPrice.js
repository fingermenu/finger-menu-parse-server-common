'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _ChoiceItemPrice = require('./ChoiceItemPrice');

var _ChoiceItemPrice2 = _interopRequireDefault(_ChoiceItemPrice);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Tag = require('./Tag');

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuItemPrice = function (_BaseObject) {
  _inherits(MenuItemPrice, _BaseObject);

  function MenuItemPrice(object) {
    _classCallCheck(this, MenuItemPrice);

    var _this = _possibleConstructorReturn(this, (MenuItemPrice.__proto__ || Object.getPrototypeOf(MenuItemPrice)).call(this, object, 'MenuItemPrice'));

    _initialiseProps.call(_this);

    return _this;
  }

  return MenuItemPrice;
}(_parseServerCommon.BaseObject);

MenuItemPrice.spawn = function (info) {
  var object = new MenuItemPrice();

  MenuItemPrice.updateInfoInternal(object, info);

  return object;
};

MenuItemPrice.updateInfoInternal = function (object, info) {
  object.set('currentPrice', info.get('currentPrice'));
  object.set('wasPrice', info.get('wasPrice'));
  object.set('validFrom', info.get('validFrom'));
  object.set('validUntil', info.get('validUntil'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'menuItem', _MenuItem2.default);
  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'toBeServedWithMenuItemPrice', MenuItemPrice);
  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'choiceItemPrice', _ChoiceItemPrice2.default);
  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'defaultChoiceItemPrice', _ChoiceItemPrice2.default);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'addedByUser');
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'removedByUser');

  var toBeServedWithMenuItemPriceSortOrderIndices = info.get('toBeServedWithMenuItemPriceSortOrderIndices');

  if (_commonJavascript.Common.isNull(toBeServedWithMenuItemPriceSortOrderIndices)) {
    object.set('toBeServedWithMenuItemPriceSortOrderIndices', {});
  } else if (toBeServedWithMenuItemPriceSortOrderIndices) {
    object.set('toBeServedWithMenuItemPriceSortOrderIndices', toBeServedWithMenuItemPriceSortOrderIndices.toJS());
  }

  var choiceItemPriceSortOrderIndices = info.get('choiceItemPriceSortOrderIndices');

  if (_commonJavascript.Common.isNull(choiceItemPriceSortOrderIndices)) {
    object.set('choiceItemPriceSortOrderIndices', {});
  } else if (choiceItemPriceSortOrderIndices) {
    object.set('choiceItemPriceSortOrderIndices', choiceItemPriceSortOrderIndices.toJS());
  }

  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'tag', _Tag2.default);

  var rules = info.get('rules');

  if (_commonJavascript.Common.isNull(rules)) {
    object.set('rules', {});
  } else if (rules) {
    object.set('rules', rules.toJS());
  }
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    MenuItemPrice.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var menuItem = object.get('menuItem');
    var toBeServedWithMenuItemPriceObjects = object.get('toBeServedWithMenuItemPrices');
    var toBeServedWithMenuItemPrices = toBeServedWithMenuItemPriceObjects ? _immutable2.default.fromJS(toBeServedWithMenuItemPriceObjects).map(function (toBeServedWithMenuItemPrice) {
      return new MenuItemPrice(toBeServedWithMenuItemPrice).getInfo();
    }) : undefined;
    var choiceItemPriceObjects = object.get('choiceItemPrices');
    var choiceItemPrices = choiceItemPriceObjects ? _immutable2.default.fromJS(choiceItemPriceObjects).map(function (choiceItemPrice) {
      return new _ChoiceItemPrice2.default(choiceItemPrice).getInfo();
    }) : undefined;
    var defaultChoiceItemPriceObjects = object.get('defaultChoiceItemPrices');
    var defaultChoiceItemPrices = defaultChoiceItemPriceObjects ? _immutable2.default.fromJS(defaultChoiceItemPriceObjects).map(function (choiceItemPrice) {
      return new _ChoiceItemPrice2.default(choiceItemPrice).getInfo();
    }) : undefined;
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
      menuItem: menuItem,
      menuItemId: menuItem ? menuItem.id : undefined,
      toBeServedWithMenuItemPrices: toBeServedWithMenuItemPrices,
      toBeServedWithMenuItemPriceIds: toBeServedWithMenuItemPrices ? toBeServedWithMenuItemPrices.map(function (toBeServedWithMenuItemPrice) {
        return toBeServedWithMenuItemPrice.get('id');
      }) : (0, _immutable.List)(),
      choiceItemPrices: choiceItemPrices,
      choiceItemPriceIds: choiceItemPrices ? choiceItemPrices.map(function (choiceItemPrice) {
        return choiceItemPrice.get('id');
      }) : (0, _immutable.List)(),
      defaultChoiceItemPrices: defaultChoiceItemPrices,
      defaultChoiceItemPriceIds: defaultChoiceItemPrices ? defaultChoiceItemPrices.map(function (choiceItemPrice) {
        return choiceItemPrice.get('id');
      }) : (0, _immutable.List)(),
      addedByUser: addedByUser,
      addedByUserId: addedByUser ? addedByUser.id : undefined,
      removedByUser: removedByUser,
      removedByUserId: removedByUser ? removedByUser.id : undefined,
      toBeServedWithMenuItemPriceSortOrderIndices: _immutable2.default.fromJS(object.get('toBeServedWithMenuItemPriceSortOrderIndices')),
      choiceItemPriceSortOrderIndices: _immutable2.default.fromJS(object.get('choiceItemPriceSortOrderIndices')),
      tags: tags,
      tagIds: tags ? tags.map(function (tag) {
        return tag.get('id');
      }) : (0, _immutable.List)(),
      rules: _immutable2.default.fromJS(object.get('rules'))
    }));
  };
};

exports.default = MenuItemPrice;