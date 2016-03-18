"use strict";

let emergencyKit = require("./lib/emergency-kit-node.js");
let filename = "1Password.pdf";

let k = emergencyKit({
    email: "holmes@agilebits.com",
    name: "Sherlock Holmes",
    accountKey: "A3-FSHJNM-7T85AC-KRSBV-VC83W-7NTCN-457SS",
    domain: "bakerstreet",
    teamURL: "bakerstreet.1password.com",
    //qrCode: image-data
});

let start = Date.now();
k.toFile().on("finish", () => {
    let end = Date.now();
    console.log("Emergency Kit rendered in " + (end - start) + " ms.");
});
