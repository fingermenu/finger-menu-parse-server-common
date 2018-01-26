'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _commonJavascript2 = _interopRequireDefault(_commonJavascript);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _parseServerCommon = require('@microbusiness/parse-server-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tag = function (_BaseObject) {
  _inherits(Tag, _BaseObject);

  function Tag(object) {
    _classCallCheck(this, Tag);

    var _this = _possibleConstructorReturn(this, (Tag.__proto__ || Object.getPrototypeOf(Tag)).call(this, object, 'Tag'));

    _initialiseProps.call(_this);

    return _this;
  }

  return Tag;
}(_parseServerCommon.BaseObject);

Tag.spawn = function (info) {
  var object = new Tag();

  Tag.updateInfoInternal(object, info);

  return object;
};

Tag.updateInfoInternal = function (object, info) {
  _parseServerCommon.BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
  _parseServerCommon.BaseObject.createMultiLanguagesStringColumn(object, info, 'description');
  object.set('level', info.get('level'));
  object.set('forDisplay', info.get('forDisplay'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'parentTag', Tag);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'ownedByUser');
  _parseServerCommon.BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    Tag.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var parentTagObject = object.get('parentTag');
    var parentTag = parentTagObject ? new Tag(parentTagObject) : undefined;
    var ownedByUser = object.get('ownedByUser');
    var maintainedByUsers = _immutable2.default.fromJS(object.get('maintainedByUsers'));

    return _commonJavascript2.default.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      name: _this2.getMultiLanguagesString('name'),
      description: _this2.getMultiLanguagesString('description'),
      level: object.get('level'),
      forDisplay: object.get('forDisplay'),
      parentTag: parentTag ? parentTag.getInfo() : undefined,
      parentTagId: parentTag ? parentTag.getId() : undefined,
      ownedByUser: ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers: maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(function (maintainedByUser) {
        return maintainedByUser.id;
      }) : (0, _immutable.List)()
    }));
  };
};

exports.default = Tag;