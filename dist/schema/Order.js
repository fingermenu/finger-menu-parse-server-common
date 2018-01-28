'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _OrderState = require('./OrderState');

var _OrderState2 = _interopRequireDefault(_OrderState);

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
  object.set('details', info.get('details').toJS());
  _parseServerCommon.BaseObject.createPointer(object, info, 'table', _Table2.default);
  _parseServerCommon.BaseObject.createPointer(object, info, 'orderState', _OrderState2.default);
  _parseServerCommon.BaseObject.createStringColumn(object, info, 'customerName');
  object.set('notes', info.get('notes'));
  object.set('totalPrice', info.get('totalPrice'));
  object.set('placedAt', info.get('placedAt'));
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    Order.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var table = object.get('table');
    var orderState = object.get('orderState');

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      details: _immutable2.default.fromJS(object.get('details')),
      table: table,
      tableId: table ? table.id : undefined,
      orderState: orderState,
      orderStateId: orderState ? orderState.id : undefined,
      customerName: object.get('customerName'),
      notes: object.get('notes'),
      totalPrice: object.get('totalPrice'),
      placedAt: object.get('placedAt')
    }));
  };
};

exports.default = Order;