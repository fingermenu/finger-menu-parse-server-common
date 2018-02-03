'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _Restaurant = require('./Restaurant');

var _Restaurant2 = _interopRequireDefault(_Restaurant);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Order = function (_BaseObject) {
  _inherits(Order, _BaseObject);

  function Order(object) {
    _classCallCheck(this, Order);

    var _this = _possibleConstructorReturn(this, (Order.__proto__ || Object.getPrototypeOf(Order)).call(this, object, 'Order'));

    _initialiseProps.call(_this);

    return _this;
  }

  return Order;
}(_parseServerCommon.BaseObject);

Order.spawn = function (info) {
  var object = new Order();

  Order.updateInfoInternal(object, info);

  return object;
};

Order.updateInfoInternal = function (object, info) {
  var details = info.get('details');

  if (_commonJavascript.Common.isNull(details)) {
    object.set('details', []);
  } else if (details) {
    object.set('details', details.toJS());
  }

  _parseServerCommon.BaseObject.createPointer(object, info, 'table', _Table2.default);
  _parseServerCommon.BaseObject.createPointer(object, info, 'restaurant', _Restaurant2.default);
  object.set('numberOfAdults', info.get('numberOfAdults'));
  object.set('numberOfChildren', info.get('numberOfChildren'));
  _parseServerCommon.BaseObject.createStringColumn(object, info, 'customerName');
  _parseServerCommon.BaseObject.createStringColumn(object, info, 'notes');
  object.set('totalPrice', info.get('totalPrice'));
  object.set('placedAt', info.get('placedAt'));
  object.set('cancelledAt', info.get('cancelledAt'));
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    Order.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var restaurant = object.get('restaurant');
    var table = object.get('table');

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      details: _immutable2.default.fromJS(object.get('details')),
      restaurant: restaurant,
      restaurantId: restaurant ? restaurant.id : undefined,
      table: table,
      tableId: table ? table.id : undefined,
      numberOfAdults: object.get('numberOfAdults'),
      numberOfChildren: object.get('numberOfChildren'),
      customerName: object.get('customerName'),
      notes: object.get('notes'),
      totalPrice: object.get('totalPrice'),
      placedAt: object.get('placedAt'),
      cancelledAt: object.get('cancelledAt')
    }));
  };
};

exports.default = Order;