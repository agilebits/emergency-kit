"use strict";
/* 1Password Emergency Kit
 * 2.2.1
 * Author: Mitchell Cohen
*/

var _draw = _interopRequireDefault(require("./modules/draw.js"));

var _mixins = _interopRequireDefault(require("./modules/mixins.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EMERGENCY_KIT_VERSION = "V2";

function emergencyKitTemplate(_ref) {
  var email = _ref.email,
      name = _ref.name,
      accountKey = _ref.accountKey,
      domain = _ref.domain,
      teamURL = _ref.teamURL,
      _ref$qrCode = _ref.qrCode,
      qrCode = _ref$qrCode === void 0 ? null : _ref$qrCode;
  return {
    version: EMERGENCY_KIT_VERSION,
    createdAt: new Date().toLocaleDateString(),
    email: email,
    name: name,
    teamURL: teamURL,
    domain: domain,
    accountKey: accountKey,
    qrCode: qrCode
  };
}

var EmergencyKit =
/*#__PURE__*/
function () {
  function EmergencyKit(template) {
    _classCallCheck(this, EmergencyKit);

    this.template = template;
  }

  _createClass(EmergencyKit, [{
    key: "pipe",
    value: function pipe(stream) {
      return (0, _draw["default"])(this.template, stream);
    }
  }, {
    key: "filename",
    get: function get() {
      return "1Password Emergency Kit-".concat(this.template.domain, ".pdf");
    }
  }]);

  return EmergencyKit;
}();

function emergencyKit(config) {
  return new EmergencyKit(emergencyKitTemplate(config));
}

if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
  if (typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
    // Make WebStream available for modules because we might
    // be using webpack
    _extends(EmergencyKit.prototype, _mixins["default"].WebStream);
  } else {
    _extends(EmergencyKit.prototype, _mixins["default"].FileStream);
  }

  module.exports = exports = emergencyKit;
}

var root = typeof window !== 'undefined' && window || typeof global !== 'undefined' && global || typeof root !== 'undefined' && root || typeof void 0 !== 'undefined' && void 0;

if (typeof root !== 'undefined') {
  _extends(EmergencyKit.prototype, _mixins["default"].WebStream);

  root.emergencyKit = emergencyKit;
}
