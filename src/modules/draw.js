"use strict";

import PDFDocument from "pdfkit";
import moment from "moment";

let fs = require("fs");

// US Letter
const DOC_WIDTH = 612;
const DOC_HEIGHT = 792;

// Pretty colours
const OP_OUTLINE_RED = [ 251.2, 236, 237.2 ];
const OP_RED = [ 243.6, 198, 201.6 ];
const OP_DARK_RED = "#d9414e";

// Doc measurements
const LEFT_MARGIN = 36;
const RIGHT_MARGIN = 36;
const MAX_WIDTH = 540;

function loadAssetsSync() {
    let header = fs.readFileSync('images/header@3x.png');
    let pencil = fs.readFileSync('images/pencil@3x.png');
    let ak = fs.readFileSync('images/ak-icon@3x.png');
    let mp = fs.readFileSync('images/mp-icon@3x.png');
    let proxima = fs.readFileSync('font/proxima-nova-regular.ttf');
    return {header, pencil, ak, mp, proxima};
}

function prettyGraphics(kit) {
    let doc = this;

    let {header, pencil, ak, mp, proxima} = loadAssetsSync();
    doc.registerFont('proxima', proxima, 'ProximaNova-Regular');

    // Banner
    doc
        .image(header, LEFT_MARGIN, RIGHT_MARGIN, {width: MAX_WIDTH});

    //Field BG
    doc
        .roundedRect(LEFT_MARGIN, 304, MAX_WIDTH, 271, 10)
        .fillAndStroke(OP_OUTLINE_RED, OP_RED);

    // Fields
    doc
        .roundedRect(LEFT_MARGIN + 18, 354, MAX_WIDTH - 36, 36, 5)
        .roundedRect(LEFT_MARGIN + 18, 409, MAX_WIDTH - 36, 36, 5)
        .roundedRect(LEFT_MARGIN + 18, 465, MAX_WIDTH - 36, 36, 5)
        .fill("white")
        .roundedRect(LEFT_MARGIN + 18, 521, MAX_WIDTH - 36, 36, 5)
        .fillAndStroke("white", OP_DARK_RED);

    // Icons
    doc
        .image(pencil, LEFT_MARGIN + 28, 530, {width: 19})
        .image(ak, MAX_WIDTH - 42, 472, {width: 50})
        .image(mp, MAX_WIDTH - 18, 526, {width: 26});

    // Labels
    doc
        .fontSize(16)
        .fillColor(OP_DARK_RED)
        .text("1Password Account", 0, 318, {align: "center"})
        .fontSize(10)
        .fillColor("#333")
        .text("SIGN-IN ADDRESS", LEFT_MARGIN + 28, 342)
        .text("EMAIL ADDRESS", LEFT_MARGIN + 28, 398)
        .text("ACCOUNT KEY", LEFT_MARGIN + 28, 454)
        .text("MASTER PASSWORD", LEFT_MARGIN + 28, 510);

    // Documentation
    doc
        .fontSize(14)
        .fillColor("#333")
        .text(
          "Once you fill in your Master Password, the details below can be used " +
          "to sign in to your 1Password account in an emergency.",
          37, 173, {width: MAX_WIDTH, lineGap: 2}
        )
        .moveDown(1)
        .text("1. Print out this document (and/or put it on a USB key or external drive).")
        .moveDown(0.5)
        .text("2. Fill in your Master Password below.")
        .moveDown(0.5)
        .text("3. Store your kit in a secure place where you can find it, e.g. a safe deposit box.");

    doc
        .fillColor("#333")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Need help?", 36, 610)
        .moveDown(1)
        .font("proxima")
        .text("Contact AgileBits at:")
        .fillColor(OP_DARK_RED)
        .text("support@1password.com");

    doc
        .fillColor("#333")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("QR Code", 403, 610)
        .moveDown(1)
        .font("proxima")
        .text(
          "Scan this code from the 1Password apps to set up your account quickly and easily.",
          {width: 174}
        );

    // User input
    doc
        .fontSize(13)
        .fillColor(OP_DARK_RED)
        .text(`Created for ${kit.name} on ${moment().format('MMMM Do, YYYY')}.`, 0, 128,
          {align: "center"}
        );
    // Account URL
    doc
        .fontSize(14)
        .fillColor(OP_DARK_RED)
        .text(kit.teamURL, LEFT_MARGIN + 28, 369);
    // Email
    doc
        .fontSize(14)
        .fillColor("#333")
        .text(kit.email, LEFT_MARGIN + 28, 425);
    // Account Key
    doc
        .font("Courier")
        .fontSize(14)
        .fillColor("#333")
        .text(kit.accountKey, LEFT_MARGIN + 28, 481);
    // QR code
    if (kit.qrCode) doc.image(kit.qrCode, 234, 612, 144, 144);
}

let drawFuncs = [
    prettyGraphics
];

function render(kit, drawFuncs) {
    let doc = new PDFDocument({
        margin: 0,
        size: "letter"
    });

    drawFuncs.forEach((drawFunc) => {
        let drawSubComponent = drawFunc.bind(doc);
        drawSubComponent(kit);
    });
    doc.end();
    return doc;
}

function draw(kit) {
    return render(kit, drawFuncs);
}

export default function createPDFDocument(template, stream) {
    return draw(template).pipe(stream);
}
