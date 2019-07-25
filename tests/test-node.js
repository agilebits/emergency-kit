"use strict";

const test = require("tape");
const emergencyKit = require("../lib/emergency-kit-node.js");
const fs = require("fs");

function setup() {
    try {
        fs.mkdirSync(__dirname + '/output');
    } catch (exists) {}

    try {
        fs.accessSync(__dirname + '/output/1password.pdf', fs.W_OK);
        console.log("Deleting 1password.pdf test data...")
        fs.unlinkSync(__dirname + "/output/1password.pdf");
    } catch (nofile) {}

    return emergencyKit.create({
        email: "wendyappleseed@me.com",
        name: "Wendy Appleseed",
        accountKey: "AK-123-456",
        domain: "appleseed",
        teamURL: "appleseed.1password.com",
    });
}

function runFileTests() {
    test("'1password.pdf' file", (assert) => {
        fs.access(__dirname + '/output/1password.pdf', fs.R_OK, (err) => {
            assert.equal(!err, true, "should exist on disk and be readable");
            assert.end();
        });
    });
}

setup()
    .toFile(__dirname + "/output/1password.pdf")
    .on("finish", runFileTests);
