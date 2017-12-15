'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _microBusinessParseServerCommon = require('micro-business-parse-server-common');

var _Tag = require('./Tag');

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChoiceItem = function (_BaseObject) {
  _inherits(ChoiceItem, _BaseObject);

  function ChoiceItem(object) {
    _classCallCheck(this, ChoiceItem);

    var _this = _possibleConstructorReturn(this, (ChoiceItem.__proto__ || Object.getPrototypeOf(ChoiceItem)).call(this, object, 'ChoiceItem'));

    _initialiseProps.call(_this);

    return _this;
  }

  return ChoiceItem;
}(_microBusinessParseServerCommon.BaseObject);

ChoiceItem.spawn = function (info) {
  var object = new ChoiceItem();

  ChoiceItem.updateInfoInternal(object, info);

  return object;
};

ChoiceItem.updateInfoInternal = function (object, info) {
  _microBusinessParseServerCommon.BaseObject.createStringColumn(object, info, 'name');
  _microBusinessParseServerCommon.BaseObject.createStringColumn(object, info, 'description');
  object.set('choiceItemPageUrl', info.get('choiceItemPageUrl'));
  object.set('imageUrl', info.get('imageUrl'));
  _microBusinessParseServerCommon.BaseObject.createArrayPointer(object, info, 'tag', _Tag2.default);
  _microBusinessParseServerCommon.BaseObject.createUserPointer(object, info, 'ownedByUser');
  _microBusinessParseServerCommon.BaseObject.createUserArrayPointer(object, info, 'maintainedByUser');
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    ChoiceItem.updateInfoInternal(_this2.getObject(), info);

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

    return (0, _immutable.Map)({
      id: _this2.getId(),
      name: object.get('name'),
      description: object.get('description'),
      choiceItemPageUrl: object.get('choiceItemPageUrl'),
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
    });
  };
};

exports.default = ChoiceItem;