'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _microBusinessParseServerCommon = require('micro-business-parse-server-common');

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

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
}(_microBusinessParseServerCommon.BaseObject);

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
  _microBusinessParseServerCommon.BaseObject.createPointer(object, info, 'menuItem', _MenuItem2.default);
  _microBusinessParseServerCommon.BaseObject.createUserPointer(object, info, 'addedByUser');
  _microBusinessParseServerCommon.BaseObject.createUserPointer(object, info, 'removedByUser');
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
    var addedByUser = object.get('addedByUser');
    var removedByUser = object.get('removedByUser');

    return (0, _immutable.Map)({
      id: _this2.getId(),
      currentPrice: object.get('currentPrice'),
      wasPrice: object.get('wasPrice'),
      validFrom: object.get('validFrom'),
      validUntil: object.get('validUntil'),
      menuItem: menuItem,
      menuItemId: menuItem ? menuItem.id : undefined,
      addedByUser: addedByUser,
      addedByUserId: addedByUser ? addedByUser.id : undefined,
      removedByUser: removedByUser,
      removedByUserId: removedByUser ? removedByUser.id : undefined
    });
  };
};

exports.default = MenuItemPrice;