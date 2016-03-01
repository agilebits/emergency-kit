"use strict";

let test = require("tape");
let emergencyKit = require("../lib/emergency-kit-node.js")

function setup() {
    let k = window.emergencyKit({
        email: "wendyappleseed@me.com",
        name: "Wendy Appleseed",
        accountKey: "AK-123-456",
        domain: "appleseed",
        teamURL: "appleseed.1password.com",
        //qrCode: image-data
    });
    return k;
}


function runBlobTests(blob) {
    let content = new Uint8Array(1000);
    let referenceBlob = new Blob(content, {type:"application/pdf"});

    test("Streamed to a blob.", (assert) => {
            let expected = referenceBlob instanceof Blob;
            let actual = blob instanceof Blob;
            assert.equal(expected, actual, blob);
            assert.end();
    });

    test("Blob has content in it.", (assert) => {
            let expected = referenceBlob.size > 0;
            let actual = blob.size > 0;
            assert.equal(expected, actual, blob.size);
            assert.end();
    });

    test("Blob is of type 'application/pdf'.", (assert) => {
            let expected = referenceBlob.type === 'application/pdf';
            let actual = blob.type === 'application/pdf';
            assert.equal(expected, actual, blob.type);
            assert.end();
    });
}

function runURLTests(url) {
    let content = new Uint8Array(1000);
    let referenceBlob = new Blob(content, {type:"application/pdf"});
    let referenceURL = URL.createObjectURL(referenceBlob);

    test("Streamed to a string.", (assert) => {
            let expected = typeof referenceURL == "string";
            let actual = typeof url == "string";
            assert.equal(expected, actual, url);
            assert.end();
    });

    test("String is a blob URL.", (assert) => {
            let expected = referenceURL.startsWith('blob:');
            let actual = url.startsWith('blob:');
            assert.equal(expected, actual);
            assert.end();
    });
}

setup().toBlob().then(runBlobTests);
setup().toURL().then(runURLTests);
