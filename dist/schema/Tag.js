'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _microBusinessParseServerCommon = require('micro-business-parse-server-common');

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
}(_microBusinessParseServerCommon.BaseObject);

Tag.spawn = function (info) {
  var object = new Tag();

  Tag.updateInfoInternal(object, info);

  return object;
};

Tag.updateInfoInternal = function (object, info) {
  object.set('key', info.get('key'));
  _microBusinessParseServerCommon.BaseObject.createStringColumn(object, info, 'name');
  _microBusinessParseServerCommon.BaseObject.createStringColumn(object, info, 'description');
  object.set('level', info.get('level'));
  object.set('forDisplay', info.get('forDisplay'));
  _microBusinessParseServerCommon.BaseObject.createPointer(object, info, 'parentTag', Tag);
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

    return (0, _immutable.Map)({
      id: _this2.getId(),
      key: object.get('key'),
      name: object.get('name'),
      description: object.get('description'),
      level: object.get('level'),
      forDisplay: object.get('forDisplay'),
      parentTag: parentTag ? parentTag.getInfo() : undefined,
      parentTagId: parentTag ? parentTag.getId() : undefined
    });
  };
};

exports.default = Tag;