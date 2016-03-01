"use strict";

let emergencyKit = require("./lib/emergency-kit-node.js");
let filename = "1Password.pdf";

let k = emergencyKit({
    email: "wendyappleseed@me.com",
    name: "Wendy Appleseed",
    accountKey: "AK-123-456",
    domain: "appleseed",
    teamURL: "appleseed.1password.com",
    //qrCode: image-data
});

let start = Date.now();
k.toFile(filename).on("finish", () => {
    let end = Date.now();
    console.log("Emergency Kit rendered in " + (end - start) + " ms.");
});
