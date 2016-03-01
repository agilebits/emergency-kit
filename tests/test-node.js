"use strict";

let test = require("tape");
let emergencyKit = require("../lib/emergency-kit-node.js");
let fs = require("fs");

function setup() {
    try {
        fs.mkdirSync(__dirname + '/output');
    } catch (exists) {}

    try {
        fs.accessSync(__dirname + '/output/1password.pdf', fs.W_OK);
        console.log("Deleting 1password.pdf test data...")
        fs.unlinkSync(__dirname + "/output/1password.pdf");
    } catch (nofile) {}

    let k = emergencyKit({
        email: "wendyappleseed@me.com",
        name: "Wendy Appleseed",
        accountKey: "AK-123-456",
        domain: "appleseed",
        teamURL: "appleseed.1password.com",
        //qrCode: image-data
    });
    return k;
}

function runFileTests() {
    test("'1password.pdf' file exists on disk and can be read.", (assert) => {
            let expected = true;
            fs.access(__dirname + '/output/1password.pdf', fs.R_OK, (err) => {
                let actual = !err;
                assert.equal(true, actual, actual);
                assert.end();
            });
    });
}

setup()
    .toFile(__dirname + "/output/1password.pdf")
    .on("finish", runFileTests);
