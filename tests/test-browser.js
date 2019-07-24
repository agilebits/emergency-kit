"use strict";

import test from "tape";

function setup() {
    return emergencyKit.create({
        email: "wendyappleseed@me.com",
        name: "Wendy Appleseed",
        accountKey: "AK-123-456",
        domain: "appleseed",
        teamURL: "appleseed.1password.com",
    });
}

function runBlobTests(blob) {
    test("Blob", (assert) => {
        assert.equal(blob instanceof Blob, true, "should be a Blob");
        assert.equal(blob.size > 0, true, `should have content: ${blob.size}`);
        assert.equal(blob.type, "application/pdf", "should have correct type");
        assert.end();
    });
}

function runUrlTests(url) {
    test("URL", (assert) => {
        assert.equal(typeof url, "string", "should be a string");
        assert.equal(url.startsWith('blob:'), true, "should be a Blob URL");
        assert.end();
    });
}

setup().toBlob().then(runBlobTests);
setup().toURL().then(runUrlTests);
test.onFinish(() => window.close());
