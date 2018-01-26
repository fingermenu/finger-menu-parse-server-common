'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commonJavascript = require('@microbusiness/common-javascript');

var _commonJavascript2 = _interopRequireDefault(_commonJavascript);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _parseServerCommon = require('@microbusiness/parse-server-common');

var _Tag = require('./Tag');

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuItem = function (_BaseObject) {
  _inherits(MenuItem, _BaseObject);

  function MenuItem(object) {
    _classCallCheck(this, MenuItem);

    var _this = _possibleConstructorReturn(this, (MenuItem.__proto__ || Object.getPrototypeOf(MenuItem)).call(this, object, 'MenuItem'));

    _initialiseProps.call(_this);

    return _this;
  }

  return MenuItem;
}(_parseServerCommon.BaseObject);

MenuItem.spawn = function (info) {
  var object = new MenuItem();

  MenuItem.updateInfoInternal(object, info);

  return object;
};

MenuItem.updateInfoInternal = function (object, info) {
  _parseServerCommon.BaseObject.createMultiLanguagesStringColumn(object, info, 'name');
  _parseServerCommon.BaseObject.createMultiLanguagesStringColumn(object, info, 'description');
  object.set('menuItemPageUrl', info.get('menuItemPageUrl'));
  object.set('imageUrl', info.get('imageUrl'));
  _parseServerCommon.BaseObject.createArrayPointer(object, info, 'tag', _Tag2.default);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'ownedByUser');
  _parseServerCommon.BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    MenuItem.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var tagObjects = object.get('tags');
    var tags = tagObjects ? _immutable2.default.fromJS(tagObjects).map(function (tag) {
      return new _Tag2.default(tag).getInfo();
    }) : undefined;
    var ownedByUser = object.get('ownedByUser');
    var maintainedByUsers = _immutable2.default.fromJS(object.get('maintainedByUsers'));

    return _commonJavascript2.default.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      name: _this2.getMultiLanguagesString('name'),
      description: _this2.getMultiLanguagesString('description'),
      menuItemPageUrl: object.get('menuItemPageUrl'),
      imageUrl: object.get('imageUrl'),
      tags: tags,
      tagIds: tags ? tags.map(function (tag) {
        return tag.get('id');
      }) : (0, _immutable.List)(),
      ownedByUser: ownedByUser,
      ownedByUserId: ownedByUser ? ownedByUser.id : undefined,
      maintainedByUsers: maintainedByUsers,
      maintainedByUserIds: maintainedByUsers ? maintainedByUsers.map(function (maintainedByUser) {
        return maintainedByUser.id;
      }) : (0, _immutable.List)()
    }));
  };
};

exports.default = MenuItem;