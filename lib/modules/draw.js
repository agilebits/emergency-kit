"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createPDFDocument;

var _pdfkit = require("pdfkit");

var _pdfkit2 = _interopRequireDefault(_pdfkit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require("fs");

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

function loadAssetsSync() {
    var header = fs.readFileSync(__dirname + '/../../images/header@3x.png');
    var pencil = fs.readFileSync(__dirname + '/../../images/pencil@3x.png');
    var ak = fs.readFileSync(__dirname + '/../../images/ak-icon@3x.png');
    var mp = fs.readFileSync(__dirname + '/../../images/mp-icon@3x.png');
    var proxima = fs.readFileSync(__dirname + '/../../font/proxima-nova-regular.ttf');
    return { header: header, pencil: pencil, ak: ak, mp: mp, proxima: proxima };
}

function prettyGraphics(kit) {
    var doc = this;

    var _loadAssetsSync = loadAssetsSync(),
        header = _loadAssetsSync.header,
        pencil = _loadAssetsSync.pencil,
        ak = _loadAssetsSync.ak,
        mp = _loadAssetsSync.mp,
        proxima = _loadAssetsSync.proxima;

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
    doc.fontSize(16).fillColor(OP_DARK_RED).text("1Password Account", 0, 318, { align: "center" }).fontSize(10).fillColor("#333").text("SIGN-IN ADDRESS", LEFT_MARGIN + 28, 342).text("EMAIL ADDRESS", LEFT_MARGIN + 28, 398).text("SECRET KEY", LEFT_MARGIN + 28, 454).text("MASTER PASSWORD", LEFT_MARGIN + 28, 510);

    // Documentation
    doc.fontSize(14).fillColor("#333").text("Once you fill in your Master Password, the details below can be used " + "to sign in to your 1Password account in an emergency.", 37, 173, { width: MAX_WIDTH, lineGap: 2 }).moveDown(1).text("1. Print out this document (and/or put it on a USB key or external drive).").moveDown(0.5).text("2. Fill in your Master Password below.").moveDown(0.5).text("3. Store your kit in a secure place where you can find it, e.g. a safe deposit box.");

    doc.fillColor("#333").font("Helvetica-Bold").fontSize(14).text("Need help?", 36, 610).moveDown(1).font("proxima").text("Contact AgileBits at:").fillColor(OP_DARK_RED).text("support@1password.com");

    doc.fillColor("#333").font("Helvetica-Bold").fontSize(14).text("Setup code", 403, 610).moveDown(1).font("proxima").text("Scan this code from the 1Password apps to set up your account quickly and easily.", { width: 174 });

    // User input
    doc.fontSize(13).fillColor(OP_DARK_RED).text("Created for " + kit.name + " on " + new Date().toLocaleDateString() + ".", 0, 128, { align: "center" });
    // Account URL
    doc.fontSize(14).fillColor(OP_DARK_RED).text(kit.teamURL, LEFT_MARGIN + 28, 369);
    // Email
    doc.fontSize(14).fillColor("#333").text(kit.email, LEFT_MARGIN + 28, 425);
    // Secret Key
    doc.font("Courier").fontSize(14).fillColor("#333").text(kit.accountKey, LEFT_MARGIN + 28, 481);
    // Setup code
    if (kit.qrCode) doc.image(kit.qrCode, 234, 612, 144, 144);
}

var drawFuncs = [prettyGraphics];

function render(kit, drawFuncs) {
    var doc = new _pdfkit2.default({
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

function draw(kit) {
    return render(kit, drawFuncs);
}

function createPDFDocument(template, stream) {
    return draw(template).pipe(stream);
}