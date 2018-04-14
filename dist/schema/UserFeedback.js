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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserFeedback = function (_BaseObject) {
  _inherits(UserFeedback, _BaseObject);

  function UserFeedback(object) {
    _classCallCheck(this, UserFeedback);

    var _this = _possibleConstructorReturn(this, (UserFeedback.__proto__ || Object.getPrototypeOf(UserFeedback)).call(this, object, 'UserFeedback'));

    _initialiseProps.call(_this);

    return _this;
  }

  return UserFeedback;
}(_parseServerCommon.BaseObject);

UserFeedback.spawn = function (info) {
  var object = new UserFeedback();

  UserFeedback.updateInfoInternal(object, info);

  return object;
};

UserFeedback.updateInfoInternal = function (object, info) {
  var questionAndAnswers = info.get('questionAndAnswers');

  object.set('questionAndAnswers', questionAndAnswers ? questionAndAnswers.toJS() : []);
  _parseServerCommon.BaseObject.createStringColumn(object, info, 'others');
  object.set('submittedAt', info.get('submittedAt'));
  _parseServerCommon.BaseObject.createPointer(object, info, 'restaurant', _Restaurant2.default);
  _parseServerCommon.BaseObject.createUserPointer(object, info, 'addedByUser');
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.updateInfo = function (info) {
    UserFeedback.updateInfoInternal(_this2.getObject(), info);

    return _this2;
  };

  this.getInfo = function () {
    var object = _this2.getObject();
    var restaurant = object.get('restaurant');
    var addedByUser = object.get('addedByUser');

    return _commonJavascript.ImmutableEx.removeUndefinedProps((0, _immutable.Map)({
      id: _this2.getId(),
      questionAndAnswers: _immutable2.default.fromJS(object.get('questionAndAnswers')),
      others: object.get('others'),
      submittedAt: object.get('submittedAt'),
      restaurant: restaurant,
      restaurantId: restaurant ? restaurant.id : undefined,
      addedByUser: addedByUser,
      addedByUserId: addedByUser ? addedByUser.id : undefined
    }));
  };
};

exports.default = UserFeedback;