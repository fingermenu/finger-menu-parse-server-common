'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Restaurant = require('./Restaurant');

var _Restaurant2 = _interopRequireDefault(_Restaurant);

var _TableState = require('./TableState');

var _TableState2 = _interopRequireDefault(_TableState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = function (_BaseObject) {
  _inherits(Table, _BaseObject);

  function Table(object) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, object, 'Table'));

    _initialiseProps.call(_this);

    return _this;
  }

  return Table;
}(_parseServerCommon.BaseObject);

Table.spawn = function (info) {
  var object = new Table();

  Table.updateInfoInternal(object, info);

  return object;
};

Table.updateInfoInternal = function (object, info) {
  _parseServerCommon.BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
  object.set('status', info.get('status'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'restaurant', _Restaurant2.default);
  _parseServerCommon.BaseObject.createPointer(object, info, 'tableState', _TableState2.default);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'ownedByUser');
  _parseServerCommon.BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
  object.set('numberOfAdults', info.get('numberOfAdults'));
  object.set('numberOfChildren', info.get('numberOfChildren'));
  _parseServerCommon.BaseObject.createStringColumn(object, info, 'customerName');
  _parseServerCommon.BaseObject.createStringColumn(object, info, 'notes');
  object.set('sortOrderIndex', info.get('sortOrderIndex'));
  object.set('lastOrderCorrelationId', info.get('lastOrderCorrelationId'));
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    Table.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var restaurant = object.get('restaurant');
    var tableState = object.get('tableState');
    var ownedByUser = object.get('ownedByUser');
    var maintainedByUsers = _immutable2.default.fromJS(object.get('maintainedByUsers'));

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      createdAt: object.get('createdAt'),
      updatedAt: object.get('updatedAt'),
      name: _this2.getMultiLanguagesString('name'),
      status: object.get('status'),
      restaurant: restaurant,
      restaurantId: restaurant ? restaurant.id : undefined,
      tableState: tableState,
      tableStateId: tableState ? tableState.id : undefined,
      ownedByUser: ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers: maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(function (maintainedByUser) {
        return maintainedByUser.id;
      }) : (0, _immutable.List)(),
      numberOfAdults: object.get('numberOfAdults'),
      numberOfChildren: object.get('numberOfChildren'),
      customerName: object.get('customerName'),
      notes: object.get('notes'),
      sortOrderIndex: object.get('sortOrderIndex'),
      lastOrderCorrelationId: object.get('lastOrderCorrelationId')
    }));
  };
};

exports.default = Table;