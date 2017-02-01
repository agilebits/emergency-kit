"use strict";

/* 1Password Emergency Kit
 * 2.2.1
 * Author: Mitchell Cohen
*/

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _draw = require("./modules/draw.js");

var _draw2 = _interopRequireDefault(_draw);

var _mixins = require("./modules/mixins.js");

var _mixins2 = _interopRequireDefault(_mixins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EMERGENCY_KIT_VERSION = "V2";

function emergencyKitTemplate(_ref) {
    var email = _ref.email,
        name = _ref.name,
        accountKey = _ref.accountKey,
        domain = _ref.domain,
        teamURL = _ref.teamURL,
        _ref$qrCode = _ref.qrCode,
        qrCode = _ref$qrCode === undefined ? null : _ref$qrCode;

    return {
        version: EMERGENCY_KIT_VERSION,
        createdAt: (0, _moment2.default)().format("MMMM Do, YYYY"),
        email: email,
        name: name,
        teamURL: teamURL,
        domain: domain,
        accountKey: accountKey,
        qrCode: qrCode
    };
}

var EmergencyKit = function () {
    function EmergencyKit(template) {
        _classCallCheck(this, EmergencyKit);

        this.template = template;
    }

    _createClass(EmergencyKit, [{
        key: "pipe",
        value: function pipe(stream) {
            return (0, _draw2.default)(this.template, stream);
        }
    }, {
        key: "filename",
        get: function get() {
            return "1Password Emergency Kit-" + this.template.domain + ".pdf";
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
        _extends(EmergencyKit.prototype, _mixins2.default.WebStream);
    } else {
        _extends(EmergencyKit.prototype, _mixins2.default.FileStream);
    }
    module.exports = exports = emergencyKit;
}

var root = typeof window !== 'undefined' && window || typeof global !== 'undefined' && global || typeof root !== 'undefined' && root || typeof undefined !== 'undefined' && undefined;

if (typeof root !== 'undefined') {
    _extends(EmergencyKit.prototype, _mixins2.default.WebStream);
    root.emergencyKit = emergencyKit;
}
