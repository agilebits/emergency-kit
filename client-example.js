"use strict";

const EmergencyKit = require("./index.js");

let k = new EmergencyKit({
    email: "wendyappleseed@me.com",
    name: "Wendy Applésçeeødüß",
    accountKey: "AK-123-456",
    domain: "appleseed",
    teamURL: "appleseed.1password.com",
    filename: "1password.pdf"
    //qrCode: image-data
});

k.toDisk(); // Will produce "1password.pdf" in the active directory
