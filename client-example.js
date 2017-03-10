"use strict";

let emergencyKit = require("./lib/emergency-kit-node.js");
let filename = "1Password.pdf";

let k = emergencyKit({
    email: "holmes@agilebits.com",
    name: "Sherlock Holmes",
    accountKey: "A3-R69SQK-TZ9KPW-8MXYD-6W373-V7GHJ-EDJQW",
    domain: "bakerstreet",
    teamURL: "bakerstreet.1password.com",
    //qrCode: image-data
});

let start = Date.now();
k.toFile().on("finish", () => {
    let end = Date.now();
    console.log("Emergency Kit rendered in " + (end - start) + " ms.");
});
