"use strict";

/* 1Password Emergency Kit
 * 2.0.0
 * Author: Mitchell Cohen
*/

const EMERGENCY_KIT_VERSION = "V2";

    // US Letter
const DOC_WIDTH = 612;
const DOC_HEIGHT = 792;

    // Pretty colours
const OP_BLUE = "#0080FF";
const OP_DARK_BLUE = "#0066CC";
const OP_GRAY = "#F5F9FA";


const OP_OUTLINE_RED = [ 251.2, 236, 237.2 ];
const OP_RED = [ 243.6, 198, 201.6 ];
const OP_DARK_RED = "#d9414e";

  // Doc measurements
const LEFT_MARGIN = 36;
const RIGHT_MARGIN = 36;
const MAX_WIDTH = 540;


let PDFDocument = require("pdfkit");
let blobStream = require("blob-stream");
let moment = require("moment");
let fs = require("fs");

window.EmergencyKit = class EmergencyKit {
    constructor(options) {
        this.email = options.email;
        this.name = options.name;
        this.accountKey = options.accountKey;
        this.domain = options.domain;
        this.teamURL = options.teamURL;
        this.qrCode = options.qrCode;
        this.filename = options.filename || `1Password Emergency Kit-${domain}`;
        this._downloadURL = null;
    }

    template() {
        return {
            version: EMERGENCY_KIT_VERSION,
            email: this.email,
            name: this.name,
            teamURL: this.teamURL,
            domain: this.domain,
            accountKey: this.accountKey,
            createdAt: moment().format("MMMM Do, YYYY"),
            qrCode: this.qrCode
        };
    }

    getDownloadURL() {
        return new Promise((fulfill, reject) => {
            if (this._downloadURL) {
                fulfill(this._downloadURL);
                return;
            }
            let server, doc;

            doc = render(this.template());

            let stream = doc.pipe(blobStream());

            let start = Date.now();
            stream.on("finish", () => {
                let end = Date.now();
                let emergencyKitURL= stream.toBlobURL('application/pdf');

                console.log("Emergency Kit rendered in " + (end - start) + " ms.");
                fulfill(emergencyKitURL);
            });
            doc.end();
        });
    }
}

function render(kit) {
    let doc = new PDFDocument({
        margin: 0,
        size: "letter"
    });

    let header = fs.readFileSync('images/header@3x.png');
    let pencil = fs.readFileSync('images/pencil@3x.png');
    let ak = fs.readFileSync('images/ak-icon@3x.png');
    let mp = fs.readFileSync('images/mp-icon@3x.png');
    //doc.registerFont('proxima', font, 'ProximaNova-Regular');

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
        .text("SIGN IN DETAILS", 0, 318, {align: "center"})
        .fontSize(9)
        .fillColor("#333")
        .text("ACCOUNT URL", LEFT_MARGIN + 28, 342)
        .text("EMAIL ADDRESS", LEFT_MARGIN + 28, 398)
        .text("ACCOUNT KEY", LEFT_MARGIN + 28, 454)
        .text("MASTER PASSWORD", LEFT_MARGIN + 28, 510);

    // Documentation
    doc
      .fontSize(13)
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
      .text("3. Store your kit in a secure place where you will be able to find it, e.g. a safe deposit box.");

    doc
      .fillColor("#333")
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Need help?", 36, 610)
      .moveDown(1)
      .font("Helvetica")
      .text("Contact AgileBits at:")
      .fillColor(OP_DARK_RED)
      .text("support@1password.com");

      doc
        .fillColor("#333")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("QR Code", 403, 610)
        .moveDown(1)
        .font("Helvetica")
        .text(
          "Scan this code from the 1Password apps to set up your account quickly and easily.",
          {width: 174}
        );

    // User input
    doc
      .fontSize(13)
      .fillColor(OP_DARK_RED)
      .text(`Created for ${kit.name} on ${moment().format('MMMM Do YYYY')}`, 0, 134,
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
    doc.image(kit.qrCode, 234, 612, 144, 144);

    // drawFuncs.forEach((drawFunc) => {
    //     let drawSubComponent = drawFunc.bind(doc);
    //     drawSubComponent(kit);
    // });

    return doc;
}
