'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _immutable = require('immutable');

var _Tag = require('./Tag');

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServingTime = function (_BaseObject) {
  _inherits(ServingTime, _BaseObject);

  function ServingTime(object) {
    _classCallCheck(this, ServingTime);

    var _this = _possibleConstructorReturn(this, (ServingTime.__proto__ || Object.getPrototypeOf(ServingTime)).call(this, object, 'ServingTime'));

    _initialiseProps.call(_this);

    return _this;
  }

  return ServingTime;
}(_parseServerCommon.BaseObject);

ServingTime.spawn = function (info) {
  var object = new ServingTime();

  ServingTime.updateInfoInternal(object, info);

  return object;
};

ServingTime.updateInfoInternal = function (object, info) {
  _parseServerCommon.BaseObject.createPointer(object, info, 'tag', _Tag2.default);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'addedByUser');
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'removedByUser');
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    ServingTime.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var tag = object.get('tag');
    var addedByUser = object.get('addedByUser');
    var removedByUser = object.get('removedByUser');

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      tag: tag,
      tagId: tag ? tag.id : undefined,
      addedByUser: addedByUser,
      addedByUserId: addedByUser ? addedByUser.id : undefined,
      removedByUser: removedByUser,
      removedByUserId: removedByUser ? removedByUser.id : undefined
    }));
  };
};

exports.default = ServingTime;