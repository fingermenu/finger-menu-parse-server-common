'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _immutable = require('immutable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RequestLog = function (_BaseObject) {
  _inherits(RequestLog, _BaseObject);

  function RequestLog(object) {
    _classCallCheck(this, RequestLog);

    var _this = _possibleConstructorReturn(this, (RequestLog.__proto__ || Object.getPrototypeOf(RequestLog)).call(this, object, 'RequestLog'));

    _initialiseProps.call(_this);

    return _this;
  }

  return RequestLog;
}(_parseServerCommon.BaseObject);

RequestLog.spawn = function (info) {
  var object = new RequestLog();

  RequestLog.updateInfoInternal(object, info);

  return object;
};

RequestLog.updateInfoInternal = function (object, info) {
  object.set('appVersion', info.get('appVersion'));
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'user');
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    RequestLog.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var user = object.get('user');

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      createdAt: object.get('createdAt'),
      updatedAt: object.get('updatedAt'),
      appVersion: object.get('appVersion'),
      user: user,
      userId: user ? user.id : undefined
    }));
  };
};

exports.default = RequestLog;