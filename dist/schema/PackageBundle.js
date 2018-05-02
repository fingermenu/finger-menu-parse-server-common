'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _immutable = require('immutable');

var _Restaurant = require('./Restaurant');

var _Restaurant2 = _interopRequireDefault(_Restaurant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PackageBundle = function (_BaseObject) {
  _inherits(PackageBundle, _BaseObject);

  function PackageBundle(object) {
    _classCallCheck(this, PackageBundle);

    var _this = _possibleConstructorReturn(this, (PackageBundle.__proto__ || Object.getPrototypeOf(PackageBundle)).call(this, object, 'PackageBundle'));

    _initialiseProps.call(_this);

    return _this;
  }

  return PackageBundle;
}(_parseServerCommon.BaseObject);

PackageBundle.spawn = function (info) {
  var object = new PackageBundle();

  PackageBundle.updateInfoInternal(object, info);

  return object;
};

PackageBundle.updateInfoInternal = function (object, info) {
  object.set('url', info.get('url'));
  object.set('checksum', info.get('checksum'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'restaurant', _Restaurant2.default);
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    PackageBundle.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var restaurant = object.get('restaurant');

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      url: object.get('url'),
      checksum: object.get('checksum'),
      restaurant: restaurant,
      restaurantId: restaurant ? restaurant.id : undefined
    }));
  };
};

exports.default = PackageBundle;