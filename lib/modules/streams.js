"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createUint8ArrayStream() {
    return new _stream2.default.Transform({
        transform: function transform(chunk, encoding, next) {
            if (!(chunk instanceof Uint8Array)) chunk = new Uint8Array(chunk);
            this.push(chunk);
            next();
        },
        flush: function flush(done) {
            done();
        }
    });
}

function blobFromUint8ArrayStream(stream, _ref) {
    var _ref$type = _ref.type,
        type = _ref$type === undefined ? 'application/octet-stream' : _ref$type;

    var buffer = [];
    return new Promise(function (fulfill) {
        stream.on("data", function (n) {
            buffer.push(n);
        }).on("finish", function (n) {
            fulfill(new Blob(buffer, { type: type }));
        });
    });
}

var streams = {};
_extends(streams, { createUint8ArrayStream: createUint8ArrayStream, blobFromUint8ArrayStream: blobFromUint8ArrayStream });

exports.default = streams;