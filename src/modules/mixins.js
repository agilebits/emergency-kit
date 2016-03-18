"use strict";

import streams from "./streams.js";
let fs = require('fs'); // Doesn't work with ES6 import syntax

// Mixin for blob streaming in browsers. Implementors must implement pipe()
function WebStream() {
    let toUint8 = (stream) => stream.pipe(streams.createUint8ArrayStream());

    return {
        toBlob() {
            if (typeof Blob === 'undefined') {
                throw new Error("No Blob object found. Are you running in node?");
            }

            return streams.blobFromUint8ArrayStream(toUint8(this), {type: "application/pdf"});
        },
        // Convenience method for browsers
        toURL() {
            if (typeof URL === 'undefined') {
                return new Error("No URL object found. Are you running in node?");
            }

            return this.toBlob().then( (blob) => URL.createObjectURL(blob) );
        }
    };
}

// Mixin for file streaming in node. Implementors must implement pipe()
function FileStream() {
    return {
        toFile(filename = this.filename) {
            return this.pipe(fs.createWriteStream(filename));
        }
    };
}

let mixins = {};
Object.assign(mixins, {WebStream: WebStream(), FileStream: FileStream()});
export default mixins;
