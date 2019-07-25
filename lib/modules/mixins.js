"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _streams = _interopRequireDefault(require("./streams.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var fs = require('fs'); // Doesn't work with ES6 import syntax
// Mixin for blob streaming in browsers. Implementors must implement pipe()


function WebStream() {
  var toUint8 = function toUint8(stream) {
    return stream.pipe(_streams["default"].createUint8ArrayStream());
  };

  return {
    toBlob: function toBlob() {
      if (typeof Blob === 'undefined') {
        throw new Error("No Blob object found. Are you running in node?");
      }

      return _streams["default"].blobFromUint8ArrayStream(toUint8(this), {
        type: "application/pdf"
      });
    },
    // Convenience method for browsers
    toURL: function toURL() {
      if (typeof URL === 'undefined') {
        return new Error("No URL object found. Are you running in node?");
      }

      return this.toBlob().then(function (blob) {
        return URL.createObjectURL(blob);
      });
    }
  };
} // Mixin for file streaming in node. Implementors must implement pipe()


function FileStream() {
  return {
    toFile: function toFile() {
      var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.filename;
      return this.pipe(fs.createWriteStream(filename));
    }
  };
}

var mixins = {};

_extends(mixins, {
  WebStream: WebStream(),
  FileStream: FileStream()
});

var _default = mixins;
exports["default"] = _default;