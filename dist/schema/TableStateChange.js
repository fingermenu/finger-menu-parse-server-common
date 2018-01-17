'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableStateChange = function (_BaseObject) {
  _inherits(TableStateChange, _BaseObject);

  function TableStateChange(object) {
    _classCallCheck(this, TableStateChange);

    var _this = _possibleConstructorReturn(this, (TableStateChange.__proto__ || Object.getPrototypeOf(TableStateChange)).call(this, object, 'TableStateChange'));

    _initialiseProps.call(_this);

    return _this;
  }

  return TableStateChange;
}(_parseServerCommon.BaseObject);

TableStateChange.spawn = function (info) {
  var object = new TableStateChange();

  TableStateChange.updateInfoInternal(object, info);

  return object;
};

TableStateChange.updateInfoInternal = function (object, info) {
  object.set('state', info.get('state'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'table', _Table2.default);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'user');
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    TableStateChange.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var table = object.get('table');
    var user = object.get('user');

    return (0, _immutable.Map)({
      id: _this2.getId(),
      state: object.get('state'),
      table: table,
      tableId: table ? table.id : undefined,
      user: user,
      userId: user ? user.id : undefined
    });
  };
};

exports.default = TableStateChange;