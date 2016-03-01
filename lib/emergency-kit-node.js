"use strict";

/* 1Password Emergency Kit
 * 2.1.0
 * Author: Mitchell Cohen
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EMERGENCY_KIT_VERSION = "V2";

// US Letter
var DOC_WIDTH = 612;
var DOC_HEIGHT = 792;

// Pretty colours
var OP_OUTLINE_RED = [251.2, 236, 237.2];
var OP_RED = [243.6, 198, 201.6];
var OP_DARK_RED = "#d9414e";

// Doc measurements
var LEFT_MARGIN = 36;
var RIGHT_MARGIN = 36;
var MAX_WIDTH = 540;

var PDFDocument = require("pdfkit");
var stream = require("stream");
var moment = require("moment");
var fs = require("fs");

var draw = {
    prettyGraphics: function prettyGraphics(kit) {
        var doc = this;

        var header = fs.readFileSync('images/header@3x.png');
        var pencil = fs.readFileSync('images/pencil@3x.png');
        var ak = fs.readFileSync('images/ak-icon@3x.png');
        var mp = fs.readFileSync('images/mp-icon@3x.png');
        var proxima = fs.readFileSync('font/proxima-nova-regular.ttf');
        doc.registerFont('proxima', proxima, 'ProximaNova-Regular');

        // Banner
        doc.image(header, LEFT_MARGIN, RIGHT_MARGIN, { width: MAX_WIDTH });

        //Field BG
        doc.roundedRect(LEFT_MARGIN, 304, MAX_WIDTH, 271, 10).fillAndStroke(OP_OUTLINE_RED, OP_RED);

        // Fields
        doc.roundedRect(LEFT_MARGIN + 18, 354, MAX_WIDTH - 36, 36, 5).roundedRect(LEFT_MARGIN + 18, 409, MAX_WIDTH - 36, 36, 5).roundedRect(LEFT_MARGIN + 18, 465, MAX_WIDTH - 36, 36, 5).fill("white").roundedRect(LEFT_MARGIN + 18, 521, MAX_WIDTH - 36, 36, 5).fillAndStroke("white", OP_DARK_RED);

        // Icons
        doc.image(pencil, LEFT_MARGIN + 28, 530, { width: 19 }).image(ak, MAX_WIDTH - 42, 472, { width: 50 }).image(mp, MAX_WIDTH - 18, 526, { width: 26 });

        // Labels
        doc.fontSize(16).fillColor(OP_DARK_RED).text("SIGN IN DETAILS", 0, 318, { align: "center" }).fontSize(10).fillColor("#333").text("ACCOUNT URL", LEFT_MARGIN + 28, 342).text("EMAIL ADDRESS", LEFT_MARGIN + 28, 398).text("ACCOUNT KEY", LEFT_MARGIN + 28, 454).text("MASTER PASSWORD", LEFT_MARGIN + 28, 510);

        // Documentation
        doc.fontSize(14).fillColor("#333").text("Once you fill in your Master Password, the details below can be used " + "to sign in to your 1Password account in an emergency.", 37, 173, { width: MAX_WIDTH, lineGap: 2 }).moveDown(1).text("1. Print out this document (and/or put it on a USB key or external drive).").moveDown(0.5).text("2. Fill in your Master Password below.").moveDown(0.5).text("3. Store your kit in a secure place where you can find it, e.g. a safe deposit box.");

        doc.fillColor("#333").font("Helvetica-Bold").fontSize(14).text("Need help?", 36, 610).moveDown(1).font("proxima").text("Contact AgileBits at:").fillColor(OP_DARK_RED).text("support@1password.com");

        doc.fillColor("#333").font("Helvetica-Bold").fontSize(14).text("QR Code", 403, 610).moveDown(1).font("proxima").text("Scan this code from the 1Password apps to set up your account quickly and easily.", { width: 174 });

        // User input
        doc.fontSize(13).fillColor(OP_DARK_RED).text("Created for " + kit.name + " on " + moment().format('MMMM Do, YYYY') + ".", 0, 128, { align: "center" });
        // Account URL
        doc.fontSize(14).fillColor(OP_DARK_RED).text(kit.teamURL, LEFT_MARGIN + 28, 369);
        // Email
        doc.fontSize(14).fillColor("#333").text(kit.email, LEFT_MARGIN + 28, 425);
        // Account Key
        doc.font("Courier").fontSize(14).fillColor("#333").text(kit.accountKey, LEFT_MARGIN + 28, 481);
        // QR code
        if (kit.qrCode) doc.image(kit.qrCode, 234, 612, 144, 144);
    }
};

function createUint8ArrayStream() {
    return new stream.Transform({
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
    var _ref$type = _ref.type;
    var type = _ref$type === undefined ? 'application/octet-stream' : _ref$type;

    var buffer = [];
    return new Promise(function (fulfill) {
        stream.on("data", function (n) {
            buffer.push(n);
        }).on("finish", function (n) {
            fulfill(new Blob(buffer, { type: type }));
        });
    });
}

function render(kit, drawFuncs) {
    var doc = new PDFDocument({
        margin: 0,
        size: "letter"
    });

    drawFuncs.forEach(function (drawFunc) {
        var drawSubComponent = drawFunc.bind(doc);
        drawSubComponent(kit);
    });
    doc.end();
    return doc;
}

function emergencyKitTemplate(_ref2) {
    var email = _ref2.email;
    var name = _ref2.name;
    var accountKey = _ref2.accountKey;
    var domain = _ref2.domain;
    var teamURL = _ref2.teamURL;
    var _ref2$qrCode = _ref2.qrCode;
    var qrCode = _ref2$qrCode === undefined ? null : _ref2$qrCode;

    return {
        version: EMERGENCY_KIT_VERSION,
        createdAt: moment().format("MMMM Do, YYYY"),
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
        this.filename = "1Password Emergency Kit-" + this.template.domain + ".pdf";
    }

    _createClass(EmergencyKit, [{
        key: "_generate",
        value: function _generate(stream) {
            return render(this.template, [draw.prettyGraphics]).pipe(stream);
        }
    }, {
        key: "pipe",
        value: function pipe(stream) {
            return this._generate(stream);
        }
    }, {
        key: "_toUint8",
        value: function _toUint8() {
            return this.pipe(createUint8ArrayStream());
        }
    }, {
        key: "toFile",
        value: function toFile() {
            var filename = arguments.length <= 0 || arguments[0] === undefined ? this.filename : arguments[0];

            return this.pipe(fs.createWriteStream(filename));
        }
    }, {
        key: "toBlob",
        value: function toBlob() {
            if (typeof Blob === 'undefined') {
                throw new Error("No Blob object found. Are you running in node?");
            }

            return blobFromUint8ArrayStream(this._toUint8(), { type: "application/pdf" });
        }

        // Convenience method for browsers

    }, {
        key: "toURL",
        value: function toURL() {
            if (typeof URL === 'undefined') {
                return new Error("No URL object found. Are you running in node?");
            }

            return this.toBlob().then(function (blob) {
                return URL.createObjectURL(blob);
            });
        }
    }]);

    return EmergencyKit;
}();

function emergencyKit(config) {
    return new EmergencyKit(emergencyKitTemplate(config));
}

if (typeof window !== 'undefined') {
    window.emergencyKit = emergencyKit;
} else {
    module.exports = emergencyKit;
}
